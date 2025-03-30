self.onmessage = async (e: MessageEvent<File>) => {
  try {
    const file = e.data;
    const text = await file.text();
    const jsonData = JSON.parse(text);
    self.postMessage({ success: true, data: jsonData });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    self.postMessage({ success: false, error: message });
  }
};

export {};
