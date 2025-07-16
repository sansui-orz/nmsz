import { ipcRenderer, contextBridge } from "electron"

contextBridge.exposeInMainWorld('webExposeHandle', {
  setConfig: (str) => {
    try {
      // dataUtils.set('setting', JSON.parse(str))
      ipcRenderer.send('setSetting', str)
    } catch(e) {
      console.log('setConfig error', e)
    }
  },
  getConfig: () => {
    return ipcRenderer.invoke('getSetting')
  },
  exitApp: () => {
    ipcRenderer.send('exitApp')
  },
  ipcRenderer: {
    ...ipcRenderer,
    on: ipcRenderer.on,
    off: ipcRenderer.off,
    send: ipcRenderer.send
  },
})
