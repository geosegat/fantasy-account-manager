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
import MessageModal from "../components/MessageModal";

interface HeaderProps {
  onImportSuccess?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onImportSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalVariant, setModalVariant] = useState<"success" | "error">(
    "success"
  );
  const [showModal, setShowModal] = useState(false);
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
      const worker = new Worker(
        new URL("../utils/worker.ts", import.meta.url),
        { type: "module" }
      );
      worker.postMessage(file);
      worker.onmessage = (event) => {
        const { success, data, error } = event.data;
        if (success) {
          const totalRecords = Array.isArray(data) ? data.length : 0;
          const frequencyMap: Record<string, number> = {};
          if (Array.isArray(data)) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            data.forEach((item: any) => {
              if (item && item.name) {
                frequencyMap[item.name] = (frequencyMap[item.name] || 0) + 1;
              }
            });
          }
          const uniqueCharacters = Object.keys(frequencyMap);
          let summaryMessage = `Importado com sucesso!\nTotal de registros: ${totalRecords}\nTotal de personagens únicos: ${uniqueCharacters.length}\n\n`;
          uniqueCharacters.forEach((name) => {
            summaryMessage += `${name}: ${frequencyMap[name]} registros\n`;
          });
          // Realiza a importação dos dados
          importCharacters(data);
          onImportSuccess?.();
          setModalTitle("Resumo da Importação");
          setModalMessage(summaryMessage);
          setModalVariant("success");
        } else {
          setModalTitle("Erro ao importar arquivo JSON");
          setModalMessage(
            "Ocorreu um erro durante a importação. Por favor, verifique o arquivo e tente novamente."
          );
          setModalVariant("error");
        }
        setShowModal(true);
        setIsLoading(false);
        worker.terminate();
      };
    } catch (err) {
      console.error(err);
      setModalTitle("Erro ao importar arquivo JSON");
      setModalMessage(
        "Ocorreu um erro durante a importação. Por favor, verifique o arquivo e tente novamente."
      );
      setModalVariant("error");
      setShowModal(true);
      setIsLoading(false);
    } finally {
      if (e.target) e.target.value = "";
    }
  };

  return (
    <>
      <header className="w-full glass-panel p-6 mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-center sm:text-left">
          <h1
            className="text-3xl sm:text-4xl font-medieval text-white cursor-pointer"
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
      {showModal && (
        <MessageModal
          title={modalTitle}
          message={modalMessage}
          onClose={() => setShowModal(false)}
          variant={modalVariant}
        />
      )}
    </>
  );
};

export default Header;
