import React, { useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View, ActivityIndicator } from "react-native";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { ReservasProvider } from "../context/ReservasContext";
import { Colors } from "../constants/theme";

function NavigationGuard({ children }) {
  const { usuario, carregando } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (carregando) return;
    const estaEmAuth = segments[0] === "(auth)";
    if (!usuario && !estaEmAuth) {
      router.replace("/(auth)/login");
    } else if (usuario && estaEmAuth) {
      router.replace("/(app)");
    }
  }, [usuario, carregando, segments]);

  if (carregando) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.background, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return children;
}

function RootLayoutNav() {
  return (
    <NavigationGuard>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: Colors.background },
          headerTintColor: Colors.text,
          headerTitleStyle: { fontWeight: "700" },
          contentStyle: { backgroundColor: Colors.background },
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
      </Stack>
    </NavigationGuard>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <ReservasProvider>
        <RootLayoutNav />
      </ReservasProvider>
    </AuthProvider>
  );
}
