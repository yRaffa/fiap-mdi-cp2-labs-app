import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import CardLab from "../../components/CardLab";
import CabecalhoTela from "../../components/CabecalhoTela";
import EstadoVazio from "../../components/EstadoVazio";
import { Colors, Spacing, Radius } from "../../constants/theme";
import { LABS } from "../../data/labs";

export default function TelaLabs() {
  const router = useRouter();
  const [carregando, setCarregando] = useState(true);
  const [labs, setLabs] = useState([]);
  const [filtro, setFiltro] = useState("todos");
  const [busca, setBusca] = useState(""); // ⭐ Diferencial: busca em tempo real

  useEffect(() => {
    const timer = setTimeout(() => {
      setLabs(LABS);
      setCarregando(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  // Busca + filtro aplicados em tempo real com useMemo para performance
  const labsFiltrados = useMemo(() => {
    let resultado = labs;

    // Filtro de status
    if (filtro !== "todos") {
      resultado = resultado.filter((l) => l.status === filtro);
    }

    // Busca por texto (nome, andar, equipamentos, descrição)
    const termoBusca = busca.trim().toLowerCase();
    if (termoBusca) {
      resultado = resultado.filter((l) => {
        return (
          l.nome.toLowerCase().includes(termoBusca) ||
          l.andar.toLowerCase().includes(termoBusca) ||
          l.descricao.toLowerCase().includes(termoBusca) ||
          l.equipamentos.some((eq) => eq.toLowerCase().includes(termoBusca))
        );
      });
    }

    return resultado;
  }, [labs, filtro, busca]);

  if (carregando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.carregandoTexto}>Carregando laboratórios...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CabecalhoTela
        titulo="Laboratórios"
        subtitulo={`${labsFiltrados.length} encontrado(s)`}
      />

      {/* ⭐ Diferencial: Campo de busca em tempo real */}
      <View style={styles.campoBusca}>
        <Ionicons name="search-outline" size={18} color={Colors.textMuted} style={{ marginRight: Spacing.sm }} />
        <TextInput
          style={styles.inputBusca}
          placeholder="Buscar por nome, andar, equipamento..."
          placeholderTextColor={Colors.textMuted}
          value={busca}
          onChangeText={setBusca}
          autoCorrect={false}
          clearButtonMode="while-editing"
        />
        {busca.length > 0 && (
          <TouchableOpacity onPress={() => setBusca("")} style={styles.limparBusca}>
            <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Filtros de status */}
      <View style={styles.filtros}>
        {[
          { chave: "todos", label: "Todos" },
          { chave: "livre", label: "Livres" },
          { chave: "ocupado", label: "Ocupados" },
        ].map((opt) => (
          <TouchableOpacity
            key={opt.chave}
            style={[styles.chip, filtro === opt.chave && styles.chipAtivo]}
            onPress={() => setFiltro(opt.chave)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.chipTexto,
                filtro === opt.chave && styles.chipTextoAtivo,
              ]}
            >
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={labsFiltrados}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.lista}
        renderItem={({ item }) => (
          <CardLab
            lab={item}
            onPress={() => router.push(`/(app)/lab/${item.id}`)}
          />
        )}
        ListEmptyComponent={
          <EstadoVazio
            titulo="Nenhum laboratório encontrado"
            mensagem={
              busca
                ? `Nenhum resultado para "${busca}". Tente outro termo.`
                : "Tente trocar o filtro selecionado."
            }
          />
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

  campoBusca: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.md,
  },

  limparBusca: { padding: Spacing.xs },

  inputBusca: {
    flex: 1,
    color: Colors.text,
    fontSize: 14,
    paddingVertical: Spacing.md,
  },

  filtros: {
    flexDirection: "row",
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },

  chip: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.lg,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  chipAtivo: { backgroundColor: Colors.primary, borderColor: Colors.primary },

  chipTexto: { color: Colors.textMuted, fontSize: 13, fontWeight: "600" },

  chipTextoAtivo: { color: Colors.text },

  lista: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    flexGrow: 1,
  },
});
