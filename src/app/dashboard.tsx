// @ts-nocheck
import { useEffect, useMemo, useState } from "react";
import { router } from "expo-router";
import { getStoredJson, setStoredJson } from "@/services/storage";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type Section = "publish" | "offers" | "applications" | "payments";
type Offer = {
  id: number;
  title: string;
  company: string;
  location: string;
  status: string;
  applications: number;
};

const initialOffers: Offer[] = [];

export default function Dashboard() {
  const [section, setSection] = useState<Section>("publish");
  const [offers, setOffers] = useState<Offer[]>(initialOffers);
  const [sessionUser, setSessionUser] = useState<{
    email?: string;
    firstName?: string;
  }>({});
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const loadOwnedData = async () => {
      const user = await getStoredJson(
        "ocupa2_session_user",
        {} as { email?: string; firstName?: string },
      );
      setSessionUser(user);
      const ownerKey = `ocupa2_offers_${encodeURIComponent(user.email || "guest")}`;
      setOffers(await getStoredJson(ownerKey, initialOffers));
    };
    void loadOwnedData();
  }, []);

  const current = useMemo(
    () =>
      ({
        publish: {
          eyebrow: "NUEVA OFERTA",
          title: "Encuentra a la persona ideal",
          copy: "Publica una oportunidad clara y llega a talento que está listo para trabajar.",
        },
        offers: {
          eyebrow: "GESTIÓN",
          title: "Mis ofertas publicadas",
          copy: "Revisa el estado de tus oportunidades y el interés que han generado.",
        },
        applications: {
          eyebrow: "SEGUIMIENTO",
          title: "Mis aplicaciones",
          copy: "Todo lo que has solicitado, ordenado en un solo lugar.",
        },
        payments: {
          eyebrow: "CUENTA",
          title: "Mis pagos",
          copy: "Consulta tus pagos y el historial de tu plan en Ocupa2.",
        },
      })[section],
    [section],
  );

  const publish = () => {
    if (!title.trim() || !company.trim() || !description.trim()) {
      Alert.alert(
        "Faltan datos",
        "Completa el título, la empresa y la descripción.",
      );
      return;
    }
    const updatedOffers = [
      {
        id: Date.now(),
        title: title.trim(),
        company: company.trim(),
        location: location.trim() || "Remoto",
        status: "Activa",
        applications: 0,
      },
      ...offers,
    ];
    setOffers(updatedOffers);
    void setStoredJson(
      `ocupa2_offers_${encodeURIComponent(sessionUser.email || "guest")}`,
      updatedOffers,
    );
    setTitle("");
    setCompany("");
    setLocation("");
    setDescription("");
    Alert.alert(
      "Oferta publicada",
      "Tu oferta ya está visible para las personas candidatas.",
    );
    setSection("offers");
  };

  const nav = (next: Section) => setSection(next);

  return (
    <View style={styles.page}>
      <View style={styles.topbar}>
        <Pressable onPress={() => router.replace("/")}>
          <Text style={styles.brand}>
            OCUPA<Text style={styles.brandAccent}>2</Text>
          </Text>
        </Pressable>
        <View style={styles.user}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(sessionUser.firstName || sessionUser.email || "T")
                .slice(0, 2)
                .toUpperCase()}
            </Text>
          </View>
          <View>
            <Text style={styles.userName}>
              {sessionUser.firstName || sessionUser.email || "Mi cuenta"}
            </Text>
            <Text style={styles.userRole}>Cuenta empleador</Text>
          </View>
        </View>
      </View>
      <View style={styles.body}>
        <View style={styles.sidebar}>
          <Text style={styles.menuLabel}>MI ESPACIO</Text>
          <NavItem
            label="Publicar oferta"
            icon="＋"
            active={section === "publish"}
            onPress={() => nav("publish")}
          />
          <NavItem
            label="Mis ofertas publicadas"
            icon="▣"
            active={section === "offers"}
            onPress={() => nav("offers")}
          />
          <NavItem
            label="Mis aplicaciones"
            icon="✓"
            active={section === "applications"}
            onPress={() => nav("applications")}
          />
          <NavItem
            label="Mis pagos"
            icon="$"
            active={section === "payments"}
            onPress={() => nav("payments")}
          />
        </View>
        <ScrollView
          style={styles.mainScroll}
          contentContainerStyle={styles.content}>
          <Text style={styles.eyebrow}>{current.eyebrow}</Text>
          <Text style={styles.heading}>{current.title}</Text>
          <Text style={styles.copy}>{current.copy}</Text>

          {section === "publish" && (
            <PublishForm
              title={title}
              company={company}
              location={location}
              description={description}
              setTitle={setTitle}
              setCompany={setCompany}
              setLocation={setLocation}
              setDescription={setDescription}
              onSubmit={publish}
            />
          )}

          {section === "offers" && (
            <Offers offers={offers} onPublish={() => nav("publish")} />
          )}

          {section === "applications" && <Applications />}
          {section === "payments" && <Payments />}

          <View style={styles.mobileHelp}>
            <Text style={styles.sidebarHint}>¿Necesitas ayuda?</Text>
            <Text style={styles.sidebarSupport}>
              Escríbenos y te acompañamos.
            </Text>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

function NavItem({
  label,
  icon,
  active,
  onPress,
}: {
  label: string;
  icon: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.navItem,
        active && styles.navItemActive,
        pressed && styles.pressed,
      ]}>
      <Text style={[styles.navIcon, active && styles.navIconActive]}>
        {icon}
      </Text>
      <Text style={[styles.navText, active && styles.navTextActive]}>
        {label}
      </Text>
      {active && <View style={styles.activeLine} />}
    </Pressable>
  );
}

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  multiline = false,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  multiline?: boolean;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9ba4b2"
        multiline={multiline}
        style={[styles.input, multiline && styles.textarea]}
      />
    </View>
  );
}

function PublishForm({
  title,
  company,
  location,
  description,
  setTitle,
  setCompany,
  setLocation,
  setDescription,
  onSubmit,
}: any) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.cardTitle}>Información de la oferta</Text>
          <Text style={styles.cardSubtitle}>
            Los campos con * son obligatorios.
          </Text>
        </View>
        <View style={styles.step}>
          <Text style={styles.stepText}>1 / 1</Text>
        </View>
      </View>
      <View style={styles.formGrid}>
        <Field
          label="Título del puesto *"
          value={title}
          onChangeText={setTitle}
          placeholder="Ej. Diseñador/a gráfico/a"
        />
        <Field
          label="Empresa *"
          value={company}
          onChangeText={setCompany}
          placeholder="Nombre de tu empresa"
        />
        <Field
          label="Ubicación"
          value={location}
          onChangeText={setLocation}
          placeholder="Ciudad o remoto"
        />
      </View>
      <Field
        label="Descripción del puesto *"
        value={description}
        onChangeText={setDescription}
        placeholder="Cuenta brevemente qué hará esta persona..."
        multiline
      />
      <View style={styles.formFooter}>
        <Text style={styles.helper}>
          Sé claro: una buena descripción recibe mejores aplicaciones.
        </Text>
        <Pressable style={styles.primaryButton} onPress={onSubmit}>
          <Text style={styles.primaryButtonText}>
            Publicar oferta <Text style={styles.arrow}>→</Text>
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function Offers({
  offers,
  onPublish,
}: {
  offers: Offer[];
  onPublish: () => void;
}) {
  return (
    <View>
      {offers.length === 0 ? (
        <EmptyState
          title="Aún no tienes ofertas"
          copy="Publica tu primera oferta y aparecerá aquí para que puedas administrarla."
        />
      ) : (
        offers.map((offer) => (
          <View style={styles.listCard} key={offer.id}>
            <View style={styles.offerIcon}>
              <Text>⌁</Text>
            </View>
            <View style={styles.listMain}>
              <Text style={styles.listTitle}>{offer.title}</Text>
              <Text style={styles.listMeta}>
                {offer.company} · {offer.location}
              </Text>
            </View>
            <View style={styles.listAside}>
              <Text
                style={[
                  styles.status,
                  offer.status === "Activa"
                    ? styles.statusGreen
                    : styles.statusAmber,
                ]}>
                {offer.status}
              </Text>
              <Text style={styles.applicationCount}>
                {offer.applications} aplicaciones
              </Text>
            </View>
          </View>
        ))
      )}
      <Pressable style={styles.secondaryButton} onPress={onPublish}>
        <Text style={styles.secondaryButtonText}>＋ Publicar otra oferta</Text>
      </Pressable>
    </View>
  );
}

function Applications() {
  return (
    <EmptyState
      title="Aún no tienes aplicaciones"
      copy="Cuando apliques a una oferta, podrás ver aquí su estado y seguimiento."
    />
  );
}

function Payments() {
  return (
    <EmptyState
      title="Aún no tienes pagos"
      copy="Aquí aparecerá tu historial cuando exista una suscripción o un pago registrado."
    />
  );
}

function EmptyState({ title, copy }: { title: string; copy: string }) {
  return (
    <View style={emptyStyles.emptyState}>
      <View style={emptyStyles.emptyIcon}>
        <Text>○</Text>
      </View>
      <Text style={emptyStyles.emptyTitle}>{title}</Text>
      <Text style={emptyStyles.emptyCopy}>{copy}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#f7f9fc" },
  topbar: {
    height: 76,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e8edf3",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 32,
  },
  mainScroll: {
    flex: 1,
    width: "100%",
  },
  brand: {
    color: "#172338",
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: 1,
  },
  brandAccent: { color: "#35d982" },
  user: { flexDirection: "row", alignItems: "center", gap: 10 },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#e6f8ef",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: "#159b5a", fontWeight: "800" },
  userName: { color: "#172338", fontSize: 13, fontWeight: "700" },
  userRole: { color: "#8a95a5", fontSize: 12, marginTop: 2 },
  body: {
    flex: 1,
    width: "100%",
  },
  sidebar: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 12,
    flexDirection: "row",
    flexWrap: "wrap",
    borderBottomWidth: 1,
    borderBottomColor: "#e8edf3",
  },
  mobileHelp: {
    marginTop: 32,
    padding: 14,
    backgroundColor: "#f7f9fc",
    borderRadius: 10,
  },

  menuLabel: {
    color: "#a2acb9",
    fontSize: 11,
    letterSpacing: 1.3,
    fontWeight: "800",
    marginBottom: 14,
    width: "100%",
  },
  navItem: {
    width: "50%",
    minHeight: 42,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    marginBottom: 5,
    gap: 12,
    position: "relative",
  },
  navItemActive: { backgroundColor: "#effbf5" },
  navIcon: { color: "#8d98a7", fontSize: 18, width: 19, textAlign: "center" },
  navIconActive: { color: "#21b86d" },
  navText: { color: "#687587", fontSize: 14, flex: 1 },
  navTextActive: { color: "#148d52", fontWeight: "700" },
  activeLine: {
    width: 3,
    height: 22,
    borderRadius: 2,
    backgroundColor: "#35d982",
    position: "absolute",
    right: 0,
  },
  pressed: { opacity: 0.72 },
  sidebarHint: { color: "#172338", fontWeight: "700", fontSize: 12 },
  sidebarSupport: {
    color: "#8a95a5",
    lineHeight: 18,
    fontSize: 12,
    marginTop: 4,
  },
  content: { padding: 22, width: "100%" },
  eyebrow: {
    color: "#1fae66",
    fontWeight: "800",
    fontSize: 11,
    letterSpacing: 1.5,
  },
  heading: {
    color: "#172338",
    fontSize: 32,
    lineHeight: 39,
    fontWeight: "800",
    marginTop: 9,
  },
  copy: {
    color: "#7d8898",
    fontSize: 15,
    lineHeight: 23,
    marginTop: 9,
    marginBottom: 28,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 26,
    borderWidth: 1,
    borderColor: "#e8edf3",
    shadowColor: "#172338",
    shadowOpacity: 0.04,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  cardTitle: { color: "#172338", fontSize: 18, fontWeight: "800" },
  cardSubtitle: { color: "#9ba4b2", fontSize: 12, marginTop: 5 },
  step: {
    backgroundColor: "#effbf5",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  stepText: { color: "#159b5a", fontSize: 12, fontWeight: "700" },
  formGrid: { flexDirection: "row", gap: 14, flexWrap: "wrap" },
  field: { flex: 1, minWidth: 210, marginBottom: 17 },
  fieldLabel: {
    color: "#3d4959",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 8,
  },
  input: {
    height: 45,
    borderWidth: 1,
    borderColor: "#dfe5ec",
    borderRadius: 8,
    paddingHorizontal: 13,
    color: "#172338",
    fontSize: 14,
    backgroundColor: "#fff",
  },
  textarea: { height: 120, paddingTop: 13, textAlignVertical: "top" },
  formFooter: {
    borderTopWidth: 1,
    borderTopColor: "#edf0f4",
    paddingTop: 18,
    marginTop: 3,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
    flexWrap: "wrap",
  },
  helper: { color: "#9ba4b2", fontSize: 12, flex: 1 },
  primaryButton: {
    backgroundColor: "#35d982",
    borderRadius: 9,
    paddingHorizontal: 18,
    paddingVertical: 13,
  },
  primaryButtonText: { color: "#104a2c", fontSize: 13, fontWeight: "800" },
  arrow: { fontSize: 17 },
  listCard: {
    minHeight: 78,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e8edf3",
    borderRadius: 13,
    marginBottom: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
  },
  offerIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#eef5ff",
    justifyContent: "center",
    alignItems: "center",
  },
  listMain: { flex: 1 },
  listTitle: { color: "#172338", fontSize: 14, fontWeight: "800" },
  listMeta: { color: "#8a95a5", fontSize: 12, marginTop: 5 },
  listAside: { alignItems: "flex-end" },
  status: {
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 5,
    fontSize: 11,
    overflow: "hidden",
    fontWeight: "700",
  },
  statusGreen: { backgroundColor: "#e7f9ef", color: "#159b5a" },
  statusAmber: { backgroundColor: "#fff5dc", color: "#b47a12" },
  statusBlue: { backgroundColor: "#eaf2ff", color: "#3979d8" },
  statusGray: { backgroundColor: "#f0f2f5", color: "#7d8795" },
  applicationCount: { color: "#9ba4b2", fontSize: 11, marginTop: 7 },
  secondaryButton: {
    alignSelf: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: "#35d982",
    marginTop: 4,
  },
  secondaryButtonText: { color: "#159b5a", fontWeight: "800", fontSize: 13 },
  balanceCard: {
    backgroundColor: "#172338",
    borderRadius: 15,
    padding: 24,
    marginBottom: 16,
  },
  balanceLabel: {
    color: "#8fa1b9",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.2,
  },
  balanceTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "800",
    marginTop: 8,
  },
  balanceCopy: { color: "#b7c2d0", fontSize: 13, marginTop: 6 },
  balanceButton: {
    alignSelf: "flex-start",
    backgroundColor: "#35d982",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 18,
  },
  balanceButtonText: { color: "#104a2c", fontSize: 12, fontWeight: "800" },
  paymentRow: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#edf0f4",
    paddingVertical: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  paymentRight: { alignItems: "flex-end" },
  amount: { color: "#172338", fontWeight: "800", fontSize: 14 },
  statusGreenText: {
    color: "#159b5a",
    fontSize: 12,
    marginTop: 5,
    fontWeight: "700",
  },
});

const emptyStyles = StyleSheet.create({
  emptyState: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e8edf3",
    borderRadius: 13,
    padding: 36,
    alignItems: "center",
  },
  emptyIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#effbf5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  emptyTitle: { color: "#172338", fontSize: 16, fontWeight: "800" },
  emptyCopy: {
    color: "#8a95a5",
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
    marginTop: 7,
    maxWidth: 420,
  },
});
