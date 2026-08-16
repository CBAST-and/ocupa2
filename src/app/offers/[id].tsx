import { applyToOffer, getOfferById } from "@/services/offers";
import { colors, contractTypeColors, radius, spacing, type } from "@/styles/tokens";
import { Offer, OfferQuestion } from "@/types/OfferType";
import { formatDateEs } from "@/utils/date";
import DateTimePicker from "@/components/DateTimePicker";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const PERIOD_LABELS: Record<string, string> = {
  mensual: "/ mes",
  hora: "/ hora",
  total: "total",
};

function isValidPhotoUrl(photo: string) {
  return photo.startsWith("http://") || photo.startsWith("https://");
}

function formatDeadline(deadline: string | null) {
  if (!deadline) return null;
  const date = new Date(deadline);
  if (isNaN(date.getTime())) return null;
  return formatDateEs(date);
}

type AnswersState = Record<string, string>;

function AnswerField({
  question,
  value,
  onChange,
}: {
  question: OfferQuestion;
  value: string;
  onChange: (value: string) => void;
}) {
  const [showDate, setShowDate] = useState(false);

  if (question.type === "text") {
    return (
      <TextInput
        style={styles.input}
        placeholder={question.label}
        placeholderTextColor={colors.inkMuted}
        value={value}
        onChangeText={onChange}
      />
    );
  }

  if (question.type === "date") {
    const parsed = value ? new Date(value) : null;
    const isValidParsed = parsed !== null && !isNaN(parsed.getTime());
    const displayValue = isValidParsed ? formatDateEs(parsed!) : null;

    return (
      <>
        <Pressable style={styles.dateInput} onPress={() => setShowDate(true)}>
          <Text style={displayValue ? styles.dateInputText : styles.dateInputPlaceholder}>
            {displayValue ?? "Selecciona una fecha"}
          </Text>
        </Pressable>

        {showDate && (
          <DateTimePicker
            value={isValidParsed ? parsed! : new Date()}
            mode="date"
            presentation="dialog"
            onValueChange={(_event, selectedDate) => {
              setShowDate(false);
              if (selectedDate) {
                onChange(selectedDate.toISOString());
              }
            }}
            onDismiss={() => setShowDate(false)}
          />
        )}
      </>
    );
  }

  if (question.type === "select") {
    return (
      <View style={styles.optionsRow}>
        {(question.options ?? []).map((option) => (
          <Pressable
            key={option}
            style={[styles.optionChip, value === option && styles.optionChipSelected]}
            onPress={() => onChange(option)}>
            <Text
              style={[
                styles.optionChipText,
                value === option && styles.optionChipTextSelected,
              ]}>
              {option}
            </Text>
          </Pressable>
        ))}
      </View>
    );
  }

  if (question.type === "check") {
    const checked = value === "true";
    return (
      <Pressable style={styles.checkRow} onPress={() => onChange(checked ? "false" : "true")}>
        <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
          {checked && <Text style={styles.checkboxMark}>✓</Text>}
        </View>
        <Text style={styles.checkLabel}>{question.label}</Text>
      </Pressable>
    );
  }

  return null;
}

export default function OfferDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [offer, setOffer] = useState<Offer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [comment, setComment] = useState("");
  const [answers, setAnswers] = useState<AnswersState>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setError(null);

    getOfferById(id)
      .then(setOffer)
      .catch((err) => {
        console.error("Error obteniendo la oferta:", err);
        setError(err instanceof Error ? err.message : "No se pudo cargar la oferta.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const setAnswer = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async () => {
    if (!offer) return;

    const missing = offer.questions.filter((q) => q.required && !answers[q.id]?.trim());

    if (missing.length > 0) {
      Alert.alert("Faltan datos", `Por favor completa: ${missing.map((q) => q.label).join(", ")}`);
      return;
    }

    setSubmitting(true);

    try {
      await applyToOffer(offer.id, {
        comment,
        answers: offer.questions.map((q) => ({
          questionId: q.id,
          value: answers[q.id] ?? "",
        })),
      });

      Alert.alert("¡Listo!", "Tu aplicación fue enviada correctamente.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (err) {
      console.error("Error aplicando a la oferta:", err);
      Alert.alert("Error", err instanceof Error ? err.message : "No se pudo enviar tu aplicación.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.green} />
        <Text style={styles.centerText}>Cargando oferta...</Text>
      </View>
    );
  }

  if (error || !offer) {
    return (
      <View style={styles.center}>
        <Text style={styles.centerText}>{error ?? "Oferta no encontrada."}</Text>
        <Pressable style={styles.retryButton} onPress={() => router.back()}>
          <Text style={styles.retryButtonText}>Volver</Text>
        </Pressable>
      </View>
    );
  }

  const periodLabel = PERIOD_LABELS[offer.payment.period] ?? offer.payment.period;
  const deadlineLabel = formatDeadline(offer.deadline);
  const contract = contractTypeColors[offer.contractType] ?? {
    solid: colors.inkMuted,
    soft: colors.hairline,
    label: offer.contractType,
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.imageWrapper}>
        {isValidPhotoUrl(offer.photo) ? (
          <Image source={{ uri: offer.photo }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.imagePlaceholder]}>
            <Text style={styles.imagePlaceholderText}>Sin imagen</Text>
          </View>
        )}

        <View style={[styles.contractPillFloating, { backgroundColor: contract.solid }]}>
          <Text style={styles.contractPillFloatingText}>{contract.label}</Text>
        </View>
      </View>

      <View style={styles.body}>
        <Text style={styles.eyebrow}>{offer.jobTypeName}</Text>
        <Text style={styles.payment}>
          {offer.payment.amount} {offer.payment.currency}
          <Text style={styles.paymentPeriod}> {periodLabel}</Text>
        </Text>

        <Text style={styles.address}>{offer.address}</Text>

        {deadlineLabel && (
          <View style={styles.deadlineBadge}>
            <Text style={styles.deadlineText}>Cierra el {deadlineLabel}</Text>
          </View>
        )}

        <View style={styles.metaRow}>
          <Text style={styles.metaText}>{offer.applicantsCount} aplicante(s)</Text>
          <Text style={styles.metaDot}>·</Text>
          <Text style={styles.metaText}>♥ {offer.likesCount}</Text>
        </View>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Descripción</Text>
        <Text style={styles.description}>{offer.description}</Text>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Aplicar a esta oferta</Text>

        <Text style={styles.fieldLabel}>Comentario</Text>
        <TextInput
          style={[styles.input, styles.commentInput]}
          placeholder="Cuéntale al empleador por qué eres una buena opción"
          placeholderTextColor={colors.inkMuted}
          value={comment}
          onChangeText={setComment}
          multiline
          numberOfLines={4}
        />

        {offer.questions.map((question) => (
          <View key={question.id} style={styles.questionBlock}>
            {question.type !== "check" && (
              <Text style={styles.fieldLabel}>
                {question.label}
                {question.required ? " *" : ""}
              </Text>
            )}

            <AnswerField
              question={question}
              value={answers[question.id] ?? ""}
              onChange={(value) => setAnswer(question.id, value)}
            />
          </View>
        ))}

        <Pressable
          style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={submitting}>
          {submitting ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.submitButtonText}>Enviar aplicación</Text>
          )}
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.paper,
  },

  content: {
    paddingBottom: spacing.xxxl,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.paper,
    paddingHorizontal: spacing.xl,
  },

  centerText: {
    ...type.body,
    color: colors.inkMuted,
    textAlign: "center",
  },

  imageWrapper: {
    position: "relative",
  },

  image: {
    width: "100%",
    height: 220,
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

  contractPillFloating: {
    position: "absolute",
    bottom: spacing.md,
    left: spacing.lg,
    paddingVertical: 6,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
  },

  contractPillFloatingText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },

  body: {
    padding: spacing.xl,
  },

  eyebrow: {
    ...type.eyebrow,
    color: colors.green,
    marginBottom: spacing.xs,
  },

  payment: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.ink,
    marginBottom: spacing.xs,
  },

  paymentPeriod: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.inkMuted,
  },

  address: {
    ...type.body,
    color: colors.inkMuted,
    marginBottom: spacing.sm,
  },

  deadlineBadge: {
    alignSelf: "flex-start",
    backgroundColor: colors.claySoft,
    borderRadius: radius.sm,
    paddingVertical: 4,
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.md,
  },

  deadlineText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.clay,
  },

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },

  metaText: {
    ...type.caption,
  },

  metaDot: {
    color: colors.hairline,
  },

  divider: {
    height: 1,
    backgroundColor: colors.hairline,
    marginVertical: spacing.lg,
  },

  sectionTitle: {
    ...type.h2,
    marginBottom: spacing.sm,
  },

  description: {
    ...type.body,
    color: colors.inkMuted,
  },

  fieldLabel: {
    ...type.label,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },

  input: {
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 15,
    color: colors.ink,
    backgroundColor: colors.card,
  },

  commentInput: {
    minHeight: 90,
    textAlignVertical: "top",
  },

  questionBlock: {
    marginBottom: spacing.xs,
  },

  dateInput: {
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.card,
  },

  dateInputText: {
    fontSize: 15,
    color: colors.ink,
  },

  dateInputPlaceholder: {
    fontSize: 15,
    color: colors.inkMuted,
  },

  optionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },

  optionChip: {
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: radius.pill,
    paddingVertical: 8,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.card,
  },

  optionChipSelected: {
    borderColor: colors.ink,
    backgroundColor: colors.ink,
  },

  optionChipText: {
    fontSize: 14,
    color: colors.ink,
    fontWeight: "600",
  },

  optionChipTextSelected: {
    color: colors.paper,
    fontWeight: "700",
  },

  checkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },

  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.hairline,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.card,
  },

  checkboxChecked: {
    borderColor: colors.green,
    backgroundColor: colors.green,
  },

  checkboxMark: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "700",
  },

  checkLabel: {
    ...type.body,
    flexShrink: 1,
  },

  submitButton: {
    marginTop: spacing.xl,
    backgroundColor: colors.green,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: "center",
  },

  submitButtonDisabled: {
    opacity: 0.6,
  },

  submitButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "700",
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
