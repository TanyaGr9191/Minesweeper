'use strict'

function countNeighbors(board, cellI, cellJ) {
    var neighborsCount = 0;

    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;

        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= board[i].length) continue
            if (i === cellI && j === cellJ) continue
            if (board[i][j].isMine) neighborsCount++
        }
    }
    return neighborsCount
}

// location such as: {i: 2, j: 7}
function renderCell(location, value) {
    // Select the elCell and set the value
    const elCell = document.
        querySelector(`.cell-${location.i}-${location.j}`)
    elCell.innerHTML = value
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min
}

function getTime() {
    return new Date().toString().split(' ')[4];
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function getEmptyCell() {
    var emptyCells = []

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {

            if (gBoard[i][j] === EMPTY)
                emptyCells.push({ i, j })
        }
    }

    if (emptyCells.length === 0) return null
    const idx = getRandomInt(0, emptyCells.length)
    return emptyCells[idx]
}

function addGameElement(element) {
    const chosenCell = getEmptyCell()
    if (!chosenCell) return

    //Model
    gBoard[chosenCell.i][chosenCell.j] = element
    //DOM
    renderCell(chosenCell, element)
}

function drawNum(nums) {
    var num = getRandomInt(0, nums.length)
    var removedNum = nums.splice(num, 1)
    return removedNum
}

function getCellCoord(strCellId) {
    var coord = {}
    console.log('strCellId', strCellId);
    var cells = strCellId.split('-')
    coord.i = +cells[1]
    coord.j = +cells[2]
    return coord
}