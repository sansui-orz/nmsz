// import { TouchBar, nativeImage } from 'electron'

// const { TouchBarSlider, TouchBarButton } = TouchBar

// export default function initTouchBar(mainWindow) {
//     if (process.platform !== 'darwin') return
//     const touchBar = new TouchBar({
//         items: [
//             new TouchBarButton({
//                 icon: nativeImage
//                     .createFromPath('./static/touch-bar/last.png')
//                     .resize({
//                         width: 18,
//                         height: 18,
//                     }),
//                 click() {
//                     mainWindow.webContents.send('tray-control-last')
//                     console.log('tray-control-last')
//                 },
//             }),
//             new TouchBarButton({
//                 icon: nativeImage
//                     .createFromPath('./static/touch-bar/play.png')
//                     .resize({
//                         width: 18,
//                         height: 18,
//                     }),
//                 click() {
//                     mainWindow.webContents.send('tray-control-pause')
//                     console.log('tray-control-pause')
//                 },
//             }),
//             new TouchBarButton({
//                 icon: nativeImage
//                     .createFromPath('./static/touch-bar/next.png')
//                     .resize({
//                         width: 18,
//                         height: 18,
//                     }),
//                 click() {
//                     mainWindow.webContents.send('tray-control-next')
//                     console.log('tray-control-next')
//                 },
//             }),
//             // new TouchBarSlider({
//             //     label: '音量',
//             //     value: volume,
//             //     minValue: 0,
//             //     maxValue: 100,
//             //     change(val) {
//             //         volume = val
//             //         mainWindow.webContents.send('tray-control-volume', val)
//             //     }
//             // }),
//             new TouchBarSlider({
//                 label: '歌曲进度',
//                 value: 0,
//                 minValue: 0,
//                 maxValue: 100,
//                 change(val) {
//                     mainWindow.webContents.send('tray-control-progress', val)
//                     console.log('tray-control-progress', val)
//                 },
//             }),
//         ],
//     })
//     mainWindow.setTouchBar(touchBar)
//     return touchBar
// }
