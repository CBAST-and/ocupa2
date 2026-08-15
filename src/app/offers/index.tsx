import { JobTypeFilter } from "@/components/offers/JobTypeFilter";
import { OfferCard } from "@/components/offers/OfferCard";
import { getJobTypes, getOffers } from "@/services/offers";
import { colors, radius, spacing, type } from "@/styles/tokens";
import { JobType, Offer } from "@/types/OfferType";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function ExploreOffers() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [jobTypes, setJobTypes] = useState<JobType[]>([]);
  const [selectedJobTypeKey, setSelectedJobTypeKey] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Ocupa2 · Empleos activos</Text>
        <Text style={styles.title}>Explorar ofertas</Text>
      </View>

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
          <ActivityIndicator size="large" color={colors.green} />
          <Text style={styles.centerText}>Cargando ofertas...</Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.centerText}>{error}</Text>
          <Pressable onPress={() => loadOffers(selectedJobTypeKey)} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </Pressable>
        </View>
      ) : offers.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.centerText}>No hay ofertas disponibles por ahora.</Text>
        </View>
      ) : (
        <FlatList
          data={offers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <OfferCard offer={item} />}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.green} />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.paper,
  },

  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.sm,
  },

  eyebrow: {
    ...type.eyebrow,
    color: colors.green,
    marginBottom: spacing.xs,
  },

  title: {
    ...type.display,
  },

  mapButton: {
    marginHorizontal: spacing.xl,
    marginBottom: spacing.md,
    paddingVertical: 12,
    borderRadius: radius.md,
    backgroundColor: colors.ink,
    alignItems: "center",
  },

  mapButtonText: {
    color: colors.paper,
    fontWeight: "700",
    fontSize: 14,
    letterSpacing: 0.3,
  },

  list: {
    padding: spacing.xl,
    gap: spacing.lg,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
  },

  centerText: {
    ...type.body,
    color: colors.inkMuted,
    textAlign: "center",
  },

  retryButton: {
    paddingHorizontal: spacing.xl,
    paddingVertical: 10,
    borderRadius: radius.md,
    backgroundColor: colors.green,
  },

  retryButtonText: {
    color: colors.white,
    fontWeight: "700",
  },
});