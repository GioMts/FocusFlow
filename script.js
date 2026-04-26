// --- STATE MANAGEMENT ---
let timeLeft = 25 * 60;
let timerId = null;
// Store tasks as objects: { text: "string", completed: false }
let tasks = JSON.parse(localStorage.getItem('focusFlow_tasks')) || [];

// --- DOM ELEMENTS ---
const display = document.getElementById('timer-display');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');

// --- TIMER LOGIC ---
function updateDisplay() {
    const mins = Math.floor(timeLeft / 60);
    const secs = Math.floor(timeLeft % 60);
    display.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function setTimer(minutes) {
    clearInterval(timerId);
    timerId = null;
    timeLeft = minutes * 60;
    updateDisplay();
}

document.getElementById('start-btn').onclick = () => {
    if (timerId) return;
    timerId = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateDisplay();
        } else {
            clearInterval(timerId);
            timerId = null;
            new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg').play();
            alert("Session complete!");
        }
    }, 1000);
};

document.getElementById('pause-btn').onclick = () => {
    clearInterval(timerId);
    timerId = null;
};

document.getElementById('reset-btn').onclick = () => setTimer(25);

// --- TASK & PROGRESS LOGIC ---
function updateProgressBar() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

    progressBar.style.width = `${percentage}%`;
    progressText.innerText = `${percentage}% Completed (${completed}/${total})`;

    // Change bar color to neon green when finished
    progressBar.style.background = (percentage === 100 && total > 0) ? "#39FF14" : "#00F2FF";
}

function renderTasks() {
    taskList.innerHTML = "";

    // 1. Sort the tasks: false (0) comes before true (1)
    // This keeps uncompleted tasks at the top.
    tasks.sort((a, b) => a.completed - b.completed);

    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        if (task.completed) li.style.opacity = "0.5";

        li.innerHTML = `
            <span style="text-decoration: ${task.completed ? 'line-through' : 'none'}">${task.text}</span>
            <div class="task-controls">
                <button onclick="toggleTask(${index})">${task.completed ? 'Undo' : 'Done'}</button>
                <button onclick="deleteTask(${index})" style="background:#ff4444; margin-left:5px">✕</button>
            </div>
        `;
        taskList.appendChild(li);
    });

    localStorage.setItem('focusFlow_tasks', JSON.stringify(tasks));
    updateProgressBar();
}

document.getElementById('add-task-btn').onclick = () => {
    const text = taskInput.value.trim();
    if (text) {
        tasks.push({ text: text, completed: false });
        taskInput.value = "";
        renderTasks();
    }
};

function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    renderTasks();
}

function deleteTask(index) {
    tasks.splice(index, 1);
    renderTasks();
}

// --- SOUND LOGIC ---
const sounds = {
    rain: new Audio('rain.mp3'),
    cafe: new Audio('cafe.mp3'),
    waves: new Audio('waves.mp3'),
    fire: new Audio('fire.mp3')
};

function toggleSound(type) {
    const audio = sounds[type];
    const btn = event.currentTarget;
    audio.loop = true;
    if (audio.paused) {
        audio.play();
        btn.classList.add('sound-active');
    } else {
        audio.pause();
        btn.classList.remove('sound-active');
    }
}

function changeVolume(type, volume) {
    sounds[type].volume = volume;
}

// --- QUOTE LOGIC ---
const motivationQuotes = [
    { q: "Code is like humor. When you have to explain it, it’s bad.", a: "Cory House" },
    { q: "First, solve the problem. Then, write the code.", a: "John Johnson" },
    { q: "Simplicity is the soul of efficiency.", a: "Austin Freeman" },
    { q: "Done is better than perfect.", a: "Sheryl Sandberg" },
    { q: "Code is like humor. When you have to explain it, it’s bad.", a: "Cory House" },
    { q: "Fix the cause, not the symptom.", a: "Steve Maguire" },
    { q: "Simplicity is the soul of efficiency.", a: "Austin Freeman" },
    { q: "Don't stop when you're tired. Stop when you're done.", a: "Unknown" },
    { q: "First, solve the problem. Then, write the code.", a: "John Johnson" },
    { q: "Focus is a matter of deciding what things you're not going to do.", a: "John Carmack" },
    { q: "The only way to do great work is to love what you do.", a: "Steve Jobs" },
    { q: "The secret of getting ahead is getting started.", a: "Mark Twain" },
    { q: "Focus is a matter of deciding what things you're not going to do.", a: "John Carmack" },
    { q: "Your mind is for having ideas, not holding them.", a: "David Allen" },
    { q: "Persistence is very important. You should not give up unless you are forced to give up.", a: "Elon Musk" },
    { q: "It always seems impossible until it's done.", a: "Nelson Mandela" },
    { q: "Don't comment bad code—rewrite it.", a: "Brian Kernighan" },
    { q: "Quality is a product of a thousand small decisions.", a: "Anonymous" },
    { q: "Simplicity is the ultimate sophistication.", a: "Leonardo da Vinci" },
    { q: "Done is better than perfect.", a: "Sheryl Sandberg" },
    { q: "Move fast and break things", a: "Mark Zuckerberg" },
    { q: "Code never lies, comments sometimes do.", a: "Ron Jeffries" },
    { q: "Hi! You have found an easter egg!", a: "Giorgi Mtsituri" }
];

document.getElementById('quote-btn').onclick = () => {
    const text = document.getElementById('quote-text');
    const author = document.getElementById('quote-author');
    const random = motivationQuotes[Math.floor(Math.random() * motivationQuotes.length)];

    text.style.opacity = 0;
    setTimeout(() => {
        text.innerText = `"${random.q}"`;
        author.innerText = `- ${random.a}`;
        text.style.opacity = 1;
    }, 300);
};

// --- INITIALIZE ---
updateDisplay();
renderTasks();