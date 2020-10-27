const board = document.getElementById('board')
const cells = document.querySelectorAll('[data-cell]')
const winScreen = document.querySelector('.winning-message')
const msg = document.getElementById('msg')
const xBtn = document.getElementById('x')
const oBtn = document.getElementById('o')
const easy = document.getElementById('easy')
const impo = document.getElementById('impo')
let playerTurn
let player
let ai
let isMaximizing
let difficulty

easy.addEventListener('click', () => {
    impo.classList.remove('red')
    easy.classList.add('green')

    difficulty = 'easy'
})

impo.addEventListener('click', () => {
    difficulty = 'impo'
    impo.classList.add('red')
    easy.classList.remove('green')
})
const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
]

xBtn.addEventListener('click', () => {
    player = 'x'
    ai = 'o'
    isMaximizing = false
    startGame()
})

oBtn.addEventListener('click', () => {
    player = 'o'
    ai = 'x'
    isMaximizing = true
    startGame()
})


function startGame(){
    board.classList.remove(player)
    board.classList.remove(ai)
    board.classList.add(player)
    winScreen.classList.remove('show')
    cells.forEach(cell => {
        cell.classList.remove(ai)
        cell.classList.remove(player)
    })
    cells.forEach(cell => {
        cell.addEventListener('click', playerMove)
    })
    if(ai === 'x'){
        cells[0].classList.add('x')
    }

}

function available(cell){
    return (!(cell.classList.contains(player) || cell.classList.contains(ai)))
}


function playerMove(e){
    if(available(e.target)){
        e.target.classList.add(player)
        playerTurn = false
        winCheck()
        end()
        if(difficulty == 'easy'){
            aiTrunEasy()
        }else{
            aiTurn()
            playerTurn = true
        }
        winCheck()
        end()
    }
    
}


function end(){
    let winner = winCheck()
    if(winner != null){
        if(winner != 'tie'){
            color(winner)
            let name = (ai === winner) ? 'I': 'You'
            msg.innerHTML = name + ' won'
            winScreen.classList.add('show')

           
        }else {
            msg.innerHTML = 'Draw!'
            winScreen.classList.add('show')
        }

    }
}

function winCheck(){
    let winner = null
    if(checkWin2(ai)){
        winner = ai
    } else if(checkWin2(player)){
        winner = player
    } else if([...cells].every(cell => !available(cell))){
        winner = 'tie'
    }

    return winner
}

function checkWin2(currentClass) {
  return WINNING_COMBINATIONS.some((combination) => {
    return combination.every(index => {
      return cells[index].classList.contains(currentClass)
    })
  })
}

function aiTurn(){
    let bestPosition = 0
    
    if(!playerTurn){
            if(ai === 'x'){
            let bestScore = -Infinity
            for(let i=0;i < 9;i++){
                if(available(cells[i])){
                    cells[i].classList.add(ai)
                    let score  = minimax(player, !isMaximizing)
                    cells[i].classList.remove(ai)
                    if(score > bestScore){
                        bestScore = score
                        bestPosition = i
                    }
                }
            }}else{
                let bestScore = Infinity
                for(let i=0;i < 9;i++){
                if(available(cells[i])){
                    cells[i].classList.add(ai)
                    let score  = minimax(player, true)
                    cells[i].classList.remove(ai)
                    if(score < bestScore){
                        bestScore = score
                        bestPosition = i
                    }
                }
            }
            }
        cells[bestPosition].classList.add(ai)
        playerTurn = true
    }
}

const scores = {
    'x': 1,
    'o': -1,
    'tie': 0
}

function minimax(turn, isMaximizing){
    let winner = winCheck()
    let score
    if(winner != null){
        return score = scores[winner]
    }

    if(isMaximizing){
        let bestScore = -Infinity
        for(let i=0;i < 9;i++){
            if(available(cells[i])){
                cells[i].classList.add('x')
                let score  = minimax('o', false)
                cells[i].classList.remove('x')
                bestScore = Math.max(score, bestScore)
            }
        }
        return bestScore
    } else {
        let bestScore = Infinity
        for(let i=0;i < 9;i++){
            if(available(cells[i])){
                cells[i].classList.add('o')
                let score  = minimax('x', true)
                cells[i].classList.remove('o')
                bestScore = Math.min(score, bestScore)
            }
        }
        return bestScore
    }

}

function aiTrunEasy(){
    let availabeSpots = []
    if([...cells].some(cell => available(cell))){
        
        for(let i = 0; i < 9; i++){
            if(available(cells[i])){
                availabeSpots.push(cells[i])
            }
        }
         availabeSpots[Math.round(Math.random()*(availabeSpots.length-1))].classList.add(ai)
    }
   
}

function color(winner){
    for(let i = 0; i < 9; i++){
        let win = WINNING_COMBINATIONS[0]
        if(win.every(index => {
            cells[index].classList.contains(winner)
        })){
            let colr = (winner == ai) ? 'red' : 'green'
            cells[index].classList.add(colr)
            break
        }
    }
}