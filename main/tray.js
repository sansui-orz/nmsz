import {app, Menu, nativeImage, Tray, shell} from "electron"
import eventBus from "./utils/eventBus.js"


export default {
    tray: null,
    init(showMainWindow) {
        // console.log('init tray', process.platform)
        // this.tray = process.platform === 'darwin' ? this.initMacTray() : this.initialTray()
        this.tray = this.initMacTray(showMainWindow)
    },
    destroy() {
        this.tray.destroy()
    },
    initMacTray(showMainWindow) {
        const appTray = new Tray(nativeImage.createEmpty())
        appTray.setHighlightMode && appTray.setHighlightMode('never')
        const trayMenuTemplate = [
        {
            label: '牛马时钟',
            click: function () {
                shell.openExternal('https://github.com/sansui-orz/nmsz')
            }
        },
        {
            label: '显示/隐藏(⌘+T)',
            click: function () {
                eventBus.$emit('tray-control-toggle-hidden', {})
            }
        },
        {
            label: '设置',
            click: function () {
                showMainWindow()
            }
        },
        {
            label: '退出',
            click: function () {
                app.quit()
            }
        }
        ]
        const contextMenu = Menu.buildFromTemplate(trayMenuTemplate)
        appTray.setContextMenu(contextMenu)
        // appTray.on('click', (event, bounds, position) => {
        //     // eventBus.$emit('tray-click', { event, bounds, position })
        //     showMainWindow()
        // })
        return appTray
    },
    // initialTray() {
    //     const trayIconPath = __static + '/images/logo_32.png'
    //     const appTray = new Tray(trayIconPath)

    //     const contextMenu = Menu.buildFromTemplate([
    //         {
    //             label: '显示主界面',
    //             click() {
    //                 global.mainWindow.show()
    //             }
    //         },
    //         {
    //             label: '退出',
    //             click() {
    //                 app.quit()
    //             }
    //         }
    //     ])
    //     appTray.setToolTip('Player')
    //     appTray.setContextMenu(contextMenu)
    //     appTray.on('click', () => {
    //         console.log('点击了tray')
    //         // const isVisible = global.mainWindow.isVisible()
    //         // if (isVisible) {
    //         //     global.mainWindow.hide()
    //         // } else {
    //         //     global.mainWindow.show()
    //         // }
    //     })
    //     return appTray
    // },
    setTray(img, width, height) {
        const Image = nativeImage.createFromDataURL(img).resize({
            width,
            height
        })
        this.tray.setImage(Image)
    }
}