import { useEffect, useState } from "react";
import { View, Text, Pressable, ActivityIndicator, StyleSheet } from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import { router } from "expo-router";
import { JobTypeFilter } from "@/components/offers/JobTypeFilter";
import { getOffers, getJobTypes } from "@/services/offers";
import { JobType, Offer } from "@/types/OfferType";

// Centro de Santo Domingo, usado cuando no hay ofertas con ubicación válida
const DEFAULT_REGION: Region = {
  latitude: 18.4861,
  longitude: -69.9312,
  latitudeDelta: 0.3,
  longitudeDelta: 0.3,
};

// Descarta coordenadas de prueba inválidas (0,0) o claramente fuera de República Dominicana
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
      <JobTypeFilter
        jobTypes={jobTypes}
        selectedKey={selectedJobTypeKey}
        onSelect={setSelectedJobTypeKey}
      />

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" />
          <Text>Cargando ofertas...</Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text>{error}</Text>
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
                onCalloutPress={() => router.push(`/offers/${offer.id}`)}
              />
            ))}
          </MapView>

          {skippedCount > 0 && (
            <Text style={styles.notice}>
              {skippedCount} oferta(s) sin ubicación válida no se muestran en el mapa.
            </Text>
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
    backgroundColor: "#f5f5f5",
  },

  map: {
    flex: 1,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },

  notice: {
    fontSize: 12,
    color: "#888",
    textAlign: "center",
    paddingVertical: 8,
    backgroundColor: "#eee",
  },

  backButton: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    backgroundColor: "rgb(53, 107, 255)",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    elevation: 4,
  },

  backButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
