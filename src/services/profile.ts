import { API_URL } from "@/config/api";
import { getToken } from "@/services/auth";
import { ProfileInput, ProfileUser } from "@/types/ProfileType";

// Completa/actualiza el perfil del usuario autenticado (PUT /me/profile)
export async function updateProfile(
  profile: ProfileInput,
): Promise<ProfileUser> {
  const token = await getToken();

  if (!token) {
    throw new Error("No se encontró una sesión activa. Inicia sesión nuevamente.");
  }

  let response: Response;

  try {
    response = await fetch(`${API_URL}/me/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profile),
    });
  } catch {
    throw new Error("No se pudo conectar con el servidor. Revisa tu conexión.");
  }

  const data = await response.json();

  if (response.status === 401) {
    throw new Error("Tu sesión expiró. Inicia sesión nuevamente.");
  }

  if (response.status === 422) {
    throw new Error(data.message || "Revisa los datos ingresados e intenta de nuevo.");
  }

  if (!response.ok || !data.ok) {
    throw new Error(data.message || "No se pudo actualizar el perfil.");
  }

  return data.data;
}



// Cambia la contraseña del usuario autenticado (PUT /me/password)
export async function changePassword(password: string): Promise<void> {
  const token = await getToken();

  if (!token) {
    throw new Error(
      "No se encontró una sesión activa. Inicia sesión nuevamente."
    );
  }

  let response: Response;

  try {
    response = await fetch(`${API_URL}/me/password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        password,
      }),
    });
  } catch {
    throw new Error(
      "No se pudo conectar con el servidor. Revisa tu conexión."
    );
  }

  const data = await response.json();

  if (response.status === 401) {
    throw new Error("Tu sesión expiró. Inicia sesión nuevamente.");
  }

  if (response.status === 422) {
    throw new Error(
      data.message || "La contraseña ingresada no es válida."
    );
  }

  if (!response.ok) {
    throw new Error(
      data.message || "No se pudo cambiar la contraseña."
    );
  }
}