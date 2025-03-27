import React, { useRef, useState } from "react";
import { exportCharacters, importCharacters } from "../utils/localStorage";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui/tooltip";
import { Loader2 } from "lucide-react";
import { AppIcons } from "./ui/appicons";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  onImportSuccess?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onImportSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const text = await file.text();
      const jsonData = JSON.parse(text);
      importCharacters(jsonData);

      onImportSuccess?.();

      alert("Importado com sucesso!");
    } catch (err) {
      console.error(err);
      alert("Falha ao importar arquivo JSON.");
    } finally {
      setIsLoading(false);
      e.target.value = "";
    }
  };

  return (
    <header className="w-full glass-panel p-6 mb-8 flex flex-col sm:flex-row justify-between items-center gap-4 ">
      <div className="text-center sm:text-left">
        <h1
          className="text-3xl sm:text-4xl font-medieval text-white cursor-pointer "
          onClick={() => navigate("/")}
        >
          <span className="text-mu-gold">MU</span>
          <span className="tracking-wide"> Gerenciador de Contas</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Acompanhe, analise e gerencie a progressão dos seus personagens
        </p>
      </div>

      <TooltipProvider>
        <div className="flex items-center gap-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={exportCharacters}
                className="secondary-button flex items-center gap-2"
              >
                <AppIcons.Download />
                Exportar Dados
              </button>
            </TooltipTrigger>
          </Tooltip>

          <button
            onClick={handleImportClick}
            disabled={isLoading}
            className="secondary-button flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Importando...
              </>
            ) : (
              <>
                <AppIcons.Upload />
                Importar Dados
              </>
            )}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </TooltipProvider>
    </header>
  );
};

export default Header;
