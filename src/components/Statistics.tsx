import React, { useState, useEffect } from "react";
import { calculateStats, formatNumber } from "../utils/calculations";
import { getCharacterNames } from "../utils/localStorage";

interface StatisticsProps {
  refreshKey?: number;
}

const Statistics: React.FC<StatisticsProps> = ({ refreshKey = 0 }) => {
  const [names, setNames] = useState<string[]>([]);
  const [selectedName, setSelectedName] = useState<string>("Todos");
  const [stats, setStats] = useState(() => calculateStats("Todos"));

  // 1) Quando o `refreshKey` muda, recarrega a lista de nomes
  useEffect(() => {
    const existingNames = getCharacterNames();
    setNames(["Todos", ...existingNames]);
  }, [refreshKey]);

  // 2) Quando `selectedName` ou `refreshKey` mudam, recalcula estatísticas
  useEffect(() => {
    setStats(calculateStats(selectedName));
  }, [selectedName, refreshKey]);

  const handleReload = () => {
    setStats(calculateStats(selectedName));
  };

  return (
    <div className="glass-panel p-6 medieval-border">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-2">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-medieval text-mu-gold flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
            Estatísticas do Personagem
          </h2>
        </div>

        {/* Select para escolher o personagem (ou Todos) */}
        <div className="flex items-center gap-2">
          <label
            htmlFor="characterSelect"
            className="font-medieval text-mu-gold"
          >
            Personagem:
          </label>
          <select
            id="characterSelect"
            value={selectedName}
            onChange={(e) => setSelectedName(e.target.value)}
            className="border border-mu-border rounded px-2 py-1"
          >
            {names.map((nameOption) => (
              <option key={nameOption} value={nameOption}>
                {nameOption}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleReload}
          className="text-sm px-3 py-1 border border-mu-gold/70 rounded hover:bg-mu-gold/10"
        >
          Recarregar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* ÚLTIMA HORA */}
        <div className="stat-card">
          <div className="flex justify-between items-center border-b border-mu-border pb-2">
            <h3 className="text-mu-gold/90 font-medieval">Última Hora</h3>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-mu-gold/70"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <div className="space-y-1 pt-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Resets:</span>
              <span className="font-medium">
                {formatNumber(stats.hourly.resets)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Soul:</span>
              <span className="font-medium">
                {formatNumber(stats.hourly.soul)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">MR:</span>
              <span className="font-medium">
                {formatNumber(stats.hourly.mr)}
              </span>
            </div>
          </div>
        </div>

        {/* ÚLTIMO DIA */}
        <div className="stat-card">
          <div className="flex justify-between items-center border-b border-mu-border pb-2">
            <h3 className="text-mu-gold/90 font-medieval">Último Dia</h3>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-mu-gold/70"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <div className="space-y-1 pt-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Resets:</span>
              <span className="font-medium">
                {formatNumber(stats.daily.resets)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Soul:</span>
              <span className="font-medium">
                {formatNumber(stats.daily.soul)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">MR:</span>
              <span className="font-medium">
                {formatNumber(stats.daily.mr)}
              </span>
            </div>
          </div>
        </div>

        {/* ÚLTIMA SEMANA */}
        <div className="stat-card">
          <div className="flex justify-between items-center border-b border-mu-border pb-2">
            <h3 className="text-mu-gold/90 font-medieval">Última Semana</h3>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-mu-gold/70"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="4 7 4 4 20 4 20 7" />
              <line x1="9" y1="20" x2="15" y2="20" />
              <line x1="12" y1="4" x2="12" y2="20" />
            </svg>
          </div>
          <div className="space-y-1 pt-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Resets:</span>
              <span className="font-medium">
                {formatNumber(stats.weekly.resets)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Soul:</span>
              <span className="font-medium">
                {formatNumber(stats.weekly.soul)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">MR:</span>
              <span className="font-medium">
                {formatNumber(stats.weekly.mr)}
              </span>
            </div>
          </div>
        </div>

        {/* TOTAL GERAL */}
        <div className="stat-card">
          <div className="flex justify-between items-center border-b border-mu-border pb-2">
            <h3 className="text-mu-gold/90 font-medieval">Total Geral</h3>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-mu-gold/70"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 20V10" />
              <path d="M18 20V4" />
              <path d="M6 20v-4" />
            </svg>
          </div>
          <div className="space-y-1 pt-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Resets:</span>
              <span className="font-medium">
                {formatNumber(stats.total.resets)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Soul:</span>
              <span className="font-medium">
                {formatNumber(stats.total.soul)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">MR:</span>
              <span className="font-medium">
                {formatNumber(stats.total.mr)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
