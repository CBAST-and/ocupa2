import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import { changePassword } from "@/services/profile";

export default function ChangePassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    // Validar campos vacíos
    if (!password.trim() || !confirmPassword.trim()) {
      Alert.alert(
        "Campos incompletos",
        "Debes completar todos los campos."
      );
      return;
    }

    // Validar longitud
    if (password.length < 6) {
      Alert.alert(
        "Contraseña inválida",
        "La contraseña debe tener al menos 6 caracteres."
      );
      return;
    }

    // Comprobar que sean iguales
    if (password !== confirmPassword) {
      Alert.alert(
        "Las contraseñas no coinciden",
        "Verifica que ambas contraseñas sean iguales."
      );
      return;
    }

    try {
      setLoading(true);

      await changePassword(password);

      Alert.alert(
        "Contraseña actualizada",
        "Tu contraseña fue cambiada correctamente."
      );

      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error
          ? error.message
          : "No se pudo cambiar la contraseña."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cambiar contraseña</Text>

      <Text style={styles.description}>
        Ingresa tu nueva contraseña y confírmala para actualizarla.
      </Text>

      <Text style={styles.label}>Nueva contraseña</Text>

      <TextInput
        style={styles.input}
        placeholder="Nueva contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Text style={styles.label}>Confirmar contraseña</Text>

      <TextInput
        style={styles.input}
        placeholder="Repite la nueva contraseña"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <Pressable
        style={[
          styles.button,
          loading && styles.buttonDisabled,
        ]}
        onPress={handleChangePassword}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>
            Cambiar contraseña
          </Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#17202A",
    marginTop: 20,
    marginBottom: 10,
  },

  description: {
    fontSize: 15,
    color: "#667085",
    marginBottom: 30,
    lineHeight: 21,
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#344054",
    marginBottom: 7,
  },

  input: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#D0D5DD",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 20,
  },

  button: {
    backgroundColor: "#208AEF",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});