import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, View } from "react-native";

import ProfileForm from "@/components/profile/ProfileForm";
import { getMyAccount, updateProfile } from "@/services/profile";
import { profileStyles } from "@/styles/profileStyles";
import { colors } from "@/styles/tokens";
import { Gender } from "@/types/ProfileType";
import { toApiDateString } from "@/utils/date";

export default function Setup() {
    const [checking, setChecking] = useState(true);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [cedula, setCedula] = useState("");
    const [gender, setGender] = useState<Gender | null>(null);
    const [birthDate, setBirthDate] = useState<Date | null>(null);

    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        let cancelled = false;

        getMyAccount()
            .then((account) => {
                if (cancelled) return;

                if (account.profileCompleted) {
                    router.replace("/");
                } else {
                    setChecking(false);
                }
            })
            .catch((err) => {
                console.error("Error verificando el estado del perfil:", err);
                if (!cancelled) setChecking(false);
            });

        return () => {
            cancelled = true;
        };
    }, []);

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

    if (checking) {
        return (
            <View style={[profileStyles.screen, { alignItems: "center" }]}>
                <ActivityIndicator size="large" color={colors.green} />
            </View>
        );
    }

    return (
        <View style={profileStyles.screen}>
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