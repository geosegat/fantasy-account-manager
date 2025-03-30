
// Function to handle large JSON files by processing in chunks
const processLargeJSON = async (file: File): Promise<any> => {
  // Size threshold for chunking (5MB)
  const SIZE_THRESHOLD = 5 * 1024 * 1024;
  
  if (file.size <= SIZE_THRESHOLD) {
    // For smaller files, process normally
    const text = await file.text();
    return JSON.parse(text);
  } else {
    // For larger files, read in chunks using streams if supported
    if ('stream' in file && typeof file.stream === 'function') {
      try {
        const reader = file.stream().getReader();
        let result = '';
        let processedBytes = 0;
        
        // Report progress periodically
        const totalSize = file.size;
        
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = new TextDecoder().decode(value);
          result += chunk;
          
          processedBytes += value.length;
          // Report progress
          self.postMessage({ 
            type: 'progress', 
            progress: Math.round((processedBytes / totalSize) * 100) 
          });
        }
        
        return JSON.parse(result);
      } catch (error) {
        throw new Error(`Erro ao processar arquivo grande: ${error instanceof Error ? error.message : String(error)}`);
      }
    } else {
      // Fallback for browsers without stream support
      const text = await file.text();
      return JSON.parse(text);
    }
  }
};

self.onmessage = async (e: MessageEvent<File>) => {
  try {
    const file = e.data;
    
    // Check file size and warn if too large
    if (file.size > 100 * 1024 * 1024) { // 100MB
      self.postMessage({ 
        type: 'warning', 
        message: 'O arquivo é muito grande (>100MB). Isso pode causar problemas de desempenho.'
      });
    }
    
    // Start processing with initial progress message
    self.postMessage({ type: 'progress', progress: 0 });
    
    const jsonData = await processLargeJSON(file);
    
    // Validate the data structure
    if (!Array.isArray(jsonData)) {
      throw new Error('O formato do arquivo não é válido. Esperava-se um array de dados.');
    }
    
    self.postMessage({ type: 'complete', success: true, data: jsonData });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    self.postMessage({ type: 'complete', success: false, error: message });
  }
};

export {};
