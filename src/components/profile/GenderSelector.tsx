import { Pressable, Text, View } from "react-native";
import { profileStyles } from "@/styles/profileStyles";
import { Gender } from "@/types/ProfileType";

type GenderOption = {
    value: Gender;
    label: string;
};

// Valores tal como los espera el API (ver enum de "gender" en /me/profile)
const GENDER_OPTIONS: GenderOption[] = [
    { value: "masculino", label: "Masculino" },
    { value: "femenino", label: "Femenino" },
    { value: "otro", label: "Otro" },
];

type GenderSelectorProps = {
    value: Gender | null;
    onChange: (value: Gender) => void;
};

export default function GenderSelector({ value, onChange }: GenderSelectorProps) {
    return (
        <View style={profileStyles.genderRow}>
            {GENDER_OPTIONS.map((option) => {
                const selected = option.value === value;

                return (
                    <Pressable
                        key={option.value}
                        style={[
                            profileStyles.genderChip,
                            selected && profileStyles.genderChipSelected,
                        ]}
                        onPress={() => onChange(option.value)}
                    >
                        <Text
                            style={[
                                profileStyles.genderChipText,
                                selected && profileStyles.genderChipTextSelected,
                            ]}
                        >
                            {option.label}
                        </Text>
                    </Pressable>
                );
            })}
        </View>
    );
}
