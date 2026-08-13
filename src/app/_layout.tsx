import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack> 
      <Stack.Screen name="index" options={{title: "Inicio"}}/>
      <Stack.Screen name="login" options={{title: "Login/Registro"}}/>
      <Stack.Screen name="setup" options={{title: "Termina tu cuenta"}}/>
      <Stack.Screen name="videos" options={{title: "Videos promocionales"}}/>
      <Stack.Screen name="news" options={{title: "Noticias laborales"}}/>
    </Stack>
  );
}
