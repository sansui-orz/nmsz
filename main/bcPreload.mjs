import { ipcRenderer, contextBridge } from "electron"
import remote from '@electron/remote'

contextBridge.exposeInMainWorld('_electron', {
  ipcRenderer: {
    ...ipcRenderer,
    on: ipcRenderer.on,
    send: ipcRenderer.send
  },
  remote: {
    ...remote,
    systemPreferences: {
      ...remote.systemPreferences,
      isDarkMode: () => {
        return remote.nativeTheme.shouldUseDarkColors
      }
    },
    getGlobal: remote.getGlobal
  }
})
