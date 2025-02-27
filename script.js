// Function to update coin count in localStorage
function updateCoins(amount) {
    let coins = localStorage.getItem('coins');
    if (!coins) {
        coins = 0;
    }
    coins = parseInt(coins) + amount;
    localStorage.setItem('coins', coins);
    document.getElementById('coinCount').innerText = 'Balance: ' + coins;
}

// Function to set task as completed
function setTaskCompleted(taskElement) {
    taskElement.classList.add('completed');
    const taskButton = taskElement.querySelector('.task-button');
    taskButton.innerText = 'Claimed';
    taskButton.removeAttribute('onclick');
}

// Function to execute task
function executeTask(taskUrl, taskElement) {
    window.open(taskUrl, '_blank'); // Open link in a new tab
    // Change button to 'Claim' immediately
    const taskButton = taskElement.querySelector('.task-button');
    taskButton.innerText = 'Claim';
    taskButton.onclick = function() {
        collectTaskReward(taskElement);
    };
    taskButton.removeAttribute('disabled');
    saveTasksState(); // Save tasks state
}

// Function to collect task reward
function collectTaskReward(taskElement) {
    updateCoins(30); // Add 30 coins
    setTaskCompleted(taskElement); // Mark task as completed
    saveTasksState(); // Save tasks state
}

// Function to save tasks state
function saveTasksState() {
    const tasks = document.querySelectorAll('.task-item');
    const taskStates = [];
    tasks.forEach(task => {
        const isCompleted = task.classList.contains('completed');
        const buttonState = task.querySelector('.task-button').innerText;
        taskStates.push({ isCompleted, buttonState });
    });
    localStorage.setItem('taskStates', JSON.stringify(taskStates));
}

// Function to load tasks state
function loadTasksState() {
    const taskStates = JSON.parse(localStorage.getItem('taskStates'));
    if (taskStates) {
        const tasks = document.querySelectorAll('.task-item');
        tasks.forEach((task, index) => {
            if (taskStates[index]) {
                const { isCompleted, buttonState } = taskStates[index];
                if (isCompleted) {
                    setTaskCompleted(task);
                }
                if (buttonState === 'Claim') {
                    const taskButton = task.querySelector('.task-button');
                    taskButton.innerText = 'Claim';
                    taskButton.onclick = function() {
                        collectTaskReward(task);
                    };
                    taskButton.removeAttribute('disabled');
                }
            }
        });
    }
}

// Function to load coin count
function loadCoins() {
    let coins = localStorage.getItem('coins');
    if (!coins) {
        coins = 0;
    }
    document.getElementById('coinCount').innerText = `Balance: ${coins}`;
}

function showTaskPage() {
    document.getElementById('mainPage').style.display = 'none';
    document.getElementById('taskPage').style.display = 'block';
    loadTasksState(); // Load tasks state when switching to task page
}

function showMainPage() {
    document.getElementById('mainPage').style.display = 'block';
    document.getElementById('taskPage').style.display = 'none';
}

// Function to start farming
function startFarming() {
    const farmButton = document.getElementById('farmButton');
    let time = parseInt(localStorage.getItem('remainingTime'), 10);

    if (!time || time <= 0) {
        // If no time or time is up, set 3 hours
        time = 3 * 3600; // 3 hours in seconds
    }

    const updateTimerDisplay = () => {
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time % 3600) / 60);
        const seconds = time % 60;
        farmButton.innerText = `Remaining: ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    updateTimerDisplay();
    farmButton.setAttribute('disabled', 'true'); // Disable button during countdown

    const timer = setInterval(() => {
        time -= 1; // Decrease time by 1 second
        localStorage.setItem('remainingTime', time); // Save remaining time to localStorage

        if (time <= 0) {
            clearInterval(timer);
            farmButton.innerText = 'Claim';
            farmButton.removeAttribute('disabled');
            farmButton.onclick = function() {
                collectFarmingReward();
                localStorage.removeItem('remainingTime'); // Remove saved time after collection
            };
        } else {
            updateTimerDisplay();
        }
    }, 1000); // Timer updates every second
}

// Function to collect farming reward
function collectFarmingReward() {
    updateCoins(30); // Add 30 coins
    const farmButton = document.getElementById('farmButton');
    farmButton.innerText = 'Farm';
    farmButton.setAttribute('disabled', 'true');
}

// Check and start timer on page load
window.addEventListener('load', () => {
    const savedTime = localStorage.getItem('remainingTime');
    if (savedTime && parseInt(savedTime, 10) > 0) {
        startFarming(); // Continue countdown if saved time exists
    } else {
        document.getElementById('farmButton').addEventListener('click', startFarming);
    }
});

// Load coins and tasks state when the page loads
document.addEventListener('DOMContentLoaded', () => {
    loadCoins(); // Load coin count on page load
    loadTasksState(); // Load tasks state on page load
});
