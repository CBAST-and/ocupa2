import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { NewsType } from "@/types/NewsType";

export function NewsCard({ news }: { news: NewsType }) {

    //funcion para formatear fecha a formato querido
    function formatDate(date: string) {
      return new Date(date).toLocaleDateString("es-DO", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }
  
  return (
    <Pressable
      style={styles.card}
      onPress={() => WebBrowser.openBrowserAsync(news.url)}>
      <Image source={{ uri: news.image }} style={styles.image} />

      <View style={styles.content}>
        <Text style={styles.source}>{news.source}</Text>

        <Text style={styles.title}>{news.title}</Text>

        <Text style={styles.summary}>{news.summary}</Text>

        <Text style={styles.date}>{formatDate(news.date)}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3,
  },

  image: {
    width: "100%",
    height: 180,
    resizeMode: "cover",
  },
  content: {
    padding: 16,
  },

  source: {
    fontSize: 13,
    color: "#666",
    marginBottom: 6,
  },

  title: {
    fontSize: 19,
    fontWeight: "bold",
    marginBottom: 8,
  },

  summary: {
    fontSize: 15,
    color: "#555",
    lineHeight: 21,
  },

  date: {
    fontSize: 12,
    color: "#888",
    marginTop: 12,
  },
});
