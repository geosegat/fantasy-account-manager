
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

const STORAGE_KEY = 'mu-characters';

export const getCharacters = (): Character[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveCharacter = (character: Omit<Character, 'id' | 'timestamp'>): Character => {
  const characters = getCharacters();
  
  const newCharacter: Character = {
    ...character,
    id: crypto.randomUUID(),
    timestamp: Date.now(),
  };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...characters, newCharacter]));
  
  return newCharacter;
};

export const deleteCharacter = (id: string): void => {
  const characters = getCharacters();
  const filteredCharacters = characters.filter(character => character.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredCharacters));
};

export const exportCharacters = (): void => {
  const characters = getCharacters();
  const dataStr = JSON.stringify(characters, null, 2);
  const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
  
  const exportFileDefaultName = `mu-characters-${new Date().toISOString().slice(0, 10)}.json`;
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
};
