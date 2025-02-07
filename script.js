let timeLeft;
let timerId = null;
let isWorkTime = true;
let completedSessions = 0;

const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startButton = document.getElementById('start');
const resetButton = document.getElementById('reset');
const statusText = document.getElementById('status-text');

const WORK_TIME = 25 * 60; // 25 minutes in seconds
const BREAK_TIME = 5 * 60; // 5 minutes in seconds

// Create sessions display
const sessionsDisplay = document.createElement('div');
sessionsDisplay.id = 'sessions-counter';
sessionsDisplay.style.fontSize = '0.9em';
sessionsDisplay.style.marginTop = '1rem';
sessionsDisplay.textContent = 'Completed Sessions: 0';
statusText.parentNode.insertBefore(sessionsDisplay, statusText.nextSibling);

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    minutesDisplay.textContent = minutes.toString().padStart(2, '0');
    secondsDisplay.textContent = seconds.toString().padStart(2, '0');
}

function startTimer() {
    if (timerId !== null) return;

    if (!timeLeft) {
        timeLeft = WORK_TIME;
        isWorkTime = true;
        statusText.textContent = 'Work Time!';
    }

    timerId = setInterval(() => {
        timeLeft--;
        updateDisplay();

        if (timeLeft <= 0) {
            clearInterval(timerId);
            timerId = null;
            
            if (isWorkTime) {
                completedSessions++;
                sessionsDisplay.textContent = `Completed Sessions: ${completedSessions}`;
                timeLeft = BREAK_TIME;
                isWorkTime = false;
                statusText.textContent = 'Break Time!';
            } else {
                timeLeft = WORK_TIME;
                isWorkTime = true;
                statusText.textContent = 'Work Time!';
            }
            
            updateDisplay();
            startTimer();
        }
    }, 1000);

    startButton.textContent = 'Pause';
}

function resetTimer() {
    clearInterval(timerId);
    timerId = null;
    timeLeft = WORK_TIME;
    isWorkTime = true;
    statusText.textContent = 'Work Time!';
    startButton.textContent = 'Start';
    updateDisplay();
    completedSessions = 0;
    sessionsDisplay.textContent = 'Completed Sessions: 0';
}

startButton.addEventListener('click', () => {
    if (timerId === null) {
        startTimer();
    } else {
        clearInterval(timerId);
        timerId = null;
        startButton.textContent = 'Start';
    }
});

resetButton.addEventListener('click', resetTimer);

// Initialize the display
timeLeft = WORK_TIME;
updateDisplay(); 