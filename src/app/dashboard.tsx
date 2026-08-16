import { useEffect, useState } from "react";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { getMyAccount } from "@/services/profile";
import { uploadCertificate } from "@/services/experiences";
import {
  createOffer, getMyOffers, getOfferApplications, deactivateOffer,
  getMyApplications, updateApplication, OfferApplication, ApplicationStatus,
} from "@/services/offers";
import { createPayment, getMyPayments, Payment } from "@/services/payments";

type Section = "publish" | "offers" | "applications" | "payments";
type OwnedOffer = any;

export default function Dashboard() {
  const [section, setSection] = useState<Section>("publish");
  const [account, setAccount] = useState<any>({});
  const [offers, setOffers] = useState<OwnedOffer[]>([]);
  const [applications, setApplications] = useState<OfferApplication[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setBusy(true); setError("");
    try {
      const me = await getMyAccount();
      const [owned, mine, paid] = await Promise.all([getMyOffers(), getMyApplications(), getMyPayments()]);
      setAccount(me); setOffers(owned || []); setApplications(mine || []); setPayments(paid || []);
    } catch (e) { setError(e instanceof Error ? e.message : "No se pudieron cargar tus datos."); }
    finally { setBusy(false); }
  };
  useEffect(() => { void load(); }, []);

  return <View style={styles.page}>
    <View style={styles.topbar}>
      <Pressable onPress={() => router.replace("/")}><Text style={styles.brand}>OCUPA<Text style={styles.green}>2</Text></Text></Pressable>
      <View><Text style={styles.userName}>{account.firstName || account.email || "Mi cuenta"}</Text><Text style={styles.mutedSmall}>Cuenta autenticada</Text></View>
    </View>
    <View style={styles.nav}>{([
      ["publish", "Publicar oferta"], ["offers", "Mis ofertas publicadas"],
      ["applications", "Mis aplicaciones"], ["payments", "Mis pagos"],
    ] as [Section, string][]).map(([key, label]) => <Pressable key={key} onPress={() => setSection(key)} style={[styles.navItem, section === key && styles.navActive]}><Text style={section === key ? styles.navActiveText : styles.navText}>{label}</Text></Pressable>)}</View>
    <ScrollView contentContainerStyle={styles.content}>
      {busy && <Text style={styles.muted}>Cargando información real...</Text>}
      {!!error && !busy && <View style={styles.error}><Text style={styles.errorText}>{error}</Text><Pressable onPress={() => void load()}><Text style={styles.link}>Reintentar</Text></Pressable></View>}
      {!busy && !error && section === "publish" && <PublishForm onPublished={load} />}
      {!busy && !error && section === "offers" && <OwnedOffers offers={offers} onChanged={load} />}
      {!busy && !error && section === "applications" && <MyApplications applications={applications} />}
      {!busy && !error && section === "payments" && <PaymentsList payments={payments} />}
    </ScrollView>
  </View>;
}

function Field({ label, value, onChangeText, placeholder, secureTextEntry = false, keyboardType, multiline = false }: any) {
  return <View style={styles.field}><Text style={styles.label}>{label}</Text><TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor="#9ba4b2" secureTextEntry={secureTextEntry} keyboardType={keyboardType} multiline={multiline} style={[styles.input, multiline && styles.textarea]} /></View>;
}

function PublishForm({ onPublished }: { onPublished: () => Promise<void> }) {
  const [jobTypeKey, setJobTypeKey] = useState("");
  const [contractType, setContractType] = useState<"temporal" | "fijo" | "horas">("temporal");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [deadline, setDeadline] = useState("");
  const [photo, setPhoto] = useState<{ uri: string; base64: string; name: string } | null>(null);
  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [expMonth, setExpMonth] = useState("12");
  const [expYear, setExpYear] = useState("2030");
  const [cardholder, setCardholder] = useState("");
  const [saving, setSaving] = useState(false);

  const choosePhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], allowsEditing: true, quality: 0.8, base64: true });
    const asset = result.canceled ? null : result.assets[0];
    if (asset?.base64) setPhoto({ uri: asset.uri, base64: asset.base64, name: "offer.jpg" });
  };

  const submit = async () => {
    if (!jobTypeKey.trim() || !description.trim() || !address.trim() || !photo || !cardNumber.trim() || !cvv.trim() || !cardholder.trim()) {
      Alert.alert("Faltan datos", "Completa todos los campos, el pago y selecciona una foto."); return;
    }
    try {
      setSaving(true);
      const uploaded = await uploadCertificate(photo.base64, photo.name);
      const payment = await createPayment({ cardNumber: cardNumber.trim(), cvv: cvv.trim(), expMonth: Number(expMonth), expYear: Number(expYear), cardholder: cardholder.trim() });
      const paymentId = (payment as any).id || (payment as any).paymentId;
      if (!paymentId) throw new Error("El pago fue aprobado pero no devolvió paymentId.");
      await createOffer({
        jobTypeKey: jobTypeKey.trim(), contractType, description: description.trim(), address: address.trim(),
        photo: (uploaded as any)?.url || (uploaded as any)?.key || uploaded,
        paymentId, location: { lat: 0, lng: 0 },
        payment: { amount: 1, currency: "USD" }, ...(deadline.trim() ? { deadline: deadline.trim() } : {}),
      });
      Alert.alert("Oferta publicada", "El pago fue aprobado y la oferta ya está en la API.");
      setJobTypeKey(""); setDescription(""); setAddress(""); setDeadline(""); setPhoto(null); setCardNumber(""); setCvv(""); setCardholder("");
      await onPublished();
    } catch (e) { Alert.alert("No se pudo publicar", e instanceof Error ? e.message : "La API rechazó la operación."); }
    finally { setSaving(false); }
  };

  return <View style={styles.card}>
    <Text style={styles.heading}>Publicar oferta</Text>
    <Text style={styles.muted}>Formulario completo + foto obligatoria + pago de 1 USD.</Text>
    <Field label="Tipo de trabajo *" value={jobTypeKey} onChangeText={setJobTypeKey} placeholder="Ej. chofer, plomero" />
    <Text style={styles.label}>Tipo de contrato *</Text><View style={styles.row}>{(["temporal", "fijo", "horas"] as const).map((type) => <Pressable key={type} onPress={() => setContractType(type)} style={[styles.chip, contractType === type && styles.chipActive]}><Text>{type}</Text></Pressable>)}</View>
    <Field label="Dirección *" value={address} onChangeText={setAddress} placeholder="Dirección del trabajo" />
    <Field label="Descripción *" value={description} onChangeText={setDescription} placeholder="Describe la oferta" multiline />
    <Field label="Fecha límite (opcional)" value={deadline} onChangeText={setDeadline} placeholder="YYYY-MM-DD" />
    <Pressable onPress={choosePhoto} style={styles.photo}>{photo ? <Image source={{ uri: photo.uri }} style={styles.preview} /> : <Text>＋ Seleccionar foto obligatoria</Text>}</Pressable>
    <Text style={styles.section}>Pago simulado de 1 USD</Text>
    <Field label="Número de tarjeta *" value={cardNumber} onChangeText={setCardNumber} placeholder="4242424242424242" keyboardType="numeric" />
    <View style={styles.row}><View style={styles.half}><Field label="CVV *" value={cvv} onChangeText={setCvv} placeholder="123" keyboardType="numeric" /></View><View style={styles.half}><Field label="Titular *" value={cardholder} onChangeText={setCardholder} placeholder="Nombre titular" /></View></View>
    <View style={styles.row}><View style={styles.half}><Field label="Mes" value={expMonth} onChangeText={setExpMonth} placeholder="12" keyboardType="numeric" /></View><View style={styles.half}><Field label="Año" value={expYear} onChangeText={setExpYear} placeholder="2030" keyboardType="numeric" /></View></View>
    <Pressable disabled={saving} onPress={() => void submit()} style={[styles.primary, saving && styles.disabled]}><Text style={styles.primaryText}>{saving ? "Procesando..." : "Pagar 1 USD y publicar"}</Text></Pressable>
  </View>;
}

function OwnedOffers({ offers, onChanged }: { offers: OwnedOffer[]; onChanged: () => Promise<void> }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [apps, setApps] = useState<OfferApplication[]>([]);
  const open = async (id: string) => { try { setSelected(id); setApps(await getOfferApplications(id)); } catch (e) { Alert.alert("No se pudieron cargar aplicantes", e instanceof Error ? e.message : "Error"); } };
  const update = async (id: string, status: ApplicationStatus) => { try { await updateApplication(id, { status }); setApps((items) => items.map((item) => item.id === id ? { ...item, status } : item)); } catch (e) { Alert.alert("No se pudo actualizar", e instanceof Error ? e.message : "Error"); } };
  const deactivate = async (id: string) => { try { await deactivateOffer(id); Alert.alert("Oferta desactivada", "El cambio fue guardado en la API."); await onChanged(); } catch (e) { Alert.alert("No se pudo desactivar", e instanceof Error ? e.message : "Error"); } };
  return <View><Text style={styles.heading}>Mis ofertas publicadas</Text>{offers.length === 0 ? <Text style={styles.muted}>No tienes ofertas publicadas en la API.</Text> : offers.map((offer) => <View style={styles.list} key={offer.id}><Text style={styles.itemTitle}>{offer.jobTypeName || offer.jobTypeKey}</Text><Text style={styles.muted}>{offer.address} · {offer.applicantsCount || 0} aplicantes · {offer.status}</Text><View style={styles.row}><Pressable onPress={() => void open(offer.id)}><Text style={styles.link}>{selected === offer.id ? "Ocultar aplicantes" : "Ver aplicantes"}</Text></Pressable><Pressable onPress={() => void deactivate(offer.id)}><Text style={styles.danger}>Desactivar</Text></Pressable></View>{selected === offer.id && apps.map((app) => <View style={styles.application} key={app.id}><Text style={styles.itemTitle}>{app.applicant?.firstName || "Aplicante"} {app.applicant?.lastName || ""}</Text><Text style={styles.muted}>{app.applicant?.email || ""} · {app.status}</Text><View style={styles.row}><Pressable onPress={() => void update(app.id, "finalist")}><Text style={styles.link}>Finalista</Text></Pressable><Pressable onPress={() => void update(app.id, "rejected")}><Text style={styles.danger}>Descartar</Text></Pressable><Pressable onPress={() => void update(app.id, "winner")}><Text style={styles.winner}>Elegir ganador</Text></Pressable></View></View>)}</View>)}</View>;
}

function MyApplications({ applications }: { applications: OfferApplication[] }) { return <View><Text style={styles.heading}>Mis aplicaciones</Text>{applications.length === 0 ? <Text style={styles.muted}>No tienes aplicaciones en la API.</Text> : applications.map((app) => <View style={styles.list} key={app.id}><Text style={styles.itemTitle}>{app.offer?.jobTypeName || app.offer?.jobTypeKey || "Oferta"}</Text><Text style={styles.muted}>Estado: {app.status}</Text></View>)}</View>; }
function PaymentsList({ payments }: { payments: Payment[] }) { return <View><Text style={styles.heading}>Mis pagos</Text>{payments.length === 0 ? <Text style={styles.muted}>No tienes pagos registrados en la API.</Text> : payments.map((payment) => <View style={styles.list} key={payment.id}><Text style={styles.itemTitle}>{payment.amount ?? 1} {payment.currency || "USD"}</Text><Text style={styles.muted}>{payment.status || "approved"} · {payment.createdAt ? new Date(payment.createdAt).toLocaleDateString() : "Pago realizado"}</Text></View>)}</View>; }

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#f7f9fc" }, topbar: { height: 76, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#e8edf3", flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 22 }, brand: { color: "#172338", fontSize: 24, fontWeight: "800" }, green: { color: "#35d982" }, userName: { color: "#172338", fontWeight: "700" }, mutedSmall: { color: "#8a95a5", fontSize: 12, marginTop: 3 }, nav: { backgroundColor: "#fff", padding: 12, flexDirection: "row", flexWrap: "wrap", gap: 8, borderBottomWidth: 1, borderBottomColor: "#e8edf3" }, navItem: { padding: 12, borderRadius: 9 }, navActive: { backgroundColor: "#effbf5" }, navText: { color: "#687587" }, navActiveText: { color: "#148d52", fontWeight: "700" }, content: { padding: 22 }, card: { backgroundColor: "#fff", borderRadius: 16, padding: 22, borderWidth: 1, borderColor: "#e8edf3" }, heading: { fontSize: 25, fontWeight: "800", color: "#172338", marginBottom: 8 }, muted: { color: "#8a95a5", marginBottom: 14 }, label: { color: "#3d4959", fontWeight: "700", marginTop: 14, marginBottom: 7 }, field: { flex: 1, minWidth: 120 }, input: { height: 45, borderWidth: 1, borderColor: "#dfe5ec", borderRadius: 8, paddingHorizontal: 13, color: "#172338", backgroundColor: "#fff" }, textarea: { height: 110, paddingTop: 12, textAlignVertical: "top" }, row: { flexDirection: "row", gap: 9, flexWrap: "wrap", marginBottom: 8 }, half: { flex: 1, minWidth: 130 }, chip: { padding: 10, borderRadius: 8, backgroundColor: "#f0f2f5" }, chipActive: { backgroundColor: "#dff8ea" }, photo: { minHeight: 100, borderWidth: 1, borderStyle: "dashed", borderColor: "#35d982", borderRadius: 10, marginTop: 18, alignItems: "center", justifyContent: "center", overflow: "hidden" }, preview: { width: "100%", height: 150 }, section: { color: "#172338", fontWeight: "800", fontSize: 16, marginTop: 22 }, primary: { backgroundColor: "#35d982", borderRadius: 9, padding: 15, alignItems: "center", marginTop: 20 }, primaryText: { color: "#104a2c", fontWeight: "800" }, disabled: { opacity: 0.6 }, list: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#e8edf3", borderRadius: 13, padding: 16, marginBottom: 12 }, itemTitle: { color: "#172338", fontWeight: "800", marginBottom: 5 }, link: { color: "#159b5a", fontWeight: "700", marginRight: 14 }, danger: { color: "#c54c4c", fontWeight: "700", marginRight: 14 }, winner: { color: "#3175d8", fontWeight: "700" }, application: { borderTopWidth: 1, borderTopColor: "#edf0f4", marginTop: 12, paddingTop: 12 }, error: { backgroundColor: "#fff0f0", padding: 16, borderRadius: 10 }, errorText: { color: "#a33a3a", marginBottom: 8 },
});
