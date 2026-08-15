import { StyleSheet } from "react-native";
import { colors, radius, spacing, type } from "./tokens";

export const profileStyles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: colors.paper,
        padding: spacing.xl,
        justifyContent: "center",
    },

    card: {
        backgroundColor: colors.card,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: colors.hairline,
        padding: spacing.xl,
    },

    eyebrow: {
        ...type.eyebrow,
        color: colors.green,
        marginBottom: spacing.xs,
    },

    title: {
        ...type.display,
        marginBottom: spacing.sm,
    },

    subtitle: {
        ...type.body,
        color: colors.inkMuted,
        marginBottom: spacing.xl,
    },

    fieldLabel: {
        ...type.label,
        marginBottom: spacing.sm,
        marginTop: spacing.md,
    },

    errorText: {
        color: colors.clay,
        fontSize: 13,
        fontWeight: "600",
        marginTop: spacing.xs,
        marginBottom: spacing.sm,
    },

    dateField: {
        borderWidth: 1,
        borderColor: colors.hairline,
        borderRadius: radius.md,
        padding: spacing.md,
        backgroundColor: colors.paper,
        marginBottom: spacing.lg,
    },

    dateFieldText: {
        fontSize: 15,
        color: colors.ink,
    },

    dateFieldPlaceholder: {
        fontSize: 15,
        color: colors.inkMuted,
    },

    genderRow: {
        flexDirection: "row",
        gap: spacing.sm,
        marginBottom: spacing.sm,
    },

    genderChip: {
        flex: 1,
        borderWidth: 1,
        borderColor: colors.hairline,
        borderRadius: radius.md,
        paddingVertical: spacing.md,
        alignItems: "center",
        backgroundColor: colors.paper,
    },

    genderChipSelected: {
        borderColor: colors.green,
        backgroundColor: colors.greenSoft,
    },

    genderChipText: {
        fontSize: 14,
        color: colors.ink,
        fontWeight: "600",
    },

    genderChipTextSelected: {
        color: colors.green,
        fontWeight: "700",
    },

    button: {
        padding: spacing.md,
        borderRadius: radius.md,
        alignItems: "center",
        marginTop: spacing.lg,
        backgroundColor: colors.green,
    },

    buttonDisabled: {
        opacity: 0.6,
    },

    buttonText: {
        color: colors.white,
        fontWeight: "700",
        fontSize: 15,
    },
});