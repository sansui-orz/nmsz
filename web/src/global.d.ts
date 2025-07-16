interface Window {
  webExposeHandle: {
    getConfig: () => any;
    setConfig: (config: string) => void;
    login: () => any;
    register: () => any;
    ipcRenderer: {
      on: any,
      send: any,
      off: any
    }
  }
}