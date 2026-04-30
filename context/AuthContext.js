import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CHAVE_USUARIOS = "@fiaplabs:usuarios";
const CHAVE_SESSAO = "@fiaplabs:sessao";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function restaurarSessao() {
      try {
        const sessaoJson = await AsyncStorage.getItem(CHAVE_SESSAO);
        if (sessaoJson) {
          setUsuario(JSON.parse(sessaoJson));
        }
      } catch (e) {
        console.error("Erro ao restaurar sessão:", e);
      } finally {
        setCarregando(false);
      }
    }
    restaurarSessao();
  }, []);

  async function obterUsuarios() {
    try {
      const json = await AsyncStorage.getItem(CHAVE_USUARIOS);
      return json ? JSON.parse(json) : [];
    } catch {
      return [];
    }
  }

  function normalizarRM(rm) {
    const limpo = rm.trim().toUpperCase();
    return limpo.startsWith("RM") ? limpo : `RM${limpo}`;
  }

  function rmValido(rm) {
    return /^RM\d{6}$/.test(normalizarRM(rm));
  }

  async function cadastrar({ nome, rm, senha }) {
    const rmNormalizado = normalizarRM(rm);

    if (!rmValido(rmNormalizado)) {
      throw new Error("RM inválido. Use o formato RM123456.");
    }

    const usuarios = await obterUsuarios();
    const jaExiste = usuarios.find((u) => u.rm === rmNormalizado);
    if (jaExiste) {
      throw new Error("Este RM já está cadastrado.");
    }

    const novoUsuario = {
      id: Date.now().toString(),
      nome,
      rm: rmNormalizado,
      senha,
      fotoUri: null,
      criadoEm: new Date().toISOString(),
    };

    await AsyncStorage.setItem(
      CHAVE_USUARIOS,
      JSON.stringify([...usuarios, novoUsuario])
    );

    const sessao = { id: novoUsuario.id, nome: novoUsuario.nome, rm: novoUsuario.rm, fotoUri: null };
    await AsyncStorage.setItem(CHAVE_SESSAO, JSON.stringify(sessao));
    setUsuario(sessao);
    return sessao;
  }

  async function login({ rm, senha }) {
    const rmNormalizado = normalizarRM(rm);
    const usuarios = await obterUsuarios();
    const encontrado = usuarios.find(
      (u) => u.rm === rmNormalizado && u.senha === senha
    );
    if (!encontrado) {
      throw new Error("RM ou senha incorretos.");
    }

    const sessao = {
      id: encontrado.id,
      nome: encontrado.nome,
      rm: encontrado.rm,
      fotoUri: encontrado.fotoUri ?? null,
    };
    await AsyncStorage.setItem(CHAVE_SESSAO, JSON.stringify(sessao));
    setUsuario(sessao);
    return sessao;
  }

  // Atualiza foto de perfil na sessão e na lista de usuários
  async function atualizarFoto(fotoUri) {
    const usuarios = await obterUsuarios();
    const atualizados = usuarios.map((u) =>
      u.id === usuario.id ? { ...u, fotoUri } : u
    );
    await AsyncStorage.setItem(CHAVE_USUARIOS, JSON.stringify(atualizados));

    const novaSessao = { ...usuario, fotoUri };
    await AsyncStorage.setItem(CHAVE_SESSAO, JSON.stringify(novaSessao));
    setUsuario(novaSessao);
  }

  async function logout() {
    await AsyncStorage.removeItem(CHAVE_SESSAO);
    setUsuario(null);
  }

  return (
    <AuthContext.Provider value={{ usuario, carregando, cadastrar, login, logout, atualizarFoto }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth precisa estar dentro de AuthProvider");
  return ctx;
}
