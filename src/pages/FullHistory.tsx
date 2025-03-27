import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import CharacterTable from "../components/CharacterTable";
import { getCharacters, Character } from "../utils/localStorage";
import {
  filterAndSortCharacters,
  getUniqueCharacterNames,
  SortField,
  SortDirection,
} from "../utils/characterUtils";
import { Toaster } from "sonner";
import { AppIcons } from "@/components/ui/appicons";

const FullHistory: React.FC = () => {
  const navigate = useNavigate();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [filteredCharacters, setFilteredCharacters] = useState<Character[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [uniqueNames, setUniqueNames] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    name: "",
    minResets: 0,
    startDate: "",
    endDate: "",
    sortField: "timestamp" as SortField,
    sortDirection: "desc" as SortDirection,
  });
  const sortOptions: { value: SortField; label: string }[] = [
    { value: "timestamp", label: "Data" },
    { value: "name", label: "Nome" },
    { value: "resets", label: "Resets" },
    { value: "mr", label: "Master Reset" },
    { value: "eventPoints", label: "Pontos de Evento" },
    { value: "pcPoints", label: "PC Points" },
    { value: "gold", label: "Gold" },
  ];

  const handleRefresh = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: name === "minResets" ? Number(value) : value,
    }));
  };

  const clearNameFilter = () => {
    setFilters((prev) => ({
      ...prev,
      name: "",
    }));
  };

  const toggleSortDirection = () => {
    setFilters((prev) => ({
      ...prev,
      sortDirection: prev.sortDirection === "asc" ? "desc" : "asc",
    }));
  };

  useEffect(() => {
    const allCharacters = getCharacters();
    setCharacters(allCharacters);
    setUniqueNames(getUniqueCharacterNames(allCharacters));
  }, [refreshKey]);

  useEffect(() => {
    const results = filterAndSortCharacters(characters, {
      name: filters.name,
      minResets: filters.minResets || undefined,
      startDate: filters.startDate ? new Date(filters.startDate) : undefined,
      endDate: filters.endDate ? new Date(filters.endDate) : undefined,
      sortField: filters.sortField,
      sortDirection: filters.sortDirection,
    });
    setFilteredCharacters(results);
  }, [characters, filters]);

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto page-transition">
      <Toaster position="top-right" closeButton richColors />

      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={handleBackToHome}
          className=" hover:text-foreground transition-colors text-mu-gold"
          title="Voltar para Home"
        >
          <AppIcons.ArrowLeft size={24} />
        </button>
        <h1 className="text-3xl font-bold font-medieval ">
          Histórico Completo
        </h1>
      </div>

      <Header onImportSuccess={handleRefresh} />

      <div className="space-y-8">
        <div className="glass-panel p-6 mb-8">
          <div
            className="flex justify-between items-center cursor-pointer"
            onClick={() => setIsFilterExpanded(!isFilterExpanded)}
          >
            <h2 className="text-2xl font-bold flex items-center gap-2 text-mu-gold font-medieval">
              <AppIcons.Filter /> Filtros
              {isFilterExpanded ? (
                <AppIcons.ChevronUp />
              ) : (
                <AppIcons.ChevronDown />
              )}
            </h2>
          </div>

          {isFilterExpanded && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
              <div className="relative">
                <div className="relative ">
                  <input
                    type="text"
                    name="name"
                    placeholder="Nome do Personagem"
                    value={filters.name}
                    onChange={handleFilterChange}
                    className="input w-full pr-10"
                    list="characterNames"
                  />
                  {filters.name && (
                    <button
                      onClick={clearNameFilter}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 mt-1"
                      title="Limpar filtro de nome"
                    >
                      <AppIcons.X size={20} />
                    </button>
                  )}
                </div>
                <datalist id="characterNames">
                  {uniqueNames.map((name) => (
                    <option key={name} value={name} />
                  ))}
                </datalist>
              </div>

              <input
                type="number"
                name="minResets"
                placeholder="Mínimo de Resets"
                value={filters.minResets}
                onChange={handleFilterChange}
                className="input"
                min="0"
              />

              <input
                type="date"
                name="startDate"
                placeholder="Data Inicial"
                value={filters.startDate}
                onChange={handleFilterChange}
                className="input"
              />

              <input
                type="date"
                name="endDate"
                placeholder="Data Final"
                value={filters.endDate}
                onChange={handleFilterChange}
                className="input"
              />

              <div className="flex items-center gap-2">
                <select
                  name="sortField"
                  value={filters.sortField}
                  onChange={handleFilterChange}
                  className="input flex-grow "
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={toggleSortDirection}
                  className="secondary-button px-2"
                  title={`Ordenar ${
                    filters.sortDirection === "asc"
                      ? "Crescente"
                      : "Decrescente"
                  }`}
                >
                  {filters.sortDirection === "asc" ? (
                    <AppIcons.ArrowUpDown />
                  ) : (
                    <AppIcons.ArrowUpDown className="transform rotate-180" />
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        <CharacterTable
          characters={filteredCharacters}
          onDelete={handleRefresh}
        />
      </div>

      <footer className="mt-12 text-center text-muted-foreground text-sm">
        <p>MU Online Gerenciador de Contas &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default FullHistory;
