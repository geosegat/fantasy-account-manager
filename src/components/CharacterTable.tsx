
import React, { useState } from 'react';
import { Character, deleteCharacter } from '../utils/localStorage';
import { formatDate } from '../utils/calculations';
import { toast } from "../utils/toast";
import { Undo, X } from 'lucide-react';

interface CharacterTableProps {
  characters: Character[];
  onDelete: () => void;
}

const CharacterTable: React.FC<CharacterTableProps> = ({ characters, onDelete }) => {
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [deletedCharacter, setDeletedCharacter] = useState<Character | null>(null);

  const handleDelete = (id: string) => {
    if (confirmDelete === id) {
      // Armazenar o personagem antes de excluí-lo para possível recuperação
      const charToDelete = characters.find(char => char.id === id);
      if (charToDelete) {
        setDeletedCharacter(charToDelete);
      }
      
      deleteCharacter(id);
      onDelete();
      setConfirmDelete(null);
      
      // Mostrar toast com opção de desfazer
      toast.custom(
        (t) => (
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5">
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Personagem excluído
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    O personagem foi removido com sucesso.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex border-l border-gray-200">
              <button
                onClick={() => {
                  if (deletedCharacter) {
                    const savedChar = { ...deletedCharacter };
                    // Restaurar personagem excluído no localStorage
                    const characters = localStorage.getItem('mu-characters');
                    const parsedChars = characters ? JSON.parse(characters) : [];
                    localStorage.setItem('mu-characters', JSON.stringify([...parsedChars, savedChar]));
                    onDelete(); // Atualizar lista
                    toast.success("Personagem restaurado com sucesso");
                    t.dismiss();
                  }
                }}
                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none"
              >
                <Undo className="h-4 w-4 mr-1" />
                Desfazer
              </button>
              <button
                onClick={() => t.dismiss()}
                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-gray-600 hover:text-gray-500 focus:outline-none"
              >
                <X className="h-4 w-4 mr-1" />
                Fechar
              </button>
            </div>
          </div>
        ),
        { duration: 5000 }
      );
    } else {
      setConfirmDelete(id);
      // Auto reset confirm after 3 seconds
      setTimeout(() => {
        setConfirmDelete(null);
      }, 3000);
    }
  };

  if (characters.length === 0) {
    return (
      <div className="glass-panel p-6 mb-8 text-center medieval-border">
        <p className="text-muted-foreground py-8">Nenhum personagem registrado ainda. Adicione seu primeiro personagem acima.</p>
      </div>
    );
  }

  return (
    <div className="glass-panel p-0 overflow-hidden mb-8 medieval-border">
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
                <td className={`py-3 px-4 text-center ${character.resets === 0 ? 'zero-resets' : ''}`}>
                  {character.resets}
                </td>
                <td className="py-3 px-4 text-center">{character.soul}</td>
                <td className="py-3 px-4 text-center">{character.mr}</td>
                <td className="py-3 px-4 text-center">{character.eventPoints}</td>
                <td className="py-3 px-4 text-center">{character.pcPoints}</td>
                <td className="py-3 px-4 text-center">{character.gold.toLocaleString()}</td>
                <td className="py-3 px-4 text-center text-sm text-muted-foreground">
                  {formatDate(character.timestamp)}
                </td>
                <td className="py-3 px-4 text-center">
                  <button
                    onClick={() => handleDelete(character.id)}
                    className={confirmDelete === character.id ? "danger-button" : "secondary-button"}
                  >
                    {confirmDelete === character.id ? "Confirmar" : "Excluir"}
                  </button>
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
