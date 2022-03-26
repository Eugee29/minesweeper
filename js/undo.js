'use strict'

console.log('+ Undo')

var gameStages

function undoMove(elBtn) {
    if (!gGame.isOn || !gameStages.length) return
    var gameStage = gameStages.pop()
    if (!gameStages.length) elBtn.classList.add('disabled')
    gGame.shownCount = gameStage.shownCount
    gGame.markedCount = gameStage.markedCount
    undoBoard(gameStage.gBoard)
    gHealthBar = gameStage.gHealthBar
    gMinesPlaced = gameStage.gMinesPlaced
    gLives = gameStage.gLives
    gHintMode = gameStage.gHintMode
    gManualPosMode = gameStage.gManualPosMode
    gSevenBoomMode = gameStage.gSevenBoomMode
    document.querySelector('.lives').innerText = gHealthBar
    renderBoard(gBoard)
}

function addGameStage() {
    document.querySelector('.undo').classList.remove('disabled')
    var gameStage = {
        isOn: gGame.isOn,
        shownCount: gGame.shownCount,
        markedCount: gGame.markedCount,
        gBoard: copyBoard(gBoard),
        gHealthBar: gHealthBar,
        gMinesPlaced: gMinesPlaced,
        gSafeClick: gSafeClick,
        gLives: gLives,
        gHints: gHints,
        gAreMinesPlaced: gAreMinesPlaced,
        gHintMode: gHintMode,
        gManualPosMode: gManualPosMode,
        gSevenBoomMode: gSevenBoomMode,
    }
    gameStages.push(gameStage)
}

function copyBoard(board) {
    var boardCopy = []
    for (var i = 0; i < board.length; i++) {
        boardCopy[i] = []
        for (var j = 0; j < board[0].length; j++) {
            boardCopy[i][j] = {}
            Object.assign(boardCopy[i][j], board[i][j])
        }
    }
    return boardCopy
}

function undoBoard(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            gBoard[i][j].isShown = board[i][j].isShown
            gBoard[i][j].isMine = board[i][j].isMine
            gBoard[i][j].isMarked = board[i][j].isMarked
        }
    }
}
