import { useState } from "react";
import { Alert, View } from "react-native";
import { router } from "expo-router";

import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";
import ForgotPasswordForm from "../components/auth/ForgotPasswordForm";

import { login, register, forgotPassword, saveToken } from "../services/auth";

import { authStyles } from "../styles/authStyles";

import { AuthMode } from "@/types/AuthMode";

export default function Index() {
  const [mode, setMode] = useState<AuthMode>("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [matricula, setMatricula] = useState("");

  const handleLogin = async () => {
    try {
      const response = await login(email, password);

      console.log(response);

      await saveToken(response.data.token);

      if (!response.data.profileCompleted) {
        router.replace("/setup");
      } else {
        Alert.alert(
          "Ya esta registrado",
          "Ya tu cuenta esta registrada! mensaje temporal",
        );

        router.replace("/");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleRegister = async () => {
    try {
      const response = await register(
        email,
        nombre,
        apellido,
        password,
        matricula,
      );

      await saveToken(response.data.token);

      router.replace("/setup");

      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  const handleForgotPassword = async () => {
    try {
      const response = await forgotPassword(email, matricula);

      Alert.alert("Contraseña nueva", `${response.data.message}`);

      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={authStyles.container}>
      {mode === "login" && (
        <LoginForm
          email={email}
          password={password}
          setEmail={setEmail}
          setPassword={setPassword}
          onSubmit={handleLogin}
          onRegister={() => setMode("register")}
          onForgotPassword={() => setMode("forgotPassword")}
        />
      )}

      {mode === "register" && (
        <RegisterForm
          nombre={nombre}
          apellido={apellido}
          email={email}
          password={password}
          matricula={matricula}
          setNombre={setNombre}
          setApellido={setApellido}
          setEmail={setEmail}
          setPassword={setPassword}
          setMatricula={setMatricula}
          onSubmit={handleRegister}
          onLogin={() => setMode("login")}
        />
      )}

      {mode === "forgotPassword" && (
        <ForgotPasswordForm
          email={email}
          matricula={matricula}
          setEmail={setEmail}
          setMatricula={setMatricula}
          onSubmit={handleForgotPassword}
          onLogin={() => setMode("login")}
        />
      )}
    </View>
  );
}
