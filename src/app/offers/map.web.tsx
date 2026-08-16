import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function OffersMapWeb() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mapa de ofertas</Text>
      <Text style={styles.message}>
        El mapa está disponible desde la aplicación móvil.
      </Text>
      <Pressable style={styles.button} onPress={() => router.back()}>
        <Text style={styles.buttonText}>Ver ofertas en lista</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    padding: 24,
    backgroundColor: "#FAF8F3",
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1C2420",
  },
  message: {
    maxWidth: 360,
    textAlign: "center",
    color: "#68736D",
    fontSize: 16,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#1C2420",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});
