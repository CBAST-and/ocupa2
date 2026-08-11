import { StyleSheet } from "react-native";

export const authStyles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: "center",
    },

    title: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 20,
    },

    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
    },

    button: {
        padding: 14,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 8,
    },

    buttonText: {
        fontWeight: "bold",
    },

    link: {
        textAlign: "center",
        marginTop: 15,
    },
});