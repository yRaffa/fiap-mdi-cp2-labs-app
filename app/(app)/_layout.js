import { Stack } from "expo-router";
import { Colors } from "../../constants/theme";

export default function AppLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: Colors.background },
        headerTintColor: Colors.text,
        headerTitleStyle: { fontWeight: "700" },
        contentStyle: { backgroundColor: Colors.background },
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="labs" options={{ title: "Laboratórios" }} />
      <Stack.Screen name="lab/[id]" options={{ title: "Detalhes do Lab" }} />
      <Stack.Screen name="reservar/[id]" options={{ title: "Reservar" }} />
      <Stack.Screen name="minhas-reservas" options={{ title: "Minhas Reservas" }} />
      <Stack.Screen name="perfil" options={{ title: "Meu Perfil" }} />
    </Stack>
  );
}
