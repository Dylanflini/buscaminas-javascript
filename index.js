// const getRandomNumber = max => Math.round(Math.random() * max)
const getRandomNumber = max => Math.floor(Math.random() * max)

const getArrayBombs = (bombs, columns, rows) => {
  const arrayBombs = []

  while (arrayBombs.length < bombs) {
    const newCord = {
      x: getRandomNumber(columns),
      y: getRandomNumber(rows)
    }

    if (
      !arrayBombs.some(cord => cord.x === newCord.x && cord.y === newCord.y)
    ) {
      arrayBombs.push(newCord)
    }
  }

  return arrayBombs
}

const getUUID = () =>
  (crypto?.randomUUID && crypto.randomUUID()) ||
  Math.floor(Math.random * 10000).toString()

class Cell {
  markedAsBomb = false
  bombsAround = null

  constructor (x, y, hasBomb) {
    this.id = getUUID()
    this.x = x
    this.y = y
    this.hasBomb = hasBomb
  }

  markAsBomb () {
    this.markedAsBomb = true
  }

  expose (cells) {
    if (this.hasBomb || this.bombsAround) {
      return
    }

    const cellsAround = getCellsAround(cells, this.x, this.y)

    this.bombsAround = getBombsAround(cellsAround)

    // ui
    const element = document.getElementById(this.id)
    element.textContent = this.bombsAround !== 0 ? this.bombsAround : ''
    element.disabled = true
    // ui

    if (this.bombsAround === 0) {
      for (let i = 0; i < cellsAround.length; i++) {
        cellsAround[i].expose(
          cells.filter(cell => cell.id !== this.id && cell.bombsAround !== 0)
        )
      }

      cellsAround.forEach(cell => {
        return cell.expose(
          cells.filter(cell => cell.id !== this.id && cell.bombsAround !== 0)
        )
      })
    }

    return null
  }

  // set isBomb (is) {
  //   console.log('saludos')
  // }
}

const getCells = (columns, rows, bombs) => {
  const totalCells = []

  const arrayBombs = getArrayBombs(bombs, columns, rows)

  for (let i = 0; i < rows; i++) {
    const rowsCells = []
    for (let j = 0; j < columns; j++) {
      const hasBomb = arrayBombs.some(cord => cord.x === j && cord.y === i)

      rowsCells.push(new Cell(j, i, hasBomb, i + j))
    }
    totalCells.push(rowsCells)
  }

  return totalCells
}

export { getCells }

// const getArrayBombs = (bombs, columns, rows, arrayBombs = []) => {
//   if (arrayBombs.length >= bombs) {
//     return arrayBombs
//   }

//   const newCord = {
//     x: getRandomNumber(columns),
//     y: getRandomNumber(rows)
//   }

//   if (!arrayBombs.some(cord => cord.x === newCord.x && cord.y === newCord.y)) {
//     arrayBombs.push(newCord)
//   }

//   return getArrayBombs(bombs, columns, rows, arrayBombs)
// }

const getCellsAround = (cells, x, y) =>
  cells
    .flat()
    .filter(
      cell =>
        cell.x >= x - 1 &&
        cell.x <= x + 1 &&
        cell.y >= y - 1 &&
        cell.y <= y + 1 &&
        (cell.x !== x || cell.y !== y)
    )
const getBombsAround = cellsAround =>
  cellsAround.filter(cell => cell.hasBomb).length

const getCellsWithBombsAround = (cells, x, y) =>
  cells
    .flat()
    .filter(
      cell =>
        cell.hasBomb &&
        cell.x >= x - 1 &&
        cell.x <= x + 1 &&
        cell.y >= y - 1 &&
        cell.y <= y + 1 &&
        (cell.x !== x || cell.y !== y)
    )
