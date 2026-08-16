import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import * as WebBrowser from "expo-web-browser";

import { VideoType } from "@/types/VideoType";

export function VideoCard({ video }: { video: VideoType }) {
  const openVideo = async () => {
    await WebBrowser.openBrowserAsync(video.url);
  };

  return (
    <Pressable
      style={styles.card}
      onPress={openVideo}
    >
      <View>
        <Image
          source={{ uri: video.thumbnail }}
          style={styles.thumbnail}
        />

        <View style={styles.playButton}>
          <Text style={styles.playIcon}>▶</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>
          {video.title}
        </Text>

        <Text style={styles.description}>
          {video.description}
        </Text>
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

  thumbnail: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },

  playButton: {
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: [
      { translateX: -30 },
      { translateY: -30 },
    ],

    width: 60,
    height: 60,
    borderRadius: 30,

    backgroundColor: "rgba(0, 0, 0, 0.7)",

    justifyContent: "center",
    alignItems: "center",
  },

  playIcon: {
    color: "white",
    fontSize: 26,
    marginLeft: 4,
  },

  content: {
    padding: 16,
  },

  title: {
    fontSize: 19,
    fontWeight: "bold",
    marginBottom: 8,
  },

  description: {
    fontSize: 15,
    color: "#555",
    lineHeight: 21,
  },
});