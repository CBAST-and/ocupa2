import { View, Text, Pressable } from "react-native";
import AuthInput from "./AuthInput";
import AuthButton from "./AuthButton";
import { authStyles } from "../../styles/authStyles";

type LoginFormProps = {
    email: string;
    password: string;
    setEmail: (value: string) => void;
    setPassword: (value: string) => void;
    onSubmit: () => void;
    onRegister: () => void;
    onForgotPassword: () => void;
};

export default function LoginForm({
    email,
    password,
    setEmail,
    setPassword,
    onSubmit,
    onRegister,
    onForgotPassword,
}: LoginFormProps) {
    return (
        <View>
            <Text style={authStyles.title}>
                Iniciar sesión
            </Text>

            <AuthInput
                placeholder="Correo electrónico"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <AuthInput
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <AuthButton
                title="Iniciar sesión"
                onPress={onSubmit}
            />

            <Pressable onPress={onForgotPassword}>
                <Text style={authStyles.link}>
                    ¿Olvidaste tu contraseña?
                </Text>
            </Pressable>

            <Pressable onPress={onRegister}>
                <Text style={authStyles.link}>
                    Crear una cuenta
                </Text>
            </Pressable>
        </View>
    );
}