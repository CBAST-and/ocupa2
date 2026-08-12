import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack> 
      <Stack.Screen name="index" options={{title: "Inicio"}}/>
      <Stack.Screen name="login" options={{title: "Login/Registro"}}/>
      <Stack.Screen name="setup" options={{title: "Termina tu cuenta"}}/>
    </Stack>
  );
}
