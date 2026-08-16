import { API_URL } from "@/config/api";
import { getToken } from "@/services/auth";
import { JobType, Offer, OffersFilter } from "@/types/OfferType";

// Obtiene el listado de ofertas activas, con filtros opcionales soportados por la API (GET /offers)
export async function getOffers(filters: OffersFilter = {}): Promise<Offer[]> {
  const token = await getToken();

  if (!token) {
    throw new Error("No se encontró una sesión activa. Inicia sesión nuevamente.");
  }

  const params = new URLSearchParams();

  if (filters.jobTypeKey) {
    params.append("jobTypeKey", filters.jobTypeKey);
  }

  if (filters.contractType) {
    params.append("contractType", filters.contractType);
  }

  const query = params.toString();

  let response: Response;

  try {
    response = await fetch(`${API_URL}/offers${query ? `?${query}` : ""}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch {
    throw new Error("No se pudo conectar con el servidor. Revisa tu conexión.");
  }

  const data = await response.json();

  if (response.status === 401) {
    throw new Error("Tu sesión expiró. Inicia sesión nuevamente.");
  }

  if (!response.ok || !data.ok) {
    throw new Error(data.message || "No se pudieron cargar las ofertas.");
  }

  return data.data;
}

// Obtiene el catálogo de tipos de trabajo disponibles (GET /job-types), usado para el filtro
export async function getJobTypes(): Promise<JobType[]> {
  const token = await getToken();

  if (!token) {
    throw new Error("No se encontró una sesión activa. Inicia sesión nuevamente.");
  }

  let response: Response;

  try {
    response = await fetch(`${API_URL}/job-types`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch {
    throw new Error("No se pudo conectar con el servidor. Revisa tu conexión.");
  }

  const data = await response.json();

  if (response.status === 401) {
    throw new Error("Tu sesión expiró. Inicia sesión nuevamente.");
  }

  if (!response.ok || !data.ok) {
    throw new Error(data.message || "No se pudieron cargar los tipos de empleo.");
  }

  return data.data;
}

export async function getOfferById(id: string): Promise<Offer> {
  const token = await getToken();

  if (!token) {
    throw new Error("No se encontró una sesión activa. Inicia sesión nuevamente.");
  }

  let response: Response;

  try {
    response = await fetch(`${API_URL}/offers/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch {
    throw new Error("No se pudo conectar con el servidor. Revisa tu conexión.");
  }

  const data = await response.json();

  if (response.status === 401) {
    throw new Error("Tu sesión expiró. Inicia sesión nuevamente.");
  }

  if (!response.ok || !data.ok) {
    throw new Error(data.message || "No se pudo cargar la oferta.");
  }

  return data.data;
}

export type ApplyAnswer = { questionId: string; value: string };
export type ApplyPayload = { comment: string; answers: ApplyAnswer[] };

export async function applyToOffer(id: string, payload: ApplyPayload): Promise<void> {
  const token = await getToken();

  if (!token) {
    throw new Error("No se encontró una sesión activa. Inicia sesión nuevamente.");
  }

  let response: Response;

  try {
    response = await fetch(`${API_URL}/offers/${id}/apply`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error("No se pudo conectar con el servidor. Revisa tu conexión.");
  }

  const data = await response.json();

  if (response.status === 401) {
    throw new Error("Tu sesión expiró. Inicia sesión nuevamente.");
  }

  if (!response.ok || !data.ok) {
    throw new Error(data.message || "No se pudo enviar tu aplicación.");
  }
}