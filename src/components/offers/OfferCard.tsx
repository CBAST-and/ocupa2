import { colors, contractTypeColors, radius, spacing, type } from "@/styles/tokens";
import { Offer } from "@/types/OfferType";
import { router } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

const PERIOD_LABELS: Record<string, string> = {
  mensual: "/ mes",
  hora: "/ hora",
  total: "total",
};

function isValidPhotoUrl(photo: string) {
  return photo.startsWith("http://") || photo.startsWith("https://");
}

const HOLE_COUNT = 10;

export function OfferCard({ offer }: { offer: Offer }) {
  const periodLabel = PERIOD_LABELS[offer.payment.period] ?? offer.payment.period;
  const contract = contractTypeColors[offer.contractType] ?? {
    solid: colors.inkMuted,
    soft: colors.hairline,
    label: offer.contractType,
  };

  return (
    <Pressable style={styles.card} onPress={() => router.push(`/offers/${offer.id}`)}>
      <View style={[styles.topBar, { backgroundColor: contract.solid }]} />

      <View style={styles.imageWrapper}>
        {isValidPhotoUrl(offer.photo) ? (
          <Image source={{ uri: offer.photo }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.imagePlaceholder]}>
            <Text style={styles.imagePlaceholderText}>Sin imagen</Text>
          </View>
        )}

        <View style={styles.perforationRow}>
          {Array.from({ length: HOLE_COUNT }).map((_, index) => (
            <View key={index} style={styles.hole} />
          ))}
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.jobType}>{offer.jobTypeName}</Text>
          <View style={[styles.contractPill, { backgroundColor: contract.soft }]}>
            <Text style={[styles.contractPillText, { color: contract.solid }]}>
              {contract.label}
            </Text>
          </View>
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {offer.description}
        </Text>

        <Text style={styles.address} numberOfLines={1}>
          {offer.address}
        </Text>

        <View style={styles.footerRow}>
          <Text style={styles.payment}>
            {offer.payment.amount} {offer.payment.currency}
            <Text style={styles.paymentPeriod}> {periodLabel}</Text>
          </Text>

          <Text style={styles.likes}>♥ {offer.likesCount}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.hairline,
  },

  topBar: {
    height: 5,
  },

  imageWrapper: {
    position: "relative",
  },

  image: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
  },

  imagePlaceholder: {
    backgroundColor: colors.hairline,
    justifyContent: "center",
    alignItems: "center",
  },

  imagePlaceholderText: {
    ...type.caption,
  },

  perforationRow: {
    position: "absolute",
    bottom: -6,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },

  hole: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.paper,
  },

  content: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },

  jobType: {
    ...type.h2,
    flexShrink: 1,
  },

  contractPill: {
    borderRadius: radius.pill,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },

  contractPillText: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },

  description: {
    ...type.body,
    color: colors.inkMuted,
    marginBottom: spacing.sm,
  },

  address: {
    ...type.caption,
    marginBottom: spacing.md,
  },

  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: colors.hairline,
    paddingTop: spacing.md,
  },

  payment: {
    fontSize: 17,
    fontWeight: "800",
    color: colors.ink,
  },

  paymentPeriod: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.inkMuted,
  },

  likes: {
    ...type.caption,
  },
});