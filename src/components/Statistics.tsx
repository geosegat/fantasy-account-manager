import React, { useState, useEffect, useRef } from "react";
import { getCharacters, getCharacterNames } from "../utils/localStorage";
import { sumCharacters, formatNumber } from "../utils/calculations";
import { AppIcons } from "./ui/appicons";

interface StatisticsProps {
  refreshKey?: number;
}

const Statistics: React.FC<StatisticsProps> = ({ refreshKey = 0 }) => {
  const [names, setNames] = useState<string[]>([]);
  const [selectedName, setSelectedName] = useState("Todos");
  const [total, setTotal] = useState(() => ({
    resets: 0,
    soul: 0,
    mr: 0,
    eventPoints: 0,
    pcPoints: 0,
    gold: 0,
  }));
  const [totalResets, setTotalResets] = useState<number | null>(null);

  const totalResetsRef = useRef<HTMLDivElement>(null);

  const calculateTotalResets = () => {
    const calculatedTotalResets = total.mr * 150 + total.resets;
    setTotalResets(calculatedTotalResets);

    setTimeout(() => {
      if (totalResetsRef.current) {
        totalResetsRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, 100);
  };

  useEffect(() => {
    const uniqueNames = getCharacterNames();
    setNames(["Todos", ...uniqueNames]);
  }, [refreshKey]);

  useEffect(() => {
    const all = getCharacters();
    let filtered = all;

    if (selectedName !== "Todos") {
      filtered = all.filter(
        (ch) => ch.name.toLowerCase() === selectedName.toLowerCase()
      );
    }
    const result = sumCharacters(filtered);
    setTotal(result);
  }, [selectedName, refreshKey]);

  return (
    <div className="glass-panel p-6">
      <div className="flex flex-col md:flex-row items-center justify-between mb-4 space-y-2 md:space-y-0 md:space-x-2">
        <h2 className="text-xl font-medieval text-mu-gold flex items-center gap-2">
          <AppIcons.ChartLine width={30} height={30} />
          Estatísticas
        </h2>

        <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <label
              htmlFor="characterSelect"
              className="font-medieval text-mu-gold whitespace-nowrap"
            >
              Personagem:
            </label>
            <select
              id="characterSelect"
              value={selectedName}
              onChange={(e) => setSelectedName(e.target.value)}
              className="border border-mu-border rounded px-2 py-1 w-full sm:w-auto"
            >
              {names.map((nameOption) => (
                <option key={nameOption} value={nameOption}>
                  {nameOption}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={calculateTotalResets}
            className="secondary-button flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0"
          >
            Calcular Resets Gerais
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
        <div className="stat-card">
          <div className="border-b border-mu-border pb-2 mb-2">
            <h3 className="text-mu-gold/90 font-medieval">Resets</h3>
          </div>
          <p className="text-xl font-bold">{formatNumber(total.resets)}</p>
        </div>

        <div className="stat-card">
          <div className="border-b border-mu-border pb-2 mb-2">
            <h3 className="text-mu-gold/90 font-medieval">Soul</h3>
          </div>
          <p className="text-xl font-bold">{formatNumber(total.soul)}</p>
        </div>

        <div className="stat-card">
          <div className="border-b border-mu-border pb-2 mb-2">
            <h3 className="text-mu-gold/90 font-medieval">MR</h3>
          </div>
          <p className="text-xl font-bold">{formatNumber(total.mr)}</p>
        </div>

        <div className="stat-card">
          <div className="border-b border-mu-border pb-2 mb-2">
            <h3 className="text-mu-gold/90 font-medieval">Pontos de Evento</h3>
          </div>
          <p className="text-xl font-bold">{formatNumber(total.eventPoints)}</p>
        </div>

        <div className="stat-card">
          <div className="border-b border-mu-border pb-2 mb-2">
            <h3 className="text-mu-gold/90 font-medieval">PC Points</h3>
          </div>
          <p className="text-xl font-bold">{formatNumber(total.pcPoints)}</p>
        </div>

        <div className="stat-card">
          <div className="border-b border-mu-border pb-2 mb-2">
            <h3 className="text-mu-gold/90 font-medieval">Gold</h3>
          </div>
          <p className="text-xl font-bold">{formatNumber(total.gold)}</p>
        </div>

        {totalResets !== null && (
          <div ref={totalResetsRef} className="stat-card col-span-full">
            <div className="border-b border-mu-border pb-2 mb-2">
              <h3 className="text-mu-gold/90 font-medieval">
                Total de Resets Gerais
              </h3>
            </div>
            <p className="text-2xl font-bold text-mu-gold">
              {formatNumber(totalResets)}
              <span className="text-sm ml-2 text-muted-foreground">
                (MR * 150 + Resets Atuais)
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Statistics;
