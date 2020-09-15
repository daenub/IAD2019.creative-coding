import p5 from "p5"

export const easeInQuad = pos => Math.pow(pos, 2)
export const easeOutQuad = pos => -(Math.pow(pos - 1, 2) - 1)

const sketch = p => {
  let canvas
  let wrapperLength
  let diameter
  let circleSpace
  let minX
  let maxX
  let squareMouseX
  let squareMouseY

  let stripedCircles = []

  const relCoordX = x => (p.width / 2) - (wrapperLength / 2) + x
  const relCoordY = y => (p.height / 2) - (wrapperLength / 2) + y

  const setSizes = () => {
    wrapperLength = Math.min(p.width, p.height) - 100
    circleSpace = wrapperLength / 5.5
    diameter = circleSpace * 1.2
    minX = relCoordX(-circleSpace * 2.1)
    maxX = relCoordX(circleSpace * 0.6)

  }

  p.setup = () => {
    canvas = p.createCanvas(p.windowWidth, p.windowHeight)
    setSizes()
    // p.noLoop()
    stripedCircles.push(new StripedCirlce({x: 20, y: 20, diameter, p}))
  }

  p.draw = () => {
    p.background("#222733")

    // square
    p.noFill()
    p.stroke("#EDB363")
    p.strokeWeight(5)
    p.square(relCoordX(0), relCoordY(0), wrapperLength)

    // text label
    p.fill("#EDB363")
    p.noStroke()
    p.textSize(60)
    p.textAlign(p.LEFT, p.TOP)
    p.text("nada surf", relCoordX(25), relCoordY(25))

    p.noFill()
    p.stroke("#EDB363")
    p.strokeWeight(2)

    for (var x = 0; x < 8; x++) {
      for (var y = 2; y > 0; y--) {
        const xOffset = y === 2 ? p.map(p.mouseX, 0, p.width, minX, maxX) : p.map(p.mouseX, 0, p.width, maxX, minX)
        p.circle(xOffset + (x * circleSpace), relCoordY(wrapperLength - (diameter / 2) - (diameter * (y - 1)) - 10 * y), diameter)
      }
    }

    p.fill("#222733")
    p.noStroke()
    // left mask
    p.rect(0, 0, p.width / 2 - wrapperLength / 2 - 2, p.height)
    // right mask
    p.rect(p.width / 2 + wrapperLength / 2 + 2, 0, p.width / 2 - wrapperLength / 2 - 2, p.height)

    p.stroke("#EDB363")
    p.strokeWeight(2)
    for (var i = 0; i < 16; i++) {
      const y = (diameter / 16) * i
      p.line(0, y, diameter, y)
    }

    stripedCircles.forEach(c => c.draw())
  }

  p.mouseMoved = () => {

  }

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight)
    setSizes()
  }

  // p.keyPressed = () => {
  // }
}


class StripedCirlce {
  constructor({x, y, diameter, p}) {
    this.p = p
    this.x = x
    this.y = y
    this.diameter = diameter
  }

  draw() {
    const {p, x, y, diameter} = this
    p.stroke("#EDB363")
    p.strokeWeight(2)
    p.circle(x + this.diameter / 2, y + this.diameter / 2, this.diameter)

    p.fill("red")
    p.beginShape()
    p.vertex(x, y)
    p.bezierVertex(x, y + diameter / 2, x, y, x + diameter / 2, y)
    p.vertex(x + diameter / 2, y)
    p.endShape(p.CLOSE)
  }
}

export default (wrapper) => new p5(sketch, wrapper)
