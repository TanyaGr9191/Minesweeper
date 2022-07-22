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

// Builds the board
function buildBoard(SIZE) {
    // Create a 4x4 gBoard Matrix containing Objects
    const board = []
    for (var i = 0; i < SIZE; i++) {
        board.push([])
        for (var j = 0; j < SIZE; j++) {
            board[i][j] = createCell()
        }
    }
    return board
}

// Present the board using renderBoard() function
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
                    class="${className}">${cell.isShown ? `<span>${cell.content}</span>` : ''}
                </td>\n`
        }
        strHTML += '\t</tr>\n'
    }
    strHTML += '</tbody></table>'

    const elContainer = document.querySelector(selector)
    elContainer.innerHTML = strHTML
}

//Randomly locate the mines on the board
function setMines(board, size, mines, cellI, cellJ) {
    gMines = []

    for (var i = 0; i < mines; i++) {
        var randomI = getRandomInt(0, size - 1)
        var randomJ = getRandomInt(0, size - 1)

        // Make sure the first clicked cell is never a mine (like in the real game) 
        if (randomI === cellI && randomJ === cellJ ||
            board[randomI][randomJ].content === MINE) {
            i--
        } else {
            board[randomI][randomJ].content = MINE
            board[randomI][randomJ].isMine = true
            // Make array of generated mines to reveal all when game is over
            gMines.push(board[randomI][randomJ])
        }
    }
    return board
}

//  Counting neighbors: Create setMinesNegsCount() and store the numbers (isShown is still true)
function setMinesNegsCount(board) {

    // model
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

// Game ends when all mines are marked, and all the other cells are shown
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
    if (gBoard[cellI][cellJ].minesAroundCount === 0) expandShown(gBoard, cellI, cellJ)


    //model
    gBoard[cellI][cellJ].isShown = true
    checkGameOver(cellI, cellJ)
    //DOM
    renderBoard(gBoard, ".board-container")
}

//Mark a cell suspected to be a mine
function cellMarked(cellI, cellJ) {
    if (gBoard[cellI][cellJ].isShown) return
    gBoard[cellI][cellJ].isMarked = !gBoard[cellI][cellJ].isMarked
    //model
    if (gBoard[cellI][cellJ].isMarked) {
        gGame.markedCount++
        checkGameOver(cellI, cellJ)
    } else {
        gGame.markedCount--
    }

    //DOM
    renderBoard(gBoard, ".board-container")
}

function expandShown(board, cellI, cellJ) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue

        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= board[i].length) continue
            if (i === cellI && j === cellJ) continue
            //model
            if (board[cellI][cellJ].minesAroundCount === 0) {
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
            //model
            gBoard[i][j].isShown = isShow
            //DOM
            renderBoard(gBoard, ".board-container")
        }
    }
    gIsHintMode = false

}

function setHint(el) {
    el.className += ' hidden'
    gIsHintMode = true
}


