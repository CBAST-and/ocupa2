import { API_URL } from "@/config/api";
import { getToken } from "@/services/auth";

export type Payment = {
  id: string;
  amount?: number;
  currency?: string;
  status?: string;
  cardholder?: string;
  createdAt?: string;
};

export type PaymentInput = {
  cardNumber: string;
  cvv: string;
  expMonth: number;
  expYear: number;
  cardholder: string;
};

async function authenticatedRequest(path: string, init: RequestInit = {}) {
  const token = await getToken();
  if (!token) throw new Error("No se encontró una sesión activa. Inicia sesión nuevamente.");

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: {
        Accept: "application/json",
        ...(init.body ? { "Content-Type": "application/json" } : {}),
        Authorization: `Bearer ${token}`,
        ...init.headers,
      },
    });
  } catch {
    throw new Error("No se pudo conectar con el servidor. Revisa tu conexión.");
  }

  const data = await response.json();
  if (response.status === 401) throw new Error("Tu sesión expiró. Inicia sesión nuevamente.");
  if (response.status === 402) throw new Error(data?.message || "El pago fue rechazado.");
  if (!response.ok || !data?.ok) throw new Error(data?.message || "No se pudo procesar el pago.");
  return data.data;
}

// El API cobra siempre 1 USD y devuelve el paymentId que requiere POST /offers.
export function createPayment(input: PaymentInput): Promise<Payment> {
  return authenticatedRequest("/payments", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function getMyPayments(): Promise<Payment[]> {
  return authenticatedRequest("/me/payments");
}

