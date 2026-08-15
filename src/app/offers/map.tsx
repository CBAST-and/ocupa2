import { JobTypeFilter } from "@/components/offers/JobTypeFilter";
import { getJobTypes, getOffers } from "@/services/offers";
import { colors, contractTypeColors, radius, spacing, type } from "@/styles/tokens";
import { JobType, Offer } from "@/types/OfferType";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import MapView, { Marker, Region } from "react-native-maps";

const DEFAULT_REGION: Region = {
  latitude: 18.4861,
  longitude: -69.9312,
  latitudeDelta: 0.3,
  longitudeDelta: 0.3,
};

function hasValidLocation(offer: Offer) {
  const { lat, lng } = offer.location;
  if (lat === 0 && lng === 0) return false;
  return lat > 17 && lat < 20 && lng > -72.5 && lng < -68;
}

export default function OffersMap() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [jobTypes, setJobTypes] = useState<JobType[]>([]);
  const [selectedJobTypeKey, setSelectedJobTypeKey] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getJobTypes()
      .then(setJobTypes)
      .catch((err) => console.error("Error obteniendo tipos de trabajo:", err));
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);

    getOffers(selectedJobTypeKey ? { jobTypeKey: selectedJobTypeKey } : {})
      .then(setOffers)
      .catch((err) => {
        console.error("Error obteniendo ofertas:", err);
        setError(
          err instanceof Error ? err.message : "No se pudieron cargar las ofertas.",
        );
      })
      .finally(() => setLoading(false));
  }, [selectedJobTypeKey]);

  const validOffers = offers.filter(hasValidLocation);
  const skippedCount = offers.length - validOffers.length;

  return (
    <View style={styles.container}>
      <View style={styles.filterBar}>
        <JobTypeFilter
          jobTypes={jobTypes}
          selectedKey={selectedJobTypeKey}
          onSelect={setSelectedJobTypeKey}
        />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.green} />
          <Text style={styles.centerText}>Cargando ofertas...</Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.centerText}>{error}</Text>
        </View>
      ) : (
        <>
          <MapView style={styles.map} initialRegion={DEFAULT_REGION}>
            {validOffers.map((offer) => (
              <Marker
                key={offer.id}
                coordinate={{
                  latitude: offer.location.lat,
                  longitude: offer.location.lng,
                }}
                title={offer.jobTypeName}
                description={offer.description}
                pinColor={contractTypeColors[offer.contractType]?.solid ?? colors.ink}
                onCalloutPress={() => router.push(`/offers/${offer.id}`)}
              />
            ))}
          </MapView>

          {skippedCount > 0 && (
            <View style={styles.notice}>
              <Text style={styles.noticeText}>
                {skippedCount} oferta(s) sin ubicación válida no se muestran en el mapa.
              </Text>
            </View>
          )}
        </>
      )}

      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>Ver en lista</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.paper,
  },

  filterBar: {
    backgroundColor: colors.paper,
    borderBottomWidth: 1,
    borderBottomColor: colors.hairline,
  },

  map: {
    flex: 1,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.md,
  },

  centerText: {
    ...type.body,
    color: colors.inkMuted,
  },

  notice: {
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.hairline,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },

  noticeText: {
    ...type.caption,
    textAlign: "center",
  },

  backButton: {
    position: "absolute",
    bottom: spacing.xl,
    alignSelf: "center",
    backgroundColor: colors.ink,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
    elevation: 4,
    shadowColor: colors.ink,
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },

  backButtonText: {
    color: colors.paper,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});