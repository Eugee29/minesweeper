'use strict'

console.log('+ Safe Clicks')

var gSafeClick

function markSafeCell() {
    if (!gSafeClick || !gGame.isOn) return
    gSafeClick--
    var elSafeClicks = document.querySelector('.safe-clicks')
    if (!gSafeClick) elSafeClicks.classList.toggle('disabled')
    elSafeClicks.innerText = SAFE_CLICK + ' x ' + gSafeClick
    var safeCells = getSafeCells()
    var randIdx = getRandomInt(0, safeCells.length)
    var cellPos = safeCells[randIdx]
    var elCell = document.getElementById(`cell-${cellPos.i}-${cellPos.j}`)
    elCell.classList.toggle('safe-cell')
    setTimeout(() => {
        elCell.classList.toggle('safe-cell')
    }, 1000)
}

function getSafeCells() {
    var safeCells = []
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var cell = gBoard[i][j]
            if (!cell.isMine && !cell.isShown) safeCells.push({ i, j })
        }
    }
    return safeCells
}
