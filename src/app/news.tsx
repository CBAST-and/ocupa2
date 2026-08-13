import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { NewsCard } from "@/components/news/NewsCard";
import { getNews } from "@/services/news";
import { NewsType } from "@/types/NewsType";

export default function News() {
  const [news, setNews] = useState<NewsType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    //cargar las noticias al cargar pantalla
    loadNews();
  }, []);

  //funcion para cargar noticias
  const loadNews = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getNews(12);

      setNews(data);
    } catch (error) {
      console.error("Error obteniendo noticias:", error);
      setError("No se pudieron cargar las noticias.");
    } finally {
      setLoading(false);
    }
  };

  //recargar noticias
  const onRefresh = async () => {
    try {
      setRefreshing(true);

      const data = await getNews(12);

      setNews(data);
    } catch (error) {
      console.error("Error actualizando noticias:", error);
    } finally {
      setRefreshing(false);
    }
  };

  //Si noticias aun estan cargando
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Cargando noticias...</Text>
      </View>
    );
  }
  
  //si noticias no cargan
  if (error) {
    return (
      <View style={styles.center}>
        <Text>{error}</Text>

        <Pressable onPress={loadNews} style={styles.button}>
          <Text style={styles.buttonText}>Reintentar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Noticias</Text>

      {/*lista de noticias*/}
      <FlatList
        data={news}
        keyExtractor={(item, index) => `${item.url}-${index}`}
        renderItem={({ item }) => <NewsCard news={item} />}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },

  header: {
    fontSize: 28,
    fontWeight: "bold",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },

  list: {
    padding: 20,
    gap: 16,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },

  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#208AEF",
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
