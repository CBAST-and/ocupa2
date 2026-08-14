import React, { useState } from "react";
import { Platform, Pressable, Text, View } from "react-native";
import DateTimePicker from "@expo/ui/community/datetime-picker";
import { profileStyles } from "@/styles/profileStyles";

// Rango razonable: entre 100 años atrás y hoy (no se puede nacer en el futuro)
const TODAY = new Date();
const MIN_DATE = new Date(TODAY.getFullYear() - 100, TODAY.getMonth(), TODAY.getDate());

function formatDisplayDate(date: Date) {
    return date.toLocaleDateString("es-DO", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

function toInputDate(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

type BirthDateFieldProps = {
    value: Date | null;
    onChange: (date: Date) => void;
};

export default function BirthDateField({ value, onChange }: BirthDateFieldProps) {
    const [show, setShow] = useState(false);

    // @expo/ui no abre correctamente el selector de fecha en Expo Web.
    // En navegador usamos el control nativo del browser.
    if (Platform.OS === "web") {
        return (
            <View style={profileStyles.dateField}>
                {React.createElement("input", {
                    type: "date",
                    value: value ? toInputDate(value) : "",
                    min: toInputDate(MIN_DATE),
                    max: toInputDate(TODAY),
                    onChange: (event: any) => {
                        if (!event.target.value) return;
                        const selectedDate = new Date(`${event.target.value}T12:00:00`);
                        if (!Number.isNaN(selectedDate.getTime())) onChange(selectedDate);
                    },
                    style: {
                        width: "100%",
                        height: 38,
                        border: 0,
                        outline: "none",
                        backgroundColor: "transparent",
                        color: "#172338",
                        fontSize: 16,
                        fontFamily: "inherit",
                    },
                })}
            </View>
        );
    }

    return (
        <>
            <Pressable
                style={profileStyles.dateField}
                onPress={() => setShow(true)}
            >
                {value ? (
                    <Text style={profileStyles.dateFieldText}>
                        {formatDisplayDate(value)}
                    </Text>
                ) : (
                    <Text style={profileStyles.dateFieldPlaceholder}>
                        Fecha de nacimiento
                    </Text>
                )}
            </Pressable>

            {show && (
                <DateTimePicker
                    value={value ?? MIN_DATE}
                    mode="date"
                    presentation="dialog"
                    minimumDate={MIN_DATE}
                    maximumDate={TODAY}
                    onValueChange={(_event, selectedDate) => {
                        setShow(false);
                        onChange(selectedDate);
                    }}
                    onDismiss={() => setShow(false)}
                />
            )}
        </>
    );
}
