import { API_URL } from "@/config/api";
import { VideoType } from "@/types/VideoType";
export async function getVideos(): Promise<VideoType[]>{
  const response = await fetch(`${API_URL}/videos`);

  const data = await response.json();

  if (!response.ok || !data.ok) {
    throw new Error(data.message || "Error al obtener videos");
  }

  return data.data;
}