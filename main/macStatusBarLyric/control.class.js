import { nativeImage } from 'electron'
import Canvas from './canvas.class.js'
// import eventBus from './eventBus'

export default class Control extends Canvas {
    imageList = []
    singleWidth

    constructor(imageList, singleWidth = 22) {
        super({width: singleWidth * imageList.length, devicePixelRatio: 2})
        this.ctx.textBaseline = 'middle'
        this.singleWidth = singleWidth
        this.imageList = imageList
    }

    async draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        await this.drawImage(0, this.imageList[0])
        // document.body.appendChild(this.canvas)
    }

    async drawImage(index, path) {
        const img = await this.getImage(path)
        this.ctx.drawImage(img, this.singleWidth * index * this.devicePixelRatio, this.canvas.height / 2 - 22) // 22 是图片的高度的一半
    }

    updateImage(index, image) {
        this.imageList[index] = image
    }
}