import { colors, radius, spacing } from "@/styles/tokens";
import { JobType } from "@/types/OfferType";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";

type Props = {
  jobTypes: JobType[];
  selectedKey: string | null;
  onSelect: (key: string | null) => void;
};

export function JobTypeFilter({ jobTypes, selectedKey, onSelect }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.row}>
      <Pressable
        style={[styles.chip, selectedKey === null && styles.chipSelected]}
        onPress={() => onSelect(null)}>
        <Text style={[styles.chipText, selectedKey === null && styles.chipTextSelected]}>
          Todos
        </Text>
      </Pressable>

      {jobTypes.map((jobType) => (
        <Pressable
          key={jobType.id}
          style={[styles.chip, selectedKey === jobType.key && styles.chipSelected]}
          onPress={() => onSelect(jobType.key)}>
          <Text
            style={[
              styles.chipText,
              selectedKey === jobType.key && styles.chipTextSelected,
            ]}>
            {jobType.name}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 0,
    flexShrink: 0,
    height: 56,
  },

  row: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
    alignItems: "center",
  },

  chip: {
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: radius.pill,
    paddingVertical: 10,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.card,
    justifyContent: "center",
    alignSelf: "flex-start",
  },

  chipSelected: {
    borderColor: colors.ink,
    backgroundColor: colors.ink,
  },

  chipText: {
    fontSize: 14,
    lineHeight: 18,
    color: colors.ink,
    fontWeight: "600",
  },

  chipTextSelected: {
    color: colors.paper,
    fontWeight: "700",
  },
});