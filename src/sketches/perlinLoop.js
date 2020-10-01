import p5 from "p5"
import "../lib/p5.gui.js"

export const easeInQuad = pos => Math.pow(pos, 2)
export const easeOutQuad = pos => -(Math.pow(pos - 1, 2) - 1)

// let yoff = 0

const minRadius = 100
let numOfCircles = 10
let radiusSpaceDuration = 0
let maxRadiusSpace = 0

const backgroundColor = "#232323"
const lineColor = "#fae3a2aa"

let noiseMax = 10
let zOff = 0

let ox, oy

const sketch = p => {
  let canvas

  let params = {
    maxRadiusSpace: 300,
    maxRadiusSpaceMax: 400,
    maxRadiusSpaceMin: 40,
    maxRadiusSpaceStep: 5,
  }

  p.setup = function() {
    canvas = p.createCanvas(p.windowWidth, p.windowHeight)
    let gui = p.createGui(this)
    gui.addObject(params)

    ox = p.width / 2
    oy = p.height / 2

    p.noFill()
    p.background(backgroundColor)
  }

  p.draw = () => {
    p.background("#23232311")
    p.translate(ox, oy)

    const {maxRadiusSpace} = params
    // maxRadiusSpace = p.map(p.mouseX, 0, p.width, 40, 400)
    // noiseMax = p.map(p.mouseX, 0, p.width, 50, 1)
    // maxRadiusSpace = p.abs(90 * p.sin(radiusSpaceDuration))

    // maxRadiusSpace = p.map(p.abs(p.sin(radiusSpaceDuration)), 0, 1, 50, 100)

    for (let i = 0; i < numOfCircles; i += 1) {
      let radiusOffset = i * maxRadiusSpace

      let c = p.color(lineColor)
      c.setAlpha(p.map(i, 0, numOfCircles, 255, 50))
      p.stroke(c)
      p.strokeWeight(p.noise(i, zOff) * 5)

      p.beginShape()
      for (let angle = 0; angle < p.TWO_PI; angle += 0.02) {
        let xOff = p.map(p.cos(angle), -1, 1, 0, noiseMax)
        let yOff = p.map(p.sin(angle), -1, 1, 0, noiseMax)

        let radius = p.map(p.noise(xOff, yOff, zOff + i / 10), 0, 1, minRadius + radiusOffset, minRadius + radiusOffset + maxRadiusSpace)

        let x = radius * p.cos(angle)
        let y = radius * p.sin(angle)

        p.vertex(x, y)
      }
      p.endShape(p.CLOSE)
    }

    zOff += 0.01
    // radiusSpaceDuration += 0.01
  }

  // p.mouseMoved = () => {

  // }

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight)
    ox = p.width / 2
    oy = p.height / 2
  }

  p.mouseDown = () => {
    p.save(canvas, 'for_sam.png')
  }
}

export default wrapper => new p5(sketch, wrapper)
