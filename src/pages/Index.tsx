import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import CharacterForm from "../components/CharacterForm";
import CharacterTable from "../components/CharacterTable";
import Statistics from "../components/Statistics";
import { getCharacters, Character } from "../utils/localStorage";
import { Toaster } from "sonner";

const Index: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  useEffect(() => {
    setCharacters(getCharacters());
  }, [refreshKey]);

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto page-transition">
      <Toaster position="top-right" closeButton richColors />
      <Header />

      <div className="space-y-8">
        <CharacterForm onSave={handleRefresh} />

        <CharacterTable characters={characters} onDelete={handleRefresh} />

        <Statistics refreshKey={refreshKey} />
      </div>

      <footer className="mt-12 text-center text-muted-foreground text-sm">
        <p>MU Online Gerenciador de Contas &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default Index;
