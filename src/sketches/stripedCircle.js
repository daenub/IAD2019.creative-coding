import p5 from "p5"

export const easeInQuad = pos => Math.pow(pos, 2)
export const easeOutQuad = pos => -(Math.pow(pos - 1, 2) - 1)

const circleRadius = 200
const numOfCircleStripes = 20
let xOrigin = 0
let yOrigin = 0

const sketch = p => {
  let canvas

  p.setup = () => {
    canvas = p.createCanvas(p.windowWidth, p.windowHeight)
    p.background("#fae3a2")
    p.noLoop()

    xOrigin = p.width / 2
    yOrigin = p.height / 2
  }

  p.draw = () => {
    p.stroke("#000000")
    p.translate(xOrigin, yOrigin)
    p.rotate(p.HALF_PI)

    // for (let i = 0; i < numOfCircleStripes; i++) {
    //   let y = circleRadius / numOfCircleStripes * i
    //   p.line(0, y, circleRadius, y)
    // }

    let step = p.PI / numOfCircleStripes

    for (let i = 0; i < numOfCircleStripes; i++) {
      let x = p.cos(i * step) * circleRadius
      let y = p.sin(i * step) * circleRadius

      p.line(x, y, x, -y)
    }
  }

  // p.mouseMoved = () => {

  // }

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight)
    p.background("#fae3a2")

    xOrigin = p.width / 2 - circleRadius / 2
    yOrigin = p.height / 2 - circleRadius / 2

    p.draw()
  }

  // p.keyPressed = () => {
  // }
}

export default wrapper => new p5(sketch, wrapper)
