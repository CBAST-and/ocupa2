import { View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function OfferDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Detalle de oferta próximamente</Text>
      <Text style={styles.id}>ID: {id}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },

  text: {
    fontSize: 16,
  },

  id: {
    fontSize: 12,
    color: "#888",
  },
});
