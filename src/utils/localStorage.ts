// utils/localStorage.ts

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

/**
 * Gera ID único, se não existir. Pode usar crypto.randomUUID() (se disponível)
 */
function generateId() {
  // Se seu ambiente suportar `crypto.randomUUID`, pode usar diretamente:
  // return crypto.randomUUID();

  // Caso não suporte, use algo simples como Date.now() + random:
  return `${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
}

export function saveCharacter(char: Partial<Character>) {
  const all = getCharacters();

  // Se vier sem ID (novo personagem), geramos um
  if (!char.id) {
    char.id = generateId();
  }

  // Se não tiver timestamp ainda, define um
  if (!char.timestamp) {
    char.timestamp = Date.now();
  }

  // Verifica se já existe no array
  const index = all.findIndex((c) => c.id === char.id);
  if (index >= 0) {
    // Atualiza os campos
    const old = all[index];
    all[index] = {
      ...old,
      ...char,
    };
  } else {
    // Adiciona no array
    all.push(char as Character);
  }

  setCharacters(all);
}

export function deleteCharacter(id: string) {
  const all = getCharacters().filter((c) => c.id !== id);
  setCharacters(all);
}

// ... exportCharacters, getCharacterNames, etc. ...

/**
 * Função que gera e BAIXA um arquivo JSON contendo todos os personagens.
 */
export function exportCharacters() {
  const characters = getCharacters();
  const dataStr = JSON.stringify(characters, null, 2); // espaçamento de 2

  // Cria um "blob" do arquivo JSON
  const blob = new Blob([dataStr], { type: "application/json" });

  // Cria URL temporária pra download
  const url = URL.createObjectURL(blob);

  // Cria link, aciona clique e remove
  const link = document.createElement("a");
  link.href = url;
  link.download = "mu-characters.json"; // nome do arquivo
  link.click();

  URL.revokeObjectURL(url);
}

/**
 * Retorna nomes de personagens (sem duplicados) para preencher selects, etc.
 */
export function getCharacterNames(): string[] {
  const allChars = getCharacters();
  const uniqueNames = Array.from(new Set(allChars.map((c) => c.name)));
  return uniqueNames;
}
