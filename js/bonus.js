'use strict'

console.log('+ Bonuses!')

var gHints
var gHintMode
var gBestScore

function toggleHint(elHint) {
    if (!gHints || !gGame.isOn) return
    gHintMode = !gHintMode
    elHint.classList.toggle('activated')
}

function revealNegs(board, pos) {
    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            if (i === -1 || j === -1 || i === gBoard.length || j === gBoard.length) continue
            var cell = board[i][j]
            if (cell.isShown) continue
            cell.isShown = true
            setTimeout(
                (cell) => {
                    cell.isShown = false
                    renderBoard(gBoard)
                },
                1000,
                cell
            )
        }
    }
}
