
import React, { useState } from 'react';
import { Character, deleteCharacter } from '../utils/localStorage';
import { formatDate } from '../utils/calculations';
import { toast } from '@/components/ui/sonner';

interface CharacterTableProps {
  characters: Character[];
  onDelete: () => void;
}

const CharacterTable: React.FC<CharacterTableProps> = ({ characters, onDelete }) => {
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    if (confirmDelete === id) {
      deleteCharacter(id);
      onDelete();
      setConfirmDelete(null);
      toast.success("Character deleted successfully");
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
        <p className="text-muted-foreground py-8">No characters registered yet. Add your first character above.</p>
      </div>
    );
  }

  return (
    <div className="glass-panel p-0 overflow-hidden mb-8 medieval-border">
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="table-header">
            <tr>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-center">Resets</th>
              <th className="py-3 px-4 text-center">Soul</th>
              <th className="py-3 px-4 text-center">MR</th>
              <th className="py-3 px-4 text-center">Event Points</th>
              <th className="py-3 px-4 text-center">PC Points</th>
              <th className="py-3 px-4 text-center">Gold</th>
              <th className="py-3 px-4 text-center">Date/Time</th>
              <th className="py-3 px-4 text-center">Actions</th>
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
                    {confirmDelete === character.id ? "Confirm" : "Delete"}
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
