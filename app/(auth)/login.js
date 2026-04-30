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

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();

  const [rm, setRm] = useState("");
  const [senha, setSenha] = useState("");
  const [erros, setErros] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [erroGeral, setErroGeral] = useState("");
  const [senhaVisivel, setSenhaVisivel] = useState(false);

  function validar() {
    const novosErros = {};
    const rmLimpo = rm.trim().toUpperCase();
    const rmFinal = rmLimpo.startsWith("RM") ? rmLimpo : `RM${rmLimpo}`;

    if (!rm.trim()) {
      novosErros.rm = "O RM é obrigatório.";
    } else if (!/^RM\d{6}$/.test(rmFinal)) {
      novosErros.rm = "Formato inválido. Use RM123456.";
    }

    if (!senha) {
      novosErros.senha = "A senha é obrigatória.";
    } else if (senha.length < 6) {
      novosErros.senha = "A senha deve ter no mínimo 6 caracteres.";
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  }

  async function handleLogin() {
    setErroGeral("");
    if (!validar()) return;
    setEnviando(true);
    try {
      await login({ rm: rm.trim(), senha });
    } catch (e) {
      setErroGeral(e.message);
    } finally {
      setEnviando(false);
    }
  }

  function handleChangeRm(texto) {
    // Aceita o usuário digitando só os números ou "RM" + números
    // Remove tudo que não for letra R, M ou dígito
    const limpo = texto.toUpperCase().replace(/[^RM0-9]/g, "");
    setRm(limpo);
    if (erros.rm) setErros((e) => ({ ...e, rm: undefined }));
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

        <Text style={styles.titulo}>Bem-vindo de volta</Text>
        <Text style={styles.subtitulo}>
          Entre com seu RM e senha para gerenciar suas reservas.
        </Text>

        {erroGeral ? (
          <View style={styles.alertaErro}>
            <Ionicons name="warning-outline" size={16} color={Colors.danger} style={{ marginRight: 6 }} />
            <Text style={styles.alertaTexto}>{erroGeral}</Text>
          </View>
        ) : null}

        {/* Campo RM */}
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
              value={rm.startsWith("RM") ? rm.slice(2) : rm}
              onChangeText={(t) => {
                const apenasNumeros = t.replace(/\D/g, "");
                setRm(apenasNumeros ? `RM${apenasNumeros}` : "");
                if (erros.rm) setErros((e) => ({ ...e, rm: undefined }));
              }}
            />
          </View>
          {erros.rm ? <Text style={styles.textoErro}>{erros.rm}</Text> : null}
        </View>

        {/* Campo Senha */}
        <View style={styles.campo}>
          <Text style={styles.label}>Senha</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={[styles.input, styles.inputComIcone, erros.senha && styles.inputErro]}
              placeholder="Digite sua senha"
              placeholderTextColor={Colors.textMuted}
              secureTextEntry={!senhaVisivel}
              value={senha}
              onChangeText={(t) => {
                setSenha(t);
                if (erros.senha) setErros((e) => ({ ...e, senha: undefined }));
              }}
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

        <TouchableOpacity
          style={[styles.botao, enviando && styles.botaoDesabilitado]}
          onPress={handleLogin}
          disabled={enviando}
          activeOpacity={0.85}
        >
          {enviando ? (
            <ActivityIndicator color={Colors.text} />
          ) : (
            <Text style={styles.botaoTexto}>Entrar</Text>
          )}
        </TouchableOpacity>

        <View style={styles.rodape}>
          <Text style={styles.rodapeTexto}>Não tem uma conta? </Text>
          <TouchableOpacity onPress={() => router.push("/(auth)/cadastro")}>
            <Text style={styles.link}>Cadastre-se</Text>
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
    paddingTop: Spacing.xl * 2,
    justifyContent: "center",
  },

  logoWrap: { alignItems: "center", marginBottom: Spacing.xl },
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
