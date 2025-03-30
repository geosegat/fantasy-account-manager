/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useState } from "react";

const LargeJSONImporter: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [importResult, setImportResult] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setErrorMessage("");

    const worker = new Worker(new URL("../utils/worker.js", import.meta.url));

    worker.postMessage(file);

    worker.onmessage = (event) => {
      const { success, data, error } = event.data;
      if (success) {
        setImportResult(data);
      } else {
        setErrorMessage(error);
      }
      setIsLoading(false);
      worker.terminate();
    };
  };

  return (
    <div className="p-4">
      <button
        onClick={handleImportClick}
        disabled={isLoading}
        className="secondary-button"
      >
        {isLoading ? "Importando..." : "Importar JSON"}
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
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
