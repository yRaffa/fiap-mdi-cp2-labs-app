import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "./AuthContext";

const ReservasContext = createContext(null);

function chaveReservas(userId) {
  return `@fiaplabs:reservas:${userId}`;
}

function chaveHistorico(userId) {
  return `@fiaplabs:historico:${userId}`;
}

export function ReservasProvider({ children }) {
  const { usuario } = useAuth();
  const [reservas, setReservas] = useState([]);
  const [historico, setHistorico] = useState([]);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    if (!usuario) {
      setReservas([]);
      setHistorico([]);
      return;
    }
    carregarDados();
  }, [usuario]);

  async function carregarDados() {
    if (!usuario) return;
    setCarregando(true);
    try {
      const [jsonReservas, jsonHistorico] = await Promise.all([
        AsyncStorage.getItem(chaveReservas(usuario.id)),
        AsyncStorage.getItem(chaveHistorico(usuario.id)),
      ]);
      setReservas(jsonReservas ? JSON.parse(jsonReservas) : []);
      setHistorico(jsonHistorico ? JSON.parse(jsonHistorico) : []);
    } catch (e) {
      console.error("Erro ao carregar reservas:", e);
    } finally {
      setCarregando(false);
    }
  }

  // Alias para compatibilidade
  const carregarReservas = carregarDados;

  async function adicionarReserva(novaReserva) {
    const reservaComId = {
      ...novaReserva,
      id: Date.now().toString(),
      status: "ativa",
      criadaEm: new Date().toISOString(),
    };

    const novasReservas = [...reservas, reservaComId];
    const novoHistorico = [reservaComId, ...historico];

    setReservas(novasReservas);
    setHistorico(novoHistorico);

    await Promise.all([
      AsyncStorage.setItem(chaveReservas(usuario.id), JSON.stringify(novasReservas)),
      AsyncStorage.setItem(chaveHistorico(usuario.id), JSON.stringify(novoHistorico)),
    ]);

    return reservaComId;
  }

  async function cancelarReserva(id) {
    const atualizadas = reservas.filter((r) => r.id !== id);

    // Marca como cancelada no histórico
    const historicoAtualizado = historico.map((r) =>
      r.id === id ? { ...r, status: "cancelada" } : r
    );

    setReservas(atualizadas);
    setHistorico(historicoAtualizado);

    await Promise.all([
      AsyncStorage.setItem(chaveReservas(usuario.id), JSON.stringify(atualizadas)),
      AsyncStorage.setItem(chaveHistorico(usuario.id), JSON.stringify(historicoAtualizado)),
    ]);
  }

  return (
    <ReservasContext.Provider
      value={{ reservas, historico, carregando, adicionarReserva, cancelarReserva, carregarReservas }}
    >
      {children}
    </ReservasContext.Provider>
  );
}

export function useReservas() {
  const ctx = useContext(ReservasContext);
  if (!ctx) throw new Error("useReservas precisa estar dentro de ReservasProvider");
  return ctx;
}
