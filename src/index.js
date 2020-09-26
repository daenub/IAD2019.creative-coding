import "./scss/index.scss"
import exercise_1 from "./sketches/exercise_1"
import vera_molnar from "./sketches/vera_molnar"
import nadaSurf from "./sketches/nada_surf"
import linePattern from "./sketches/linePattern"
import waves from "./sketches/waves"
import stripedCircle from "./sketches/stripedCircle"
import trigo from "./sketches/trigo"
import perlinLoop from "./sketches/perlinLoop"

const $ = s => document.querySelector(s)

const sketches = [
  ["Übung 1", exercise_1],
  ["Vera Molnar", vera_molnar],
  ["Nada Surf", nadaSurf],
  ["Line pattern", linePattern],
  ["Waves", waves],
  ["Striped circle", stripedCircle],
  ["Trigo", trigo],
  ["Perlin loop", perlinLoop]
]

const sketchClose = $("[data-sketch-close]")
const sketchWrapper = $("[data-sketch-wrapper]")
const sketchList = $("[data-sketch-list]")
let activeSketch = null

sketchClose.addEventListener("click", e => {
  e.preventDefault()
  document.body.classList.remove("active-sketch")
  activeSketch.remove()
  activeSketch = null
})

const openExercise = sketch => {
  document.body.classList.add("active-sketch")
  activeSketch = sketch(sketchWrapper)
}

const sketchListFrag = document.createDocumentFragment()

sketches.forEach(([label, sketch]) => {
  const listItem = document.createElement("li")
  listItem.classList.add("sketch-list__item")

  const button = document.createElement("button")
  button.classList.add("sketch-list__button")

  button.textContent = label
  button.addEventListener("click", e => {
    e.preventDefault()
    openExercise(sketch)
  })

  listItem.appendChild(button)
  sketchListFrag.appendChild(listItem)
})

sketchList.appendChild(sketchListFrag)

/* Dev Mode */
// openExercise(perlinLoop)
