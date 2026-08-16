import { profileStyles } from "@/styles/profileStyles";
import { formatDateEs } from "@/utils/date";
import DateTimePicker from "@expo/ui/community/datetime-picker";
import { useState } from "react";
import { Pressable, Text } from "react-native";

const TODAY = new Date();
const MIN_DATE = new Date(TODAY.getFullYear() - 100, TODAY.getMonth(), TODAY.getDate());

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
                        {formatDateEs(value)}
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