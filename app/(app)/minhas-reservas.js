import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Botao from "../../components/Botao";
import CabecalhoTela from "../../components/CabecalhoTela";
import EstadoVazio from "../../components/EstadoVazio";
import { Colors, Radius, Spacing } from "../../constants/theme";
import { useReservas } from "../../context/ReservasContext";

export default function MinhasReservas() {
  const router = useRouter();
  const { reservas, cancelarReserva, carregando } = useReservas();

  function confirmarCancelamento(reserva) {
    Alert.alert(
      "Cancelar reserva?",
      `Deseja cancelar a reserva de ${reserva.labNome} às ${reserva.horario}?`,
      [
        { text: "Não", style: "cancel" },
        {
          text: "Sim, cancelar",
          style: "destructive",
          onPress: () => cancelarReserva(reserva.id),
        },
      ]
    );
  }

  if (carregando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.carregandoTexto}>Carregando reservas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CabecalhoTela
        titulo="Minhas Reservas"
        subtitulo={`${reservas.length} ativa(s)`}
      />

      <FlatList
        data={reservas}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.lista}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardCabecalho}>
              <Text style={styles.cardTitulo}>{item.labNome}</Text>
              <View style={styles.tag}>
                <Text style={styles.tagTexto}>ATIVA</Text>
              </View>
            </View>
            <View style={styles.cardInfoRow}>
              <Ionicons name="location-outline" size={14} color={Colors.textMuted} style={styles.cardInfoIcone} />
              <Text style={styles.cardInfo}>{item.andar}</Text>
            </View>
            <View style={styles.cardInfoRow}>
              <Ionicons name="time-outline" size={14} color={Colors.textMuted} style={styles.cardInfoIcone} />
              <Text style={styles.cardInfo}>{item.horario}</Text>
            </View>
            <View style={styles.cardInfoRow}>
              <Ionicons name="calendar-outline" size={14} color={Colors.textMuted} style={styles.cardInfoIcone} />
              <Text style={styles.cardInfo}>{item.data}</Text>
            </View>

            <View style={styles.cardAcoes}>
              <Botao
                titulo="Cancelar reserva"
                variante="perigo"
                onPress={() => confirmarCancelamento(item)}
              />
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={{ flex: 1 }}>
            <EstadoVazio
              titulo="Você ainda não tem reservas"
              mensagem="Que tal reservar um lab agora? Toque no botão abaixo."
            />
            <View style={{ paddingHorizontal: Spacing.lg }}>
              <Botao
                titulo="Ver laboratórios"
                onPress={() => router.push("/(app)/labs")}
              />
            </View>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  centro: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
  },

  carregandoTexto: { color: Colors.textMuted, marginTop: Spacing.md, fontSize: 14 },

  lista: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    flexGrow: 1,
  },

  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  cardCabecalho: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },

  cardTitulo: { color: Colors.text, fontSize: 18, fontWeight: "700", flex: 1 },

  tag: {
    backgroundColor: Colors.success,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.sm,
  },

  tagTexto: { color: Colors.text, fontSize: 11, fontWeight: "800", letterSpacing: 0.5 },

  cardInfo: { color: Colors.textMuted, fontSize: 14 },

  cardInfoRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },

  cardInfoIcone: { marginRight: 6 },

  cardAcoes: { marginTop: Spacing.md },
});
