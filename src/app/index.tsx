import { router } from "expo-router";
import { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

const images = [
  require("@/assets/images/jobs/job1.jpg"),
  require("@/assets/images/jobs/job2.jpg"),
  require("@/assets/images/jobs/job3.jpg"),
  require("@/assets/images/jobs/job4.jpg"),
];

export default function ImageSlider() {
  const translateX = useRef(new Animated.Value(0)).current;

  // Efecto infinito de imágenes
  const duplicatedImages = [...images, ...images];

  useEffect(() => {
    const imageWidth = width;

    const animation = Animated.loop(
      Animated.timing(translateX, {
        toValue: -imageWidth * images.length,
        duration: images.length * 6000,
        useNativeDriver: true,
      }),
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>OCUPA2</Text>

      <Text style={styles.text}>Encuentra empleos</Text>

      <Animated.View
        style={[
          styles.imageContainer,
          {
            transform: [{ translateX }],
          },
        ]}
      >
        {duplicatedImages.map((image, index) => (
          <Image
            key={index}
            source={image}
            style={styles.image}
            resizeMode="cover"
          />
        ))}
      </Animated.View>

      <View style={styles.menuContainer}>
        <Pressable
          style={styles.button}
          onPress={() => router.push("/videos")}
        >
          <Text style={styles.buttonText}>VIDEOS</Text>
        </Pressable>

        <Pressable
          style={styles.loginButton}
          onPress={() => router.push("/login")}
        >
          <Text style={styles.buttonText}>LOGIN</Text>
        </Pressable>

        <Pressable
          style={styles.button}
          onPress={() => router.push("/news")}
        >
          <Text style={styles.buttonText}>NOTICIAS</Text>
        </Pressable>

        <Pressable
          style={styles.button}
          onPress={() => router.push("/profile")}
        >
          <Text style={styles.buttonText}>MI PERFIL</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width,
    overflow: "hidden",
    backgroundColor: "#f5f5f5",
  },

  imageContainer: {
    flexDirection: "row",
  },

  image: {
    width,
    height: 220,
  },

  title: {
    textAlign: "center",
    paddingTop: 20,
    fontSize: 40,
    fontWeight: "bold",
    color: "#17202A",
  },

  text: {
    fontSize: 18,
    textAlign: "center",
    paddingBottom: 20,
    color: "#475467",
  },

  menuContainer: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },

  button: {
    width: "47%",
    backgroundColor: "#356BFF",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 55,
  },

  loginButton: {
    width: "47%",
    backgroundColor: "#35C875",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 55,
  },

  buttonText: {
    fontSize: 14,
    color: "#ffffff",
    fontWeight: "bold",
    textAlign: "center",
  },
});