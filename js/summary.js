let countTaskSummery = 0;
let countTaskToDo = 0;
let countTaskInProgress = 0;
let countTaskAwaitFeedback = 0;
let countTaskDone = 0;

async function buildSummeryBoard(userName) {
    let tasks = await fetchAllTasks();
    if (!tasks) tasks = {};

    countTasks(tasks);
    let tasksUrgent = getTasksUrgent(tasks);
    let taskDeadline = getTaskUrgentDeadline(tasks);

    if (userName === 'Guest') { userName = 'Guest'; }

    let html = buildSummeryPage(
        countTaskToDo,
        countTaskDone,
        tasksUrgent,
        taskDeadline,
        countTaskSummery,
        countTaskInProgress,
        countTaskAwaitFeedback,
        userName
    );
    return html;
}

function countTasks(tasks) {
    emptyCountLists();
    let tasksIdArray = Object.keys(tasks);
    countTaskSummery = tasksIdArray.length;

    for (let index = 0; index < tasksIdArray.length; index++) {
        const task = tasks[tasksIdArray[index]];
        if (!task) continue;

        switch (task.status) {
            case 'todo':
                countTaskToDo += 1;
                break;
            case 'progress':
                countTaskInProgress += 1;
                break;
            case 'await':
                countTaskAwaitFeedback += 1;
                break;
            case 'done':
                countTaskDone += 1;
                break;
        }
    }
}

function emptyCountLists() {
    [countTaskSummery, countTaskToDo, countTaskInProgress, countTaskAwaitFeedback, countTaskDone] = [0, 0, 0, 0, 0];
}

function getTasksUrgent(tasks) {
    let counter = 0;
    let tasksIdArray = Object.keys(tasks);

    for (let index = 0; index < tasksIdArray.length; index++) {
        const task = tasks[tasksIdArray[index]];
        if (!task) continue;

        if (task.prio === 'urgent' && task.status !== 'done') counter += 1;
    }
    return counter;
}

function getTaskUrgentDeadline(tasks) {
    let deadLines = [];
    let tasksIdArray = Object.keys(tasks);

    for (let index = 0; index < tasksIdArray.length; index++) {
        const task = tasks[tasksIdArray[index]];
        if (!task || !task.date) continue;
        deadLines.push(task.date);
    }

    if (deadLines.length === 0) return 'No deadlines';

    let closest = findClosestDeadline(deadLines);
    closest = formatDate(closest);
    return closest;
}

function findClosestDeadline(dates) {
    let today = new Date();
    let closestDate = dates[0];
    let minDiff = Math.abs(new Date(dates[0]) - today);

    for (let i = 1; i < dates.length; i++) {
        let currentDiff = Math.abs(new Date(dates[i]) - today);
        if (currentDiff < minDiff) {
            minDiff = currentDiff;
            closestDate = dates[i];
        }
    }
    return closestDate;
}

// === User greeting functions ===
function userGreeting() {
    const greetingElement = document.getElementById('userGreeting');
    if (!greetingElement) return;

    const greetingText = getGreetingText();
    greetingElement.textContent = greetingText;
}

function userGreetingMobile() {
    const greetingElement = document.getElementById('userGreetingMobile');
    if (!greetingElement) return;

    const greetingText = getGreetingText();
    greetingElement.textContent = greetingText;
}

function getGreetingText() {
    const currentHour = new Date().getHours();
    if (currentHour >= 5 && currentHour < 12) return "Good morning ";
    if (currentHour >= 12 && currentHour < 18) return "Good day ";
    if (currentHour >= 18 && currentHour < 22) return "Good evening ";
    return "Good night ";
}