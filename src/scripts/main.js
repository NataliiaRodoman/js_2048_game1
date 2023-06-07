'use strict';

const tablGamme = document.querySelector('.game-field');
const buttonStart = document.querySelector('.start');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageOver = document.querySelector('.message-over');
const rows = 4;
const columns = 4;
let flag = 0;
let flagSetRandom = true;
let score = 0;
let gammeBoard = [];
let copyBoard = [];
let arrayEqual = false;

buttonStart.addEventListener('click', () => {
  buttonStart.classList.value = '';
  buttonStart.classList.add('button', 'restart');
  buttonStart.innerText = 'Restart';
  messageStart.classList.add('hidden');
  messageOver.classList.add('hidden');
  document.querySelector('.game-score').innerText = 0;
  score = 0;
  flagSetRandom = true;
  setGame();
});

function setGame() {
  gammeBoard = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      const tile = tablGamme.rows[r].cells[c];
      const num = gammeBoard[r][c];

      tile.id = r.toString() + c.toString();
      updateTile(tile, num);
    }
  }
  setRandomInEmptyCell();
  setRandomInEmptyCell();
}

function emptyTile() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (gammeBoard[r][c] === 0) {
        return true;
      }
    }
  }

  return false;
}

function moves() {
  for (let r = 0; r < rows - 1; r++) {
    for (let c = 0; c < columns - 1; c++) {
      if ((gammeBoard[r][c] === gammeBoard[r][c + 1])
        || (gammeBoard[r][c] === 0)) {
        return true;
      }
    }
  }

  for (let col = 0; col < columns - 1; col++) {
    for (let row = 0; row < rows - 1; row++) {
      if ((gammeBoard[row][col] === gammeBoard[row + 1][col])
        || (gammeBoard[row][col] === 0)) {
        return true;
      }
    }
  }

  return false;
}

function setRandomInEmptyCell() {
  if (!emptyTile() || !flagSetRandom) {
    return;
  }

  let found = false;

  while (!found) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * columns);

    if (gammeBoard[r][c] === 0) {
      gammeBoard[r][c] = Math.random() < 0.9 ? 2 : 4;

      const tile = document.getElementById(r.toString() + c.toString());

      tile.innerText = `${gammeBoard[r][c]}`;
      tile.classList.add(`field-cell--${gammeBoard[r][c]}`);
      found = true;
    }
  }
}

function updateTile(tile, num) {
  tile.innerText = '';
  tile.classList.value = '';
  tile.classList.add('field-cell');

  if (num > 0) {
    tile.innerText = num;

    if (num < 2048) {
      tile.classList.add('field-cell--' + num.toString());
    }

    if (num === 2048) {
      tile.classList.add('field-cell--' + num.toString());
      messageWin.classList.remove('hidden');
    }
  }
}

document.addEventListener('keyup', (e) => {
  switch (e.code) {
    case 'ArrowLeft':
      flag = score;

      copyBoard = gammeBoard.map(row => row.slice());

      slideLeft();

      arrayEqual = gammeBoard.every((row, rowIndex) =>
        row.every(
          (value, columnIndex) => value === copyBoard[rowIndex][columnIndex]
        ));

      if ((arrayEqual) && (flag === score)) {
        setRandomInEmptyCell();
        flagSetRandom = false;
      } else {
        flagSetRandom = true;
      }

      setRandomInEmptyCell();

      moves();

      break;

    case 'ArrowRight':
      flag = score;

      copyBoard = gammeBoard.map(row => row.slice());

      slideRight();

      arrayEqual = gammeBoard.every((row, rowIndex) =>
        row.every(
          (value, columnIndex) => value === copyBoard[rowIndex][columnIndex]
        ));

      if ((arrayEqual) && (flag === score)) {
        setRandomInEmptyCell();
        flagSetRandom = false;
      } else {
        flagSetRandom = true;
      }

      setRandomInEmptyCell();

      moves();

      break;

    case 'ArrowUp':
      flag = score;
      slideUp();

      copyBoard = gammeBoard.map(row => row.slice());

      setRandomInEmptyCell();

      arrayEqual = gammeBoard.every((row, rowIndex) =>
        row.every(
          (value, columnIndex) => value === copyBoard[rowIndex][columnIndex]
        ));

      if ((arrayEqual) && (flag === score)) {
        setRandomInEmptyCell();
        flagSetRandom = false;
      } else {
        flagSetRandom = true;
      }

      moves();

      break;

    case 'ArrowDown':
      flag = score;
      copyBoard = gammeBoard.map(row => row.slice());
      slideDown();

      arrayEqual = gammeBoard.every((row, rowIndex) =>
        row.every(
          (value, columnIndex) => value === copyBoard[rowIndex][columnIndex]
        ));

      if ((arrayEqual) && (flag === score)) {
        setRandomInEmptyCell();
        flagSetRandom = false;
      } else {
        flagSetRandom = true;
      }
      setRandomInEmptyCell();

      moves();

      break;
  }

  if (!moves()) {
    messageOver.classList.remove('hidden');
    messageOver.style.color = '#f87474';
  }

  document.querySelector('.game-score').innerText = score;
});

function filterZero(row) {
  return row.filter(num => num !== 0);
}

function doubling(rowTemp) {
  let row = filterZero(rowTemp);

  for (let i = 0; i < row.length; i++) {
    if (row[i] === row[i + 1]) {
      row[i] *= 2;
      row[i + 1] = 0;
      score += row[i];
    }
  }

  row = filterZero(row);

  while (row.length < columns) {
    row.push(0);
  }

  return row;
}

function slideLeft() {
  for (let r = 0; r < rows; r++) {
    let row = gammeBoard[r];

    row = doubling(row);
    gammeBoard[r] = row;

    for (let c = 0; c < columns; c++) {
      const tile = document.getElementById(r.toString() + c.toString());
      const num = gammeBoard[r][c];

      updateTile(tile, num);
    }
  }
}

function slideRight() {
  for (let r = 0; r < rows; r++) {
    let row = gammeBoard[r];

    row.reverse();
    row = doubling(row);
    row.reverse();
    gammeBoard[r] = row;

    for (let c = 0; c < columns; c++) {
      const tile = document.getElementById(r.toString() + c.toString());
      const num = gammeBoard[r][c];

      updateTile(tile, num);
    }
  }
}

function slideUp() {
  for (let c = 0; c < columns; c++) {
    let row = [
      gammeBoard[0][c],
      gammeBoard[1][c],
      gammeBoard[2][c],
      gammeBoard[3][c],
    ];

    row = doubling(row);

    for (let r = 0; r < rows; r++) {
      gammeBoard[r][c] = row[r];

      const tile = document.getElementById(r.toString() + c.toString());

      const num = gammeBoard[r][c];

      updateTile(tile, num);
    }
  }
}

function slideDown() {
  for (let c = 0; c < columns; c++) {
    let row = [
      gammeBoard[0][c],
      gammeBoard[1][c],
      gammeBoard[2][c],
      gammeBoard[3][c],
    ];

    row.reverse();
    row = doubling(row);
    row.reverse();

    for (let r = 0; r < rows; r++) {
      gammeBoard[r][c] = row[r];

      const tile = document.getElementById(r.toString() + c.toString());

      const num = gammeBoard[r][c];

      updateTile(tile, num);
    }
  }
}
