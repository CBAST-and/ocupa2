import * as SecureStore from "expo-secure-store";

export async function saveToken(key: string, token: string) {
  await SecureStore.setItemAsync(key, token);
}

export async function getToken(key: string) {
  return SecureStore.getItemAsync(key);
}

export async function deleteToken(key: string) {
  await SecureStore.deleteItemAsync(key);
}
