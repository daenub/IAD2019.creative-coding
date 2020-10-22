import p5 from "p5"
import "../lib/p5.gui.js"

const easeInQuad = pos => Math.pow(pos, 2)

const radiusBase = 50

let numOfCircles = 0
let maxRadius = 0
let circles = []

let noiseMax = 1000

const backgroundColor = "#232323"
const backgroundColorAlpha = "#23232333"
const lineColor = "#fae3a2aa"

let ox, oy
let zOff = 0

let inputMode = false
let inputElement = null

let cityName = null
let windDir = null

const params = {
  windSpeed: 20,
  windSpeedMax: 100,
  windSpeedMin: 0,
}

/* Fonts */
let fontThin,
  fontBold

const sketch = p => {
  let canvas
  createInputElement()

  p.setup = function() {
    canvas = p.createCanvas(p.windowWidth, p.windowHeight)
    let gui = p.createGui(this)
    gui.addObject(params)

    fontThin = p.loadFont(require("../fonts/Raleway-Thin.ttf"))
    fontBold = p.loadFont(require("../fonts/Raleway-Bold.ttf"))

    ox = p.width / 2
    oy = p.height / 2

    maxRadius = Math.max(p.width, p.height)
    numOfCircles = Math.ceil(maxRadius / radiusBase)

    for (let i = 0; i < numOfCircles; i++) {
      const radius = p.map(i, 0, numOfCircles, 0, 1)
      const alpha = p.map(i, 0, numOfCircles - 1, 0, 255)
      circles[i] = [radius, alpha]
    }
    p.background(backgroundColor)
  }

  p.draw = () => {
    const {windSpeed} = params
    p.background(backgroundColor)
    p.translate(ox, oy)

    noiseMax = p.map(windSpeed, 0, 100, 10, 1000)

    p.strokeWeight(0)
    p.fill(lineColor)
    p.textFont(fontBold)
    p.textSize(40)
    p.textAlign(p.CENTER)
    p.text(cityName || "Click to search for a city", 0, 0)

    if (cityName !== null) {
      p.textFont(fontThin)
      p.textSize(40)
      p.text(`${windSpeed} km/h`, 0, 40)
    }

    p.noFill()
    circles.forEach(([normalizedRadius, alpha], i) => {
      p.strokeWeight(p.map(easeInQuad(normalizedRadius), 0, 1, 2, 10))

      const cirlceRadiusBase = p.map(easeInQuad(normalizedRadius), 0, 1, radiusBase, maxRadius)
      const nextCircleRadiusBase = p.map(easeInQuad(normalizedRadius + 1 / numOfCircles), 0, 1, radiusBase, maxRadius)

      let c = p.color(lineColor)
      c.setAlpha(p.map(easeInQuad(normalizedRadius), 0, 1, 0, 255))
      p.stroke(c)

      p.beginShape()
      for (let angle = 0; angle < p.TWO_PI; angle += 0.08) {
        let xOff = p.map(p.cos(angle), -1, 1, 0, noiseMax)
        let yOff = p.map(p.sin(angle), -1, 1, 0, noiseMax)

        let radius = p.map(p.noise(xOff, yOff, zOff), 0, 1, cirlceRadiusBase, nextCircleRadiusBase * p.map(windSpeed, 0, 100, 1.125, 1.5))

        let x = radius * p.cos(angle)
        let y = radius * p.sin(angle)

        p.vertex(x, y)
      }
      p.endShape(p.CLOSE)
    })

    circles = circles.map(([radius, ...circle], i) => {
      const nextRadius = radius >= 1 ? 0 : radius + p.map(windSpeed, 0, 100, 0.0003, 0.007)
      return [nextRadius, ...circle]
    })

    zOff += p.map(windSpeed, 0, 100, 0.001, 0.03)
  }

  p.mouseClicked = (e) => {
    if (e.target.closest(".qs_main") === null) {
      inputMode = !inputMode
      updateInputFieldVisibility()
    }
  }

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight)
    ox = p.width / 2
    oy = p.height / 2
  }
}

export default wrapper => new p5(sketch, wrapper)


function createInputElement() {
  inputElement = document.createElement("input")
  inputElement.type = "text"
  inputElement.className = "text-input"
  updateInputFieldVisibility()

  document.body.appendChild(inputElement)

  inputElement.addEventListener("click", e => {
    e.stopPropagation()
  })

  inputElement.addEventListener("keyup", e => {
    if (e.keyCode === 13 && inputElement.value !== "") {
      fetchWeatherData(inputElement.value)
    } else if (e.keyCode === 27) {
      inputMode = !inputMode
      updateInputFieldVisibility()
    }
  })
}

function updateInputFieldVisibility() {
  inputElement.classList.toggle("hide", !inputMode)
}

function fetchWeatherData(q) {
  loadingStart()
  inputErrorReset()

  const encodedQuery = encodeURIComponent(q)

  fetch(`http://api.weatherstack.com/current?access_key=8627ee47b0f19b9f9c8d034ce14bc64c&query=${encodedQuery}`)
    .then(res => res.json())
    .then(data => {
      loadingEnd()

      // API response only contains success property if an error has occured
      if (data.success !== false) {
        cityName = data.location.name
        params.windSpeed = data.current.wind_speed
        windDir = data.current.wind_degree

        inputMode = !inputMode
        updateInputFieldVisibility()
      } else {
        throw new Error(`${data.error.code} – ${data.error.info} – ${data.error.type}`)
      }
    })
    .catch(err => {
      console.log("Error", err)
      loadingEnd()
      inputError()
    })
}

const loadingStart = () => {inputElement.classList.add("loading"); inputElement.disabled = true}
const loadingEnd = () => {inputElement.classList.remove("loading"); inputElement.disabled = false}
const inputError = () => inputElement.classList.add("error")
const inputErrorReset = () => inputElement.classList.remove("error")

