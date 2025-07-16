import { app, ipcMain, BrowserWindow } from 'electron'
import dataUtils from './utils/data.js'
import { restartLoop } from './loop.js'

export default function initIpcEvent() {
  ipcMain.handle('getSetting', async (event, params) => {
    const value = dataUtils.getSetting()
    return value
  })
  ipcMain.on('setSetting', (event, params) => {
    const oldSetting = dataUtils.getSetting()
    const setting = typeof params === 'string' ? JSON.parse(params) : params
    if (oldSetting.autoLaunch !== setting.autoLaunch) {
      app.setLoginItemSettings({
        openAtLogin: setting.autoLaunch,
        openAsHidden: true,
        args: []
      })
    }
    dataUtils.setSetting(setting)
    restartLoop(setting)
    BrowserWindow.getAllWindows()[0].hide()
  })
  ipcMain.on('exitApp', () => {
    app.exit()
  })
  ipcMain.on('tray-control-showMainWindow', () => {
    // console.log('tray-control-showMainWindow')
    // showMainWindow()
  })
  ipcMain.on('log', (event, data) => {
    console.log('log => ', data)
  })
}