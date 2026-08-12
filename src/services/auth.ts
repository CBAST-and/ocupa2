import { API_URL } from "@/config/api";
import * as SecureStore from "expo-secure-store";

// Funciones de pagina de index
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

  if (!response.ok) {
    throw new Error(data.message || "Error al registrarse");
  }

  return data;
}

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
  console.log(data);

  if (!response.ok) {
    throw new Error(`Error al iniciar sesión: ${data?.message}`);
  }

  return data;
}

export async function forgotPassword(email: string, referralMatricula: string) {
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

  if (!response.ok) {
    throw new Error(data.message || "Error al recuperar la contraseña");
  }

  return data;
}

//funciones de manejo de token
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