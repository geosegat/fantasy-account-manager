import React, { useState, useMemo } from "react";
import { Character, deleteCharacter } from "../utils/localStorage";
import { formatDate } from "../utils/calculations";
import { toast } from "../utils/toast";

interface CharacterTableProps {
  characters: Character[];
  onDelete: () => void;
}

type SortConfig = {
  key: keyof Character | null;
  direction: "asc" | "desc";
};

const CharacterTable: React.FC<CharacterTableProps> = ({
  characters,
  onDelete,
}) => {
  const [characterToDelete, setCharacterToDelete] = useState<string | null>(
    null
  );
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: "desc",
  });

  const handleDeleteConfirmation = (characterId: string) => {
    setCharacterToDelete(characterId);
  };

  const handleConfirmDelete = (character: Character) => {
    deleteCharacter(character.id);
    onDelete();
    setCharacterToDelete(null);
    toast.success("Personagem excluído com sucesso");
  };

  const requestSort = (key: keyof Character) => {
    let direction: "asc" | "desc" = "desc";
    if (sortConfig.key === key && sortConfig.direction === "desc") {
      direction = "asc";
    }
    setSortConfig({ key, direction });
  };

  const sortedCharacters = useMemo(() => {
    const sortableCharacters = [...characters];
    if (sortConfig.key !== null) {
      sortableCharacters.sort((a, b) => {
        const aValue = a[sortConfig.key!];
        const bValue = b[sortConfig.key!];

        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortConfig.direction === "desc"
            ? bValue - aValue
            : aValue - bValue;
        }
        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortConfig.direction === "desc"
            ? bValue.localeCompare(aValue)
            : aValue.localeCompare(bValue);
        }
        return 0;
      });
    }
    return sortableCharacters;
  }, [characters, sortConfig]);

  const renderSortIndicator = (key: keyof Character) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "desc" ? " ↓" : " ↑";
    }
    return "";
  };

  if (characters.length === 0) {
    return (
      <div className="glass-panel p-6 mb-8 text-center">
        <p className="text-muted-foreground py-8">
          Nenhum personagem registrado ainda. Adicione seu primeiro personagem
          acima.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-panel p-0 overflow-hidden mb-8">
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="table-header">
            <tr>
              <th
                className="py-3 px-4 text-left cursor-pointer"
                onClick={() => requestSort("name")}
              >
                Nome{renderSortIndicator("name")}
              </th>
              <th
                className="py-3 px-4 text-center cursor-pointer"
                onClick={() => requestSort("resets")}
              >
                Resets{renderSortIndicator("resets")}
              </th>
              <th
                className="py-3 px-4 text-center cursor-pointer"
                onClick={() => requestSort("soul")}
              >
                Soul{renderSortIndicator("soul")}
              </th>
              <th
                className="py-3 px-4 text-center cursor-pointer"
                onClick={() => requestSort("mr")}
              >
                MR{renderSortIndicator("mr")}
              </th>
              <th
                className="py-3 px-4 text-center cursor-pointer"
                onClick={() => requestSort("eventPoints")}
              >
                Pontos de Evento{renderSortIndicator("eventPoints")}
              </th>
              <th
                className="py-3 px-4 text-center cursor-pointer"
                onClick={() => requestSort("pcPoints")}
              >
                PC Points{renderSortIndicator("pcPoints")}
              </th>
              <th
                className="py-3 px-4 text-center cursor-pointer"
                onClick={() => requestSort("gold")}
              >
                Gold{renderSortIndicator("gold")}
              </th>
              <th
                className="py-3 px-4 text-center cursor-pointer"
                onClick={() => requestSort("timestamp")}
              >
                Data/Hora{renderSortIndicator("timestamp")}
              </th>
              <th className="py-3 px-4 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {sortedCharacters.map((character) => (
              <tr key={character.id} className="table-row">
                <td className="py-3 px-4 font-medium">{character.name}</td>
                <td className="py-3 px-4 text-center">{character.resets}</td>
                <td className="py-3 px-4 text-center">{character.soul}</td>
                <td className="py-3 px-4 text-center">{character.mr}</td>
                <td className="py-3 px-4 text-center">
                  {character.eventPoints}
                </td>
                <td className="py-3 px-4 text-center">{character.pcPoints}</td>
                <td className="py-3 px-4 text-center">
                  {character.gold.toLocaleString()}
                </td>
                <td className="py-3 px-4 text-center text-sm text-muted-foreground">
                  {formatDate(character.timestamp)}
                </td>
                <td className="py-3 px-4 text-center">
                  {characterToDelete === character.id ? (
                    <button
                      onClick={() => handleConfirmDelete(character)}
                      className="secondary-button text-white bg-red-800 hover:bg-red-900"
                    >
                      Confirmar
                    </button>
                  ) : (
                    <button
                      onClick={() => handleDeleteConfirmation(character.id)}
                      className="secondary-button"
                    >
                      Excluir
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CharacterTable;
