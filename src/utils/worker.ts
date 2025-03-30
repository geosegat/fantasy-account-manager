self.onmessage = (e: MessageEvent<File>) => {
  const file = e.data;
  const reader = new FileReader();

  reader.onprogress = (event) => {
    if (event.lengthComputable) {
      const prog = Math.round((event.loaded / event.total) * 100);
      self.postMessage({ progress: prog });
    }
  };

  reader.onload = () => {
    try {
      const text = reader.result as string;
      const jsonData = JSON.parse(text);
      self.postMessage({ success: true, data: jsonData });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      self.postMessage({ success: false, error: message });
    }
  };

  reader.onerror = () => {
    self.postMessage({
      success: false,
      error: reader.error?.message || "Erro de leitura",
    });
  };

  reader.readAsText(file);
};

export {};
