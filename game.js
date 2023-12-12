document.getElementById("start").addEventListener("click", start);

let usedLocation = [];
let usedLocationCounter = 0;
let clicked = null;
let clickedId = null;
let correct = [];
let correctLen = 0;
let intervalId;
let matchStarted = false;
let revealedCount = 0;
let pairsToMatch = 0;

function checkGameEnd(Size) {
    let pairsToMatch;
    if (Size === 16) {
        pairsToMatch = 8;
    } else if (Size === 20) {
        pairsToMatch = 10;
    } else if (Size === 24) {
        pairsToMatch = 12;
    }

    if (correct.length === pairsToMatch * 2) { // Check if all pairs are matched
        const winSection = document.getElementById('win');
        winSection.style.display = 'block'; // Reveal the "You Win!!" section
        clearInterval(intervalId); // Clear the interval when the game ends
    }
}

function start() {
    document.getElementById("instructions").style.display = "none";
    const gridSize = document.getElementById("gridSize").value;
    const revealTime = document.getElementById("revealTime").value * 1000;
    const timerDisplay = document.getElementById('timer');
    let Size, gameOverTime;

    if (gridSize === "lvl1") {
        Size = 16;
        gameOverTime = 120000 + revealTime;
        document.getElementById("lvl1").style.display = 'block';
        bindCardEvents(Size, gridSize);
        populateImages(Size, gridSize);
        setTimeout(() => {
            hideImages(Size, gridSize);
            enableCardClicks(Size, gridSize);
        }, revealTime);
    } else if (gridSize === "lvl2") {
        Size = 20;
        gameOverTime = 150000 + revealTime;
        document.getElementById("lvl2").style.display = 'block';
        bindCardEvents(Size, gridSize);
        populateImages(Size, gridSize);
        setTimeout(() => {
            hideImages(Size, gridSize);
            enableCardClicks(Size, gridSize);
        }, revealTime);
    } else if (gridSize === "lvl3") {
        Size = 24;
        gameOverTime = 180000 + revealTime;
        document.getElementById("lvl3").style.display = 'block';
        bindCardEvents(Size, gridSize);
        populateImages(Size, gridSize);
        setTimeout(() => {
            hideImages(Size, gridSize);
            enableCardClicks(Size, gridSize);
        }, revealTime);
    }
    setTimeout(() => {
        hideImages(Size, gridSize);
        enableCardClicks(Size, gridSize);
        matchStarted = true; // Set matchStarted to true after images are hidden
    }, revealTime);

    timerDisplay.style.display = 'block';
    startTimer(gameOverTime, timerDisplay);

    const startTime = new Date().getTime();
    intervalId = setInterval(function() {
        const currentTime = new Date().getTime();
        const timeDifference = gameOverTime - (currentTime - startTime);
        const seconds = Math.floor(timeDifference / 1000);
        timerDisplay.innerHTML = 'Time Left: ' + seconds + 's';
        if (currentTime - startTime > gameOverTime) {
            clearInterval(intervalId);
            alert("Time's Up!!");
            location.reload();
        }
        checkGameEnd(Size); // Check game end on every interval update
    }, 1000);
}

function bindCardEvents(Size, gridSize) {
    const cards = document.querySelectorAll(`#${gridSize} td img`);
    cards.forEach(card => {
        card.addEventListener('click', function() {
            check(this, Size); // Pass Size as a parameter
        });
    });
}

function populateImages(Size, gridSize) {
    const uniqueImageCount = Size / 2;
    const imagePaths = [
        '1.png', '2.png', '3.png', '4.png', '5.png', '6.png',
        '7.png', '8.png', '9.png', '10.png', '11.png', '12.png'
    ];

    const uniqueImages = imagePaths.slice(0, uniqueImageCount);
    const pairs = [...uniqueImages, ...uniqueImages];
    const shuffledPairs = pairs.sort(() => Math.random() - 0.5);

    const images = document.getElementById(gridSize).querySelectorAll('td img');

    images.forEach((image, index) => {
        image.setAttribute('src', shuffledPairs[index]);
        image.setAttribute('name', shuffledPairs[index].replace('.png', ''));
        image.setAttribute('data-back', 'q.png');
    });
}

function hideImages(Size, gridSize) {
    revealedCount = 0; // Reset revealedCount when hiding images
    const images = document.getElementById(gridSize).querySelectorAll('td img');
    images.forEach(image => {
        image.setAttribute('src', 'q.png'); // Set the source to the back of the card
        image.removeAttribute('onclick'); // Remove click event
    });
}

function enableCardClicks(Size, gridSize) {
    const images = document.getElementById(gridSize).querySelectorAll('td img');
    images.forEach(image => {
        image.addEventListener('click', function() {
            check(this, Size);
            revealedCount++; // Increment revealedCount when a card is clicked
            checkGameEnd(Size); // Check game end after every card click
        });
    });
}

function startTimer(gameOverTime, timerDisplay) {
    const startTime = new Date().getTime();
    const interval = setInterval(function() {
        const currentTime = new Date().getTime();
        const timeDifference = gameOverTime - (currentTime - startTime);
        const seconds = Math.floor(timeDifference / 1000);
        timerDisplay.innerHTML = 'Time Left: ' + seconds + 's';
        if (currentTime - startTime > gameOverTime) {
            clearInterval(interval);
            alert("Time's Up!!");
            location.reload();
        }
    }, 1000);
}

function getNumber(set) {
    let rndm = Math.floor(Math.random() * set.length);
    while (usedLocation.indexOf(set[rndm]) !== -1) {
        rndm = Math.floor(Math.random() * set.length);
    }
    usedLocation[usedLocationCounter] = set[rndm];
    usedLocationCounter++;
    return set[rndm];
}

function restart() {
    window.location.href = 'index.html'; // Redirects to the instructions page
}

let flippedCards = [];
let canClick = true;

function check(clickedCard, Size) {
    if (!canClick || flippedCards.length >= 2 || flippedCards.includes(clickedCard)) {
        return;
    }

    clickedCard.setAttribute('src', clickedCard.getAttribute('name') + '.png');
    flippedCards.push(clickedCard);

    if (flippedCards.length === 2) {
        const [firstCard, secondCard] = flippedCards;
        const firstCardImage = firstCard.getAttribute('name');
        const secondCardImage = secondCard.getAttribute('name');

        canClick = false;

        setTimeout(() => {
            if (firstCardImage === secondCardImage) {
                correct.push(firstCardImage);
                firstCard.removeEventListener('click', check); // Disable click event for matched cards
                secondCard.removeEventListener('click', check); // Disable click event for matched cards

                if (correct.length === Size / 2) { // Check if all pairs are matched
                    const winSection = document.getElementById('win');
                    winSection.style.display = 'block'; // Reveal the "You Win!!" section
                    clearInterval(intervalId); // Clear the interval when the game ends
                }
            } else {
                firstCard.setAttribute('src', 'q.png');
                secondCard.setAttribute('src', 'q.png');
            }

            flippedCards = [];
            canClick = true;
        }, 1000);
    }

    checkGameEnd(Size); // Check game end on every card click
}
