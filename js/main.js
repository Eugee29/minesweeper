'use strict'

console.log('Minesweeper')

const MINE = '💣'
const NORMAL = '😀'
const LOSE = '🤯'
const WIN = '😎'
const LIFE = '❤️'
const HINT = '💡'
const SAFE_CLICK = '🔍'

// The model
var gBoard
var gLives
var gHealthBar
var gTimerInterval
var gAreMinesPlaced

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
    document.querySelector('.best-time span').innerText = localStorage.getItem('bestScore')
    document.querySelector(`.size${gLevel.SIZE}`).classList.toggle('activated')
    gHealthBar = LIFE + LIFE + LIFE
    gameStages = []
    gMinesPlaced = 0
    gSafeClick = 3
    gLives = 3
    gHints = 3
    gAreMinesPlaced = false
    gHintMode = false
    gManualPosMode = false
    gSevenBoomMode = false
    var elHints = document.querySelector('.hints')
    elHints.innerText = HINT + ' x ' + gHints
    elHints.classList.add('disabled')
    var elSafeClicks = document.querySelector('.safe-clicks')
    elSafeClicks.innerText = SAFE_CLICK + ' x ' + gSafeClick
    elSafeClicks.classList.add('disabled')
    document.querySelector('.manual-place').innerText = 'MANUAL POSITION MODE'
    document.querySelector('.lives').innerText = gHealthBar
    document.querySelector('.smiley').innerText = NORMAL
    document.querySelector('.timer').innerText = gGame.secsPassed
    document.querySelector('.undo').classList.add('disabled')
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
            elRow.innerHTML += `<td id="cell-${i}-${j}" class="${className} content${cellContent}" onclick="cellClicked(${i},${j})" oncontextmenu="cellMarked(${i},${j})"><span>${cellContent}</span></td>`
        }
    }
}

// DONE: Called when a cell (td) is clicked
function cellClicked(i, j) {
    var cell = gBoard[i][j]

    if (cell.isMarked || cell.isShown) return

    if (checkGameOver()) return

    addGameStage()

    if (gManualPosMode && !cell.isMine) {
        cell.isMine = true
        cell.isShown = true
        gMinesPlaced++
        document.querySelector('.manual-place').innerText = gMinesPlaced + ' / ' + gLevel.MINES
        if (gMinesPlaced === gLevel.MINES) {
            hideAllCells(gBoard)
            setMinesNegsCount(gBoard)
            gManualPosMode = false
            gAreMinesPlaced = true
        }
        renderBoard(gBoard)
    } else if (gHintMode) {
        var elHints = document.querySelector('.hints')
        elHints.classList.toggle('activated')
        revealNegs(gBoard, { i, j })
        gHintMode = false
        gHints--
        if (!gHints) elHints.classList.toggle('disabled')
        elHints.innerText = '💡 x ' + gHints
        renderBoard(gBoard)
        gameStages.pop()
    } else {
        cell.isShown = true
        gGame.shownCount++
        if (!gGame.isOn) {
            gTimerInterval = setInterval(startTimer, 1000)
            document.querySelector('.hints').classList.toggle('disabled')
            document.querySelector('.safe-clicks').classList.toggle('disabled')
            gGame.isOn = !gGame.isOn
            if (!gAreMinesPlaced) {
                placeMines(gBoard)
                setMinesNegsCount(gBoard)
                gAreMinesPlaced = true
            }
        }
        if (!cell.minesAroundCount && !cell.isMine) expandShown(gBoard, { i, j })
        renderBoard(gBoard)
        if (cell.isMine) {
            gLives--
            gHealthBar = gHealthBar.slice(0, gHealthBar.length - 2)
            document.querySelector('.lives').innerText = gHealthBar
        }
        if (checkGameOver()) gameOver()
    }
}

// DONE: Called on right click to mark a
// cell (suspected to be a mine)
// Search the web (and
// implement) how to hide the
// context menu on right click
function cellMarked(i, j) {
    var cell = gBoard[i][j]

    if (cell.isShown) return

    if (!gGame.isOn) return

    addGameStage()

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
    return gGame.shownCount + gGame.markedCount === gLevel.SIZE ** 2 || !gLives
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
}

function gameOver() {
    gGame.isOn = false
    clearInterval(gTimerInterval)
    var elSmiley = document.querySelector('.smiley')
    if (gLives === 0) {
        document.querySelector('.lives').innerText = '☠️'
        elSmiley.innerText = LOSE
        revealAllMines(gBoard)
        renderBoard(gBoard)
        return
    }
    var bestScore = localStorage.getItem('bestScore')
    if (!bestScore) localStorage.setItem('bestScore', gGame.secsPassed)
    else if (bestScore > gGame.secsPassed) {
        bestScore = gGame.secsPassed
        localStorage.setItem('bestScore', bestScore)
    }
    document.querySelector('.best-time span').innerText = bestScore
    elSmiley.innerText = WIN
}

function restartGame() {
    deactivateAllBtns()
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

function deactivateAllBtns() {
    var elButtons = document.querySelectorAll('button')
    for (var i = 0; i < elButtons.length; i++) {
        elButtons[i].classList.remove('activated')
    }
}
