import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Botao from "../../components/Botao";
import { Colors, Spacing, Radius } from "../../constants/theme";
import { useReservas } from "../../context/ReservasContext";
import { useAuth } from "../../context/AuthContext";

export default function Home() {
  const router = useRouter();
  const { reservas } = useReservas();
  const { usuario } = useAuth();

  const primeiroNome = usuario?.nome?.split(" ")[0] ?? "Aluno";

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>

        {/* Header */}
        <View style={styles.header}>
          <Image
            source={require("../../assets/fiap_logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <TouchableOpacity
            style={styles.perfilBtn}
            onPress={() => router.push("/(app)/perfil")}
            activeOpacity={0.8}
          >
            {usuario?.fotoUri ? (
              <Image source={{ uri: usuario.fotoUri }} style={styles.perfilFoto} />
            ) : (
              <View style={styles.perfilIconeWrap}>
                <Ionicons name="person-outline" size={18} color={Colors.textMuted} />
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Saudação */}
        <View style={styles.saudacao}>
          <View style={styles.saudacaoTituloRow}>
            <Text style={styles.saudacaoTexto}>Olá, {primeiroNome}</Text>
          </View>
          <Text style={styles.saudacaoSub}>{usuario?.rm}</Text>
        </View>

        <Text style={styles.titulo}>FIAP Labs</Text>
        <Text style={styles.subtitulo}>
          Reserve laboratórios e salas da FIAP{"\n"}direto do seu celular.
        </Text>

        {/* Card contador */}
        <View style={styles.cardDestaque}>
          <Text style={styles.cardTitulo}>Reservas ativas</Text>
          <Text style={styles.cardNumero}>{reservas.length}</Text>
          <Text style={styles.cardLegenda}>
            {reservas.length === 1 ? "reserva ativa" : "reservas ativas"}
          </Text>
        </View>

        <View style={styles.botoes}>
          <Botao
            titulo="Ver laboratórios disponíveis"
            onPress={() => router.push("/(app)/labs")}
          />
          <View style={{ height: Spacing.md }} />
          <Botao
            titulo="Minhas reservas"
            variante="secundario"
            onPress={() => router.push("/(app)/minhas-reservas")}
          />
        </View>

        <Text style={styles.rodape}>
          Mobile Development & IoT • Engenharia de Software
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },

  container: { padding: Spacing.lg, paddingTop: Spacing.xl },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },

  logo: { width: 90, height: 45 },

  perfilBtn: {
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: Colors.border,
  },

  perfilFoto: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },

  perfilIconeWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },

  saudacao: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },

  saudacaoTituloRow: { flexDirection: "row", alignItems: "center" },

  saudacaoTexto: { color: Colors.text, fontSize: 18, fontWeight: "700" },

  saudacaoSub: { color: Colors.textMuted, fontSize: 13, marginTop: 2 },

  titulo: {
    color: Colors.text,
    fontSize: 36,
    fontWeight: "800",
    textAlign: "center",
  },

  subtitulo: {
    color: Colors.textMuted,
    fontSize: 15,
    textAlign: "center",
    marginTop: Spacing.sm,
    marginBottom: Spacing.xl,
    lineHeight: 22,
  },

  cardDestaque: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.primary,
    marginBottom: Spacing.xl,
  },

  cardTitulo: {
    color: Colors.textMuted,
    fontSize: 13,
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  cardNumero: {
    color: Colors.primary,
    fontSize: 56,
    fontWeight: "800",
    marginVertical: Spacing.sm,
  },

  cardLegenda: { color: Colors.text, fontSize: 14 },

  botoes: { marginBottom: Spacing.xl },

  rodape: {
    color: Colors.textMuted,
    fontSize: 12,
    textAlign: "center",
    marginTop: Spacing.lg,
  },
});
