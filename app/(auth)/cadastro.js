import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import { Colors, Spacing, Radius } from "../../constants/theme";

export default function Cadastro() {
  const router = useRouter();
  const { cadastrar } = useAuth();

  const [nome, setNome] = useState("");
  const [rm, setRm] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmaSenha, setConfirmaSenha] = useState("");
  const [erros, setErros] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [erroGeral, setErroGeral] = useState("");
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [confirmaSenhaVisivel, setConfirmaSenhaVisivel] = useState(false);

  function validar() {
    const novosErros = {};
    const rmFinal = `RM${rm.replace(/\D/g, "")}`;

    if (!nome.trim()) {
      novosErros.nome = "O nome completo é obrigatório.";
    } else if (nome.trim().split(" ").length < 2) {
      novosErros.nome = "Informe seu nome completo.";
    }

    if (!rm.trim()) {
      novosErros.rm = "O RM é obrigatório.";
    } else if (!/^RM\d{6}$/.test(rmFinal)) {
      novosErros.rm = "O RM deve ter exatamente 6 dígitos.";
    }

    if (!senha) {
      novosErros.senha = "A senha é obrigatória.";
    } else if (senha.length < 6) {
      novosErros.senha = "A senha deve ter no mínimo 6 caracteres.";
    }

    if (!confirmaSenha) {
      novosErros.confirmaSenha = "Confirme sua senha.";
    } else if (confirmaSenha !== senha) {
      novosErros.confirmaSenha = "As senhas não coincidem.";
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  }

  async function handleCadastro() {
    setErroGeral("");
    if (!validar()) return;
    setEnviando(true);
    try {
      await cadastrar({ nome: nome.trim(), rm, senha });
    } catch (e) {
      setErroGeral(e.message);
    } finally {
      setEnviando(false);
    }
  }

  function limparErro(campo) {
    setErros((e) => ({ ...e, [campo]: undefined }));
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.logoWrap}>
          <Image
            source={require("../../assets/fiap_logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.titulo}>Cadastrar</Text>
        <Text style={styles.subtitulo}>
          Use seu RM da FIAP para se cadastrar.
        </Text>

        {erroGeral ? (
          <View style={styles.alertaErro}>
            <Ionicons name="warning-outline" size={16} color={Colors.danger} style={{ marginRight: 6 }} />
            <Text style={styles.alertaTexto}>{erroGeral}</Text>
          </View>
        ) : null}

        {/* Nome */}
        <View style={styles.campo}>
          <Text style={styles.label}>Nome completo</Text>
          <TextInput
            style={[styles.input, erros.nome && styles.inputErro]}
            placeholder="Ex: João da Silva"
            placeholderTextColor={Colors.textMuted}
            autoCapitalize="words"
            value={nome}
            onChangeText={(t) => { setNome(t); limparErro("nome"); }}
          />
          {erros.nome ? <Text style={styles.textoErro}>{erros.nome}</Text> : null}
        </View>

        {/* RM */}
        <View style={styles.campo}>
          <Text style={styles.label}>RM</Text>
          <View style={styles.inputWrapper}>
            <View style={styles.prefixoWrap}>
              <Text style={styles.prefixoTexto}>RM</Text>
            </View>
            <TextInput
              style={[
                styles.input,
                styles.inputComPrefixo,
                erros.rm && styles.inputErro,
              ]}
              placeholder="000000"
              placeholderTextColor={Colors.textMuted}
              keyboardType="number-pad"
              maxLength={6}
              value={rm.replace(/\D/g, "")}
              onChangeText={(t) => {
                const apenasNumeros = t.replace(/\D/g, "");
                setRm(apenasNumeros);
                limparErro("rm");
              }}
            />
          </View>
          {erros.rm ? <Text style={styles.textoErro}>{erros.rm}</Text> : null}
        </View>

        {/* Senha */}
        <View style={styles.campo}>
          <Text style={styles.label}>Senha</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={[styles.input, styles.inputComIcone, erros.senha && styles.inputErro]}
              placeholder="Mínimo 6 caracteres"
              placeholderTextColor={Colors.textMuted}
              secureTextEntry={!senhaVisivel}
              value={senha}
              onChangeText={(t) => { setSenha(t); limparErro("senha"); }}
            />
            <TouchableOpacity
              style={styles.iconeOlho}
              onPress={() => setSenhaVisivel(!senhaVisivel)}
            >
              <Ionicons
                name={senhaVisivel ? "eye-off-outline" : "eye-outline"}
                size={20}
                color={Colors.textMuted}
              />
            </TouchableOpacity>
          </View>
          {erros.senha ? <Text style={styles.textoErro}>{erros.senha}</Text> : null}
        </View>

        {/* Confirmar Senha */}
        <View style={styles.campo}>
          <Text style={styles.label}>Confirmar senha</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={[styles.input, styles.inputComIcone, erros.confirmaSenha && styles.inputErro]}
              placeholder="Repita sua senha"
              placeholderTextColor={Colors.textMuted}
              secureTextEntry={!confirmaSenhaVisivel}
              value={confirmaSenha}
              onChangeText={(t) => { setConfirmaSenha(t); limparErro("confirmaSenha"); }}
            />
            <TouchableOpacity
              style={styles.iconeOlho}
              onPress={() => setConfirmaSenhaVisivel(!confirmaSenhaVisivel)}
            >
              <Ionicons
                name={confirmaSenhaVisivel ? "eye-off-outline" : "eye-outline"}
                size={20}
                color={Colors.textMuted}
              />
            </TouchableOpacity>
          </View>
          {erros.confirmaSenha ? (
            <Text style={styles.textoErro}>{erros.confirmaSenha}</Text>
          ) : null}
        </View>

        <TouchableOpacity
          style={[styles.botao, enviando && styles.botaoDesabilitado]}
          onPress={handleCadastro}
          disabled={enviando}
          activeOpacity={0.85}
        >
          {enviando ? (
            <ActivityIndicator color={Colors.text} />
          ) : (
            <Text style={styles.botaoTexto}>Cadastrar</Text>
          )}
        </TouchableOpacity>

        <View style={styles.rodape}>
          <Text style={styles.rodapeTexto}>Já está cadastrado? </Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.link}>Entrar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },

  container: {
    flexGrow: 1,
    padding: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xl,
  },

  logoWrap: { alignItems: "center", marginBottom: Spacing.lg },
  logo: { width: 100, height: 50 },

  titulo: {
    color: Colors.text,
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: Spacing.sm,
  },

  subtitulo: {
    color: Colors.textMuted,
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: Spacing.xl,
  },

  alertaErro: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3B0A0A",
    borderWidth: 1,
    borderColor: Colors.danger,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },

  alertaTexto: { color: Colors.danger, fontSize: 14, fontWeight: "600" },

  campo: { marginBottom: Spacing.md },

  label: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: "600",
    marginBottom: Spacing.xs,
  },

  inputWrapper: { flexDirection: "row", alignItems: "center", position: "relative" },

  prefixoWrap: {
    backgroundColor: Colors.surfaceLight,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRightWidth: 0,
    borderTopLeftRadius: Radius.md,
    borderBottomLeftRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    justifyContent: "center",
    minHeight: 52,
  },

  prefixoTexto: {
    color: Colors.primary,
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 1,
  },

  input: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    color: Colors.text,
    fontSize: 15,
  },

  inputComPrefixo: {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },

  inputComIcone: { paddingRight: 48 },
  inputErro: { borderColor: Colors.danger },

  iconeOlho: {
    position: "absolute",
    right: Spacing.md,
    top: "50%",
    transform: [{ translateY: -10 }],
  },

  dica: {
    color: Colors.textMuted,
    fontSize: 11,
    marginTop: 4,
  },

  textoErro: {
    color: Colors.danger,
    fontSize: 12,
    marginTop: 4,
    fontWeight: "500",
  },

  botao: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52,
    marginTop: Spacing.sm,
  },

  botaoDesabilitado: { opacity: 0.6 },
  botaoTexto: { color: Colors.text, fontSize: 16, fontWeight: "700" },

  rodape: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: Spacing.xl,
  },

  rodapeTexto: { color: Colors.textMuted, fontSize: 14 },
  link: { color: Colors.primary, fontSize: 14, fontWeight: "700" },
});
