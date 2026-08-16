import { API_URL } from "@/config/api";
import { getToken } from "@/services/auth";
import { ContractType, JobType, Offer, OfferLocation, OffersFilter } from "@/types/OfferType";

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

export type ApplicationStatus = "applied" | "finalist" | "rejected" | "winner";

export type OfferApplication = {
  id: string;
  offerId?: string;
  status: ApplicationStatus;
  rating?: number | null;
  comment?: string;
  answers?: ApplyAnswer[];
  createdAt?: string;
  applicant?: {
    id?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  };
  offer?: Offer;
};

export type UpdateApplicationPayload = {
  rating?: number;
  status: ApplicationStatus;
  salary?: number;
  currency?: string;
  startDate?: string;
  duration?: string;
};

export type OfferQuestionInput = {
  label: string;
  type: "text" | "date" | "select" | "check";
  required: boolean;
  options?: string[];
};

export type CreateOfferPayload = {
  jobTypeKey: string;
  contractType: ContractType;
  description: string;
  address: string;
  photo: string;
  paymentId: string;
  location: OfferLocation;
  payment: { amount: number; currency: string };
  deadline?: string;
  customAnswers?: Record<string, unknown>;
  questions?: OfferQuestionInput[];
};

// Publica una oferta. El API exige perfil completo, paymentId aprobado y foto.
export async function createOffer(payload: CreateOfferPayload): Promise<Offer> {
  const token = await getToken();
  if (!token) throw new Error("No se encontró una sesión activa. Inicia sesión nuevamente.");

  let response: Response;
  try {
    response = await fetch(`${API_URL}/offers`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error("No se pudo conectar con el servidor. Revisa tu conexión.");
  }

  const data = await response.json();
  if (response.status === 401) throw new Error("Tu sesión expiró. Inicia sesión nuevamente.");
  if (response.status === 402) throw new Error(data?.message || "El pago no está aprobado o no es válido.");
  if (response.status === 422) throw new Error(data?.message || "Revisa los datos de la oferta y la foto.");
  if (!response.ok || !data?.ok) throw new Error(data?.message || "No se pudo publicar la oferta.");
  return data.data;
}

// Lista únicamente las ofertas publicadas por el usuario autenticado.
export async function getMyOffers(): Promise<Offer[]> {
  const token = await getToken();
  if (!token) throw new Error("No se encontró una sesión activa. Inicia sesión nuevamente.");
  const response = await fetch(`${API_URL}/me/offers`, { headers: { Authorization: `Bearer ${token}` } });
  const data = await response.json();
  if (response.status === 401) throw new Error("Tu sesión expiró. Inicia sesión nuevamente.");
  if (!response.ok || !data?.ok) throw new Error(data?.message || "No se pudieron cargar tus ofertas.");
  return data.data;
}

export async function deactivateOffer(id: string): Promise<void> {
  const token = await getToken();
  if (!token) throw new Error("No se encontró una sesión activa. Inicia sesión nuevamente.");
  const response = await fetch(`${API_URL}/offers/${id}/deactivate`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  if (response.status === 401) throw new Error("Tu sesión expiró. Inicia sesión nuevamente.");
  if (!response.ok || !data?.ok) throw new Error(data?.message || "No se pudo desactivar la oferta.");
}

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

  if (response.status === 409) {
    throw new Error(data.message || "Ya aplicaste a esta oferta.");
  }

  if (!response.ok || !data.ok) {
    throw new Error(data.message || "No se pudo enviar tu aplicación.");
  }
}

// Aplicantes de una oferta. Solo el dueño puede consultar este endpoint.
export async function getOfferApplications(id: string): Promise<OfferApplication[]> {
  const token = await getToken();
  if (!token) throw new Error("No se encontró una sesión activa. Inicia sesión nuevamente.");

  const response = await fetch(`${API_URL}/offers/${id}/applications`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();

  if (response.status === 401) throw new Error("Tu sesión expiró. Inicia sesión nuevamente.");
  if (response.status === 403) throw new Error("No tienes permiso para ver los aplicantes de esta oferta.");
  if (!response.ok || !data?.ok) throw new Error(data?.message || "No se pudieron cargar los aplicantes.");
  return data.data;
}

// Ofertas a las que aplicó el usuario autenticado.
export async function getMyApplications(): Promise<OfferApplication[]> {
  const token = await getToken();
  if (!token) throw new Error("No se encontró una sesión activa. Inicia sesión nuevamente.");

  const response = await fetch(`${API_URL}/me/applications`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();

  if (response.status === 401) throw new Error("Tu sesión expiró. Inicia sesión nuevamente.");
  if (!response.ok || !data?.ok) throw new Error(data?.message || "No se pudieron cargar tus aplicaciones.");
  return data.data;
}

// Califica, descarta, marca como finalista o elige ganador.
// status=winner hace que el API cree automáticamente el contrato.
export async function updateApplication(
  id: string,
  payload: UpdateApplicationPayload,
): Promise<OfferApplication> {
  const token = await getToken();
  if (!token) throw new Error("No se encontró una sesión activa. Inicia sesión nuevamente.");

  const response = await fetch(`${API_URL}/applications/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  const data = await response.json();

  if (response.status === 401) throw new Error("Tu sesión expiró. Inicia sesión nuevamente.");
  if (response.status === 403) throw new Error("No tienes permiso para gestionar esta aplicación.");
  if (!response.ok || !data?.ok) throw new Error(data?.message || "No se pudo actualizar la aplicación.");
  return data.data;
}
