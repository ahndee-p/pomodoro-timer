let timeLeft;
let timerId = null;
let isWorkTime = true;
let pauseTimeLeft = 0;
let pauseTimerId = null;
let completedSessions = 0;
let lastTimestamp = null;

const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startButton = document.getElementById('start');
const resetButton = document.getElementById('reset');
const statusText = document.getElementById('status-text');

const WORK_TIME = 25 * 60; // 25 minutes in seconds
const BREAK_TIME = 5 * 60; // 5 minutes in seconds

const pauseDisplay = document.createElement('div');
pauseDisplay.id = 'pause-timer';
pauseDisplay.style.fontSize = '0.8em';
statusText.parentNode.insertBefore(pauseDisplay, statusText.nextSibling);

const sessionsDisplay = document.createElement('div');
sessionsDisplay.id = 'sessions-counter';
sessionsDisplay.style.fontSize = '0.9em';
sessionsDisplay.style.marginTop = '1rem';
sessionsDisplay.textContent = 'Completed Sessions: 0';
statusText.parentNode.insertBefore(sessionsDisplay, statusText.nextSibling);

// Add visibility change handler
document.addEventListener('visibilitychange', handleVisibilityChange);

function handleVisibilityChange() {
    if (document.hidden) {
        // Tab becomes hidden - store the timestamp
        if (timerId !== null) {
            clearInterval(timerId);
            lastTimestamp = Date.now();
        }
    } else {
        // Tab becomes visible - calculate elapsed time and update
        if (lastTimestamp !== null && timerId !== null) {
            const elapsedSeconds = Math.floor((Date.now() - lastTimestamp) / 1000);
            timeLeft = Math.max(0, timeLeft - elapsedSeconds);
            updateDisplay();
            startTimer(); // Restart the interval
        }
    }
}

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    minutesDisplay.textContent = minutes.toString().padStart(2, '0');
    secondsDisplay.textContent = seconds.toString().padStart(2, '0');
    
    // Update the page title with the current time
    document.title = `${timeString} - Pomodoro Timer`;
}

function updatePauseDisplay() {
    const minutes = Math.floor(pauseTimeLeft / 60);
    const seconds = pauseTimeLeft % 60;
    pauseDisplay.textContent = `Paused for: ${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function startTimer() {
    if (timerId !== null) return;
    
    // Clear pause timer if it exists
    if (pauseTimerId !== null) {
        clearInterval(pauseTimerId);
        pauseTimerId = null;
        pauseDisplay.textContent = '';
    }

    if (!timeLeft) {
        timeLeft = WORK_TIME;
        isWorkTime = true;
        statusText.textContent = 'Work Time!';
    }

    lastTimestamp = Date.now();
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
    clearInterval(pauseTimerId);
    timerId = null;
    pauseTimerId = null;
    pauseDisplay.textContent = '';
    timeLeft = WORK_TIME;
    isWorkTime = true;
    statusText.textContent = 'Work Time!';
    startButton.textContent = 'Start';
    updateDisplay();
    document.title = 'Pomodoro Timer';
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
        
        // Start pause timer
        pauseTimeLeft = 0;
        pauseTimerId = setInterval(() => {
            pauseTimeLeft++;
            updatePauseDisplay();
        }, 1000);
    }
});

resetButton.addEventListener('click', resetTimer);

// Initialize the display
timeLeft = WORK_TIME;
updateDisplay(); 