import { API_URL } from "@/config/api";
import { getToken } from "@/services/auth";

export async function getExperiences() {
  const token = await getToken();

  if (!token) {
    throw new Error("No se encontró una sesión activa.");
  }

  const response = await fetch(`${API_URL}/me/experiences`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  console.log("RESPUESTA EXPERIENCIAS:", data);

  if (!response.ok) {
    throw new Error(
      data?.message || "No se pudieron cargar las experiencias."
    );
  }

  return data;
}

export async function createExperience(
    title: string,
    description: string,
    jobTypeKey: string,
    certificateImage: string,
  ) {
    const token = await getToken();
  
    if (!token) {
      throw new Error("No se encontró una sesión activa.");
    }
  
    const response = await fetch(`${API_URL}/me/experiences`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        description,
        jobTypeKey,
        certificateImage,
      }),
    });
  
    const data = await response.json();
  
    console.log("STATUS CREAR EXPERIENCIA:", response.status);
    console.log("RESPUESTA CREAR EXPERIENCIA:", data);
  
    if (!response.ok) {
      throw new Error(
        data?.message ||
          data?.error ||
          "No se pudo crear la experiencia."
      );
    }
  
    return data;
  }




export async function getJobTypes() {
    const token = await getToken();
  
    if (!token) {
      throw new Error("No se encontró una sesión activa.");
    }
  
    const response = await fetch(`${API_URL}/job-types`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    const data = await response.json();
  
    console.log("RESPUESTA JOB TYPES:", data);
  
    if (!response.ok) {
      throw new Error(
        data?.message ||
          data?.error ||
          "No se pudieron cargar los tipos de trabajo."
      );
    }
  
    return data;
  }



  export async function deleteExperience(id: string) {
    const token = await getToken();
  
    if (!token) {
      throw new Error("No se encontró una sesión activa.");
    }
  
    const response = await fetch(`${API_URL}/me/experiences/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    let data: any = null;
  
    try {
      data = await response.json();
    } catch {
      data = null;
    }
  
    console.log("STATUS ELIMINAR EXPERIENCIA:", response.status);
    console.log("RESPUESTA ELIMINAR EXPERIENCIA:", data);
  
    if (!response.ok) {
      throw new Error(
        data?.message ||
          data?.error ||
          "No se pudo eliminar la experiencia."
      );
    }
  
    return data;
  }




  export async function uploadCertificate(
    base64: string,
    filename: string
  ) {
    const token = await getToken();
  
    if (!token) {
      throw new Error("No se encontró una sesión activa.");
    }
  
    const response = await fetch(`${API_URL}/uploads`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        image: base64,
        filename,
      }),
    });
  
    const data = await response.json();
  
    console.log("STATUS SUBIR IMAGEN:", response.status);
    console.log("RESPUESTA SUBIR IMAGEN:", data);
  
    if (!response.ok || !data?.ok) {
      throw new Error(
        data?.message ||
          data?.error ||
          "No se pudo subir el certificado."
      );
    }
  
    return data.data;
  }