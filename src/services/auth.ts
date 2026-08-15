import { API_URL } from "@/config/api";
import * as SecureStore from "expo-secure-store";

// REGISTRO
export async function register(
  email: string,
  firstName: string,
  lastName: string,
  password: string,
  referralMatricula: string,
) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      firstName,
      lastName,
      password,
      referralMatricula,
    }),
  });

  const data = await response.json();

  console.log("STATUS REGISTRO:", response.status);
  console.log("RESPUESTA REGISTRO:", data);

  if (!response.ok) {
    throw new Error(
      data?.message ||
        data?.error ||
        JSON.stringify(data) ||
        "Error al registrarse",
    );
  }

  return data;
}

// LOGIN
export async function login(email: string, password: string) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await response.json();

  console.log("STATUS LOGIN:", response.status);
  console.log("RESPUESTA LOGIN:", data);

  if (!response.ok) {
    throw new Error(
      data?.message ||
        data?.error ||
        JSON.stringify(data) ||
        "Error al iniciar sesión",
    );
  }

  return data;
}

// RECUPERAR CONTRASEÑA
export async function forgotPassword(
  email: string,
  referralMatricula: string,
) {
  const response = await fetch(`${API_URL}/auth/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      referralMatricula,
    }),
  });

  const data = await response.json();

  console.log("STATUS RECUPERAR:", response.status);
  console.log("RESPUESTA RECUPERAR:", data);

  if (!response.ok) {
    throw new Error(
      data?.message ||
        data?.error ||
        JSON.stringify(data) ||
        "Error al recuperar la contraseña",
    );
  }

  return data;
}

// MANEJO DEL TOKEN
const TOKEN_KEY = "bearer_token";

export async function saveToken(token: string) {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function getToken() {
  return await SecureStore.getItemAsync(TOKEN_KEY);
}

export async function deleteToken() {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}