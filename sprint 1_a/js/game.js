var gGame = {
    isOn: false,
    showCount: 0,
    markedCount: 0,
    secsPassed: 0,
}
var gLevel = {
    SIZE: 4,
    MINES: 2,
}

var gBoard
var gSecInterval = 1
var gStartTime = Date.now()
var gIsWin = false
var gLives = 3

// This is called when page loads 
function initGame() {
    gBoard = buildBoard(gLevel.SIZE)
    renderBoard(gBoard, '.board-container')
}

function handleLevel(ev) {
    gLevel.SIZE = ev.id
    gLevel.MINES = ev.value
    restartGame()
}

// This is called when page loads 
function play(cellI, cellJ) {
    startTimer()
    updateTime()
    setMines(gBoard, gLevel.SIZE, gLevel.MINES, cellI, cellJ) //Randomly locates the  mines on the board
    setMinesNegsCount(gBoard)
    renderBoard(gBoard, '.board-container') // Present the mines and their count using renderBoard() function
}

function restartGame(elBtn) {
    if(!gGame.isOn) document.querySelector('.msgToUser').innerText = 'Choose cell and click on it!'
    if (elBtn) elBtn.innerText = 'Start Game'
    clearInterval(gSecInterval)
    gGame.isOn = true
    gGame.showCount = 0
    gGame.markedCount = 0
    gGame.secsPassed = 0
    updateTime()
    initGame()
}

function startTimer() {

    gStartTime = Date.now()

    gSecInterval = setInterval(() => {
        gGame.secsPassed = Date.now() - gStartTime;
        updateTime()
    }, 1000)
}

function updateTime() {
    var elSpanTimer = document.querySelector('#spanTimer')
    var timer = (gGame.secsPassed/1000000).toFixed(3)
    elSpanTimer.innerText = timer.substring([2], timer.length)
}

function gameover() {
    gGame.isOn = false
    document.querySelector('button').innerText = "Game Over"
    msgToUser()
    console.log('gGame.secsPassed', gGame.secsPassed)
    clearInterval(gSecInterval)
}

function msgToUser() {
    document.querySelector('.msgToUser').innerText = (gIsWin) ? 'YOU WIN' : 'TRY AGAIN?'
    gIsWin = false
}


