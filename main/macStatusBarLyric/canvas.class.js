import { createCanvas, loadImage } from 'canvas'

export default class Canvas {
    canvas = null
    ctx = null
    devicePixelRatio
    w
    h

    constructor({width = 35, height = 22, devicePixelRatio = 1}) {
        this.w = width
        this.h = height
        this.devicePixelRatio = devicePixelRatio
        // this.canvas = document.createElement('canvas')
        // this.canvas.width = this.w * this.devicePixelRatio
        // this.canvas.height = this.h * this.devicePixelRatio
        this.canvas = createCanvas(this.w * this.devicePixelRatio, this.h * this.devicePixelRatio)
        this.ctx = this.canvas.getContext('2d')
    }

    async getImage(path) {
        return new Promise((resolve, reject) => {
            loadImage(path).then(image => {
                resolve(image)
            }).catch(err => {
                reject(err)
            })
        })
    }
}