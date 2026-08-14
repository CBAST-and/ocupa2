import { useState } from "react";
import { Pressable, Text } from "react-native";
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

type BirthDateFieldProps = {
    value: Date | null;
    onChange: (date: Date) => void;
};

export default function BirthDateField({ value, onChange }: BirthDateFieldProps) {
    const [show, setShow] = useState(false);

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
