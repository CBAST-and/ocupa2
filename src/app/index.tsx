import { useState } from "react";
import { View } from "react-native";

import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";
import ForgotPasswordForm from "../components/auth/ForgotPasswordForm";

import { login, register, forgotPassword } from "../services/auth";

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

      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  const handleForgotPassword = async () => {
    try {
      const response = await forgotPassword(email, matricula);

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
