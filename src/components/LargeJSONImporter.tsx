
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useState } from "react";
import { Loader2 } from "lucide-react";

const LargeJSONImporter: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [importResult, setImportResult] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [progress, setProgress] = useState(0);
  const [warningMessage, setWarningMessage] = useState("");
  const workerRef = useRef<Worker | null>(null);

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const cancelImport = () => {
    if (workerRef.current) {
      // Send abort command to worker
      workerRef.current.postMessage({ command: 'abort' });
      
      // Also terminate for immediate effect
      workerRef.current.terminate();
      workerRef.current = null;
      setIsLoading(false);
      setProgress(0);
      setErrorMessage("Importação cancelada pelo usuário.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setErrorMessage("");
    setWarningMessage("");
    setProgress(0);
    setImportResult(null);

    // Create a new worker
    try {
      // Terminate existing worker if there is one
      if (workerRef.current) {
        workerRef.current.terminate();
      }

      workerRef.current = new Worker(
        new URL("../utils/worker.ts", import.meta.url),
        { type: "module" }
      );

      workerRef.current.postMessage(file);

      workerRef.current.onmessage = (event) => {
        const { type, success, data, error, progress: progressValue, message } = event.data;

        if (type === "progress") {
          setProgress(progressValue);
        } else if (type === "warning") {
          setWarningMessage(message);
        } else if (type === "complete") {
          if (success) {
            setImportResult(data);
          } else {
            setErrorMessage(error);
          }
          setIsLoading(false);
          workerRef.current?.terminate();
          workerRef.current = null;
        }
      };

      // Set a timeout to prevent infinite loading
      setTimeout(() => {
        if (isLoading && workerRef.current) {
          workerRef.current.terminate();
          workerRef.current = null;
          setIsLoading(false);
          setErrorMessage("A importação demorou muito tempo e foi cancelada. Tente um arquivo menor.");
        }
      }, 180000); // 3 minutes timeout
    } catch (err) {
      console.error("Erro ao iniciar worker:", err);
      setErrorMessage(`Erro ao processar arquivo: ${err instanceof Error ? err.message : String(err)}`);
      setIsLoading(false);
    } finally {
      if (e.target) e.target.value = "";
    }
  };

  return (
    <div className="p-4">
      <button
        onClick={handleImportClick}
        disabled={isLoading}
        className="secondary-button mr-2"
      >
        {isLoading ? "Importando..." : "Importar JSON"}
      </button>
      
      {isLoading && (
        <button
          onClick={cancelImport}
          className="secondary-button bg-red-700 hover:bg-red-800"
        >
          Cancelar
        </button>
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      {warningMessage && (
        <p className="mt-2 text-yellow-500">Aviso: {warningMessage}</p>
      )}
      
      {isLoading && (
        <div className="mt-4">
          <div className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Processando arquivo ({progress}%)...</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2.5 mt-2">
            <div 
              className="bg-mu-gold h-2.5 rounded-full" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}
      
      {errorMessage && (
        <p className="mt-2 text-red-600">Erro: {errorMessage}</p>
      )}
      
      {importResult && (
        <div className="mt-4">
          <p>Importação concluída!</p>
          <p>Total de registros: {importResult.length}</p>
        </div>
      )}
    </div>
  );
};

export default LargeJSONImporter;
