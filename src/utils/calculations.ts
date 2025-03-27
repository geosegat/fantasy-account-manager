// utils/calculations.ts
import { Character, getCharacters } from "./localStorage";

interface Stat {
  resets: number;
  soul: number;
  mr: number;
}

interface Stats {
  hourly: Stat;
  daily: Stat;
  weekly: Stat;
  total: Stat;
}

/**
 * Calcula o "histórico" (última hora, dia, semana) e total, podendo filtrar por um personagem específico.
 * - Se `characterName` for 'Todos' ou undefined, calcula com base em todos os personagens.
 */
export function calculateStats(characterName?: string): Stats {
  const allChars = getCharacters();

  // Filtra caso seja um personagem específico
  const characters =
    !characterName || characterName === "Todos"
      ? allChars
      : allChars.filter(
          (c) => c.name.toLowerCase() === characterName.toLowerCase()
        );

  // Se não houver nenhum personagem (ou nenhum que atenda ao filtro)
  if (characters.length === 0) {
    return {
      hourly: { resets: 0, soul: 0, mr: 0 },
      daily: { resets: 0, soul: 0, mr: 0 },
      weekly: { resets: 0, soul: 0, mr: 0 },
      total: { resets: 0, soul: 0, mr: 0 },
    };
  }

  const now = Date.now();
  const HOUR = 3600000;
  const DAY = 86400000;
  const WEEK = 604800000;

  // Função auxiliar que soma atributos dentro de um range de tempo
  function sumStatInTimeWindow(
    start: number,
    end: number,
    statKey: keyof Character
  ) {
    return characters
      .filter((c) => c.timestamp >= start && c.timestamp <= end)
      .reduce((acc, c) => acc + Number(c[statKey]), 0);
  }

  // Última hora
  const hourlyStats = {
    resets: sumStatInTimeWindow(now - HOUR, now, "resets"),
    soul: sumStatInTimeWindow(now - HOUR, now, "soul"),
    mr: sumStatInTimeWindow(now - HOUR, now, "mr"),
  };

  // Último dia
  const dailyStats = {
    resets: sumStatInTimeWindow(now - DAY, now, "resets"),
    soul: sumStatInTimeWindow(now - DAY, now, "soul"),
    mr: sumStatInTimeWindow(now - DAY, now, "mr"),
  };

  // Última semana
  const weeklyStats = {
    resets: sumStatInTimeWindow(now - WEEK, now, "resets"),
    soul: sumStatInTimeWindow(now - WEEK, now, "soul"),
    mr: sumStatInTimeWindow(now - WEEK, now, "mr"),
  };

  // Total: do começo (timestamp=0) até agora
  // (ou seja, soma todos os registros desse personagem (ou todos) ignorando o range)
  function sumAllStat(statKey: keyof Character) {
    return characters.reduce((acc, c) => acc + Number(c[statKey]), 0);
  }

  const totalStats = {
    resets: sumAllStat("resets"),
    soul: sumAllStat("soul"),
    mr: sumAllStat("mr"),
  };

  return {
    hourly: hourlyStats,
    daily: dailyStats,
    weekly: weeklyStats,
    total: totalStats,
  };
}

/**
 * Formata número sem abreviação (ex.: "22").
 */
export function formatNumber(value: number): string {
  return value.toString();
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleString();
}
