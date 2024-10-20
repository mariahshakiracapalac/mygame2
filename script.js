let score = 0;
let missedCount = 0;
const maxMissed = 10;
const gameContainer = document.getElementById('gameContainer');
const basket = document.getElementById('basket');
const scoreDisplay = document.getElementById('score');
const missedDisplay = document.getElementById('missed');
const gameOverDisplay = document.getElementById('gameOver');
const finalScoreDisplay = document.getElementById('finalScoreDisplay');
const restartButton = document.getElementById('restartButton');

const fruits = [
    'apple.png',
    'banana.png',
    'orange.jpg',
    'cherry.png',
    'grapes.png'
];

let fallIntervals = []; // To keep track of all fruit fall intervals
let createFruitInterval; // To track the fruit creation interval

// Move the basket with the mouse
const moveBasket = (event) => {
    const containerRect = gameContainer.getBoundingClientRect();
    const basketX = event.clientX - containerRect.left;

    // Ensure the basket stays within the container boundaries
    if (basketX < 0) {
        basket.style.left = `0px`; // Align with the left edge
    } else if (basketX > containerRect.width - basket.offsetWidth) {
        basket.style.left = `${containerRect.width - basket.offsetWidth}px`; // Align with the right edge
    } else {
        basket.style.left = `${basketX}px`; // Position as per mouse
    }
};

// Function to create and drop fruit
function createFruit() {
    const fruit = document.createElement('div');
    fruit.classList.add('fruit');
    
    const randomFruit = fruits[Math.floor(Math.random() * fruits.length)];
    fruit.style.backgroundImage = `url("${randomFruit}")`; 
    fruit.style.left = `${Math.random() * (gameContainer.offsetWidth - 40)}px`;
    gameContainer.appendChild(fruit);

    let fallInterval = setInterval(() => {
        const fruitRect = fruit.getBoundingClientRect();
        const basketRect = basket.getBoundingClientRect();

        if (fruitRect.bottom >= gameContainer.offsetHeight) {
            clearInterval(fallInterval);
            gameContainer.removeChild(fruit);
            missedCount++; // Increment missed count when fruit falls past the bottom
            missedDisplay.innerText = `Missed: ${missedCount}`;

            if (missedCount >= maxMissed) {
                endGame(); // End game if missed count reaches the maximum
            }
        } else {
            fruit.style.top = `${fruit.offsetTop + 5}px`; // Move fruit down
        }

        // Check for collision with the basket
        if (fruitRect.bottom >= basketRect.top && fruitRect.right >= basketRect.left && fruitRect.left <= basketRect.right) {
            score++; // Increment score when fruit is caught
            scoreDisplay.innerText = `Score: ${score}`;
            clearInterval(fallInterval);
            gameContainer.removeChild(fruit);
        }
    }, 100);

    fallIntervals.push(fallInterval); // Store the interval reference
}

// End the game and show the game over message
function endGame() {
    // Clear all fruit fall intervals
    fallIntervals.forEach(interval => clearInterval(interval));
    fallIntervals = []; // Reset the array

    // Clear the fruit creation interval
    clearInterval(createFruitInterval);

    // Disable basket movement
    document.removeEventListener('mousemove', moveBasket); // Remove mousemove listener

    // Show the final score
    finalScoreDisplay.innerText = `Final Score: ${score}`;
    gameOverDisplay.style.display = 'flex'; // Show game over message
}

// Restart the game
function restartGame() {
    // Reset game variables
    score = 0;
    missedCount = 0;
    scoreDisplay.innerText = `Score: ${score}`;
    missedDisplay.innerText = `Missed: ${missedCount}`;
    finalScoreDisplay.style.display = 'none'; // Hide final score
    gameOverDisplay.style.display = 'none'; // Hide game over message
    gameContainer.style.pointerEvents = 'auto'; // Re-enable interaction

    // Reset basket position
    basket.style.left = '50%'; // Align basket to the center
    basket.style.transform = 'translateX(-50%)'; // Center it

    // Clear all fruits in the gameContainer
    const fruitsInContainer = document.querySelectorAll('.fruit');
    fruitsInContainer.forEach(fruit => gameContainer.removeChild(fruit));

    // Restart intervals
    fallIntervals.forEach(interval => clearInterval(interval)); // Clear any remaining fall intervals
    createFruitInterval = setInterval(createFruit, 1000); // Restart fruit creation

    // Reattach the mousemove event listener
    document.addEventListener('mousemove', moveBasket); // Add mousemove listener back
}

// Add event listener for the restart button
restartButton.addEventListener('click', restartGame);

// Start creating fruits every second
createFruitInterval = setInterval(createFruit, 1000);
document.addEventListener('mousemove', moveBasket); // Add mousemove listener on game start
