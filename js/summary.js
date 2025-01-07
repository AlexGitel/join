let countTaskSummery = 0;
let countTaskToDo = 0;
let countTaskInProgress = 0;
let countTaskAwaitFeedback = 0;
let countTaskDone = 0;

async function buildSummeryBoard(userName) {
    let tasks = await fetchAllTasks();
    countTasks(tasks);
    let tasksUrgent = getTasksUrgent(tasks);
    let taskDeadline = getTaskUrgentDeadline(tasks);
    if (userName = 'Guest') { userName = '' }
    let html = buildSummeryPage(countTaskToDo, countTaskDone, tasksUrgent, taskDeadline, countTaskSummery, countTaskInProgress, countTaskAwaitFeedback, userName);
    return html;
}


function countTasks(tasks) {

    emptyCountLists()
    let tasksIdArray = Object.keys(tasks);
    countTaskSummery = tasksIdArray.length;
    for (let index = 0; index < tasksIdArray.length; index++) {
        if (tasks[tasksIdArray[index]]['status'] == 'todo') countTaskToDo += 1;
        if (tasks[tasksIdArray[index]]['status'] == 'progress') countTaskInProgress += 1;
        if (tasks[tasksIdArray[index]]['status'] == 'await') countTaskAwaitFeedback += 1;
        if (tasks[tasksIdArray[index]]['status'] == 'done') countTaskDone += 1;
    }
}


function emptyCountLists() {
    [countTaskSummery, countTaskToDo, countTaskInProgress, countTaskAwaitFeedback, countTaskDone] = [0, 0, 0, 0, 0];
}


function getTasksUrgent(tasks) {

    let counter = 0
    let tasksIdArray = Object.keys(tasks);

    for (let index = 0; index < tasksIdArray.length; index++) {
        if (tasks[tasksIdArray[index]]['prio'] == 'urgent' && tasks[tasksIdArray[index]]['status'] != 'done') counter += 1;
    }
    return counter;
}


function getTaskUrgentDeadline(tasks) {
    let Deadlines = []
    let tasksIdArray = Object.keys(tasks);

    for (let index = 0; index < tasksIdArray.length; index++) {
        Deadlines.push(tasks[tasksIdArray[index]]['date'])
    }
    closest = findClosestDeadline(Deadlines);
    closest = formatDate(closest)
    return closest
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


/**
 * to greet Users depending on the time of day
 * desktop
 */
function userGreeting() {
    const greetingElement = document.getElementById('userGreeting');
    const currentHour = new Date().getHours();
    let greetingText;

    if (currentHour >= 5 && currentHour < 12) {
        greetingText = "Good morning ";
    } else if (currentHour >= 12 && currentHour < 18) {
        greetingText = "Good day ";
    } else if (currentHour >= 18 && currentHour < 22) {
        greetingText = "Good evening ";
    } else {
        greetingText = "Good night ";
    }
    greetingElement.textContent = `${greetingText}`;
}


/**
 * to greet Users depending on the time of day
 * start overlay mobile
 */
function userGreetingMobile() {
    const greetingElement = document.getElementById('userGreetingMobile');
    const currentHour = new Date().getHours();
    let greetingText;

    if (currentHour >= 5 && currentHour < 12) {
        greetingText = "Good morning ";
    } else if (currentHour >= 12 && currentHour < 18) {
        greetingText = "Good day ";
    } else if (currentHour >= 18 && currentHour < 22) {
        greetingText = "Good evening ";
    } else {
        greetingText = "Good night ";
    }
    greetingElement.textContent = `${greetingText}`;
}