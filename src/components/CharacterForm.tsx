import React, { useState, useEffect } from "react";
import {
  getCharacterNames,
  getCharacters,
  saveCharacter,
} from "../utils/localStorage";
import { Input } from "@/components/ui/input";
import { toast } from "../utils/toast";
import { AppIcons } from "./ui/appicons";

interface CharacterFormProps {
  onSave: () => void;
}

const CharacterForm: React.FC<CharacterFormProps> = ({ onSave }) => {
  const [name, setName] = useState("");
  const [resets, setResets] = useState("");
  const [soul, setSoul] = useState("");
  const [mr, setMr] = useState("");
  const [eventPoints, setEventPoints] = useState("");
  const [pcPoints, setPcPoints] = useState("");
  const [gold, setGold] = useState("");
  const [existingNames, setExistingNames] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Nome do personagem é obrigatório");
      return;
    }

    saveCharacter({
      name,
      resets: parseInt(resets) || 0,
      soul: parseInt(soul) || 0,
      mr: parseInt(mr) || 0,
      eventPoints: parseInt(eventPoints) || 0,
      pcPoints: parseInt(pcPoints) || 0,
      gold: parseInt(gold) || 0,
    });

    setName("");
    setResets("");
    setSoul("");
    setMr("");
    setEventPoints("");
    setPcPoints("");
    setGold("");

    setExistingNames(getCharacterNames());

    onSave();

    toast.success("Personagem salvo com sucesso");
  };

  const handleNumberChange = (
    setter: React.Dispatch<React.SetStateAction<string>>,
    value: string
  ) => {
    if (value === "" || /^\d+$/.test(value)) {
      setter(value);
    }
  };

  useEffect(() => {
    setExistingNames(getCharacterNames());
  }, []);

  useEffect(() => {
    if (existingNames.includes(name)) {
      const allChars = getCharacters();
      const found = allChars.find(
        (c) => c.name.toLowerCase() === name.toLowerCase()
      );
      if (found) {
        setResets(found.resets.toString());
        setSoul(found.soul.toString());
        setMr(found.mr.toString());
        setEventPoints(found.eventPoints.toString());
        setPcPoints(found.pcPoints.toString());
        setGold(found.gold.toString());
      }
    } else {
      setResets("");
      setSoul("");
      setMr("");
      setEventPoints("");
      setPcPoints("");
      setGold("");
    }
  }, [name, existingNames]);

  return (
    <div className="glass-panel p-6 ">
      <h2 className="text-xl font-medieval text-mu-gold mb-4 flex items-center gap-2">
        <AppIcons.File />
        Cadastro / Edição de Personagem
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="name" className="input-label">
              Nome do Personagem
            </label>
            <Input
              list="character-names"
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              placeholder="Digite ou selecione"
              required
            />
            <datalist id="character-names">
              {existingNames.map((existingName) => (
                <option key={existingName} value={existingName} />
              ))}
            </datalist>
          </div>

          <div>
            <label htmlFor="resets" className="input-label">
              Resets
            </label>
            <Input
              id="resets"
              type="text"
              inputMode="numeric"
              value={resets}
              onChange={(e) => handleNumberChange(setResets, e.target.value)}
              className="input-field"
              placeholder="0"
            />
          </div>

          <div>
            <label htmlFor="soul" className="input-label">
              Soul
            </label>
            <Input
              id="soul"
              type="text"
              inputMode="numeric"
              value={soul}
              onChange={(e) => handleNumberChange(setSoul, e.target.value)}
              className="input-field"
              placeholder="0"
            />
          </div>

          <div>
            <label htmlFor="mr" className="input-label">
              MR
            </label>
            <Input
              id="mr"
              type="text"
              inputMode="numeric"
              value={mr}
              onChange={(e) => handleNumberChange(setMr, e.target.value)}
              className="input-field"
              placeholder="0"
            />
          </div>

          <div>
            <label htmlFor="eventPoints" className="input-label">
              Pontos de Evento
            </label>
            <Input
              id="eventPoints"
              type="text"
              inputMode="numeric"
              value={eventPoints}
              onChange={(e) =>
                handleNumberChange(setEventPoints, e.target.value)
              }
              className="input-field"
              placeholder="0"
            />
          </div>

          <div>
            <label htmlFor="pcPoints" className="input-label">
              PC Points
            </label>
            <Input
              id="pcPoints"
              type="text"
              inputMode="numeric"
              value={pcPoints}
              onChange={(e) => handleNumberChange(setPcPoints, e.target.value)}
              className="input-field"
              placeholder="0"
            />
          </div>

          <div>
            <label htmlFor="gold" className="input-label">
              Gold
            </label>
            <Input
              id="gold"
              type="text"
              inputMode="numeric"
              value={gold}
              onChange={(e) => handleNumberChange(setGold, e.target.value)}
              className="input-field"
              placeholder="0"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="primary-button flex items-center gap-2 "
          >
            <AppIcons.Save color="white" />
            Salvar Personagem
          </button>
        </div>
      </form>
    </div>
  );
};

export default CharacterForm;
