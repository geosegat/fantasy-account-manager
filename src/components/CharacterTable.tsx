import React, { useState } from "react";
import { Character, deleteCharacterHistory } from "../utils/localStorage";
import { formatDate } from "../utils/calculations";
import { toast } from "../utils/toast";

interface CharacterTableProps {
  characters: Character[];
  onDelete: () => void;
}

const CharacterTable: React.FC<CharacterTableProps> = ({
  characters,
  onDelete,
}) => {
  const [characterToDelete, setCharacterToDelete] = useState<string | null>(
    null
  );

  const handleDeleteConfirmation = (characterName: string) => {
    setCharacterToDelete(characterName);
  };

  const handleConfirmDelete = (character: Character) => {
    // Deleta todo o histórico do personagem, usando o nome
    deleteCharacterHistory(character.name);
    onDelete();
    setCharacterToDelete(null);
    toast.success("Personagem e todo o histórico excluídos com sucesso");
  };

  if (characters.length === 0) {
    return (
      <div className="glass-panel p-6 mb-8 text-center ">
        <p className="text-muted-foreground py-8">
          Nenhum personagem registrado ainda. Adicione seu primeiro personagem
          acima.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-panel p-0 overflow-hidden mb-8 ">
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="table-header">
            <tr>
              <th className="py-3 px-4 text-left">Nome</th>
              <th className="py-3 px-4 text-center">Resets</th>
              <th className="py-3 px-4 text-center">Soul</th>
              <th className="py-3 px-4 text-center">MR</th>
              <th className="py-3 px-4 text-center">Pontos de Evento</th>
              <th className="py-3 px-4 text-center">PC Points</th>
              <th className="py-3 px-4 text-center">Gold</th>
              <th className="py-3 px-4 text-center">Data/Hora</th>
              <th className="py-3 px-4 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {characters.map((character) => (
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
                  {characterToDelete === character.name ? (
                    <button
                      onClick={() => handleConfirmDelete(character)}
                      className="secondary-button text-white bg-red-800 hover:bg-red-900"
                    >
                      Confirmar
                    </button>
                  ) : (
                    <button
                      onClick={() => handleDeleteConfirmation(character.name)}
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
