import p5 from "p5"

export const easeInQuad = pos => Math.pow(pos, 2)
export const easeOutQuad = pos => -(Math.pow(pos - 1, 2) - 1)

let speed = 0.02
let radius = 120
let angle = 0

const sketch = p => {
  let canvas

  p.setup = () => {
    canvas = p.createCanvas(p.windowWidth, p.windowHeight)
  }

  p.draw = () => {
    let x = radius * p.cos(angle)
    let y = radius * p.sin(angle)

    p.translate(p.width / 2, p.height / 2);
    p.rect(x, y, 50, 10);

    angle += speed;
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
