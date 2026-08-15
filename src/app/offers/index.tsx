import { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { router } from "expo-router";
import { OfferCard } from "@/components/offers/OfferCard";
import { JobTypeFilter } from "@/components/offers/JobTypeFilter";
import { getOffers, getJobTypes } from "@/services/offers";
import { JobType, Offer } from "@/types/OfferType";

export default function ExploreOffers() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [jobTypes, setJobTypes] = useState<JobType[]>([]);
  const [selectedJobTypeKey, setSelectedJobTypeKey] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carga el catálogo de tipos de trabajo una sola vez, para el filtro
  useEffect(() => {
    getJobTypes()
      .then(setJobTypes)
      .catch((err) => console.error("Error obteniendo tipos de trabajo:", err));
  }, []);

  const loadOffers = useCallback(async (jobTypeKey: string | null) => {
    try {
      setError(null);

      const data = await getOffers(jobTypeKey ? { jobTypeKey } : {});

      setOffers(data);
    } catch (err) {
      console.error("Error obteniendo ofertas:", err);
      setError(
        err instanceof Error ? err.message : "No se pudieron cargar las ofertas.",
      );
    }
  }, []);

  // Carga inicial y recarga cuando cambia el filtro seleccionado
  useEffect(() => {
    setLoading(true);
    loadOffers(selectedJobTypeKey).finally(() => setLoading(false));
  }, [selectedJobTypeKey, loadOffers]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadOffers(selectedJobTypeKey);
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Explorar ofertas</Text>

      <JobTypeFilter
        jobTypes={jobTypes}
        selectedKey={selectedJobTypeKey}
        onSelect={setSelectedJobTypeKey}
      />

      <Pressable style={styles.mapButton} onPress={() => router.push("/offers/map")}>
        <Text style={styles.mapButtonText}>Ver en mapa</Text>
      </Pressable>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" />
          <Text>Cargando ofertas...</Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text>{error}</Text>

          <Pressable
            onPress={() => loadOffers(selectedJobTypeKey)}
            style={styles.button}>
            <Text style={styles.buttonText}>Reintentar</Text>
          </Pressable>
        </View>
      ) : offers.length === 0 ? (
        <View style={styles.center}>
          <Text>No hay ofertas disponibles por ahora.</Text>
        </View>
      ) : (
        <FlatList
          data={offers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <OfferCard offer={item} />}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },

  header: {
    fontSize: 28,
    fontWeight: "bold",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },

  mapButton: {
    marginHorizontal: 20,
    marginBottom: 10,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "rgb(53, 107, 255)",
    alignItems: "center",
  },

  mapButtonText: {
    color: "white",
    fontWeight: "bold",
  },

  list: {
    padding: 20,
    gap: 16,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },

  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#208AEF",
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
