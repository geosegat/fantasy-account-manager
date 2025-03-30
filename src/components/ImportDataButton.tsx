
import React, { useRef, useState } from "react";
import { importCharacters } from "../utils/localStorage";
import { Loader2 } from "lucide-react";
import { AppIcons } from "./ui/appicons";
import MessageModal from "./MessageModal";

interface ImportDataButtonProps {
  onImportSuccess?: () => void;
}

const ImportDataButton: React.FC<ImportDataButtonProps> = ({ onImportSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalVariant, setModalVariant] = useState<"success" | "error">("success");
  const [showModal, setShowModal] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const workerRef = useRef<Worker | null>(null);

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const cancelImport = () => {
    if (workerRef.current) {
      workerRef.current.postMessage({ command: 'abort' });
      workerRef.current.terminate();
      workerRef.current = null;
      setIsLoading(false);
      setImportProgress(0);
      setModalTitle("Importação Cancelada");
      setModalMessage("A importação foi cancelada pelo usuário.");
      setModalVariant("error");
      setShowModal(true);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsLoading(true);
    setImportProgress(0);
    
    try {
      if (workerRef.current) {
        workerRef.current.terminate();
      }

      workerRef.current = new Worker(
        new URL("../utils/worker.ts", import.meta.url),
        { type: "module" }
      );
      
      workerRef.current.postMessage(file);
      
      workerRef.current.onmessage = (event) => {
        const { type, success, data, error, progress, message } = event.data;
        
        if (type === "progress") {
          setImportProgress(progress);
        } else if (type === "warning") {
          console.warn(message);
        } else if (type === "complete") {
          if (success) {
            const totalRecords = Array.isArray(data) ? data.length : 0;
            const frequencyMap: Record<string, number> = {};
            if (Array.isArray(data)) {
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
            importCharacters(data);
            onImportSuccess?.();
            setModalTitle("Resumo da Importação");
            setModalMessage(summaryMessage);
            setModalVariant("success");
          } else {
            setModalTitle("Erro ao importar arquivo JSON");
            setModalMessage(
              `Ocorreu um erro durante a importação: ${error}\nPor favor, verifique o arquivo e tente novamente.`
            );
            setModalVariant("error");
          }
          setShowModal(true);
          setIsLoading(false);
          if (workerRef.current) {
            workerRef.current.terminate();
            workerRef.current = null;
          }
        }
      };
      
      setTimeout(() => {
        if (isLoading && workerRef.current) {
          workerRef.current.terminate();
          workerRef.current = null;
          setIsLoading(false);
          setModalTitle("Tempo Esgotado");
          setModalMessage("A importação demorou muito tempo e foi cancelada. Tente um arquivo menor.");
          setModalVariant("error");
          setShowModal(true);
        }
      }, 180000);
    } catch (err) {
      console.error(err);
      setModalTitle("Erro ao importar arquivo JSON");
      setModalMessage(
        `Ocorreu um erro durante a importação: ${err instanceof Error ? err.message : String(err)}`
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
      <div className="flex items-center gap-2">
        <button
          onClick={handleImportClick}
          disabled={isLoading}
          className="secondary-button flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Importando {importProgress}%
            </>
          ) : (
            <>
              <AppIcons.Upload />
              Importar Dados
            </>
          )}
        </button>
        {isLoading && (
          <button
            onClick={cancelImport}
            className="secondary-button bg-red-700 hover:bg-red-800"
          >
            Cancelar
          </button>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        className="hidden"
        onChange={handleFileChange}
      />
      {isLoading && (
        <div className="fixed bottom-4 right-4 z-50 bg-black bg-opacity-75 p-4 rounded-lg max-w-xs">
          <div className="flex items-center gap-2 text-white mb-2">
            <Loader2 className="h-5 w-5 animate-spin text-mu-gold" />
            <span>Processando arquivo ({importProgress}%)...</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2.5">
            <div 
              className="bg-mu-gold h-2.5 rounded-full" 
              style={{ width: `${importProgress}%` }}
            ></div>
          </div>
        </div>
      )}
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

export default ImportDataButton;
