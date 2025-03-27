import { Character } from "./localStorage";

export function sumCharacters(characters: Character[]): {
  resets: number;
  soul: number;
  mr: number;
  eventPoints: number;
  pcPoints: number;
  gold: number;
} {
  // Cria um objeto para armazenar apenas um registro por nome (em lowercase)
  const uniqueCharacters: { [key: string]: Character } = {};

  characters.forEach((ch) => {
    const nameKey = ch.name.toLowerCase();
    // Se não existir ou se o timestamp do personagem atual for mais recente, substitua
    if (
      !uniqueCharacters[nameKey] ||
      ch.timestamp > uniqueCharacters[nameKey].timestamp
    ) {
      uniqueCharacters[nameKey] = ch;
    }
  });

  // Soma os valores apenas dos registros únicos
  let resets = 0;
  let soul = 0;
  let mr = 0;
  let eventPoints = 0;
  let pcPoints = 0;
  let gold = 0;

  Object.values(uniqueCharacters).forEach((ch) => {
    resets += ch.resets;
    soul += ch.soul;
    mr += ch.mr;
    eventPoints += ch.eventPoints;
    pcPoints += ch.pcPoints;
    gold += ch.gold;
  });

  return { resets, soul, mr, eventPoints, pcPoints, gold };
}

export function formatNumber(value: number): string {
  return value.toString();
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleString();
}
