import { API_URL } from "@/config/api";
import { NewsType } from "@/types/NewsType";

export async function getNews(limit: number = 12): Promise<NewsType[]> {
  const response = await fetch(`${API_URL}/news?limit=${limit}`);

  const data = await response.json();

  if (!response.ok || !data.ok) {
    throw new Error(data.message || "Error al obtener las noticias");
  }

  return data.data;
}