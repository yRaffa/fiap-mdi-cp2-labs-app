import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Colors, Radius, Spacing } from "../constants/theme";

export default function CardLab({ lab, onPress }) {
  const livre = lab.status === "livre";

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={styles.linhaTopo}>
        <Text style={styles.nome}>{lab.nome}</Text>
        <View
          style={[
            styles.badge,
            { backgroundColor: livre ? Colors.success : Colors.danger },
          ]}
        >
          <Text style={styles.badgeTexto}>
            {livre ? "LIVRE" : "OCUPADO"}
          </Text>
        </View>
      </View>

      <Text style={styles.info}>{lab.andar} • {lab.capacidade} pessoas</Text>
      <Text style={styles.descricao} numberOfLines={2}>
        {lab.descricao}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  linhaTopo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },

  nome: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: "700",
    flex: 1,
  },

  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.sm,
  },

  badgeTexto: {
    color: Colors.text,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.5,
  },

  info: {
    color: Colors.primary,
    fontSize: 13,
    fontWeight: "600",
    marginBottom: Spacing.xs,
  },

  descricao: {
    color: Colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
  },
});
