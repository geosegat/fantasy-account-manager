import React, { useState, useEffect } from "react";
import {
  getCharacters,
  Character,
  getCharacterNames,
} from "../utils/localStorage";

type PresetUnit = "minuto" | "hora" | "dia" | "semana" | "mes";
type IntervalOption = PresetUnit | "custom";

const conversionFactors: Record<PresetUnit, number> = {
  minuto: 60 * 1000,
  hora: 60 * 60 * 1000,
  dia: 24 * 60 * 60 * 1000,
  semana: 7 * 24 * 60 * 60 * 1000,
  mes: 30 * 24 * 60 * 60 * 1000,
};

interface ResetStatisticsCardsProps {
  refreshKey?: number;
}

const ResetStatisticsCards: React.FC<ResetStatisticsCardsProps> = ({
  refreshKey = 0,
}) => {
  const [characterList, setCharacterList] = useState<string[]>([]);
  const [selectedName, setSelectedName] = useState("Todos");
  const [historicalCharacters, setHistoricalCharacters] = useState<Character[]>(
    []
  );

  const [selectedInterval, setSelectedInterval] =
    useState<IntervalOption>("hora");
  const [customValue, setCustomValue] = useState<number>(1);
  const [customUnit, setCustomUnit] = useState<PresetUnit>("dia");

  const [rate, setRate] = useState<number>(0);

  useEffect(() => {
    const names = getCharacterNames();
    setCharacterList(["Todos", ...names]);
  }, [refreshKey]);

  useEffect(() => {
    const allCharacters = getCharacters();
    const filtered =
      selectedName === "Todos"
        ? allCharacters
        : allCharacters.filter(
            (ch) => ch.name.toLowerCase() === selectedName.toLowerCase()
          );
    setHistoricalCharacters(filtered);
  }, [refreshKey, selectedName]);

  useEffect(() => {
    let totalResetDiff = 0;
    let totalTimeDiff = 0;

    const groups: Record<string, Character[]> = {};
    historicalCharacters.forEach((char) => {
      if (!groups[char.name]) {
        groups[char.name] = [];
      }
      groups[char.name].push(char);
    });

    Object.keys(groups).forEach((name) => {
      const records = groups[name].sort((a, b) => a.timestamp - b.timestamp);
      if (records.length >= 2) {
        const previous = records[records.length - 2];
        const last = records[records.length - 1];
        totalResetDiff += last.resets - previous.resets;
        totalTimeDiff += last.timestamp - previous.timestamp;
      }
    });

    if (totalTimeDiff === 0) {
      setRate(0);
      return;
    }

    const effectiveFactor =
      selectedInterval !== "custom"
        ? conversionFactors[selectedInterval as PresetUnit]
        : customValue * conversionFactors[customUnit];

    const computedRate = Math.round(
      (totalResetDiff * effectiveFactor) / totalTimeDiff
    );
    setRate(computedRate);
  }, [historicalCharacters, selectedInterval, customValue, customUnit]);

  return (
    <div className="glass-panel p-6 mb-8">
      <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-4">
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
            {characterList.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label
            htmlFor="intervalSelect"
            className="font-medieval text-mu-gold"
          >
            Intervalo de Cálculo:
          </label>
          <select
            id="intervalSelect"
            value={selectedInterval}
            onChange={(e) =>
              setSelectedInterval(e.target.value as IntervalOption)
            }
            className="border border-mu-border rounded px-2 py-1"
          >
            <option value="minuto">Minuto</option>
            <option value="hora">Hora</option>
            <option value="dia">Dia</option>
            <option value="semana">Semana</option>
            <option value="mes">Mês</option>
            <option value="custom">Personalizado</option>
          </select>
          {selectedInterval === "custom" && (
            <>
              <input
                type="number"
                min="1"
                value={customValue}
                onChange={(e) => setCustomValue(Number(e.target.value))}
                className="border border-mu-border rounded px-2 py-1 w-20"
              />
              <select
                value={customUnit}
                onChange={(e) => setCustomUnit(e.target.value as PresetUnit)}
                className="border border-mu-border rounded px-2 py-1"
              >
                <option value="minuto">Minuto</option>
                <option value="hora">Hora</option>
                <option value="dia">Dia</option>
                <option value="semana">Semana</option>
                <option value="mes">Mês</option>
              </select>
            </>
          )}
        </div>
      </div>

      <div className="glass-panel p-4 text-center">
        <h3 className="text-lg font-bold font-medieval text-mu-gold ">
          {selectedInterval === "custom"
            ? `Resetes em ${customValue} ${customUnit}`
            : `Resetes por ${
                selectedInterval.charAt(0).toUpperCase() +
                selectedInterval.slice(1)
              }`}
        </h3>
        <p className="text-2xl">{rate}</p>
      </div>
    </div>
  );
};

export default ResetStatisticsCards;
