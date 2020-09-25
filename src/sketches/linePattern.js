import p5 from "p5"

export const easeInQuad = pos => Math.pow(pos, 2)
export const easeOutQuad = pos => -(Math.pow(pos - 1, 2) - 1)

const sketch = p => {
  let canvas
  const maxNumOfLines = 400
  let rotation = 0
  let rotationStep = 360 / maxNumOfLines

  let xOff = 0.0
  const xOffStep = 0.005
  let xOffDirection = 1

  let xOffStart = 0
  let yOffStart = 0

  let maxLineLength

  p.setup = () => {
    canvas = p.createCanvas(p.windowWidth, p.windowHeight)
    p.background("#ffffff")
    maxLineLength = Math.min(p.width * .75, p.height * .75) - 50

    p.angleMode(p.DEGREES)
    p.colorMode(p.HSB)
  }

  p.draw = () => {
    p.background("#ffffff")
    p.translate(p.width / 2, p.height / 2)
    p.stroke("#000")

    const h = p.map(p.mouseX, 0, p.width, 0, 100)
    const b = p.map(p.mouseY, 0, p.height, 0, 100)
    p.stroke(h, 50, b)

    xOffStart += 0.01
    yOffStart += 0.01

    for (var i = 0; i < maxNumOfLines; i++) {
      xOff += xOffStep * xOffDirection
      p.push()
      p.rotate(rotation)
      p.line(0, 0, 0, p.noise(xOffStart + xOff, yOffStart) * maxLineLength)


      p.pop()

      rotation += rotationStep

      if (i === Math.floor(maxNumOfLines / 2)) {
        xOffDirection = xOffDirection * -1
      }
    }

    rotation = 0
    xOff = 0
    xOffDirection = 1
  }

  // p.mouseMoved = () => {

  // }

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight)
    maxLineLength = Math.min(p.width * .75, p.height * .75) - 50
  }

  // p.keyPressed = () => {
  // }
}

export default wrapper => new p5(sketch, wrapper)
