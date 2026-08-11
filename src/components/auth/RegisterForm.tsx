import { View, Text, Pressable } from "react-native";
import AuthInput from "./AuthInput";
import AuthButton from "./AuthButton";
import { authStyles } from "../../styles/authStyles";

type RegisterFormProps = {
    nombre: string;
    apellido: string;
    email: string;
    password: string;
    matricula: string;

    setNombre: (value: string) => void;
    setApellido: (value: string) => void;
    setEmail: (value: string) => void;
    setPassword: (value: string) => void;
    setMatricula: (value: string) => void;

    onSubmit: () => void;
    onLogin: () => void;
};

export default function RegisterForm({
    nombre,
    apellido,
    email,
    password,
    matricula,
    setNombre,
    setApellido,
    setEmail,
    setPassword,
    setMatricula,
    onSubmit,
    onLogin,
}: RegisterFormProps) {
    return (
        <View>
            <Text style={authStyles.title}>
                Crear cuenta
            </Text>

            <AuthInput
                placeholder="Nombre"
                value={nombre}
                onChangeText={setNombre}
            />

            <AuthInput
                placeholder="Apellido"
                value={apellido}
                onChangeText={setApellido}
            />

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

            <AuthInput
                placeholder="Matrícula"
                value={matricula}
                onChangeText={setMatricula}
                keyboardType="numeric"
                maxLength={8}
            />

            <AuthButton
                title="Registrarse"
                onPress={onSubmit}
            />

            <Pressable onPress={onLogin}>
                <Text style={authStyles.link}>
                    Ya tengo una cuenta
                </Text>
            </Pressable>
        </View>
    );
}