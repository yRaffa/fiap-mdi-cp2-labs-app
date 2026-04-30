import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors, Spacing } from "../constants/theme";

export default function CabecalhoTela({ titulo, subtitulo }) {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>{titulo}</Text>
      {subtitulo ? <Text style={styles.subtitulo}>{subtitulo}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: "#222",
    marginBottom: Spacing.md,
  },
  titulo: {
    color: Colors.text,
    fontSize: 22,
    fontWeight: "800",
  },
  subtitulo: {
    color: Colors.textMuted,
    fontSize: 13,
    marginTop: 2,
  },
});
