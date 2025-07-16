import Lyric from './lyrics.class.js'
import Canvas from './canvas.class.js'
import eventBus from '../utils/eventBus.js'

export default async function initMacStatusbarLyric() {
    try {
        const lyric = new Lyric()
        const width = lyric.canvas.width // + control.canvas.width
        const height = lyric.canvas.height
        const devicePixelRatio = lyric.devicePixelRatio
        const combine = new Canvas({ width, height })
        let hidden = false
        
        const updateTray = async () => {
            combine.ctx.clearRect(0, 0, width, height)
            combine.ctx.drawImage(lyric.canvas, 0, 0)
            // combine.ctx.drawImage(control.canvas, lyric.canvas.width, 0)
            global.Tray.setTray(combine.canvas.toDataURL(), width / devicePixelRatio, height / devicePixelRatio)
        }
        
        const changeHidden = async () => {
        }

        setTimeout(updateTray)

        eventBus.$on('tray-control-lyrics', (arg) => {
            lyric.updateLyric(arg)
        })
        eventBus.$on('tray-control-toggle-hidden', (arg) => {
            hidden = !hidden
            lyric.hidden = hidden
            lyric.updateLyric()
            updateTray()
        })

        eventBus.$on('lyric-draw', () => {
            updateTray()
        })
        eventBus.$on('control-draw', () => {
            updateTray()
        })
    } catch (e) {
        console.error('error', e)
    }
}