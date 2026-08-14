import { Text, View } from "react-native";
import AuthInput from "../auth/AuthInput";
import ProfileButton from "./ProfileButton";
import GenderSelector from "./GenderSelector";
import BirthDateField from "./BirthDateField";
import { authStyles } from "../../styles/authStyles";
import { profileStyles } from "../../styles/profileStyles";
import { Gender } from "@/types/ProfileType";

type ProfileFormProps = {
    firstName: string;
    lastName: string;
    cedula: string;
    gender: Gender | null;
    birthDate: Date | null;

    setFirstName: (value: string) => void;
    setLastName: (value: string) => void;
    setCedula: (value: string) => void;
    setGender: (value: Gender) => void;
    setBirthDate: (value: Date) => void;

    errorMessage: string | null;
    submitting: boolean;
    onSubmit: () => void;
};

export default function ProfileForm({
    firstName,
    lastName,
    cedula,
    gender,
    birthDate,
    setFirstName,
    setLastName,
    setCedula,
    setGender,
    setBirthDate,
    errorMessage,
    submitting,
    onSubmit,
}: ProfileFormProps) {
    return (
        <View>
            <Text style={authStyles.title}>
                Completa tu perfil
            </Text>

            <Text style={profileStyles.subtitle}>
                Necesitamos algunos datos antes de que puedas continuar.
            </Text>

            <Text style={profileStyles.fieldLabel}>Cédula</Text>
            <AuthInput
                placeholder="Cédula (sin guiones)"
                value={cedula}
                onChangeText={(value) => setCedula(value.replace(/[^0-9]/g, ""))}
                keyboardType="numeric"
                maxLength={11}
            />

            <Text style={profileStyles.fieldLabel}>Nombre</Text>
            <AuthInput
                placeholder="Nombre"
                value={firstName}
                onChangeText={setFirstName}
                autoCapitalize="words"
            />

            <Text style={profileStyles.fieldLabel}>Apellido</Text>
            <AuthInput
                placeholder="Apellido"
                value={lastName}
                onChangeText={setLastName}
                autoCapitalize="words"
            />

            <Text style={profileStyles.fieldLabel}>Género</Text>
            <GenderSelector value={gender} onChange={setGender} />

            <Text style={profileStyles.fieldLabel}>Fecha de nacimiento</Text>
            <BirthDateField value={birthDate} onChange={setBirthDate} />

            {errorMessage && (
                <Text style={profileStyles.errorText}>{errorMessage}</Text>
            )}

            <ProfileButton
                title="Guardar perfil"
                onPress={onSubmit}
                loading={submitting}
                disabled={submitting}
            />
        </View>
    );
}
