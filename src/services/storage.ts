import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

export async function setStoredValue(key: string, value: string) {
  if (Platform.OS === "web") {
    localStorage.setItem(key, value);
    return;
  }
  await SecureStore.setItemAsync(key, value);
}

export async function getStoredValue(key: string) {
  if (Platform.OS === "web") return localStorage.getItem(key);
  return SecureStore.getItemAsync(key);
}

export async function setStoredJson<T>(key: string, value: T) {
  await setStoredValue(key, JSON.stringify(value));
}

export async function getStoredJson<T>(key: string, fallback: T) {
  const value = await getStoredValue(key);
  if (!value) return fallback;
  try { return JSON.parse(value) as T; } catch { return fallback; }
}
