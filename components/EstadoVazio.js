import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Spacing } from "../constants/theme";

export default function EstadoVazio({ titulo, mensagem }) {
  return (
    <View style={styles.container}>
      <Ionicons name="mail-outline" size={48} color={Colors.textMuted} style={styles.icone} />
      <Text style={styles.titulo}>{titulo}</Text>
      {mensagem ? <Text style={styles.mensagem}>{mensagem}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: Spacing.xl * 2,
    paddingHorizontal: Spacing.xl,
  },
  icone: { marginBottom: Spacing.md },
  titulo: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  mensagem: {
    color: Colors.textMuted,
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});
