import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import { router } from "expo-router";

import * as ImagePicker from "expo-image-picker";

import {
  createExperience,
  deleteExperience,
  getExperiences,
  getJobTypes,
  uploadCertificate,
} from "@/services/experiences";

import { deleteToken } from "@/services/auth";

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [jobTypes, setJobTypes] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [jobTypeKey, setJobTypeKey] = useState("");

  const [certificateUri, setCertificateUri] = useState<string | null>(null);
  const [certificateBase64, setCertificateBase64] = useState<string | null>(null);
  const [certificateName, setCertificateName] = useState<string>("certificado.jpg");

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);
  
  const handleLogout = async () => {
    await deleteToken();
    router.replace("/");
  };
  
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const experiencesResponse = await getExperiences();
      const jobTypesResponse = await getJobTypes();

      console.log("EXPERIENCIAS:", experiencesResponse);
      console.log("JOB TYPES:", jobTypesResponse);

      if (Array.isArray(experiencesResponse)) {
        setExperiences(experiencesResponse);
      } else if (Array.isArray(experiencesResponse?.data)) {
        setExperiences(experiencesResponse.data);
      } else {
        setExperiences([]);
      }

      if (Array.isArray(jobTypesResponse)) {
        setJobTypes(jobTypesResponse);
      } else if (Array.isArray(jobTypesResponse?.data)) {
        setJobTypes(jobTypesResponse.data);
      } else {
        setJobTypes([]);
      }
    } catch (error) {
      console.error("ERROR PERFIL:", error);

      setError(
        error instanceof Error
          ? error.message
          : "No se pudieron cargar los datos."
      );
    } finally {
      setLoading(false);
    }
  };

  const selectCertificate = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Permiso requerido",
          "Necesitamos permiso para acceder a tus imágenes."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: false,
        quality: 0.8,
        base64: true,
      });

      if (result.canceled) {
        return;
      }

      const image = result.assets[0];

      setCertificateUri(image.uri);

      if (image.base64) {
        setCertificateBase64(image.base64);
      }

      if (image.fileName) {
        setCertificateName(image.fileName);
      } else {
        setCertificateName("certificado.jpg");
      }
    } catch (error) {
      console.error("ERROR SELECCIONANDO CERTIFICADO:", error);

      Alert.alert(
        "Error",
        "No se pudo seleccionar el certificado."
      );
    }
  };

  const handleCreateExperience = async () => {
    if (!title.trim()) {
      Alert.alert("Falta información", "Escribe un título.");
      return;
    }

    if (!description.trim()) {
      Alert.alert("Falta información", "Escribe una descripción.");
      return;
    }

    if (!jobTypeKey) {
      Alert.alert(
        "Falta información",
        "Selecciona un tipo de trabajo."
      );
      return;
    }

    if (!certificateBase64) {
      Alert.alert(
        "Falta certificado",
        "Debes seleccionar una imagen del certificado."
      );
      return;
    }

    try {
      setSaving(true);

      const uploadedImage = await uploadCertificate(
        certificateBase64,
        certificateName
      );

      console.log("IMAGEN SUBIDA:", uploadedImage);

      const certificateUrl =
        uploadedImage?.url ??
        uploadedImage?.key ??
        "";

      if (!certificateUrl) {
        throw new Error(
          "El servidor no devolvió la dirección del certificado."
        );
      }

      await createExperience(
        title.trim(),
        description.trim(),
        jobTypeKey,
        certificateUrl
      );

      Alert.alert(
        "Experiencia guardada",
        "La experiencia y el certificado fueron agregados correctamente."
      );

      setTitle("");
      setDescription("");
      setJobTypeKey("");

      setCertificateUri(null);
      setCertificateBase64(null);
      setCertificateName("certificado.jpg");

      setShowForm(false);

      await loadData();
    } catch (error) {
      console.error("ERROR CREANDO EXPERIENCIA:", error);

      Alert.alert(
        "Error",
        error instanceof Error
          ? error.message
          : "No se pudo agregar la experiencia."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteExperience = (id: string) => {
    Alert.alert(
      "Eliminar experiencia",
      "¿Seguro que deseas eliminar esta experiencia?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteExperience(id);

              Alert.alert(
                "Experiencia eliminada",
                "La experiencia fue eliminada correctamente."
              );

              await loadData();
            } catch (error) {
              Alert.alert(
                "Error",
                error instanceof Error
                  ? error.message
                  : "No se pudo eliminar la experiencia."
              );
            }
          },
        },
      ]
    );
  };

  const cancelForm = () => {
    setTitle("");
    setDescription("");
    setJobTypeKey("");

    setCertificateUri(null);
    setCertificateBase64(null);
    setCertificateName("certificado.jpg");

    setShowForm(false);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Cargando perfil...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Mi perfil</Text>

      <Text style={styles.subtitle}>Mis experiencias</Text>

      {error && <Text style={styles.error}>{error}</Text>}

      {!showForm && (
        <Pressable
          style={styles.addButton}
          onPress={() => setShowForm(true)}
        >
          <Text style={styles.addButtonText}>
            + Agregar experiencia
          </Text>
        </Pressable>
      )}

      {showForm && (
        <View style={styles.form}>
          <Text style={styles.formTitle}>
            Nueva experiencia
          </Text>

          <Text style={styles.label}>Título</Text>

          <TextInput
            style={styles.input}
            placeholder="Ej: Chofer de distribución"
            value={title}
            onChangeText={setTitle}
          />

          <Text style={styles.label}>Descripción</Text>

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe tu experiencia laboral"
            value={description}
            onChangeText={setDescription}
            multiline
          />

          <Text style={styles.label}>
            Tipo de trabajo
          </Text>

          {jobTypes.length === 0 ? (
            <Text style={styles.warning}>
              No se encontraron tipos de trabajo.
            </Text>
          ) : (
            <View style={styles.jobTypes}>
              {jobTypes.map((job, index) => {
                const key =
                  job.key ??
                  job.jobTypeKey ??
                  job.id ??
                  job.value ??
                  "";

                const name =
                  job.name ??
                  job.label ??
                  job.title ??
                  key;

                const selected = jobTypeKey === key;

                return (
                  <Pressable
                    key={key || index}
                    style={[
                      styles.jobTypeButton,
                      selected && styles.jobTypeSelected,
                    ]}
                    onPress={() => setJobTypeKey(key)}
                  >
                    <Text
                      style={[
                        styles.jobTypeText,
                        selected && styles.jobTypeSelectedText,
                      ]}
                    >
                      {name}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          )}

          <Text style={styles.label}>
            Certificado
          </Text>

          <Pressable
            style={styles.certificateButton}
            onPress={selectCertificate}
          >
            <Text style={styles.certificateButtonText}>
              Seleccionar certificado
            </Text>
          </Pressable>

          {certificateUri && (
            <View style={styles.previewContainer}>
              <Image
                source={{ uri: certificateUri }}
                style={styles.previewImage}
              />

              <Text style={styles.fileName}>
                {certificateName}
              </Text>

              <Pressable
                style={styles.removeCertificateButton}
                onPress={() => {
                  setCertificateUri(null);
                  setCertificateBase64(null);
                  setCertificateName("certificado.jpg");
                }}
              >
                <Text style={styles.removeCertificateText}>
                  Quitar certificado
                </Text>
              </Pressable>
            </View>
          )}

          <Pressable
            style={[
              styles.saveButton,
              saving && styles.disabledButton,
            ]}
            onPress={handleCreateExperience}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.saveButtonText}>
                Guardar experiencia
              </Text>
            )}
          </Pressable>

          <Pressable
            style={styles.cancelButton}
            onPress={cancelForm}
            disabled={saving}
          >
            <Text style={styles.cancelButtonText}>
              Cancelar
            </Text>
          </Pressable>
        </View>
      )}

      {experiences.length === 0 && !showForm && (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>
            No tienes experiencias registradas
          </Text>

          <Text style={styles.emptyText}>
            Aquí aparecerán las experiencias laborales que agregues.
          </Text>
        </View>
      )}

      {experiences.map((experience, index) => (
        <View
          style={styles.card}
          key={experience.id ?? index}
        >
          <Text style={styles.cardTitle}>
            {experience.title ?? "Experiencia"}
          </Text>

          <Text style={styles.cardDescription}>
            {experience.description ?? "Sin descripción"}
          </Text>

          {(experience.jobTypeKey || experience.jobType) && (
            <Text style={styles.cardType}>
              Tipo:{" "}
              {experience.jobType?.name ??
                experience.jobTypeKey}
            </Text>
          )}

          {experience.certificateImage && (
            <Image
              source={{ uri: experience.certificateImage }}
              style={styles.certificateImage}
            />
          )}

          {experience.id && (
            <Pressable
              style={styles.deleteButton}
              onPress={() =>
                handleDeleteExperience(experience.id)
              }
            >
              <Text style={styles.deleteButtonText}>
                Eliminar
              </Text>
            </Pressable>
          )}
        </View>
      ))}

      <Pressable
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },

  content: {
    padding: 20,
    paddingBottom: 50,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#17202A",
    marginBottom: 25,
  },

  subtitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#17202A",
    marginBottom: 15,
  },

  error: {
    color: "#D92D20",
    marginBottom: 15,
  },

  addButton: {
    backgroundColor: "#208AEF",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },

  addButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },

  form: {
    backgroundColor: "#ffffff",
    padding: 18,
    borderRadius: 15,
    marginBottom: 25,
  },

  formTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#17202A",
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 7,
    color: "#344054",
  },

  input: {
    borderWidth: 1,
    borderColor: "#D0D5DD",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 18,
    backgroundColor: "#ffffff",
    fontSize: 15,
  },

  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },

  warning: {
    color: "#D92D20",
    marginBottom: 15,
  },

  jobTypes: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
  },

  jobTypeButton: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#D0D5DD",
    backgroundColor: "#ffffff",
  },

  jobTypeSelected: {
    backgroundColor: "#208AEF",
    borderColor: "#208AEF",
  },

  jobTypeText: {
    color: "#344054",
    fontSize: 14,
  },

  jobTypeSelectedText: {
    color: "#ffffff",
    fontWeight: "bold",
  },

  certificateButton: {
    backgroundColor: "#7C3AED",
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },

  certificateButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },

  previewContainer: {
    marginBottom: 20,
    alignItems: "center",
  },

  previewImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    resizeMode: "cover",
  },

  fileName: {
    marginTop: 8,
    fontSize: 13,
    color: "#667085",
  },

  removeCertificateButton: {
    marginTop: 8,
    paddingVertical: 8,
  },

  removeCertificateText: {
    color: "#D92D20",
    fontWeight: "600",
  },

  saveButton: {
    backgroundColor: "#22C55E",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  disabledButton: {
    opacity: 0.6,
  },

  saveButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },

  cancelButton: {
    paddingVertical: 13,
    alignItems: "center",
    marginTop: 7,
  },

  cancelButtonText: {
    color: "#667085",
    fontWeight: "600",
  },

  empty: {
    backgroundColor: "#ffffff",
    padding: 25,
    borderRadius: 15,
  },

  emptyTitle: {
    fontSize: 17,
    fontWeight: "bold",
    textAlign: "center",
  },

  emptyText: {
    color: "#667085",
    textAlign: "center",
    marginTop: 8,
  },

  card: {
    backgroundColor: "#ffffff",
    padding: 18,
    borderRadius: 15,
    marginBottom: 15,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 7,
    color: "#17202A",
  },

  cardDescription: {
    fontSize: 15,
    color: "#475467",
    lineHeight: 21,
  },

  cardType: {
    marginTop: 10,
    fontSize: 14,
    color: "#208AEF",
    fontWeight: "600",
  },

  certificateImage: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    marginTop: 15,
    resizeMode: "cover",
    backgroundColor: "#E5E7EB",
  },

  deleteButton: {
    marginTop: 15,
    backgroundColor: "#D92D20",
    paddingVertical: 11,
    borderRadius: 9,
    alignItems: "center",
  },

  deleteButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 14,
  },

  logoutButton: {
    backgroundColor: "#D92D20",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },

  logoutButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
});