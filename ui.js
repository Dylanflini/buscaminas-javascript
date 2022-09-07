import { getCells } from './index.js'

const root = document.getElementById('root')
const remainingBombs = document.getElementById('numbers-bombs')
const restartButton = document.getElementById('restart')
const timer = document.getElementById('timer')

// const CELLS_CONTAINER_ID = 'cells-container'

let intervalo

function setTimer () {
  if (!intervalo) {
    let seconds = 0
    intervalo = setInterval(() => {
      seconds++
      timer.textContent = seconds.toString()
    }, 1000)
  }
}

const bombs = 2
const columns = 4
const rows = 4

root.style.setProperty('--columns', columns.toString())

const initialData = {
  // bombs: 12,
  remainingBombs: bombs
  // columns: 10,
  // rows: 10,
  // time: 0
}

const viewData = new Proxy(initialData, {
  set: (obj, prop, value) => {
    obj[prop] = value
    console.log({ obj })
    console.log({ prop })
    console.log({ value })

    switch (prop) {
      case 'remainingBombs':
        if (value <= 0) {
          console.log('game over')
        }
      // if (value >= 0) {
      //   remainingBombs.textContent = value
        return true
      // }
    }

    return false
  }
})

// class Game {
//   cells = []
//   constructor () {}

//   initGame () {
//     restartButton.textContent = `🙂`
//     root.children[0]?.remove()
//     root.appendChild(document.createElement('div'))

//     const cells = getCells(columns, rows, bombs)

//     cells.flat().forEach(cell => {
//       const button = document.createElement('button')
//       button.classList.add('button')
//       button.classList.add('cell')
//       button.dataset.x = cell.x
//       button.dataset.y = cell.y
//       button.id = cell.id
//       root.children[0].appendChild(button)
//     })

//     this.cells = cells
//   }
//   get cells () {
//     return this.cells
//   }
// }

// const game = new Game()

const game = {
  cells: [],
  initGame () {
    timer.textContent = '0'
    clearInterval(intervalo)
    intervalo = null
    remainingBombs.textContent = viewData.remainingBombs.toString()
    restartButton.textContent = `🙂`
    root.children[0]?.remove()
    const cellsContainer = document.createElement('div')
    root.appendChild(cellsContainer)

    const cells = getCells(columns, rows, bombs)

    cells.flat().forEach(cell => {
      const button = document.createElement('button')
      button.classList.add('button')
      button.classList.add('cell')
      button.dataset.x = cell.x
      button.dataset.y = cell.y
      button.id = cell.id
      root.children[0].appendChild(button)
    })

    this.cells = cells
  }
}

const exposeAllBombs = cells => {
  cells
    .filter(cell => cell.hasBomb)
    .forEach(cell => {
      const button = document.getElementById(cell.id)
      button.textContent = `💣'`
      button.disabled = true
    })
}

// acciones

restartButton.onclick = e => {
  console.log('restart')

  game.initGame()
}

root.onclick = e => {
  setTimer()
  console.log('paso por aqui')
  const x = Number(e.target.dataset.x)
  const y = Number(e.target.dataset.y)
  const button = e.target
  const cell = game.cells[y][x]
  
  if (!cell.markedAsBomb) {
    cell.expose(game.cells.flat())
    console.log('paso por aqui2')

    if (cell.hasBomb) {
      button.dataset.hasBomb = true
      button.textContent = `💣'`
      restartButton.textContent = `😵`
      exposeAllBombs(game.cells.flat())

      root.onclick = () => null

      // const container = document.getElementById(CELLS_CONTAINER_ID)
      // const a = container.querySelectorAll('button:not([disabled])')
      // console.log(a)


      clearInterval(intervalo)

      // TODO: desabilitar todos las celdas
    }
  }
}

root.oncontextmenu = e => {
  setTimer()
  e.preventDefault()
  const { x, y } = e.target.dataset
  const cell = game.cells[y][x]

  console.log(cell.bombsAround)

  if (cell.bombsAround === null) {
    cell.markedAsBomb = !cell.markedAsBomb

    viewData.remainingBombs = cell.markedAsBomb
      ? viewData.remainingBombs - 1
      : viewData.remainingBombs + 1

    e.target.dataset.markedAsBomb = cell.markedAsBomb
    e.target.textContent = cell.markedAsBomb && !cell.bombsAround ? `🕵️‍♂️` : ''
  }

  //TODO: mensaje al ganar el juego
}

function gameFinish () {}

game.initGame()
console.log(viewData)
