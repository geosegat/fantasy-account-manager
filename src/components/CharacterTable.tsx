import React, { useState } from "react";
import { Character, deleteCharacter } from "../utils/localStorage";
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
  const [charToDelete, setCharToDelete] = useState<Character | null>(null);

  const handleOpenDeleteModal = (character: Character) => {
    setCharToDelete(character);
  };

  const handleCloseModal = () => {
    setCharToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (!charToDelete) return;
    deleteCharacter(charToDelete.id);
    onDelete();
    setCharToDelete(null);
    toast.success("Personagem excluído com sucesso");
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
    <>
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
                  <td className="py-3 px-4 text-center">
                    {character.pcPoints}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {character.gold.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-center text-sm text-muted-foreground">
                    {formatDate(character.timestamp)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleOpenDeleteModal(character)}
                      className="secondary-button"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {charToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white rounded-md p-6 w-[300px] shadow-lg">
            <h2 className="text-lg font-medium mb-2 text-gray-800">
              Confirmar Exclusão
            </h2>
            <p className="text-sm text-gray-700 mb-4">
              Tem certeza que deseja excluir o personagem{" "}
              <strong>{charToDelete.name}</strong>?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={handleCloseModal}
                className="px-3 py-1 text-sm hover:bg-gray-200 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-500"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CharacterTable;
