import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { router } from "expo-router";
import { Offer } from "@/types/OfferType";

const CONTRACT_TYPE_LABELS: Record<string, string> = {
  temporal: "Temporal",
  fijo: "Fijo",
  horas: "Por horas",
};

const PERIOD_LABELS: Record<string, string> = {
  mensual: "/ mes",
  hora: "/ hora",
  total: "total",
};

// Algunas ofertas de prueba tienen paths locales de Android o base64 inválido en "photo"
function isValidPhotoUrl(photo: string) {
  return photo.startsWith("http://") || photo.startsWith("https://");
}

export function OfferCard({ offer }: { offer: Offer }) {
  const periodLabel = PERIOD_LABELS[offer.payment.period] ?? offer.payment.period;

  return (
    <Pressable
      style={styles.card}
      onPress={() => router.push(`/offers/${offer.id}`)}>
      {isValidPhotoUrl(offer.photo) ? (
        <Image source={{ uri: offer.photo }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder]}>
          <Text style={styles.imagePlaceholderText}>Sin imagen</Text>
        </View>
      )}

      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.jobType}>{offer.jobTypeName}</Text>
          <Text style={styles.contractType}>
            {CONTRACT_TYPE_LABELS[offer.contractType] ?? offer.contractType}
          </Text>
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {offer.description}
        </Text>

        <Text style={styles.address} numberOfLines={1}>
          {offer.address}
        </Text>

        <View style={styles.footerRow}>
          <Text style={styles.payment}>
            {offer.payment.amount} {offer.payment.currency} {periodLabel}
          </Text>

          <Text style={styles.likes}>♥ {offer.likesCount}</Text>
        </View>
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
    height: 160,
    resizeMode: "cover",
  },

  imagePlaceholder: {
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
  },

  imagePlaceholderText: {
    color: "#888",
    fontSize: 13,
  },

  content: {
    padding: 16,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },

  jobType: {
    fontSize: 17,
    fontWeight: "bold",
  },

  contractType: {
    fontSize: 12,
    color: "rgb(53, 107, 255)",
    fontWeight: "600",
    textTransform: "uppercase",
  },

  description: {
    fontSize: 14,
    color: "#555",
    marginBottom: 8,
  },

  address: {
    fontSize: 13,
    color: "#888",
    marginBottom: 10,
  },

  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  payment: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#222",
  },

  likes: {
    fontSize: 13,
    color: "#888",
  },
});
