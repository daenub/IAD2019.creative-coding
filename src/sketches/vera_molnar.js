import p5 from "p5"

export const easeInQuad = pos => Math.pow(pos, 2)
export const easeOutQuad = pos => -(Math.pow(pos - 1, 2) - 1)

const sketch = p => {
  let canvas
  const numOfShapesPerSide = 14
  let shapeSpace
  let shapeSize
  let angle = 0

  p.setup = () => {
    canvas = p.createCanvas(p.windowWidth, p.windowHeight)
    p.background("#ffffff")
    p.noLoop()

    shapeSpace = Math.min(p.width, p.height) / numOfShapesPerSide
    shapeSize = (shapeSpace / 4) * 3

    p.fill("#BE2025")
    p.noStroke()
    p.angleMode(p.DEGREES)
  }

  p.draw = () => {
    p.translate(
      p.width / 2 - (numOfShapesPerSide * shapeSpace) / 2,
      p.height / 2 - (numOfShapesPerSide * shapeSpace) / 2
    )
    for (let x = 0; x < numOfShapesPerSide; x++) {
      for (let y = 0; y < numOfShapesPerSide; y++) {
        if (y < numOfShapesPerSide / 2) {
          p.push()
          p.rotate(1)
        }

        drawShape(x, y)

        if (y < numOfShapesPerSide / 2) {
          p.pop()
        }
      }
    }
  }

  // p.mouseMoved = () => {

  // }

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight)

    shapeSpace = Math.min(p.width, p.height) / numOfShapesPerSide
    shapeSize = (shapeSpace / 4) * 3
  }

  // p.keyPressed = () => {
  // }

  const centerShapeCoord = c => c - shapeSize / 2

  const drawShape = (x, y) => {
    let shapeAngle
    const shapeX = x * shapeSpace
    const shapeY = y * shapeSpace

    const random = Math.random()
    if (random > 0.75) {
      shapeAngle = 0
    } else if (random > 0.5) {
      shapeAngle = 90
    } else if (random > 0.25) {
      shapeAngle = 180
    } else {
      shapeAngle = 270
    }

    p.push()
    p.translate(
      x * shapeSpace + shapeSpace / 2,
      y * shapeSpace + shapeSpace / 2
    )

    p.rotate(shapeAngle)
    p.beginShape()

    p.vertex(centerShapeCoord(0), centerShapeCoord(0))
    p.vertex(centerShapeCoord(0), centerShapeCoord(shapeSize))
    p.vertex(centerShapeCoord(shapeSize / 3), centerShapeCoord(shapeSize))
    p.vertex(centerShapeCoord(shapeSize / 3), centerShapeCoord(shapeSize / 3))
    p.vertex(
      centerShapeCoord((shapeSize * 2) / 3),
      centerShapeCoord(shapeSize / 3)
    )
    p.vertex(centerShapeCoord((shapeSize * 2) / 3), centerShapeCoord(shapeSize))
    p.vertex(centerShapeCoord(shapeSize), centerShapeCoord(shapeSize))
    p.vertex(centerShapeCoord(shapeSize), centerShapeCoord(0))

    p.endShape(p.CLOSE)
    p.pop()
  }
}

export default (wrapper) => new p5(sketch, wrapper)
