import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Calendar, LocaleConfig } from "react-native-calendars";
import Botao from "../../../components/Botao";
import { Colors, Radius, Spacing } from "../../../constants/theme";
import { LABS, HORARIOS_DISPONIVEIS } from "../../../data/labs";
import { useReservas } from "../../../context/ReservasContext";

// Localização do calendário em português
LocaleConfig.locales["pt-br"] = {
  monthNames: [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
  ],
  monthNamesShort: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
  dayNames: ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
  dayNamesShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
  today: "Hoje",
};
LocaleConfig.defaultLocale = "pt-br";

// Data mínima = hoje
function dataHoje() {
  return new Date().toISOString().split("T")[0];
}

// Formata "2025-04-29" → "29/04/2025"
function formatarDataBR(iso) {
  const [ano, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${ano}`;
}

export default function Reservar() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { adicionarReserva } = useReservas();

  const lab = LABS.find((l) => l.id === id);
  const [dataSelecionada, setDataSelecionada] = useState(dataHoje());
  const [horarioSelecionado, setHorarioSelecionado] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);

  if (!lab) {
    return (
      <View style={styles.centro}>
        <Text style={styles.erroTexto}>Laboratório não encontrado.</Text>
      </View>
    );
  }

  async function confirmar() {
    if (!horarioSelecionado) {
      setErro("Selecione um horário para continuar.");
      return;
    }
    setErro("");
    setEnviando(true);
    try {
      await adicionarReserva({
        labId: lab.id,
        labNome: lab.nome,
        andar: lab.andar,
        horario: horarioSelecionado,
        data: formatarDataBR(dataSelecionada),
      });
      setSucesso(true);
      setTimeout(() => {
        router.replace("/(app)/minhas-reservas");
      }, 1500);
    } catch (e) {
      setErro("Erro ao confirmar reserva. Tente novamente.");
    } finally {
      setEnviando(false);
    }
  }

  if (sucesso) {
    return (
      <View style={styles.centro}>
        <Ionicons name="checkmark-circle" size={72} color={Colors.success} style={{ marginBottom: Spacing.md }} />
        <Text style={styles.sucessoTitulo}>Reserva confirmada!</Text>
        <Text style={styles.sucessoTexto}>
          {lab.nome} · {formatarDataBR(dataSelecionada)}
        </Text>
        <Text style={styles.sucessoTexto}>{horarioSelecionado}</Text>
        <ActivityIndicator color={Colors.primary} style={{ marginTop: Spacing.lg }} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.conteudo}>
      <Text style={styles.rotulo}>Reservar</Text>
      <Text style={styles.labNome}>{lab.nome}</Text>
      <Text style={styles.subtitulo}>{lab.andar}</Text>

      {/* Calendário */}
      <View style={styles.secao}>
        <Text style={styles.secaoTitulo}>Escolha uma data</Text>
        <View style={styles.calendarioWrap}>
          <Calendar
            current={dataSelecionada}
            minDate={dataHoje()}
            onDayPress={(dia) => {
              setDataSelecionada(dia.dateString);
              setHorarioSelecionado(null);
              setErro("");
            }}
            markedDates={{
              [dataSelecionada]: {
                selected: true,
                selectedColor: Colors.primary,
                selectedTextColor: Colors.text,
              },
            }}
            theme={{
              backgroundColor: Colors.surface,
              calendarBackground: Colors.surface,
              textSectionTitleColor: Colors.textMuted,
              selectedDayBackgroundColor: Colors.primary,
              selectedDayTextColor: Colors.text,
              todayTextColor: Colors.primary,
              dayTextColor: Colors.text,
              textDisabledColor: Colors.border,
              dotColor: Colors.primary,
              arrowColor: Colors.primary,
              monthTextColor: Colors.text,
              textMonthFontWeight: "700",
              textDayFontSize: 14,
              textMonthFontSize: 16,
              textDayHeaderFontSize: 12,
              textDayHeaderFontWeight: "600",
            }}
          />
        </View>
      </View>

      {/* Horários */}
      <View style={styles.secao}>
        <Text style={styles.secaoTitulo}>
          Escolha um horário{" "}
          <Text style={styles.secaoData}>— {formatarDataBR(dataSelecionada)}</Text>
        </Text>
        <View style={styles.gridHorarios}>
          {HORARIOS_DISPONIVEIS.map((h) => {
            const selecionado = h === horarioSelecionado;
            return (
              <TouchableOpacity
                key={h}
                style={[styles.horarioChip, selecionado && styles.horarioChipAtivo]}
                onPress={() => { setHorarioSelecionado(h); setErro(""); }}
                activeOpacity={0.85}
              >
                <Text style={[styles.horarioTexto, selecionado && styles.horarioTextoAtivo]}>
                  {h}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        {erro ? <Text style={styles.textoErro}>{erro}</Text> : null}
      </View>

      {/* Resumo */}
      {horarioSelecionado && (
        <View style={styles.resumo}>
          <Text style={styles.resumoTitulo}>Resumo da reserva</Text>
          <View style={styles.resumoLinha}>
            <Ionicons name="location-outline" size={14} color={Colors.primary} style={styles.resumoIcone} />
            <Text style={styles.resumoTexto}>{lab.nome}</Text>
          </View>
          <View style={styles.resumoLinha}>
            <Ionicons name="calendar-outline" size={14} color={Colors.primary} style={styles.resumoIcone} />
            <Text style={styles.resumoTexto}>{formatarDataBR(dataSelecionada)}</Text>
          </View>
          <View style={styles.resumoLinha}>
            <Ionicons name="time-outline" size={14} color={Colors.primary} style={styles.resumoIcone} />
            <Text style={styles.resumoTexto}>{horarioSelecionado}</Text>
          </View>
        </View>
      )}

      <View style={styles.acoes}>
        <Botao
          titulo="Confirmar reserva"
          onPress={confirmar}
          carregando={enviando}
          desabilitado={!horarioSelecionado || enviando}
        />
        <View style={{ height: Spacing.sm }} />
        <Botao titulo="Cancelar" variante="secundario" onPress={() => router.back()} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  conteudo: { padding: Spacing.lg, paddingBottom: Spacing.xl },

  centro: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.lg,
  },

  erroTexto: { color: Colors.text, fontSize: 16 },

  sucessoTitulo: { color: Colors.text, fontSize: 24, fontWeight: "800", marginBottom: Spacing.sm },
  sucessoTexto: { color: Colors.textMuted, fontSize: 15, marginBottom: 2 },

  rotulo: { color: Colors.textMuted, fontSize: 13, textTransform: "uppercase", letterSpacing: 1 },
  labNome: { color: Colors.text, fontSize: 28, fontWeight: "800", marginTop: Spacing.xs },
  subtitulo: { color: Colors.primary, fontSize: 14, fontWeight: "600", marginBottom: Spacing.lg },

  secao: { marginTop: Spacing.lg },

  secaoTitulo: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: Spacing.md,
  },

  secaoData: {
    color: Colors.primary,
    fontWeight: "600",
    fontSize: 14,
  },

  calendarioWrap: {
    borderRadius: Radius.md,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.border,
  },

  gridHorarios: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.sm },

  horarioChip: {
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.md,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  horarioChipAtivo: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  horarioTexto: { color: Colors.textMuted, fontWeight: "600", fontSize: 13 },
  horarioTextoAtivo: { color: Colors.text },

  textoErro: {
    color: Colors.danger,
    fontSize: 13,
    marginTop: Spacing.sm,
    fontWeight: "500",
  },

  resumo: {
    marginTop: Spacing.xl,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.primary,
  },

  resumoTitulo: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: Spacing.sm,
  },

  resumoTexto: { color: Colors.text, fontSize: 14 },
  resumoLinha: { flexDirection: "row", alignItems: "center", marginBottom: Spacing.xs },
  resumoIcone: { marginRight: 8 },

  acoes: { marginTop: Spacing.xl },
});
