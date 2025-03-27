import { Character } from "./localStorage";

export type SortField = keyof Omit<Character, "id">;
export type SortDirection = "asc" | "desc";

export interface CharacterFilters {
  name?: string;
  startDate?: Date;
  endDate?: Date;
  minResets?: number;
  sortField?: SortField;
  sortDirection?: SortDirection;
}

export const getUniqueCharacters = (characters: Character[]): Character[] => {
  const uniqueMap = new Map<string, Character>();

  characters
    .sort((a, b) => b.timestamp - a.timestamp)
    .forEach((character) => {
      if (!uniqueMap.has(character.name)) {
        uniqueMap.set(character.name, character);
      }
    });

  return Array.from(uniqueMap.values());
};

const sorters: Record<SortField, (a: Character, b: Character) => number> = {
  name: (a, b) => a.name.localeCompare(b.name),
  resets: (a, b) => a.resets - b.resets,
  mr: (a, b) => a.mr - b.mr,
  eventPoints: (a, b) => a.eventPoints - b.eventPoints,
  pcPoints: (a, b) => a.pcPoints - b.pcPoints,
  gold: (a, b) => a.gold - b.gold,
  timestamp: (a, b) => a.timestamp - b.timestamp,
  soul: function (a: Character, b: Character): number {
    throw new Error("Function not implemented.");
  },
};

export const filterAndSortCharacters = (
  characters: Character[],
  filters: CharacterFilters
): Character[] => {
  const filteredCharacters = characters.filter((character) => {
    const matchesName =
      !filters.name ||
      character.name.toLowerCase().includes(filters.name.toLowerCase());
    const matchesStartDate =
      !filters.startDate || new Date(character.timestamp) >= filters.startDate;
    const matchesEndDate =
      !filters.endDate || new Date(character.timestamp) <= filters.endDate;
    const matchesResets =
      !filters.minResets || character.resets >= filters.minResets;

    return matchesName && matchesStartDate && matchesEndDate && matchesResets;
  });

  if (filters.sortField) {
    const sorter = sorters[filters.sortField];
    const modifier = filters.sortDirection === "asc" ? 1 : -1;

    filteredCharacters.sort((a, b) => modifier * sorter(a, b));
  }

  return filteredCharacters;
};

export const getUniqueCharacterNames = (characters: Character[]): string[] => {
  return [...new Set(characters.map((character) => character.name))];
};
