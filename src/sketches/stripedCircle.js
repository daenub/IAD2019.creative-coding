import p5 from "p5"

export const easeInQuad = pos => Math.pow(pos, 2)
export const easeOutQuad = pos => -(Math.pow(pos - 1, 2) - 1)

const circleRadius = 200
const numOfCircleStripes = 10
let xOrigin = 0
let yOrigin = 0

const sketch = p => {
  let canvas

  p.setup = () => {
    canvas = p.createCanvas(p.windowWidth, p.windowHeight)
    p.background("#7a793c")
    p.noLoop()

    xOrigin = p.width / 2 - circleRadius / 2
    yOrigin = p.height / 2 - circleRadius / 2
  }

  p.draw = () => {
    p.stroke("#000000")
    p.translate(xOrigin, yOrigin)

    for (let i = 0; i < numOfCircleStripes; i++) {
      let y = circleRadius / numOfCircleStripes * i
      p.line(0, y, circleRadius, y)
    }
  }

  // p.mouseMoved = () => {

  // }

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight)
  }

  // p.keyPressed = () => {
  // }
}

export default wrapper => new p5(sketch, wrapper)
