import { useState } from "react";
import { Alert, View } from "react-native";
import { router } from "expo-router";

import ProfileForm from "@/components/profile/ProfileForm";
import { updateProfile } from "@/services/profile";
import { Gender } from "@/types/ProfileType";
import { authStyles } from "@/styles/authStyles";

// Convierte un Date a "YYYY-MM-DD" en hora local (evita el corrimiento de día de toISOString)
function toApiDateString(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

export default function Setup() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [cedula, setCedula] = useState("");
    const [gender, setGender] = useState<Gender | null>(null);
    const [birthDate, setBirthDate] = useState<Date | null>(null);

    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const validate = (): string | null => {
        if (!cedula.trim()) return "La cédula es obligatoria.";
        if (cedula.length !== 11) return "La cédula debe tener 11 dígitos.";
        if (!firstName.trim()) return "El nombre es obligatorio.";
        if (!lastName.trim()) return "El apellido es obligatorio.";
        if (!gender) return "Selecciona un género.";
        if (!birthDate) return "La fecha de nacimiento es obligatoria.";
        return null;
    };

    const handleSubmit = async () => {
        if (submitting) return;

        const validationError = validate();
        if (validationError) {
            setErrorMessage(validationError);
            return;
        }

        setErrorMessage(null);
        setSubmitting(true);

        try {
            await updateProfile({
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                cedula,
                gender: gender as Gender,
                birthDate: toApiDateString(birthDate as Date),
            });

            Alert.alert("Perfil completado", "Tus datos se guardaron correctamente.");
            router.replace("/dashboard");
        } catch (error) {
            setErrorMessage(
                error instanceof Error ? error.message : "No se pudo actualizar el perfil.",
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <View style={authStyles.container}>
            <ProfileForm
                firstName={firstName}
                lastName={lastName}
                cedula={cedula}
                gender={gender}
                birthDate={birthDate}
                setFirstName={setFirstName}
                setLastName={setLastName}
                setCedula={setCedula}
                setGender={setGender}
                setBirthDate={setBirthDate}
                errorMessage={errorMessage}
                submitting={submitting}
                onSubmit={handleSubmit}
            />
        </View>
    );
}
