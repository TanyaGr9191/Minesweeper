'use strict'

const MINE = '💣'

var gMines
var gIsHintMode = false

function createCell() {
    const newCell = {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false,
        content: '',
    }
    return newCell
}

function buildBoard(SIZE) {
    const board = []
    for (var i = 0; i < SIZE; i++) {
        board.push([])
        for (var j = 0; j < SIZE; j++) {
            board[i][j] = createCell()
        }
    }
    return board
}

function renderBoard(mat, selector) {

    var strHTML = '<table border="0" oncontextmenu="return false"><tbody>'
    for (var i = 0; i < mat.length; i++) {

        strHTML += '\t<tr>\n'
        for (var j = 0; j < mat[0].length; j++) {

            var className = 'cell'
            const cell = mat[i][j]
            if (cell.isShown) {
                className += ' visible'
            }
            if (cell.isMarked) {
                className += ' marked'
            }

            strHTML += `
                \t<td oncontextmenu="cellMarked(${i},${j})"
                    data-i="${i}" data-j="${j}"
                    onclick="cellClicked(${i},${j})"
                    class="${className} num-${cell.content} bold">${cell.isShown ? `<span>${cell.content}</span>` : ''}
                </td>\n`
        }
        strHTML += '\t</tr>\n'
    }
    strHTML += '</tbody></table>'

    const elContainer = document.querySelector(selector)
    elContainer.innerHTML = strHTML
}

function setMines(board, size, mines, cellI, cellJ) {
    gMines = []

    for (var i = 0; i < mines; i++) {
        var randomI = getRandomInt(0, size - 1)
        var randomJ = getRandomInt(0, size - 1)

        if (randomI === cellI && randomJ === cellJ ||
            board[randomI][randomJ].content === MINE) {
            i--
        } else {
            board[randomI][randomJ].content = MINE
            board[randomI][randomJ].isMine = true
            gMines.push(board[randomI][randomJ])
        }
    }
    return board
}

function setMinesNegsCount(board) {

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            board[i][j].minesAroundCount = countNeighbors(board, i, j)
            if (board[i][j].isMine === false &&
                board[i][j].minesAroundCount !== 0) {
                board[i][j].content = board[i][j].minesAroundCount.toString()
            }
        }
    }
    return board
}


function checkGameOver(cellI, cellJ) {

    if (gGame.markedCount === gLevel.SIZE ** 2) return
    var shown = 0
    var marked = 0
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {

            if (gBoard[i][j].isShown) {
                shown++
            }
            if (gBoard[i][j].isMarked) {
                marked++
            }
        }

    }
    if ((shown + marked) === gLevel.SIZE ** 2) {
        setBestScore(gLevel.LEVEL)
        updateBestScoreBoard(gLevel.LEVEL)
        gameover('winner')
    }
    if (gBoard[cellI][cellJ].isMine && !gBoard[cellI][cellJ].isMarked) {
        gBoard[cellI][cellJ].isShown
        gLives--
        updateLives()

        if (gLives === 0) {
            expandMines(gBoard)
            gameover('looser')
        }
    }
}

function cellClicked(cellI, cellJ) {

    if (gBoard[cellI][cellJ].isMarked) gBoard[cellI][cellJ].isMarked = false
    if (gGame.showCount === 0) {
        play(cellI, cellJ)

        gGame.showCount++
    }
    if (gIsHintMode) {
        showHint(cellI, cellJ, true)

        setTimeout(() => {
            showHint(cellI, cellJ, false)
        }, 1000);
        return
    }
    if (gBoard[cellI][cellJ].isMine === false &&
        gBoard[cellI][cellJ].minesAroundCount === 0) {
        expandShown(gBoard, cellI, cellJ)
    }

    gBoard[cellI][cellJ].isShown = true
    checkGameOver(cellI, cellJ)
    renderBoard(gBoard, ".board-container")
}

function cellMarked(cellI, cellJ) {
    if (gBoard[cellI][cellJ].isShown) return
    gBoard[cellI][cellJ].isMarked = !gBoard[cellI][cellJ].isMarked
    if (gBoard[cellI][cellJ].isMarked) {
        gGame.markedCount++
        checkGameOver(cellI, cellJ)
    } else {
        gGame.markedCount--
    }

    renderBoard(gBoard, ".board-container")
}

function expandShown(board, cellI, cellJ) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue

        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= board[i].length) continue
            if (i === cellI && j === cellJ) continue
            if (board[i][j].minesAroundCount === 0 && board[i][j].isShown === false) {
                board[i][j].isShown = true
                expandShown(board, i, j)
            } else {
                board[i][j].isShown = true
            }
        }
    }
}

function expandMines() {
    for (var i = 0; i < gMines.length; i++) {
        if (!gMines[i].isMarked) gMines[i].isShown = true
    }
}

function updateLives() {
    document.querySelector('.lives').innerHTML = ''
    for (let i = 0; i < gLives; i++) {
        document.querySelector('.lives').innerHTML += LIVE
    }
}

function showHint(cellI, cellJ, isShow) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue

        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue
            gBoard[i][j].isShown = isShow
            renderBoard(gBoard, ".board-container")
        }
    }
    gIsHintMode = false

}

function setHint(el) {
    el.className += ' hidden'
    gIsHintMode = true
}

function setBestScore(level) {
    const minTime = checkMinTime(level).toString()
    localStorage.setItem(level, minTime)
}

function checkMinTime(level) {
    var minTime = localStorage.getItem(level)

    if (!minTime) minTime = Infinity
    gGame.secsPassed = Math.floor((gGame.secsPassed / 1000))
    if (gGame.secsPassed < +minTime) {
        minTime = gGame.secsPassed
    }

    return minTime
}

function updateBestScoreBoard(level) {
    document.querySelector('.best-score span').innerText = localStorage.getItem(level)
}
