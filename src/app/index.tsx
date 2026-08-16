import { getToken } from "@/services/auth";
import { router, useFocusEffect } from "expo-router";
import { useEffect, useRef, useState, useCallback} from "react";
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const translateX = useRef(new Animated.Value(0)).current;

  // Efecto infinito de imagenes
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

  useFocusEffect(
    useCallback(() => {
      const checkToken = async () => {
        const token = await getToken();
        setIsLoggedIn(!!token);
      };

      checkToken();
    }, [])
  );

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
        ]}>
        {duplicatedImages.map((image, index) => (
          <Image key={index} source={image} style={styles.image} />
        ))}
      </Animated.View>
      <View style={styles.sideContainer}>
        <Pressable style={styles.button} onPress={() => router.push("/videos")}>
          <Text style={styles.loginText}>VIDEOS</Text>
        </Pressable>

        {!isLoggedIn && (
          <Pressable style={styles.login} onPress={() => router.push("/login")}>
            <Text style={styles.loginText}>LOGIN</Text>
          </Pressable>
        )}

        <Pressable style={styles.button} onPress={() => router.push("/news")}>
          <Text style={styles.loginText}>NOTICIAS</Text>
        </Pressable>

        <Pressable style={styles.button} onPress={() => router.push("/about")}>
          <Text style={styles.loginText}>ACERCA DE</Text>
        </Pressable>

        {isLoggedIn && (
          <>
            <Pressable
              style={styles.button}
              onPress={() => router.push("/change-password")}>
              <Text style={styles.loginText}>CAMBIAR CONTRASEÑA</Text>
            </Pressable>

            <Pressable
              style={styles.button}
              onPress={() => router.push("/profile")}>
              <Text style={styles.loginText}>MI PERFIL</Text>
            </Pressable>
          </>
        )}
      </View>
      <Pressable
        style={styles.offersButton}
        onPress={async () => {
          const token = await getToken();
          router.push(token ? "/offers" : "/login");
        }}>
        <Text style={styles.loginText}>EXPLORAR OFERTAS</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width,
    overflow: "hidden",
  },

  imageContainer: {
    flexDirection: "row",
  },

  sideContainer: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },

  image: {
    width,
    height: 220,
    resizeMode: "cover",
  },

  title: {
    textAlign: "center",
    paddingTop: 20,
    fontSize: 40,
    fontWeight: "bold",
  },

  text: {
    fontSize: 18,
    textAlign: "center",
    paddingBottom: 20,
  },

  login: {
    width: "30%",
    aspectRatio: 1,
    borderRadius: 20,
    borderWidth: 2,
    backgroundColor: "rgb(53, 255, 131)",
    borderColor: "rgb(87, 190, 127)",
    margin: "1.5%",
    alignItems: "center",
    justifyContent: "center",
  },

  button: {
    width: "30%",
    aspectRatio: 1,
    borderRadius: 20,
    borderWidth: 2,
    backgroundColor: "rgb(53, 107, 255)",
    borderColor: "rgb(87, 102, 190)",
    margin: "1.5%",
    alignItems: "center",
    justifyContent: "center",
  },

  loginText: {
    fontSize: 12,
    color: "white",
    fontWeight: "bold",
  },

  offersButton: {
    borderRadius: 20,
    borderWidth: 2,
    backgroundColor: "rgb(53, 107, 255)",
    borderColor: "rgb(87, 102, 190)",
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    alignItems: "center",
  },
});
