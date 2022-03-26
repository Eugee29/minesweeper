'use strict'

console.log('+ 7 Boom')

var gSevenBoomMode

function toggleSevenBoomMode(elBtn) {
    restartGame()
    gSevenBoomMode = !gSevenBoomMode
    elBtn.classList.toggle('activated')
    if (gSevenBoomMode) {
        placeSevenBoom(gBoard)
        setMinesNegsCount(gBoard)
        gAreMinesPlaced = true
    }
}

function placeSevenBoom(board) {
    var idx = 0
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            if (idx && (idx % 7 === 0 || (idx + '').includes('7'))) board[i][j].isMine = true
            idx++
        }
    }
}
