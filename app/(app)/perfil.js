import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../../context/AuthContext";
import { useReservas } from "../../context/ReservasContext";
import { Colors, Spacing, Radius } from "../../constants/theme";

export default function Perfil() {
  const router = useRouter();
  const { usuario, atualizarFoto, logout } = useAuth();
  const { historico } = useReservas();
  const [atualizandoFoto, setAtualizandoFoto] = useState(false);

  const totalReservas = historico.length;
  const reservasAtivas = historico.filter((r) => r.status === "ativa").length;
  const reservasCanceladas = historico.filter((r) => r.status === "cancelada").length;

  async function handleEscolherFoto() {
    Alert.alert(
      "Foto de perfil",
      "Escolha a origem da foto",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Câmera", onPress: () => abrirFonte("camera") },
        { text: "Galeria", onPress: () => abrirFonte("gallery") },
      ]
    );
  }

  async function abrirFonte(fonte) {
    try {
      let resultado;

      if (fonte === "camera") {
        const permissao = await ImagePicker.requestCameraPermissionsAsync();
        if (!permissao.granted) {
          Alert.alert("Permissão negada", "Precisamos de acesso à câmera.");
          return;
        }
        resultado = await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.7,
        });
      } else {
        const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissao.granted) {
          Alert.alert("Permissão negada", "Precisamos de acesso à galeria.");
          return;
        }
        resultado = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.7,
        });
      }

      if (!resultado.canceled && resultado.assets?.[0]?.uri) {
        setAtualizandoFoto(true);
        await atualizarFoto(resultado.assets[0].uri);
        setAtualizandoFoto(false);
      }
    } catch (e) {
      setAtualizandoFoto(false);
      Alert.alert("Erro", "Não foi possível atualizar a foto.");
    }
  }

  function handleLogout() {
    Alert.alert("Sair", "Deseja sair da sua conta?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Sair", style: "destructive", onPress: logout },
    ]);
  }

  const iniciais = usuario?.nome
    ?.split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase() ?? "?";

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.conteudo}>

      {/* Avatar */}
      <View style={styles.avatarSecao}>
        <TouchableOpacity style={styles.avatarWrap} onPress={handleEscolherFoto} activeOpacity={0.8}>
          {atualizandoFoto ? (
            <View style={styles.avatarPlaceholder}>
              <ActivityIndicator color={Colors.primary} size="large" />
            </View>
          ) : usuario?.fotoUri ? (
            <Image source={{ uri: usuario.fotoUri }} style={styles.avatarImagem} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarIniciais}>{iniciais}</Text>
            </View>
          )}
          <View style={styles.avatarBotaoFoto}>
            <Ionicons name="camera" size={14} color={Colors.text} />
          </View>
        </TouchableOpacity>
        <Text style={styles.avatarNome}>{usuario?.nome}</Text>
        <Text style={styles.avatarRm}>{usuario?.rm}</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumero}>{totalReservas}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={[styles.statCard, styles.statCardDestaque]}>
          <Text style={[styles.statNumero, { color: Colors.success }]}>{reservasAtivas}</Text>
          <Text style={styles.statLabel}>Ativas</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statNumero, { color: Colors.textMuted }]}>{reservasCanceladas}</Text>
          <Text style={styles.statLabel}>Canceladas</Text>
        </View>
      </View>

      {/* Dados do aluno */}
      <View style={styles.secao}>
        <Text style={styles.secaoTitulo}>Dados do aluno</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoLinha}>
            <Ionicons name="person-outline" size={16} color={Colors.textMuted} style={styles.infoIcone} />
            <View>
              <Text style={styles.infoRotulo}>Nome completo</Text>
              <Text style={styles.infoValor}>{usuario?.nome}</Text>
            </View>
          </View>
          <View style={styles.separador} />
          <View style={styles.infoLinha}>
            <Ionicons name="card-outline" size={16} color={Colors.textMuted} style={styles.infoIcone} />
            <View>
              <Text style={styles.infoRotulo}>RM</Text>
              <Text style={styles.infoValor}>{usuario?.rm}</Text>
            </View>
          </View>
          <View style={styles.separador} />
          <View style={styles.infoLinha}>
            <Ionicons name="school-outline" size={16} color={Colors.textMuted} style={styles.infoIcone} />
            <View>
              <Text style={styles.infoRotulo}>Curso</Text>
              <Text style={styles.infoValor}>Engenharia de Software</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Histórico */}
      <View style={styles.secao}>
        <Text style={styles.secaoTitulo}>Histórico de reservas</Text>

        {historico.length === 0 ? (
          <View style={styles.historicoVazio}>
            <Ionicons name="time-outline" size={36} color={Colors.textMuted} />
            <Text style={styles.historicoVazioTexto}>Nenhuma reserva realizada ainda.</Text>
          </View>
        ) : (
          historico.map((item) => (
            <View key={item.id} style={styles.historicoCard}>
              <View style={styles.historicoHeader}>
                <Text style={styles.historicoNome}>{item.labNome}</Text>
                <View style={[
                  styles.historicoBadge,
                  { backgroundColor: item.status === "ativa" ? Colors.success : Colors.surfaceLight },
                ]}>
                  <Text style={[
                    styles.historicoBadgeTexto,
                    { color: item.status === "ativa" ? Colors.text : Colors.textMuted },
                  ]}>
                    {item.status === "ativa" ? "ATIVA" : "CANCELADA"}
                  </Text>
                </View>
              </View>
              <View style={styles.historicoInfoRow}>
                <Ionicons name="location-outline" size={13} color={Colors.textMuted} style={{ marginRight: 5 }} />
                <Text style={styles.historicoInfo}>{item.andar}</Text>
              </View>
              <View style={styles.historicoInfoRow}>
                <Ionicons name="time-outline" size={13} color={Colors.textMuted} style={{ marginRight: 5 }} />
                <Text style={styles.historicoInfo}>{item.horario}</Text>
              </View>
              <View style={styles.historicoInfoRow}>
                <Ionicons name="calendar-outline" size={13} color={Colors.textMuted} style={{ marginRight: 5 }} />
                <Text style={styles.historicoInfo}>{item.data}</Text>
              </View>
            </View>
          ))
        )}
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.botaoSair} onPress={handleLogout} activeOpacity={0.85}>
        <Ionicons name="log-out-outline" size={18} color={Colors.danger} style={{ marginRight: Spacing.sm }} />
        <Text style={styles.botaoSairTexto}>Sair da conta</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  conteudo: { paddingBottom: Spacing.xl * 2 },

  // Avatar
  avatarSecao: {
    alignItems: "center",
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginBottom: Spacing.lg,
  },

  avatarWrap: { position: "relative", marginBottom: Spacing.md },

  avatarImagem: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: Colors.primary,
  },

  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.surface,
    borderWidth: 3,
    borderColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  avatarIniciais: {
    color: Colors.primary,
    fontSize: 32,
    fontWeight: "800",
    letterSpacing: 1,
  },

  avatarBotaoFoto: {
    position: "absolute",
    bottom: 2,
    right: 2,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    width: 26,
    height: 26,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: Colors.background,
  },

  avatarNome: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 4,
  },

  avatarRm: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.5,
  },

  // Stats
  statsRow: {
    flexDirection: "row",
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },

  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },

  statCardDestaque: {
    borderColor: Colors.success + "55",
  },

  statNumero: {
    color: Colors.text,
    fontSize: 26,
    fontWeight: "800",
  },

  statLabel: {
    color: Colors.textMuted,
    fontSize: 11,
    marginTop: 2,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  // Seções
  secao: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },

  secaoTitulo: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: Spacing.md,
  },

  // Dados
  infoCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden",
  },

  infoLinha: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
  },

  infoIcone: { marginRight: Spacing.md },

  infoRotulo: {
    color: Colors.textMuted,
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },

  infoValor: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: "600",
  },

  separador: {
    height: 1,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.md,
  },

  // Histórico
  historicoVazio: {
    alignItems: "center",
    paddingVertical: Spacing.xl,
    gap: Spacing.sm,
  },

  historicoVazioTexto: {
    color: Colors.textMuted,
    fontSize: 14,
  },

  historicoCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  historicoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },

  historicoNome: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: "700",
    flex: 1,
  },

  historicoBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.sm,
  },

  historicoBadgeTexto: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
  },

  historicoInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 3,
  },

  historicoInfo: {
    color: Colors.textMuted,
    fontSize: 13,
  },

  // Botão sair
  botaoSair: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.sm,
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.danger + "55",
    backgroundColor: Colors.danger + "11",
  },

  botaoSairTexto: {
    color: Colors.danger,
    fontSize: 15,
    fontWeight: "700",
  },
});
