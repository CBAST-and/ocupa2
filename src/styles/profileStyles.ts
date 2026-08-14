import { StyleSheet } from "react-native";

export const profileStyles = StyleSheet.create({
    subtitle: {
        fontSize: 15,
        color: "#555",
        marginBottom: 20,
    },

    fieldLabel: {
        fontSize: 13,
        fontWeight: "600",
        marginBottom: 6,
        color: "#333",
    },

    errorText: {
        color: "#c0392b",
        fontSize: 13,
        marginTop: -8,
        marginBottom: 12,
    },

    dateField: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
    },

    dateFieldText: {
        fontSize: 16,
    },

    dateFieldPlaceholder: {
        fontSize: 16,
        color: "#999",
    },

    genderRow: {
        flexDirection: "row",
        marginBottom: 12,
        gap: 8,
    },

    genderChip: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: "center",
    },

    genderChipSelected: {
        borderColor: "rgb(53, 107, 255)",
        backgroundColor: "rgba(53, 107, 255, 0.1)",
    },

    genderChipText: {
        fontSize: 14,
        color: "#333",
    },

    genderChipTextSelected: {
        color: "rgb(53, 107, 255)",
        fontWeight: "bold",
    },

    button: {
        padding: 14,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 8,
        backgroundColor: "rgb(53, 107, 255)",
    },

    buttonDisabled: {
        opacity: 0.6,
    },

    buttonText: {
        color: "#fff",
        fontWeight: "bold",
    },
});
