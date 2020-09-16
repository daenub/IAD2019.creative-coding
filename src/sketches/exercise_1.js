import p5 from "p5"

export const easeInQuad = pos => Math.pow(pos, 2)
export const easeOutQuad = pos => -(Math.pow(pos - 1, 2) - 1)

const sketch = p => {
  let canvas
  const gap = 20
  const numOfStrokes = 12

  p.setup = () => {
    canvas = p.createCanvas(p.windowWidth, p.windowHeight)
    p.background("#ffffff")
    p.noLoop()
  }

  p.draw = () => {
    const strokeWidth = p.width / numOfStrokes - gap
    const strokeSpace = p.width / numOfStrokes
    let h = Math.random() * 100
    let s = Math.random() * 100
    let b

    for (let i = numOfStrokes - 1; i >= 0; i--) {
      if (i < numOfStrokes / 2) {
        b = easeInQuad(p.map(i, numOfStrokes - 1, 0, 0, 1)) * 100
        p.fill(h, s, b)
        p.rect(
          i * strokeSpace,
          0,
          easeInQuad(p.map(i, numOfStrokes - 1, 0, 0, 1)) * strokeWidth,
          p.height
        )
      } else {
        b = easeInQuad(p.map(i, 0, numOfStrokes - 1, 0, 1)) * 100
        p.fill(h, s, b)
        p.rect(
          i * strokeSpace,
          0,
          easeInQuad(p.map(i, 0, numOfStrokes - 1, 0, 1)) * strokeWidth,
          p.height
        )
      }
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
