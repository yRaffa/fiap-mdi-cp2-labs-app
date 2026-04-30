import React from "react";
import { View, Text, ScrollView, StyleSheet, Image } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Botao from "../../../components/Botao";
import { Colors, Radius, Spacing } from "../../../constants/theme";
import { LABS } from "../../../data/labs";

export default function DetalhesLab() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const lab = LABS.find((l) => l.id === id);

  if (!lab) {
    return (
      <View style={styles.centro}>
        <Text style={styles.erro}>Laboratório não encontrado.</Text>
        <Botao titulo="Voltar" onPress={() => router.back()} />
      </View>
    );
  }

  const livre = lab.status === "livre";

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.conteudo}>
      <Image source={require("../../../assets/labs.jpg")} style={styles.imagem} />

      <View style={styles.cabecalho}>
        <Text style={styles.nome}>{lab.nome}</Text>
        <View
          style={[
            styles.badge,
            { backgroundColor: livre ? Colors.success : Colors.danger },
          ]}
        >
          <Text style={styles.badgeTexto}>{livre ? "DISPONÍVEL" : "OCUPADO"}</Text>
        </View>
      </View>

      <View style={styles.localizacaoRow}>
        <Ionicons name="location-outline" size={14} color={Colors.primary} style={{ marginRight: 4 }} />
        <Text style={styles.localizacao}>{lab.andar} • Capacidade: {lab.capacidade} pessoas</Text>
      </View>

      <View style={styles.secao}>
        <Text style={styles.secaoTitulo}>Sobre o espaço</Text>
        <Text style={styles.descricao}>{lab.descricao}</Text>
      </View>

      <View style={styles.secao}>
        <Text style={styles.secaoTitulo}>Equipamentos</Text>
        {lab.equipamentos.map((eq, i) => (
          <View key={i} style={styles.itemEquip}>
            <Ionicons name="chevron-forward" size={14} color={Colors.primary} style={{ marginRight: 6 }} />
            <Text style={styles.equipTexto}>{eq}</Text>
          </View>
        ))}
      </View>

      <View style={styles.acoes}>
        <Botao
          titulo={livre ? "Reservar este laboratório" : "Ver horários disponíveis"}
          onPress={() => router.push(`/(app)/reservar/${lab.id}`)}
        />
        <View style={{ height: Spacing.sm }} />
        <Botao titulo="Voltar" variante="secundario" onPress={() => router.back()} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  conteudo: { paddingBottom: Spacing.xl },

  centro: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.lg,
  },

  erro: { color: Colors.text, fontSize: 16, marginBottom: Spacing.lg },

  imagem: { width: "100%", height: 200, backgroundColor: Colors.surface },

  cabecalho: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
  },

  nome: { color: Colors.text, fontSize: 26, fontWeight: "800", flex: 1 },

  badge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radius.sm,
  },

  badgeTexto: {
    color: Colors.text,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.5,
  },

  localizacaoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.sm,
  },

  localizacao: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: "600",
  },

  secao: { paddingHorizontal: Spacing.lg, marginTop: Spacing.lg },

  secaoTitulo: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: Spacing.sm,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  descricao: { color: Colors.textMuted, fontSize: 14, lineHeight: 22 },

  itemEquip: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.xs,
  },

  equipTexto: { color: Colors.text, fontSize: 14 },

  acoes: { paddingHorizontal: Spacing.lg, marginTop: Spacing.xl },
});
