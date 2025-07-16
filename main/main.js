// main.js
import { app, BrowserWindow, nativeTheme, globalShortcut } from 'electron'
import path from 'node:path'
import dataUtils from './utils/data.js'
import initMenu from './menu.js'
// import initTouchBar from './touch-bar.js'
import Tray from './tray.js'
import { initialize } from '@electron/remote/main/index.js'
import initIpcEvent from './ipcEvent.js'
import { startLoop } from './loop.js'
import initMacStatusbarLyric from './macStatusBarLyric/index.js'
import eventBus from './utils/eventBus.js'
import url from 'url'

const appPath = app.getAppPath();
// 在模块中使用
// console.log('process.cwd = ', appPath);
initialize()
dataUtils.init()


app.dock.hide()

const createMainWindow = (defaultShow) => {
  const mainWindow = new BrowserWindow({
    width: 400,
    height: 510,
    minimizable: false,
    fullscreenable: false,
    maximizable: false,
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      preload: path.join(appPath, './main/preload.mjs')
    },
    show: defaultShow,
    skipTaskbar: true,
    icon: path.join(appPath, './main/icons/png/128x128.png')
  })
  if (process.platform === 'darwin') {
    app.dock.setIcon(path.join(appPath, './main/icons/png/128x128.png'))
  }

  mainWindow.on('closed',(e) => {
    e.preventDefault()
  })

  // if (process.env.ELE_ENV === 'dev') {
  const isDarkMode = nativeTheme.shouldUseDarkColors;
  // console.log('isDarkMode ==== ', isDarkMode)
  // mainWindow.loadURL('http://localhost:8712/#/?dark=' + isDarkMode);
  // } else {
    // 加载 index.html
    const indexUrl = url.format({
      pathname: path.resolve(appPath, './main/web/index.html'),
      protocol: 'file:',
      slashes: true,
    }) + '#/?dark=' + isDarkMode;

    mainWindow.loadURL(indexUrl);
  // }

  // 打开开发工具
  // mainWindow.webContents.openDevTools()
  return mainWindow
}

// 这段程序将会在 Electron 结束初始化
// 和创建浏览器窗口的时候调用
// 部分 API 在 ready 事件触发后才能使用。
app.whenReady().then(() => {
  const ret = globalShortcut.register('CommandOrControl+T', () => {
    // console.log('CommandOrControl+X is pressed')
    eventBus.$emit('tray-control-toggle-hidden', {})
  })

  // const mainWindow = createBackgroundWindow()
  initMenu()
  // initTouchBar(mainWindow)
  const showMainWindow = () => {
    // 在 macOS 系统内, 如果没有已开启的应用窗口
    // 点击托盘图标时通常会重新创建一个新窗口
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow(true)
    } else {
      BrowserWindow.getAllWindows()[0].show()
    }
  }

  createMainWindow(false)
  // app.on('activate', showMainWindow)
  global.Tray = Tray
  Tray.init(showMainWindow)
  initIpcEvent()
  initMacStatusbarLyric()
  const setting = dataUtils.getSetting()
  if (process.env.ELE_ENV != 'dev' && setting.autoLaunch) {
    app.setLoginItemSettings({
      openAtLogin: true,
      openAsHidden: true,
      // path: app.getPath('exe'),
      args: ['--processStart']
    })
  }
  startLoop(setting)
})


// 监听暗黑模式变化
nativeTheme.on('updated', () => {
  const isDarkMode = nativeTheme.shouldUseDarkColors;
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length > 0) {
    allWindows.forEach((win) => {
      win.webContents.send('dark-mode-changed', isDarkMode);
    });
  }
});


// 除了 macOS 外，当所有窗口都被关闭的时候退出程序。 因此, 通常
// 对应用程序和它们的菜单栏来说应该时刻保持激活状态, 
// 直到用户使用 Cmd + Q 明确退出
app.on('window-all-closed', () => {
//   if (process.platform !== 'darwin') {
//     console.log('app.quit 将被调用')
//     app.quit()
//   }
})

app.on('before-quit', () => {
  console.log('程序即将退出')
})