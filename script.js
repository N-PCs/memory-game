document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('gameBoard');
    const movesDisplay = document.getElementById('moves');
    const timerDisplay = document.getElementById('timer');
    const restartBtn = document.getElementById('restart');
    const winModal = document.getElementById('winModal');
    const playAgainBtn = document.getElementById('playAgain');
    const finalMoves = document.getElementById('finalMoves');
    const finalTime = document.getElementById('finalTime');

    let cards = [];
    let hasFlippedCard = false;
    let lockBoard = false;
    let firstCard, secondCard;
    let moves = 0;
    let timer = null;
    let seconds = 0;
    let matchedPairs = 0;
    const totalPairs = 8; // For 16 cards (8 pairs)

    // Initialize game
    initGame();

    function initGame() {
        // Reset game state
        moves = 0;
        seconds = 0;
        matchedPairs = 0;
        movesDisplay.textContent = moves;
        timerDisplay.textContent = '00:00';
        clearInterval(timer);
        
        // Create cards
        cards = createCards();
        shuffleCards(cards);
        
        // Clear the board
        gameBoard.innerHTML = '';
        
        // Add cards to the board
        cards.forEach(card => {
            gameBoard.appendChild(card);
        });
        
        // Start timer
        startTimer();
    }

    function createCards() {
        const emojis = ['😀', '😎', '🤖', '👽', '🐶', '🐱', '🦄', '🐲', '🍎', '🍕', '⚽', '🎸', '🚀', '🌈', '🎮', '📚'];
        const selectedEmojis = emojis.slice(0, totalPairs);
        const cardPairs = [...selectedEmojis, ...selectedEmojis];
        
        return cardPairs.map((emoji, index) => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.emoji = emoji;
            card.dataset.index = index;
            
            const front = document.createElement('div');
            front.classList.add('front');
            front.textContent = emoji;
            
            const back = document.createElement('div');
            back.classList.add('back');
            back.innerHTML = '<i class="fas fa-question"></i>';
            
            card.appendChild(front);
            card.appendChild(back);
            
            card.addEventListener('click', flipCard);
            
            return card;
        });
    }

    function shuffleCards(cards) {
        cards.forEach(card => {
            const randomPos = Math.floor(Math.random() * cards.length);
            card.style.order = randomPos;
        });
    }

    function flipCard() {
        if (lockBoard) return;
        if (this === firstCard) return;
        if (this.classList.contains('matched')) return;
        
        this.classList.add('flipped');
        
        if (!hasFlippedCard) {
            // First click
            hasFlippedCard = true;
            firstCard = this;
            return;
        }
        
        // Second click
        secondCard = this;
        checkForMatch();
    }

    function checkForMatch() {
        const isMatch = firstCard.dataset.emoji === secondCard.dataset.emoji;
        
        if (isMatch) {
            disableCards();
            matchedPairs++;
            if (matchedPairs === totalPairs) {
                endGame();
            }
        } else {
            unflipCards();
        }
        
        // Update moves
        moves++;
        movesDisplay.textContent = moves;
    }

    function disableCards() {
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        
        resetBoard();
    }

    function unflipCards() {
        lockBoard = true;
        
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            
            resetBoard();
        }, 1000);
    }

    function resetBoard() {
        [hasFlippedCard, lockBoard] = [false, false];
        [firstCard, secondCard] = [null, null];
    }

    function startTimer() {
        timer = setInterval(() => {
            seconds++;
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
        }, 1000);
    }

    function endGame() {
        clearInterval(timer);
        
        // Show win modal
        finalMoves.textContent = moves;
        finalTime.textContent = timerDisplay.textContent;
        winModal.style.display = 'flex';
    }

    // Event listeners
    restartBtn.addEventListener('click', initGame);
    playAgainBtn.addEventListener('click', () => {
        winModal.style.display = 'none';
        initGame();
    });
});