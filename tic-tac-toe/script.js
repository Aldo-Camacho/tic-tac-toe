let turn = true;
let hasAI = false;
let tilesBlocked = false;
let players = ['', 'Computer'];
let scores = [0,0];
const player1Class = 'player1';
const player2Class = 'player2';
const emptyTileClass = 'empty'

document.addEventListener('DOMContentLoaded', function () {
    initialize();
})

function initialize() {
    const tablero = document.querySelector('.tablero');
    for (let i = 0; i < 9; i++) {
        const tile = document.createElement('div');
        tile.id = `tile${i}`;
        tile.classList.add('tile');
        tile.classList.add(`${emptyTileClass}`);
        tile.innerHTML = ``;
        tablero.appendChild(tile);
    }
}

function activateTiles() {
    const tiles = document.querySelectorAll('.tile');
    tiles.forEach(tile => {
        tile.onclick = () => {
            if (tile.classList.contains(emptyTileClass)) { 
                if (! hasAI) {
                    if (turn) {
                        tile.classList.replace(emptyTileClass, player1Class);    
                    } else {
                        tile.classList.replace(emptyTileClass, player2Class);
                    }
                    toggleTurn();
                    checkGame();
                } else {
                    tile.classList.replace(emptyTileClass, player1Class);
                    checkGame();
                    if (! tilesBlocked) {
                        aITurn();
                        checkGame();
                    }
                }
            }
        }
    });
    
    setScores();
    tilesBlocked = false;
}

function blockTiles() {
    const tiles = document.querySelectorAll('.tile');
    tiles.forEach(tile => {
        tile.onclick = () => {
        }
    });
    setScores();
    tilesBlocked = true;
}


function aITurn(){
    const tiles = document.querySelectorAll(".tile");
    let available = [];
    tiles.forEach(tile => {
        if(tile.classList.contains(emptyTileClass)){
            available.push(tile);
        }
    });
    console.log(available);
    const rand = Math.floor(Math.random() * available.length);
    console.log(rand);
    available[rand].classList.replace(emptyTileClass,player2Class);
}
function restartPlayerNames(){
    scores = [0,0];
    players = ['', 'Computer'];
    for (let i = 1; i <3; i++){
        const playerName = document.querySelector(`.player${i}Name`);
        playerName.innerHTML = '';
    }
}

function restartBoard() {
    const random = Math.random();
    if (random < 0.5) {
        turn = true;
    } else {
        turn = false;
    }
    console.log(turn);
    
    setPlayerHighlights();
    const output = document.querySelector('.winnerName');
    output.innerHTML = '';

    const tiles = document.querySelectorAll('.tile');
    tiles.forEach(tile => {
        if (tile.classList.contains(player1Class)){
            tile.classList.replace(player1Class, emptyTileClass);
        } else if (tile.classList.contains(player2Class)){
            tile.classList.replace(player2Class, emptyTileClass);
        }
    });
    if (hasAI) {
        if (!turn) {
            aITurn();
            toggleTurn();
        }
    }
    activateTiles();
}


function singlePlayerButton() {
    hasAI = true;
    restartPlayerNames();
    playerNameIn(1);
    const nameSection = document.querySelector(`.player${2}Name`);
    const label = document.createElement('p');
    label.textContent = `Player name = ${players[1]}`;
    nameSection.append(label);
    restartBoard();
}

function playerNameIn(i){
    const textField = document.createElement('input');
    textField.setAttribute('type', 'text');
    textField.placeholder = `Player ${i} name`;
    const nameSection = document.querySelector(`.player${i}Name`);
    nameSection.appendChild(textField);
    
    textField.onchange = () => {
        players[i-1] = textField.value;
        const label = document.createElement('p');
        label.textContent = `Player name = ${players[i-1]}`;
        nameSection.append(label);
        textField.remove();
    }
}

function doublePlayerButton() {
    hasAI = false;
    restartPlayerNames();
    for (let i = 1; i < 3; i++) {
        playerNameIn(i);
    }
    restartBoard();
}

function toggleTurn(){
    turn = ! turn;
    setPlayerHighlights();
}

function setPlayerHighlights() {
    const nameContainers = document.querySelectorAll('.playerNameContainer');
    if (turn) {
        if (nameContainers[1].classList.contains('whiteNeon')){
            nameContainers[1].classList.remove('whiteNeon');
        }
        nameContainers[0].classList.add('whiteNeon');
    } else {
        if (nameContainers[0].classList.contains('whiteNeon')){
            nameContainers[0].classList.remove('whiteNeon');
        }
        nameContainers[1].classList.add('whiteNeon');
    }
}

function setScores() {
    for (let i = 1; i < 3; i++) {
        const scoreCell = document.querySelector(`.player${i}Score`); 
        scoreCell.innerHTML = '';
        const label = document.createElement('p');
        label.textContent = scores[i-1];
        scoreCell.appendChild(label);
    }
}

function checkGame(){
    const output = document.querySelector('.winnerName');
    const label = document.createElement('p');
    const allTiles = document.querySelectorAll('.tile');

    const winScenarios = [
        [0, 1, 2],
        [0, 3, 6],
        [0, 4, 8],
        [1, 4, 7],
        [2, 4, 6],
        [2, 5, 8],
        [3, 4, 5],
        [6, 7, 8]
    ];

    let hasWinner = false;
    winScenarios.forEach(scenario => {
        if (allTiles[scenario[0]].classList.contains(player1Class) 
        && allTiles[scenario[1]].classList.contains(player1Class) 
        && allTiles[scenario[2]].classList.contains(player1Class)){ 
            ++scores[0];
            hasWinner = true;
            label.textContent = `${players[0]} wins`;
            output.appendChild(label);
            blockTiles();
        } else if (allTiles[scenario[0]].classList.contains(player2Class) 
        && allTiles[scenario[1]].classList.contains(player2Class) 
        && allTiles[scenario[2]].classList.contains(player2Class)) {
            ++scores[1];
            hasWinner = true;
            label.textContent = `${players[1]} wins`;
            output.appendChild(label);
            blockTiles();
        }
    });

    if (!hasWinner) {
        let flag = true
        allTiles.forEach(tile => {
            if (!(tile.classList.contains(player1Class) || tile.classList.contains(player2Class))) {
                flag = false;
                return;
            }
        });
        
        if (flag) {
            label.textContent = `Tie`;
            output.appendChild(label);
            blockTiles();
        }
    }
}