'use strict'

console.log('+ Manual Position')

var gManualPosMode
var gMinesPlaced

function toggleManualPos(elBtn) {
    restartGame()
    elBtn.classList.toggle('activated')
    gManualPosMode = !gManualPosMode
    if (!gManualPosMode) {
        elBtn.innerText = 'MANUAL POSITION MODE'
    } else elBtn.innerText = gMinesPlaced + ' / ' + gLevel.MINES
}

function hideAllCells(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            board[i][j].isShown = false
        }
    }
    gGame.shownCount = 0
    gGame.markedCount = 0
}
