import { getToken } from "@/services/auth";
import { router, useFocusEffect } from "expo-router";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

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

  const translateX = useRef(
    new Animated.Value(0)
  ).current;

  const duplicatedImages = [
    ...images,
    ...images,
  ];

  // Slider infinito
  useEffect(() => {
    const imageWidth = width;

    const animation = Animated.loop(
      Animated.timing(translateX, {
        toValue:
          -imageWidth * images.length,
        duration:
          images.length * 6000,
        useNativeDriver: true,
      }),
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, []);

  // Verifica si existe una sesión cada vez
  // que el usuario vuelve al Inicio
  useFocusEffect(
    useCallback(() => {
      const checkToken = async () => {
        const token =
          await getToken();

        setIsLoggedIn(!!token);
      };

      checkToken();
    }, []),
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        OCUPA2
      </Text>

      <Text style={styles.text}>
        Encuentra empleos
      </Text>

      <Animated.View
        style={[
          styles.imageContainer,
          {
            transform: [
              { translateX },
            ],
          },
        ]}
      >
        {duplicatedImages.map(
          (image, index) => (
            <Image
              key={index}
              source={image}
              style={styles.image}
              resizeMode="cover"
            />
          ),
        )}
      </Animated.View>

      <View
        style={styles.menuContainer}
      >
        {/* VIDEOS */}

        <Pressable
          style={styles.button}
          onPress={() =>
            router.push("/videos")
          }
        >
          <Text
            style={styles.buttonText}
          >
            VIDEOS
          </Text>
        </Pressable>

        {/* LOGIN solamente si no hay sesión */}

        {!isLoggedIn && (
          <Pressable
            style={
              styles.loginButton
            }
            onPress={() =>
              router.push("/login")
            }
          >
            <Text
              style={
                styles.buttonText
              }
            >
              LOGIN
            </Text>
          </Pressable>
        )}

        {/* NOTICIAS */}

        <Pressable
          style={styles.button}
          onPress={() =>
            router.push("/news")
          }
        >
          <Text
            style={styles.buttonText}
          >
            NOTICIAS
          </Text>
        </Pressable>

        {/* MI PERFIL solo si inició sesión */}

        {isLoggedIn && (
          <Pressable
            style={styles.button}
            onPress={() =>
              router.push("/profile")
            }
          >
            <Text
              style={
                styles.buttonText
              }
            >
              MI PERFIL
            </Text>
          </Pressable>
        )}
      </View>

      {/* EXPLORAR OFERTAS */}

      <Pressable
        style={styles.offersButton}
        onPress={async () => {
          const token =
            await getToken();

          router.push(
            token
              ? "/offers"
              : "/login",
          );
        }}
      >
        <Text
          style={styles.buttonText}
        >
          EXPLORAR OFERTAS
        </Text>
      </Pressable>
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
    paddingBottom: 12,
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

  offersButton: {
    backgroundColor: "#356BFF",
    marginHorizontal: 20,
    marginBottom: 20,
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