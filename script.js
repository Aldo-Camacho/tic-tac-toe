let turn = true;
let players = [', '];
const player1Class = 'black';
const player2Class = 'red';
const emptyTileClass = 'white'

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
            if (turn) {
                tile.classList.replace(`${emptyTileClass}`,`${player1Class}`);
            } else {
                tile.classList.replace(`${emptyTileClass}`,`${player2Class}`);
            }
            toggleTurn();
            checkGame();
        }
    });
}

function blockTiles() {
    const tiles = document.querySelectorAll('.tile');
    tiles.forEach(tile => {
        tile.onclick = () => {
        }
    });
}

function restartBoard() {
    const output = document.querySelector('.winnerName');
    for (let i = 1; i <3; i++){
        const playerName = document.querySelector(`.player${i}Name`);
        while (playerName.firstChild){
            playerName.removeChild(playerName.lastChild);    
        }
    }
    
    while (output.firstChild){
        output.removeChild(output.lastChild);
    }
    turn = true;
    const tiles = document.querySelectorAll('.tile');
    tiles.forEach(tile => {
        if (tile.classList.contains(`${player1Class}`)){
            tile.classList.replace(`${player1Class}`,`${emptyTileClass}`);
        } else if (tile.classList.contains(`${player2Class}`)){
            tile.classList.replace(`${player2Class}`,`${emptyTileClass}`);
        }
    });
    activateTiles();
}

function singlePlayerButton() {
    const nameInput = document.querySelector('.nameInput');
    nameInput.innerHTML = "";
    playerNameIn(1);
    restartBoard();
}

function playerNameIn(i){
    const textField = document.createElement('input');
    textField.setAttribute('type', 'text');
    textField.placeholder = `Player ${i} name`;
    const nameSection = document.querySelector(`.player${i}Name`);
    const nameInput = document.querySelector('.nameInput');  
    nameInput.appendChild(textField);
    
    textField.onchange = () => {
        console.log('Player name has changed')
        players[i-1] = textField.value;
        const label = document.createElement('p');
        label.textContent = `Player name = ${players[i-1]}`;
        if (nameSection.firstChild){
            nameSection.removeChild(nameSection.lastChild);
        }
        nameSection.append(label);
        textField.remove();
        
    }
}

function doublePlayerButton() {
    const nameInput = document.querySelector('.nameInput');
    nameInput.innerHTML ='';

    for (let i = 1; i < 3; i++) {
        playerNameIn(i);
    }
    restartBoard();
}

function toggleTurn(){
    turn = ! turn;
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

    winScenarios.forEach(scenario => {
        if (allTiles[scenario[0]].classList.contains(player1Class) 
        && allTiles[scenario[1]].classList.contains(player1Class) 
        && allTiles[scenario[2]].classList.contains(player1Class)){    
        label.textContent = `${players[0]} wins`;
            output.appendChild(label);
            blockTiles();
        } else if (allTiles[scenario[0]].classList.contains(player2Class) 
        && allTiles[scenario[1]].classList.contains(player2Class) 
        && allTiles[scenario[2]].classList.contains(player2Class)) {
            label.textContent = `${players[1]} wins`;
            output.appendChild(label);
            blockTiles();
        }
    });

    allTiles.forEach(tile => {
        if (!(tile.classList.contains(player1Class) || tile.classList.contains(player1Class))) {
            return;
        }
    });
    label.textContent = `Tie`;
    output.appendChild(label);
    blockTiles();
}