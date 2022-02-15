let turn = true;
let hasAI = false;
let tilesBlocked = false;
let players = ['', 'Computer'];
let scores = [0,0];
const playerClasses = ['player1', 'player2']
const emptyTileClass = 'empty'
let size = 3;
let winScenarios = [];

document.addEventListener('DOMContentLoaded', function () {
    initialize();
})

function initialize() {
    setInputsEvents();
    setBoardLayout();
    calculateWinScenarios();
}

function setInputsEvents(){
    const spButton = document.querySelector('.spButton');
    const dpButton = document.querySelector('.dpButton');
    const resetButton = document.querySelector('.resetButton');
    const sizeInput = document.querySelector('.sizeInput');

    spButton.onclick = () => singlePlayerButton();
    dpButton.onclick = () => doublePlayerButton();
    resetButton.onclick = () => restartBoard();
    sizeInput.placeholder = size;
    sizeInput.onchange = () => {
        size = sizeInput.value;
        setBoardLayout();
        calculateWinScenarios();
        restartBoard();
    };
}

function setBoardLayout() {
    const board = document.querySelector('.board');
    board.innerHTML = '';
    for (let i = 0; i < size*size; i++) {
        const tile = document.createElement('div');
        tile.id = `tile${i}`;
        tile.classList.add('tile');
        tile.classList.add(`${emptyTileClass}`);
        tile.innerHTML = ``;
        board.appendChild(tile);
    }
    board.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    board.style.width = `${size * 100 + (size-1)*10}`;
}

function activateTiles() {
    const tiles = document.querySelectorAll('.tile');
    tiles.forEach(tile => {
        tile.onclick = () => {
            if (tile.classList.contains(emptyTileClass)) { 
                if (! hasAI) {
                    if (turn) {
                        tile.classList.replace(emptyTileClass, playerClasses[0]);    
                    } else {
                        tile.classList.replace(emptyTileClass, playerClasses[1]);
                    }
                    checkGame();
                    toggleTurn();
                } else {
                    tile.classList.replace(emptyTileClass, playerClasses[0]);
                    checkGame();
                    if (! tilesBlocked) {
                        setTimeout(() => {
                            aITurn();
                            checkGame();
                        }, 500);
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

function toggleTurn(){
    turn = ! turn;
    setPlayerHighlights();
}

function aITurn(){
    const tiles = document.querySelectorAll('.tile');
    let available = [];
    tiles.forEach(tile => {
        if(tile.classList.contains(emptyTileClass)){
            available.push(tile);
        }
    });
    const rand = Math.floor(Math.random() * available.length);
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
    
    setPlayerHighlights();
    const output = document.querySelector('.winnerName');
    output.innerHTML = '';

    const tiles = document.querySelectorAll('.tile');
    tiles.forEach(tile => {
        if (tile.classList.contains(playerClasses[0])){
            tile.classList.replace(playerClasses[0], emptyTileClass);
        } else if (tile.classList.contains(playerClasses[1])){
            tile.classList.replace(playerClasses[1], emptyTileClass);
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

function doublePlayerButton() {
    hasAI = false;
    restartPlayerNames();
    for (let i = 1; i < 3; i++) {
        playerNameIn(i);
    }
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

function calculateWinScenarios() {
    winScenarios = [];
    let horizontal;
    let vertical;
    let diagonal = [];
    let invDiagonal = [];
    for (let i = 0; i < size; i++){
        horizontal = [];
        vertical = [];
        diagonal.push(i*size + i);
        invDiagonal.push((size-1-i)*size + i);
        for (let j = 0; j < size; j++) {
            horizontal.push(i*size + j);
            vertical.push(j*size + i);
        }
        winScenarios.push(horizontal);
        winScenarios.push(vertical);
    }
    winScenarios.push(diagonal);
    winScenarios.push(invDiagonal);
}

function checkGame(){
    const output = document.querySelector('.winnerName');
    const label = document.createElement('p');
    const allTiles = document.querySelectorAll('.tile');
    
    let hasWinner = false;
    if (isPlayerWinner(0)){ 
        ++scores[0];
        hasWinner = true;
        label.textContent = `${players[0]} wins`;
        output.appendChild(label);
        blockTiles();
    } else if (isPlayerWinner(1)) {
        ++scores[1];
        hasWinner = true;
        label.textContent = `${players[1]} wins`;
        output.appendChild(label);
        blockTiles();
    }

    if (!hasWinner) {
        let tieFlag = true
        allTiles.forEach(tile => {
            let containsPlayerClass = false;
            playerClasses.forEach(playerClass => {
                containsPlayerClass = containsPlayerClass || tile.classList.contains(playerClass);
            })
            if (!containsPlayerClass) {
                tieFlag = false;
                return;
            }
        });
        
        if (tieFlag) {
            label.textContent = `Tie`;
            output.appendChild(label);
            blockTiles();
        }
    }
}

function isPlayerWinner(i){
    const allTiles = document.querySelectorAll('.tile');

    let isWinner = false;
    winScenarios.forEach((scenario) => {
        let winnerFlag = true;
        scenario.forEach(index => {
            winnerFlag = winnerFlag && allTiles[index].classList.contains(playerClasses[i]);
        });
        if (winnerFlag){
            isWinner = true;
            return;
        }
    });

    return isWinner;
}