let turn = true;
let hasAI = false;
let tilesBlocked = false;
let players = ['', 'Computer'];
let scores = [0,0];
const playerClasses = ['player1', 'player2']
const emptyTileClass = 'empty'
let size = 3;
let tilesToWin = size;

document.addEventListener('DOMContentLoaded', function () {
    initialize();
})

function initialize() {
    setInputsEvents();
    setBoardLayout();
}

function setInputsEvents(){
    const spButton = document.querySelector('.spButton');
    const dpButton = document.querySelector('.dpButton');
    const resetButton = document.querySelector('.resetButton');
    const sizeInput = document.querySelector('.sizeInput');
    const tilesToWinInput = document.querySelector('.tilesToWinInput');

    spButton.onclick = () => singlePlayerButton();
    dpButton.onclick = () => doublePlayerButton();
    resetButton.onclick = () => restartBoard();
    sizeInput.placeholder = 'Select the size of the board, f.e: 3 = 3x3 board';
    sizeInput.onchange = () => {
        size = sizeInput.value;
        setBoardLayout();
        restartBoard();
    };
    tilesToWinInput.placeholder = 'Select the size of the line to win, f.e: 3 = 3 tiles in a row';
    tilesToWinInput.onchange = () =>{
        if (tilesToWin <= size) {
        tilesToWin = tilesToWinInput.value;
        } else {
            tilesToWin = size;
        }
        restartBoard();
    } 
}

function setBoardLayout() {
    const board = document.querySelector('.board');
    const screenWidth = 350;
    let responsiveSize = Math.floor(screenWidth/size);
    let gap = Math.ceil(responsiveSize/10);
    board.innerHTML = '';
    for (let i = 0; i < size*size; i++) {
        const tile = document.createElement('div');
        tile.id = `tile_${i}`;
        tile.classList.add('tile');
        tile.classList.add(`${emptyTileClass}`);
        tile.innerHTML = ``;
        tile.style.width = `${responsiveSize}px`;
        tile.style.height = `${responsiveSize}px`;
        board.appendChild(tile);
    }
    board.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    board.style.gap = `${gap}px`;
    board.style.width = `${responsiveSize*size + (size-1)*gap}px`;
    board.style.height = `${responsiveSize*size + (size-1)*gap}px`;
}

function activateTiles() {
    const tiles = document.querySelectorAll('.tile');
    tiles.forEach(tile => {
        tile.onclick = () => {
            if (tile.classList.contains(emptyTileClass)) { 
                const tileNumber = parseInt(tile.id.split('_').pop(), 10);
                if (! hasAI) {
                    if (turn) {
                        tile.classList.replace(emptyTileClass, playerClasses[0]);   
                        checkIfPlayerWon(0,tileNumber); 
                    } else {
                        tile.classList.replace(emptyTileClass, playerClasses[1]);
                        checkIfPlayerWon(1,tileNumber);
                    }
                    toggleTurn();
                } else {
                    tile.classList.replace(emptyTileClass, playerClasses[0]);
                    checkIfPlayerWon(0,tileNumber);
                    if (! tilesBlocked) {
                        setTimeout(() => {
                            aITurn();
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
    const tile = available[rand];
    tile.classList.replace(emptyTileClass,playerClasses[1]);
    checkIfPlayerWon(1, parseInt(tile.id.split('_').pop(), 10));
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

function checkIfPlayerWon(player, tile){
    
    const tiles = document.querySelectorAll('.tile');
    const row = Math.floor(tile/size);
    const col = tile % size;
    const diagonalRow = row-Math.min(row,col);
    const diagonalCol = col-Math.min(row,col);
    const invDiagonalRow = row+Math.min(size-1-row,col);
    const invDiagonalCol = col-Math.min(size-1-row,col);
    const output = document.querySelector('.winnerName');
    const label = document.createElement('p');

    let horizontal = 0, vertical = 0, diagonal=0, invDiagonal = 0;
    let maxHorizontal = 0, maxVertical = 0, maxDiagonal = 0, maxInvDiagonal = 0;
    for(let i = 0; i < size; i++){
        if (tiles[row*size + i].classList.contains(playerClasses[player])){
            ++horizontal;
        } else {
            horizontal=0;
        }
        if (horizontal > maxHorizontal){
            maxHorizontal = horizontal;
        }
        if (tiles[(i * size) + col].classList.contains(playerClasses[player])){
            ++vertical;
        } else {
            vertical=0;
        }
        if (vertical > maxVertical){
            maxVertical = vertical;
        }
    }
    
    for (let i = 0; i < Math.min(size-diagonalRow, size-diagonalCol); i++){
        if (tiles[(diagonalRow + i)*size+diagonalCol+i].classList.contains(playerClasses[player])) {
            ++diagonal;
        }
        else {
            diagonal = 0;
        }
        if (diagonal > maxDiagonal){
            maxDiagonal = diagonal;
        }
    }
    for (let i = 0; i < Math.min(invDiagonalRow + 1, size-invDiagonalCol); i++){
        if (tiles[(invDiagonalRow-i)*size + invDiagonalCol + i].classList.contains(playerClasses[player])) {
            ++invDiagonal;
        }
        else {
            invDiagonal = 0;
        }
        if (invDiagonal > maxInvDiagonal){
            maxInvDiagonal = invDiagonal;
        }
    }
    if (maxHorizontal == tilesToWin || maxVertical == tilesToWin || maxDiagonal == tilesToWin || maxInvDiagonal == tilesToWin){
        ++scores[player];
        hasWinner = true;
        label.textContent = `${players[player]} wins`;
        output.appendChild(label);
        blockTiles();
    } else {
        const allTiles = document.querySelectorAll('.tile');
        let tieFlag = true;
        allTiles.forEach(tile => {
            if(tile.classList.contains(emptyTileClass)) {
                tieFlag = false;
                return;
            }
        });
        if(tieFlag){
            label.textContent = 'Tie';
            output.appendChild(label);
            blockTiles();
        }
    } 
}