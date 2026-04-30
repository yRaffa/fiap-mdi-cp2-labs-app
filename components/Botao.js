import React from "react";
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from "react-native";
import { Colors, Radius, Spacing } from "../constants/theme";

export default function Botao({
  titulo,
  onPress,
  variante = "primario",
  carregando = false,
  desabilitado = false,
}) {
  const estiloContainer = [
    styles.base,
    variante === "primario" && styles.primario,
    variante === "secundario" && styles.secundario,
    variante === "perigo" && styles.perigo,
    (desabilitado || carregando) && styles.desabilitado,
  ];

  return (
    <TouchableOpacity
      style={estiloContainer}
      onPress={onPress}
      disabled={desabilitado || carregando}
      activeOpacity={0.8}
    >
      {carregando ? (
        <ActivityIndicator color={Colors.text} />
      ) : (
        <Text style={styles.texto}>{titulo}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52,
  },

  primario: {
    backgroundColor: Colors.primary,
  },

  secundario: {
    backgroundColor: Colors.surfaceLight,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  perigo: {
    backgroundColor: Colors.danger,
  },

  desabilitado: {
    opacity: 0.5,
  },
  
  texto: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: "700",
  },
});
