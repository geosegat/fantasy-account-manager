import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import CharacterForm from "../components/CharacterForm";
import CharacterTable from "../components/CharacterTable";
import Statistics from "../components/Statistics";
import { getCharacters, Character } from "../utils/localStorage";
import { getUniqueCharacters } from "../utils/characterUtils";
import { Toaster } from "sonner";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [uniqueCharacters, setUniqueCharacters] = useState<Character[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  const handleViewFullHistory = () => {
    navigate("/history");
  };

  useEffect(() => {
    const allCharacters = getCharacters();
    const uniqueChars = getUniqueCharacters(allCharacters);

    setCharacters(allCharacters);
    setUniqueCharacters(uniqueChars);
  }, [refreshKey]);

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto page-transition">
      <Toaster position="top-right" closeButton richColors />
      <Header onImportSuccess={handleRefresh} />

      <div className="space-y-8">
        <CharacterForm onSave={handleRefresh} />

        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-mu-gold font-medieval">
            Personagens Ativos
          </h2>
          <button onClick={handleViewFullHistory} className="secondary-button">
            Ver Histórico Completo
          </button>
        </div>

        <CharacterTable
          characters={uniqueCharacters}
          onDelete={handleRefresh}
        />

        <Statistics refreshKey={refreshKey} />
      </div>

      <footer className="mt-12 text-center text-muted-foreground text-sm">
        <p>MU Online Gerenciador de Contas &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default Dashboard;
