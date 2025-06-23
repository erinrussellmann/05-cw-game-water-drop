// Variables to control game state
let gameRunning = false;
let dropMaker;
let score = 0;
let time = 60;
const timeEl = document.getElementById('time');
let timerInterval;
let dropActive = false;

// DOM Elements
const scoreEl = document.getElementById('score');
const gameContainer = document.getElementById('game-container');
const startBtn = document.getElementById('start-btn');
const landingScreen = document.getElementById('landing-screen');
const gameScreen = document.getElementById('game-screen');
const gameoverScreen = document.getElementById('gameover-screen');
const finalScoreEl = document.getElementById('final-score');
const resetBtn = document.getElementById('reset-btn');
const river = document.getElementById('river');

// Start the game when the start button is pressed
startBtn.addEventListener("click", startGame);
resetBtn.addEventListener("click", function() {
    if (gameScreen.classList.contains('active')) {
        // If in game, restart immediately
        endGame();
        setTimeout(startGame, 100); // Small delay to clear drops
    } else {
        // If on game over screen, go to landing
        resetGame();
    }
});

function startGame() {
    if (gameRunning) return;
    score = 0;
    time = 60;
    scoreEl.textContent = score;
    timeEl.textContent = time;
    gameRunning = true;
    landingScreen.classList.remove('active');
    landingScreen.style.display = 'none';
    gameScreen.classList.add('active');
    gameScreen.style.display = 'block';
    gameoverScreen.classList.remove('active');
    gameoverScreen.style.display = 'none';
    clearInterval(dropMaker);
    clearInterval(timerInterval);
    // Start first drop
    createDrop();
    timerInterval = setInterval(updateTimer, 1000);
}

// Randomly decide drop type
function randomDropType() {
    return Math.random() < 0.7 ? 'blue' : 'green'; // 70% blue, 30% green
}

// Create a drop and animate it
function createDrop() {
    const drop = document.createElement('div');
    const type = randomDropType();
    drop.classList.add('drop', type === 'blue' ? 'blue-drop' : 'green-drop');
    drop.style.left = Math.random() * 90 + '%';
    drop.style.top = '-40px';
    drop.dataset.type = type;
    drop.dataset.clicked = "false";

    drop.addEventListener('click', function(e) {
        e.stopPropagation();
        if (drop.dataset.clicked === "true") return; // Prevent double click
        drop.dataset.clicked = "true";
        drop.style.transition = 'opacity 0.3s';
        drop.style.opacity = '0';
        setTimeout(() => {
            if (drop.parentNode) drop.remove();
            if (gameRunning) createDrop(); // Release next drop after click
        }, 300);
        // Update score
        if (type === 'blue') {
            score++;
        } else {
            score--;
        }
        scoreEl.textContent = score;
    });

    river.appendChild(drop);
    animateDrop(drop, type);
}

function animateDrop(drop, type) {
    let pos = -40;
    const speed = Math.random() * 1 + 0.7; // slower speed
    function frame() {
        pos += speed;
        drop.style.top = pos + 'px';
        if (pos < river.offsetHeight - 80) { // 80px = lake height
            requestAnimationFrame(frame);
        } else {
            // Only remove if not already clicked/faded
            if (drop.parentNode && drop.dataset.clicked === "false") {
                if (type === 'blue') {
                    score--;
                    scoreEl.textContent = score;
                }
                drop.remove();
                if (gameRunning) createDrop(); // Release next drop after miss
            }
        }
    }
    requestAnimationFrame(frame);
}

function updateTimer() {
    time--;
    timeEl.textContent = time;
    if (time <= 0) {
        endGame();
    }
}

function endGame() {
    gameRunning = false;
    clearInterval(dropMaker);
    clearInterval(timerInterval);
    // Remove all drops
    while (river.firstChild) river.removeChild(river.firstChild);
    finalScoreEl.textContent = score;
    gameScreen.classList.remove('active');
    gameScreen.style.display = 'none';
    gameoverScreen.classList.add('active');
    gameoverScreen.style.display = 'block';
}

function resetGame() {
    gameoverScreen.classList.remove('active');
    gameoverScreen.style.display = 'none';
    landingScreen.classList.add('active');
    landingScreen.style.display = 'block';
}
