import p5 from "p5"

import "../lib/p5.gui"

const easeInQuad = pos => Math.pow(pos, 2)
const easeOutQuad = pos => -(Math.pow(pos - 1, 2) - 1)

const radiusBase = 50

let numOfCircles = 0
let maxRadius = 0
let circles = []

let noiseMax = 1000

const inputModeOverlayColor = "#23232399"

const lineColorWarm = "#fae3a2aa"
const lineColorCold = "#ffffff"

const backgroundColorCold = "#75D5FD"
const backgroundColorWarm = "#B76CFD"
const lineColorFromCold = "#FF2281"
const lineColorFromWarm = "#011FFD"

const lineColorToCold = "#FFAF22"
const lineColorToWarm = "#01DFFD"

let ox, oy
let zOff = 0
let strokeXOff = 0

let inputMode = false
let inputElement = null

let cityName = null
// not in use at the moment
let windDir = null

const params = {
  windSpeed: 0,
  windSpeedMin: 0,
  windSpeedMax: 100,
  temperature: 20,
  temperatureMin: 0,
  temperatureMax: 40,
}

/* Fonts */
let fontThin,
  fontBold

const sketch = p => {
  window.p5 = p

  let canvas

  p.setup = function() {
    canvas = p.createCanvas(p.windowWidth, p.windowHeight)
    let gui = p.createGui(this)
    gui.addObject(params)

    createInputElement()

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
  }

  p.draw = () => {
    const {windSpeed, windSpeedMin, windSpeedMax, temperature, temperatureMin, temperatureMax} = params
    const lineColorFrom = p.lerpColor(p.color(lineColorFromCold), p.color(lineColorFromWarm), p.map(temperature, temperatureMin, temperatureMax, 0, 1))
    const lineColorTo = p.lerpColor(p.color(lineColorToCold), p.color(lineColorToWarm), p.map(temperature, temperatureMin, temperatureMax, 0, 1))
    const backgroundColor = p.lerpColor(p.color(backgroundColorCold), p.color(backgroundColorWarm), p.map(temperature, temperatureMin, temperatureMax, 0, 1))


    p.background(backgroundColor)

    noiseMax = p.map(windSpeed, windSpeedMin, windSpeedMax, 5, 50)

    p.strokeWeight(0)
    p.fill(lineColorFrom)
    p.textFont(fontBold)
    p.textSize(40)
    p.text(cityName || "Click to search for a city", 20, p.height - 20)

    if (cityName !== null) {
      p.textFont(fontThin)
      p.textSize(40)
      p.text(`${windSpeed} km/h`, 20, p.height - 20 - 50)
      p.text(`${temperature}°C`, 20, p.height - 20 - 50 - 50)
    }

    p.translate(ox, oy)

    p.noFill()
    circles.forEach(([normalizedRadius, alpha], i) => {
      const strokeMax = p.map(temperature, temperatureMin, temperatureMax, 2, 12)
      p.strokeWeight(p.map(p.noise(strokeXOff), 0, 1, 2, strokeMax))

      const cirlceRadiusBase = p.map(easeInQuad(normalizedRadius), 0, 1, radiusBase, maxRadius)
      const nextCircleRadiusBase = p.map(easeInQuad(normalizedRadius + 1 / numOfCircles), 0, 1, radiusBase, maxRadius)

      let c = p.color(p.lerpColor(lineColorFrom, lineColorTo, p.noise(strokeXOff + i / 20)))

      // Opacity as a depth effect:
      // c.setAlpha(p.map(easeInQuad(normalizedRadius), 0, 1, 0, 255))

      // Noise opacity:
      // c.setAlpha(p.map(p.noise(strokeXOff), 0, 1, 127, 255))

      p.stroke(c)

      p.beginShape()
      for (let angle = 0; angle < p.TWO_PI; angle += 0.10) {
        let xOff = p.map(p.cos(angle), -1, 1, 0, noiseMax)
        let yOff = p.map(p.sin(angle), -1, 1, 0, noiseMax)

        let radius = p.map(p.noise(xOff, yOff, zOff + i / 10), 0, 1, cirlceRadiusBase, nextCircleRadiusBase * p.map(windSpeed, windSpeedMin, windSpeedMax, 1.125, 1.5))

        let x = radius * p.cos(angle)
        let y = radius * p.sin(angle)

        p.curveVertex(x, y)
      }
      p.endShape(p.CLOSE)
    })

    circles = circles.map(([radius, ...circle], i) => {
      const easeWindSpeed = easeOutQuad(p.map(windSpeed, windSpeedMin, windSpeedMax, 0, 1))
      const nextRadius = radius >= 1 ? 0 : radius + p.map(easeWindSpeed, 0, 1, 0.0003, 0.01)
      return [nextRadius, ...circle]
    })

    zOff += p.map(windSpeed, windSpeedMin, windSpeedMax, 0.001, 0.03)
    strokeXOff += p.map(windSpeed, windSpeedMin, windSpeedMax, 0.001, 0.01)

    if (inputMode) {
      p.background(inputModeOverlayColor)
    }
  }

  p.mouseClicked = (e) => {
    if (e.target.closest(".qs_main") === null) {
      toggleInputFieldVisibility()
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
  inputElement.classList.toggle("hide", !inputMode)
  inputElement.placeholder = "City"

  document.body.appendChild(inputElement)

  if (inputMode) {
    inputElement.focus()
  }

  inputElement.addEventListener("click", e => {
    e.stopPropagation()
  })

  inputElement.addEventListener("keyup", e => {
    if (e.keyCode === 13 && inputElement.value !== "") {
      fetchWeatherData(inputElement.value)
    } else if (e.keyCode === 27) {
      toggleInputFieldVisibility()
    }
  })
}

function toggleInputFieldVisibility() {
  inputMode = !inputMode
  inputElement.classList.toggle("hide", !inputMode)

  if (inputMode) {
    inputElement.focus()
  }
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
        params.temperature = data.current.temperature

        toggleInputFieldVisibility()
      } else {
        throw new Error(`${data.error.code} – ${data.error.info} – ${data.error.type}`)
      }
    })
    .catch(err => {
      loadingEnd()
      inputError()
    })
}

const loadingStart = () => {inputElement.classList.add("loading"); inputElement.disabled = true}
const loadingEnd = () => {inputElement.classList.remove("loading"); inputElement.disabled = false}
const inputError = () => inputElement.classList.add("error")
const inputErrorReset = () => inputElement.classList.remove("error")
