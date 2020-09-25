import p5 from "p5"

export const easeInQuad = pos => Math.pow(pos, 2)
export const easeOutQuad = pos => -(Math.pow(pos - 1, 2) - 1)

let yoff = 0

let ca, cb
let ox, oy

const sketch = p => {
  let canvas

  p.setup = () => {
    canvas = p.createCanvas(p.windowWidth, p.windowHeight)
    p.angleMode(p.DEGREES)

    ca = p.color("#0CCBCF")
    cb = p.color("#FE68B5")

    ox = p.width / 2
    oy = p.height / 2

    p.noFill()
    p.background("#E7ECF2")
  }

  p.draw = () => {
    p.background("#E7ECF2")
    p.translate(ox, oy)

    let max = p.width > p.height ? p.width / 8 : p.height / 8

    for (let i = 0; i < 90; i++) {
      p.stroke(p.lerpColor(ca, cb, p.noise((i + 1) / 100, yoff)))
      p.strokeWeight(p.noise((i + 1) / 100) * 5, yoff)

      p.beginShape()

      for (let j = 0; j < 360; j++) {
        const x = p.sin(j) * max
        const y = p.cos(j) * max

        p.vertex(x, y + (p.noise((j + 1) / 75, yoff) * 500))
      }

      p.endShape(p.CLOSE)
      max += p.noise((i + 1) / 75, yoff) * 25
    }
    yoff += 0.0075
  }

  // p.mouseMoved = () => {

  // }

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight)
    ox = p.width / 2
    oy = p.height / 2
  }

  // p.keyPressed = () => {
  // }
}

export default wrapper => new p5(sketch, wrapper)
