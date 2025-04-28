class Game {
    constructor() {
        this.boardSize = 10;
        this.cellCount = this.boardSize * this.boardSize;
        this.snake = [{ x: 5, y: 5 }, { x: 5, y: 6 }];
        this.direction = { x: 0, y: -1 };
        this.apple = null;
        this.score = 0;
        this.bestScore = localStorage.getItem('bestScore') ? parseInt(localStorage.getItem('bestScore')) : 0;
        this.isGameOver = false;
        this.intervalId = null;
        this.init();
    }

    init() {
        this.createBoard();
        this.updateBoard();
        document.getElementById('gameBoard').addEventListener('click', () => this.startGame());
        document.addEventListener('keydown', (e) => this.changeDirection(e));
        document.getElementById('restartGame').addEventListener('click', () => this.restartGame());
        this.updateScoreboard();
    }

    createBoard() {
        const gameBoard = document.getElementById('gameBoard');
        for (let i = 0; i < this.cellCount; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            gameBoard.appendChild(cell);
        }
    }

    updateBoard() {
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => cell.classList.remove('snake', 'apple'));
        this.snake.forEach(segment => {
            const index = segment.y * this.boardSize + segment.x;
            cells[index].classList.add('snake');
        });
        if (this.apple) {
            const appleIndex = this.apple.y * this.boardSize + this.apple.x;
            cells[appleIndex].classList.add('apple');
        }
    }

    startGame() {
        if (this.isGameOver) return;
        this.generateApple();
        this.intervalId = setInterval(() => this.move(), 500);
    }

    generateApple() {
        let x, y;
        do {
            x = Math.floor(Math.random() * this.boardSize);
            y = Math.floor(Math.random() * this.boardSize);
        } while (this.snake.some(segment => segment.x === x && segment.y === y));
        this.apple = { x, y };
        this.updateBoard();
    }

    changeDirection(event) {
        if (event.key === 'ArrowUp' && this.direction.y === 0) {
            this.direction = { x: 0, y: -1 };
        } else if (event.key === 'ArrowDown' && this.direction.y === 0) {
            
            this.direction = { x: 0, y: 1 };
        } else if (event.key === 'ArrowLeft' && this.direction.x === 0) {
            this.direction = { x: -1, y: 0 };
        } else if (event.key === 'ArrowRight' && this.direction.x === 0) {
            this.direction = { x: 1, y: 0 };
        }
    }

    move() {
        const head = { x: this.snake[0].x + this.direction.x, y: this.snake[0].y + this.direction.y };

       
        if (head.x < 0) head.x = this.boardSize - 1;
        else if (head.x >= this.boardSize) head.x = 0;
        if (head.y < 0) head.y = this.boardSize - 1;
        else if (head.y >= this.boardSize) head.y = 0;

       
        if (this.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            this.endGame();
            return;
        }

        this.snake.unshift(head); 

       
        if (this.apple && head.x === this.apple.x && head.y === this.apple.y) {
            this.score += 1;
            this.generateApple();
        } else {
            this.snake.pop();  
        }

        this.updateBoard();
        this.updateScoreboard();
    }

    endGame() {
        clearInterval(this.intervalId);
        this.isGameOver = true;
        document.getElementById('restartGame').style.display = 'block';
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            localStorage.setItem('bestScore', this.bestScore);
        }
        this.updateScoreboard();
    }

    restartGame() {
        this.snake = [{ x: 5, y: 5 }, { x: 5, y: 6 }];
        this.score = 0;
        this.direction = { x: 0, y: -1 };
        this.isGameOver = false;
        this.apple = null;
        clearInterval(this.intervalId);
        document.getElementById('restartGame').style.display = 'none';
        this.updateBoard();
        this.updateScoreboard();
        this.startGame();
    }

    updateScoreboard() {
        document.getElementById('score').innerText = this.score;
        if (this.bestScore > 0) {
            document.getElementById('bestScore').innerText = this.bestScore;
            document.getElementById('highscore').style.display = 'block';
        }
    }
}

new Game();
