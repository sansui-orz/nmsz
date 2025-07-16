import Canvas from './canvas.class.js'
// import { nativeTheme } from 'electron'
import eventBus from '../utils/eventBus.js'
// import remote from '@electron/remote/main/index.js';
// import remote from '@electron/remote'

// const { systemPreferences } = remote
export default class Lyric extends Canvas {
    fontSize = 11
    hidden = false
    lyric = {
        text: 'coming',
        width: 0,
        time: 2000, // 单句歌词的播放时间
        color: '',
        progress: 0
    }
    x = 0 // 移动的距离
    timer = null
    timer2 = null
    timer3 = null
    frame = 24

    constructor() {
        super({ devicePixelRatio: 2 })
        this.ctx.font = `${this.fontSize * this.devicePixelRatio}px "microsoft yahei", sans-serif`
        this.ctx.textBaseline = 'middle'
        this.updateLyric()
    }

    updateLyric(arg = this.lyric) {
        clearInterval(this.timer)
        clearTimeout(this.timer2)
        clearTimeout(this.timer3)
        this.x = 0
        // this.hidden = arg.hidden
        const measureText = this.ctx.measureText(this.hidden ? arg.text.replace(/\d/g, '*') : arg.text)
        this.lyric = {
            text: arg.text,
            width: measureText.width,
            time: arg.time,
            color: arg.color,
            progress: arg.progress
        }
        if (this.lyric.width > this.canvas.width) {
            // 计算移动需要的时间
            const moveTime = (this.lyric.width - this.canvas.width) * 2 / this.frame * 1000
            // 计算第一屏文字占总文字长度的比率
            // const rate = this.canvas.width / this.lyric.width
            // 根据比率计算出第一屏文字静止的时间
            // const staticTime = Math.min(rate * this.lyric.time, 2000)
            // 渲染第一屏文字
            this.draw()
            // 延时move
            this.timer2 = setTimeout(() => {
                // 开始移动
                this.timer = setInterval(() => {
                    this.move()
                    this.draw()
                }, 1000 / this.frame) // 1秒24帧
            }, 3000) // 暂停3秒
            // 取消
            this.tier3 = setTimeout(() => {
                this.updateLyric()
            }, 3000 * 2 + moveTime) // 播放后，重新开始
        } else {
            this.draw()
        }
    }

    move() {
        // 计算文字超出canvas的部分
        const more = this.lyric.width - this.canvas.width
        // 文字右侧没有到canvas右侧
        if (-this.x < more) {
            // 计算超出文字占总文字长度的比率
            // const rate = more / this.lyric.width
            // // 根据比率 计算出超出文字滚动需要的时间
            // const scrollTime = rate * this.lyric.time
            // // 根据时间 计算出每帧需要移动的距离
            // const distance = more / Math.max(this.lyric.time - 2000, scrollTime) * this.frame
            // this.x -= distance * this.devicePixelRatio
            this.x = Math.max(this.x - 0.5, -more)
        } else {
            // clearInterval(this.timer)
        }
    }
    drawProgress(x, y, width, height) {
        // this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
        this.ctx.strokeStyle = this.ctx.fillStyle
        this.ctx.lineWidth = 1
        this.ctx.strokeRect(x, y, width, height)
        this.ctx.fillRect(x, y, width * this.lyric.progress, height)
    }

    draw() {
        let x
        if (this.lyric.width <= this.canvas.width) {
            x = (this.canvas.width - this.lyric.width) / 2 + this.lyric.width
            this.ctx.textAlign = 'right'
        } else {
            x = this.x
            this.ctx.textAlign = 'left'
        }
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        // const isDarkMode = nativeTheme.shouldUseDarkColors;
        this.ctx.fillStyle = this.lyric.color || '#222120' //(isDarkMode ? 'white' : 'black');
        const text = this.hidden ? this.lyric.text.replace(/\d/g, '*') : this.lyric.text
        this.ctx.fillText(text, x, this.canvas.height / 2 - 3)
        this.drawProgress(0, this.canvas.height - 12, this.canvas.width, 6)
        // document.body.appendChild(this.canvas)
        eventBus.$emit('lyric-draw')
    }
}