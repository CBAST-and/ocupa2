import { ScrollView, Text, Pressable, StyleSheet } from "react-native";
import { JobType } from "@/types/OfferType";

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
      contentContainerStyle={styles.row}>
      <Pressable
        style={[styles.chip, selectedKey === null && styles.chipSelected]}
        onPress={() => onSelect(null)}>
        <Text
          style={[
            styles.chipText,
            selectedKey === null && styles.chipTextSelected,
          ]}>
          Todos
        </Text>
      </Pressable>

      {jobTypes.map((jobType) => (
        <Pressable
          key={jobType.id}
          style={[
            styles.chip,
            selectedKey === jobType.key && styles.chipSelected,
          ]}
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
  row: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 8,
  },

  chip: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },

  chipSelected: {
    borderColor: "rgb(53, 107, 255)",
    backgroundColor: "rgba(53, 107, 255, 0.1)",
  },

  chipText: {
    fontSize: 14,
    color: "#333",
  },

  chipTextSelected: {
    color: "rgb(53, 107, 255)",
    fontWeight: "bold",
  },
});
