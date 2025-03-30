/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Character {
  id: string;
  name: string;
  resets: number;
  soul: number;
  mr: number;
  eventPoints: number;
  pcPoints: number;
  gold: number;
  timestamp: number;
}

export function getCharacters(): Character[] {
  const data = localStorage.getItem("mu-characters");
  if (!data) return [];
  try {
    return JSON.parse(data) as Character[];
  } catch {
    return [];
  }
}

function setCharacters(chars: Character[]) {
  localStorage.setItem("mu-characters", JSON.stringify(chars));
}

function generateId() {
  return `${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
}

export function saveCharacter(char: Partial<Character>) {
  const all = getCharacters();

  if (!char.id) {
    char.id = generateId();
  }
  if (!char.timestamp) {
    char.timestamp = Date.now();
  }

  const index = all.findIndex((c) => c.id === char.id);
  if (index >= 0) {
    const old = all[index];
    all[index] = { ...old, ...char };
  } else {
    all.push(char as Character);
  }

  setCharacters(all);
}

export function deleteCharacterHistory(characterName: string) {
  const characters = getCharacters();
  const updated = characters.filter((char) => char.name !== characterName);
  setCharacters(updated);
}

export function exportCharacters() {
  const characters = getCharacters();
  const dataStr = JSON.stringify(characters, null, 2);

  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "mu-characters.json";
  link.click();

  URL.revokeObjectURL(url);
}

export function importCharacters(jsonData: any) {
  if (!Array.isArray(jsonData)) {
    console.error("O arquivo JSON não é um array de personagens.");
    return;
  }

  const existing = getCharacters();

  jsonData.forEach((importedChar: Character) => {
    const index = existing.findIndex((c) => c.id === importedChar.id);

    if (index >= 0) {
      existing[index] = { ...existing[index], ...importedChar };
    } else {
      if (!importedChar.id) {
        importedChar.id = generateId();
      }
      if (!importedChar.timestamp) {
        importedChar.timestamp = Date.now();
      }
      existing.push(importedChar);
    }
  });

  setCharacters(existing);
  console.log("Import concluído com sucesso.");
}

export function getCharacterNames(): string[] {
  const allChars = getCharacters();
  return Array.from(new Set(allChars.map((c) => c.name)));
}
