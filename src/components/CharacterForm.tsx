
import React, { useState } from 'react';
import { saveCharacter } from '../utils/localStorage';
import { toast } from "../utils/toast";

interface CharacterFormProps {
  onSave: () => void;
}

const CharacterForm: React.FC<CharacterFormProps> = ({ onSave }) => {
  const [name, setName] = useState('');
  const [resets, setResets] = useState(0);
  const [soul, setSoul] = useState(0);
  const [mr, setMr] = useState(0);
  const [eventPoints, setEventPoints] = useState(0);
  const [pcPoints, setPcPoints] = useState(0);
  const [gold, setGold] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error("Character name is required");
      return;
    }
    
    // Save the character
    saveCharacter({
      name,
      resets,
      soul,
      mr,
      eventPoints,
      pcPoints,
      gold,
    });
    
    // Reset form
    setName('');
    setResets(0);
    setSoul(0);
    setMr(0);
    setEventPoints(0);
    setPcPoints(0);
    setGold(0);
    
    // Notify parent component
    onSave();
    
    toast.success("Character saved successfully");
  };

  return (
    <div className="glass-panel p-6 medieval-border">
      <h2 className="text-xl font-medieval text-mu-gold mb-4 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
        Character Registration
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="name" className="input-label">Character Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              placeholder="Enter character name"
              required
            />
          </div>
          
          <div>
            <label htmlFor="resets" className="input-label">Resets</label>
            <input
              id="resets"
              type="number"
              value={resets}
              onChange={(e) => setResets(parseInt(e.target.value) || 0)}
              className="input-field"
              min="0"
            />
          </div>
          
          <div>
            <label htmlFor="soul" className="input-label">Soul</label>
            <input
              id="soul"
              type="number"
              value={soul}
              onChange={(e) => setSoul(parseInt(e.target.value) || 0)}
              className="input-field"
              min="0"
            />
          </div>
          
          <div>
            <label htmlFor="mr" className="input-label">MR</label>
            <input
              id="mr"
              type="number"
              value={mr}
              onChange={(e) => setMr(parseInt(e.target.value) || 0)}
              className="input-field"
              min="0"
            />
          </div>
          
          <div>
            <label htmlFor="eventPoints" className="input-label">Event Points</label>
            <input
              id="eventPoints"
              type="number"
              value={eventPoints}
              onChange={(e) => setEventPoints(parseInt(e.target.value) || 0)}
              className="input-field"
              min="0"
            />
          </div>
          
          <div>
            <label htmlFor="pcPoints" className="input-label">PC Points</label>
            <input
              id="pcPoints"
              type="number"
              value={pcPoints}
              onChange={(e) => setPcPoints(parseInt(e.target.value) || 0)}
              className="input-field"
              min="0"
            />
          </div>
          
          <div>
            <label htmlFor="gold" className="input-label">Gold</label>
            <input
              id="gold"
              type="number"
              value={gold}
              onChange={(e) => setGold(parseInt(e.target.value) || 0)}
              className="input-field"
              min="0"
            />
          </div>
        </div>
        
        <div className="flex justify-end">
          <button type="submit" className="primary-button flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>
            Save Character
          </button>
        </div>
      </form>
    </div>
  );
};

export default CharacterForm;
