var gGame = {
    isOn: false,
    showCount: 0,
    markedCount: 0,
    secsPassed: 0,
}
var gLevel = {
    SIZE: 8,
    MINES: 12,
}

var gBoard

var gSecInterval = 1
var gStartTime = Date.now()
var gLives = 3

const LIVE = '❤️️'


function initGame() {
    gBoard = buildBoard(gLevel.SIZE)
    renderBoard(gBoard, '.board-container')
}

function handleLevel(ev) {
    gLevel.SIZE = ev.id
    gLevel.MINES = ev.value
    restartGame()
}

function play(cellI, cellJ) {
    startTimer()
    updateTime()
    setMines(gBoard, gLevel.SIZE, gLevel.MINES, cellI, cellJ) //Randomly locates the  mines on the board
    setMinesNegsCount(gBoard)
    renderBoard(gBoard, '.board-container') // Present the mines and their count using renderBoard() function
}

function restartGame(elBtn) {
    switchBtnClass('smiley')
    clearInterval(gSecInterval)
    gGame.isOn = true
    gGame.showCount = 0
    gGame.markedCount = 0
    gGame.secsPassed = 0

    if (gLevel.SIZE == 4) {
        gLives = 2
    } else {
        gLives = 3
    }
    var elHints = document.querySelectorAll('.hint')
    for (let i = 0; i < elHints.length; i++) {
        elHints[i].classList.remove('hidden')

    }
    updateLives()
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

function getNumClass(num) {
    switch (num) {
        case '0':
            return 'zero'
        case '1':
            return 'one'
        case '2':
            return 'two'
        case '3':
            return 'three'
        case '4':
            return 'four'
        case '5':
            return 'five'
        case '6':
            return 'six'
        case '7':
            return 'seven'
        case '8':
            return 'eight'
        case '9':
            return 'nine'
        default:
            break;
    }
}

function updateTime() {
    var digit1 = document.querySelector('.digit1')
    var digit2 = document.querySelector('.digit2')
    var digit3 = document.querySelector('.digit3')
    var timeStr = Math.floor((gGame.secsPassed / 1000)).toString()

    if (timeStr.length === 1) {
        timeStr = '00' + timeStr
    } else if (timeStr.length === 2) {
        timeStr = '0' + timeStr
    }

    const numsNames = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']

    digit1.classList.remove(...numsNames)
    digit1.classList.add(getNumClass(timeStr[0]))

    digit2.classList.remove(...numsNames)
    digit2.classList.add(getNumClass(timeStr[1]))

    digit3.classList.remove(...numsNames)
    digit3.classList.add(getNumClass(timeStr[2]))
}

function gameover(gameRes) {
    gGame.isOn = false
    clearInterval(gSecInterval)
    switchBtnClass(gameRes)
}

function switchBtnClass(classAdd) {

    const classOpts = ['smiley', 'looser', 'winner', 'click']
    document.querySelector('.game-start-btn').classList.remove(...classOpts)
    document.querySelector('.game-start-btn').classList.add(classAdd)
}
