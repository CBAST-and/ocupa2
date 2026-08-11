import { View, Text, Pressable } from "react-native";
import AuthInput from "./AuthInput";
import AuthButton from "./AuthButton";
import { authStyles } from "../../styles/authStyles";

type ForgotPasswordFormProps = {
    email: string;
    matricula: string;
    setEmail: (value: string) => void;
    setMatricula: (value: string) => void;
    onSubmit: () => void;
    onLogin: () => void;
};

export default function ForgotPasswordForm({
    email,
    matricula,
    setEmail,
    setMatricula,
    onSubmit,
    onLogin,
}: ForgotPasswordFormProps) {
    return (
        <View>
            <Text style={authStyles.title}>
                Recuperar contraseña
            </Text>

            <AuthInput
                placeholder="Correo electrónico"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <AuthInput
                placeholder="Matrícula"
                value={matricula}
                onChangeText={setMatricula}
                keyboardType="numeric"
                maxLength={8}
            />

            <AuthButton
                title="Recuperar contraseña"
                onPress={onSubmit}
            />

            <Pressable onPress={onLogin}>
                <Text style={authStyles.link}>
                    Volver a iniciar sesión
                </Text>
            </Pressable>
        </View>
    );
}