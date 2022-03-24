'use strict'

console.log('Mine Sweeper!')

// The model
var gBoard
var gLives
// var gHints
// var gHintMode
var gTimerInterval
const MINE = '💣'

// This is an object by which the
// board size is set (in this case:
// 4x4 board and how many mines
// to put)
const gLevel = {
    SIZE: 8,
    MINES: 12,
}

// This is an object in which you
// can keep and update the
// current game state:
// isOn: Boolean, when true we
// let the user play
// shownCount: How many cells
// are shown
// markedCount: How many cells
// are marked (with a flag)
// secsPassed: How many seconds
// passed
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
}

// DONE: This is called when page loads
function initGame() {
    document.addEventListener('contextmenu', (event) => event.preventDefault())
    gLives = 3
    // gHints = 3
    // gHintMode = false
    // document.querySelector('.hints span').innerText = gHints
    document.querySelector('.lives span').innerText = gLives
    document.querySelector('.smiley').innerText = '😃'
    document.querySelector('.timer').innerText = gGame.secsPassed
    buildBoard()
    renderBoard(gBoard)
}

// DONE: Builds the board
// Set mines at random locations
// Call setMinesNegsCount()
// Return the created board
function buildBoard() {
    gBoard = []
    for (var i = 0; i < gLevel.SIZE; i++) {
        gBoard[i] = []
        for (var j = 0; j < gLevel.SIZE; j++) {
            gBoard[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
            }
        }
    }
}

// DONE: Count mines around each cell
// and set the cell's
// minesAroundCount.
function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            if (board[i][j].isMine) {
                addMinesCount({ i, j })
            }
        }
    }
}

//DONE: Render the board as a <table>
// to the page
function renderBoard(board) {
    var elTable = document.querySelector('.board tbody')
    elTable.innerHTML = ''
    for (var i = 0; i < board.length; i++) {
        elTable.innerHTML += `<tr id='row-${i}'></tr>`
        var elRow = elTable.querySelector(`#row-${i}`)
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j]
            var className = cell.isShown ? '' : 'hidden'
            className = cell.isMarked ? 'marked' : className
            var cellContent = cell.isMine ? MINE : cell.minesAroundCount
            // if (!cellContent) cellContent = ''
            elRow.innerHTML += `<td class="${className} content${cellContent}" id="i-${i} j-${j}" onclick="cellClicked(${i},${j})" oncontextmenu="cellMarked(${i},${j})"><span>${cellContent}</span></td>`
        }
    }
}

// DONE: Called when a cell (td) is clicked
function cellClicked(i, j) {
    var cell = gBoard[i][j]
    if (cell.isMarked || cell.isShown) return
    cell.isShown = true
    gGame.shownCount++
    if (gGame.shownCount === 1) {
        gGame.isOn = true
        placeMines(gBoard)
        gTimerInterval = setInterval(startTimer, 1000)
    }
    if (!gGame.isOn) return
    if (!cell.minesAroundCount && !cell.isMine) expandShown(gBoard, { i, j })
    renderBoard(gBoard)
    if (cell.isMine) {
        gLives--
        document.querySelector('.lives span').innerText = gLives
        if (!gLives) gameOver()
    }
    if (checkGameOver()) gameOver()
}

// DONE: Called on right click to mark a
// cell (suspected to be a mine)
// Search the web (and
// implement) how to hide the
// context menu on right click
function cellMarked(i, j) {
    var cell = gBoard[i][j]
    if (cell.isShown) return
    cell.isMarked = !cell.isMarked

    if (cell.isMarked && cell.isMine) gGame.markedCount++
    else if (cell.isMine) gGame.markedCount--
    renderBoard(gBoard)
    if (checkGameOver()) gameOver()
}

// DONE: Game ends when all mines are
// marked, and all the other cells
// are shown
function checkGameOver() {
    return gGame.shownCount + gGame.markedCount === gLevel.SIZE ** 2
}

// DONE: When user clicks a cell with no
// mines around, we need to open
// not only that cell, but also its
// neighbors.
// NOTE: start with a basic
// implementation that only opens
// the non-mine 1st degree
// neighbors
// BONUS: if you have the time
// later, try to work more like the
// real algorithm (see description
// at the Bonuses section below)
function expandShown(board, pos) {
    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            if (i !== -1 && j !== -1 && i !== board.length && j !== board.length) {
                var cell = board[i][j]
                if (!cell.isShown && !cell.isMine && !cell.isMarked) {
                    cell.isShown = true
                    gGame.shownCount++
                    if (!cell.minesAroundCount) expandShown(board, { i, j })
                }
            }
        }
    }
}

function addMinesCount(pos) {
    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            if (i !== -1 && j !== -1 && i !== gBoard.length && j !== gBoard.length && (i !== pos.i || j !== pos.j)) {
                gBoard[i][j].minesAroundCount++
            }
        }
    }
}

function placeMines(board) {
    var randPositions = []
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            if (board[i][j].isShown) continue
            randPositions.push({ i, j })
        }
    }
    for (var i = 0; i < gLevel.MINES; i++) {
        var randIdx = getRandomInt(0, randPositions.length)
        var randPos = randPositions.splice(randIdx, 1)[0]
        board[randPos.i][randPos.j].isMine = true
    }
    setMinesNegsCount(gBoard)
}

function gameOver() {
    gGame.isOn = false
    clearInterval(gTimerInterval)
    var elSmiley = document.querySelector('.smiley')
    if (gLives === 0) {
        elSmiley.innerText = '🤯'
        revealAllMines(gBoard)
        renderBoard(gBoard)
    } else elSmiley.innerText = '😎'
}

function restartGame() {
    clearInterval(gTimerInterval)
    gGame.isOn = false
    gGame.shownCount = 0
    gGame.markedCount = 0
    gGame.secsPassed = 0
    initGame()
}

function revealAllMines(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j]
            if (cell.isMine) cell.isShown = true
        }
    }
}

function startTimer() {
    gGame.secsPassed++
    document.querySelector('.timer').innerText = gGame.secsPassed
}

function setDifficulty(size, mines) {
    gLevel.SIZE = size
    gLevel.MINES = mines
    restartGame()
}

// function getHint(elHint) {
//     gHintMode = !gHintMode
//     if (gHintMode) elHint.innerText = `💡 x ${gHints}`
//     else elHint.innerText = `⚡ x ${gHints}`
// }
