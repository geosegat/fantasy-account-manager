// Function to handle large JSON files by processing in chunks
const processLargeJSON = async (file: File): Promise<any> => {
  // Size threshold for chunking (1MB)
  const CHUNK_SIZE = 1 * 1024 * 1024;
  const SIZE_THRESHOLD = 5 * 1024 * 1024;
  
  if (file.size <= SIZE_THRESHOLD) {
    // For smaller files, process normally
    const text = await file.text();
    return JSON.parse(text);
  } else {
    // For larger files, we'll use a chunked approach
    try {
      let result = '';
      let processedBytes = 0;
      const totalSize = file.size;
      
      // Create a FileReader for chunked reading
      const readChunk = (start: number, end: number): Promise<string> => {
        return new Promise((resolve, reject) => {
          const blob = file.slice(start, end);
          const reader = new FileReader();
          
          reader.onload = (e) => {
            if (e.target?.result) {
              resolve(e.target.result as string);
            } else {
              reject(new Error("Failed to read chunk"));
            }
          };
          
          reader.onerror = () => {
            reject(new Error("Error reading file chunk"));
          };
          
          reader.readAsText(blob);
        });
      };
      
      // Process file in chunks
      for (let position = 0; position < file.size; position += CHUNK_SIZE) {
        const end = Math.min(position + CHUNK_SIZE, file.size);
        const chunk = await readChunk(position, end);
        result += chunk;
        
        processedBytes += (end - position);
        // Report progress
        if (processedBytes % (CHUNK_SIZE * 2) === 0 || processedBytes === file.size) {
          self.postMessage({ 
            type: 'progress', 
            progress: Math.round((processedBytes / totalSize) * 100) 
          });
          
          // Give the main thread some time to breathe
          await new Promise(resolve => setTimeout(resolve, 0));
        }
      }
      
      try {
        // Parse the complete JSON once all chunks are read
        return JSON.parse(result);
      } catch (parseError) {
        throw new Error(`Erro ao analisar o JSON: ${parseError instanceof Error ? parseError.message : String(parseError)}`);
      }
    } catch (error) {
      throw new Error(`Erro ao processar arquivo grande: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
};

// Helper to validate JSON data
const validateJSON = (data: any): boolean => {
  if (!Array.isArray(data)) {
    throw new Error('O formato do arquivo não é válido. Esperava-se um array de dados.');
  }
  
  // Check if array has at least one valid character object
  if (data.length > 0) {
    const hasValidObject = data.some(item => 
      item && 
      typeof item === 'object' && 
      'name' in item
    );
    
    if (!hasValidObject) {
      throw new Error('O JSON não contém dados de personagens válidos.');
    }
  }
  
  return true;
};

self.onmessage = async (e: MessageEvent<File>) => {
  let aborted = false;
  
  // Set up a handler for abort messages
  const originalPostMessage = self.postMessage;
  self.postMessage = function(message) {
    if (aborted && message.type !== 'complete') return;
    originalPostMessage.call(this, message);
  };
  
  try {
    const file = e.data;
    
    // Check if it's an abort message
    if (typeof file === 'object' && 'command' in file && file.command === 'abort') {
      aborted = true;
      self.postMessage({ type: 'complete', success: false, error: 'Importação cancelada pelo usuário.' });
      return;
    }
    
    // Check file size and warn if too large
    if (file.size > 100 * 1024 * 1024) { // 100MB
      self.postMessage({ 
        type: 'warning', 
        message: 'O arquivo é muito grande (>100MB). Isso pode causar problemas de desempenho.'
      });
    }
    
    // Start processing with initial progress message
    self.postMessage({ type: 'progress', progress: 0 });
    
    // Process in smaller portions to keep the UI responsive
    const jsonData = await processLargeJSON(file);
    
    if (aborted) {
      self.postMessage({ type: 'complete', success: false, error: 'Importação cancelada pelo usuário.' });
      return;
    }
    
    // Validate the data structure
    validateJSON(jsonData);
    
    self.postMessage({ type: 'complete', success: true, data: jsonData });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    self.postMessage({ type: 'complete', success: false, error: message });
  }
};

export {};
