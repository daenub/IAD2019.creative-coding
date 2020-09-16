import p5 from "p5"

export const easeInQuad = pos => Math.pow(pos, 2)
export const easeOutQuad = pos => -(Math.pow(pos - 1, 2) - 1)

const backgroundColor = "#222733"
const foregroundColor = "#EDB363"

const stripedCircles = [
  {x: 1, y: 2},
  {x: 5, y: 2},
  {x: 3, y: 1},
]

const isStripedCircle = (x, y) =>
  stripedCircles.find(c => c.x === x && c.y === y) ? true : false

const sketch = p => {
  let canvas
  let wrapperLength
  let diameter
  let circleSpace
  let minX
  let maxX
  let squareMouseX
  let squareMouseY

  const relCoordX = x => p.width / 2 - wrapperLength / 2 + x
  const relCoordY = y => p.height / 2 - wrapperLength / 2 + y

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
  }

  p.draw = () => {
    p.background(backgroundColor)

    // text label
    p.fill(foregroundColor)
    p.noStroke()
    p.textSize(60)
    p.textAlign(p.LEFT, p.TOP)
    p.text("nada surf", relCoordX(25), relCoordY(25))

    // striped circles
    stripedCircles.forEach(({x, y}) => drawStrippedCircle(x, y))

    // emtpy circles
    p.noFill()
    p.stroke(foregroundColor)
    p.strokeWeight(2)

    for (var x = 0; x < 8; x++) {
      for (var y = 2; y > 0; y--) {
        if (!isStripedCircle(x, y)) {
          const xOffset =
            y === 2
              ? p.map(p.mouseX, 0, p.width, minX, maxX)
              : p.map(p.mouseX, 0, p.width, maxX, minX)
          p.circle(
            xOffset + x * circleSpace,
            relCoordY(
              wrapperLength - diameter / 2 - diameter * (y - 1) - 10 * y
            ),
            diameter
          )
        }
      }
    }

    p.fill(backgroundColor)
    p.noStroke()
    // left mask
    p.rect(0, 0, p.width / 2 - wrapperLength / 2 - 2, p.height)
    // right mask
    p.rect(
      p.width / 2 + wrapperLength / 2 + 2,
      0,
      p.width / 2 - wrapperLength / 2 - 2,
      p.height
    )

    // square
    p.noFill()
    p.stroke(foregroundColor)
    p.strokeWeight(5)
    p.square(relCoordX(0), relCoordY(0), wrapperLength)
  }

  p.mouseMoved = () => {}

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight)
    setSizes()
  }

  // p.keyPressed = () => {
  // }

  const drawStrippedCircle = (x, y) => {
    p.push()
    const xOffset =
      y === 2
        ? p.map(p.mouseX, 0, p.width, minX, maxX)
        : p.map(p.mouseX, 0, p.width, maxX, minX)

    const xOrigin = p.width / 2 - wrapperLength / 2 + x
    const yOrigin = p.height / 2 - wrapperLength / 2 + y

    p.translate(
      xOffset + x * circleSpace,
      relCoordY(wrapperLength - diameter / 2 - diameter * (y - 1) - 10 * y)
    )
    p.translate(x - diameter / 2, y - diameter / 2)

    p.stroke(foregroundColor)
    p.strokeWeight(2)
    for (var i = 0; i < 25; i++) {
      const y = (diameter / 25) * i
      p.line(0, y, diameter, y)
    }

    p.stroke(backgroundColor)
    p.strokeWeight(3)
    p.fill(backgroundColor)
    /* left top */
    p.beginShape()
    p.vertex(0, 0)
    p.vertex(0, diameter / 2)
    p.bezierVertex(0, diameter / 2, 0, 0, diameter / 2, 0)
    p.vertex(diameter / 2, 0)
    p.endShape(p.CLOSE)

    /* right top */
    p.translate(diameter, 0)
    p.rotate(p.HALF_PI)
    p.beginShape()
    p.vertex(0, 0)
    p.vertex(0, diameter / 2)
    p.bezierVertex(0, diameter / 2, 0, 0, diameter / 2, 0)
    p.vertex(diameter / 2, 0)
    p.endShape(p.CLOSE)

    /* right bottom */
    p.translate(diameter, 0)
    p.rotate(p.HALF_PI)
    p.beginShape()
    p.vertex(0, 0)
    p.vertex(0, diameter / 2)
    p.bezierVertex(0, diameter / 2, 0, 0, diameter / 2, 0)
    p.vertex(diameter / 2, 0)
    p.endShape(p.CLOSE)

    /* left bottom */
    p.translate(diameter, 0)
    p.rotate(p.HALF_PI)
    p.beginShape()
    p.vertex(0, 0)
    p.vertex(0, diameter / 2)
    p.bezierVertex(0, diameter / 2, 0, 0, diameter / 2, 0)
    p.vertex(diameter / 2, 0)
    p.endShape(p.CLOSE)

    p.pop()
  }
}

// class StripedCircle {
//   constructor({x, y, diameter, p, wrapperLength}) {
//     this.p = p
//     this.x = x
//     this.y = y
//     this.diameter = diameter
//     this.wrapperLength = wrapperLength
//   }
// }

export default wrapper => new p5(sketch, wrapper)
