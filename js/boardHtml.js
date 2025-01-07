let tasks = {}
let usersDataArray = {}
let subTaskNone = []


/**
 * gets all tasks from the database, builds the task dashboard view and retruns the html content
 * 
 * @returns - html content
 */
async function getAllTasksFromDataBase() {

    emptyTaskLists();
    tasks = await fetchAllTasks();
    await buildTask(tasks);
    let content = buildBoard();
    checkMobileTaskMoveBtn();
    return (content)
}


/**
 * recreates the Board after moving a task 
 * 
 * @returns - html content of the board
 */
async function recreatBoard(){
    emptyTaskLists();
    await buildTask(tasks);
    let content = buildBoard();
    checkMobileTaskMoveBtn();
    return (content)
}


/**
 * moves a task to a new list in locat data
 * 
 * @param {string} taskId - Id of the task
 * @param {string} destination - destination status list
 */
async function moveTaskinLocalData(taskId, destination){
    
    tasks[taskId].status = destination;
}


/**
 * builds a task for the small view on the task dashboard
 * 
 * @param {json} tasks - a json of all tasks that shall be shown on the dashboard
 */
async function buildTask(tasks) {

    let tasksIdArray = Object.keys(tasks);

    for (let i = 0; i < tasksIdArray.length; i++) {
        let shortDescription = tasks[tasksIdArray[i]]['description'];
        let subTasksDone = checkSubTasksDone(tasks[tasksIdArray[i]]['subtasks']);
        let subTasksTotal = tasks[tasksIdArray[i]]['subtasks'] ? tasks[tasksIdArray[i]]['subtasks'].length : 0;
        let usersIcons = (Array.isArray(tasks[tasksIdArray[i]]['users'])) ? await getUserIconsList(tasks[tasksIdArray[i]]['users'], 'userIconForSmallTask') : [`<div></div>`];
        let category = getTaskCategoryName(tasks[tasksIdArray[i]]['type']);
        let task = await boardTaskTemplate(tasks[tasksIdArray[i]]['name'], shortDescription, tasks[tasksIdArray[i]]['type'], category, subTasksDone, subTasksTotal, usersIcons, tasks[tasksIdArray[i]]['prio'], [tasksIdArray[i]], tasks[tasksIdArray[i]]['status']);
        let taskStatus = tasks[tasksIdArray[i]]['status'];
        subTaskIsEmpty([tasksIdArray[i]], tasks[tasksIdArray[i]]['subtasks']);
        addTaskToBoardViewList(task, taskStatus);
        holdTaskStatus([tasksIdArray[i]], taskStatus);
    }
}


/**
 * checks if there are subtasks to disable later the subtask status
 * 
 * @param {string} taskId - Id of the given task
 * @param {array} subtasks - list of subtasks
 */
function subTaskIsEmpty(taskId, subtasks) {
    if (typeof subtasks === "undefined") {
        subTaskNone.push(taskId)
    }
}


/**
 * removes the subtask status for all tasks without subtasks
 */
async function removeSubtaskStatus() {
    await pause(50);
    for (let index = 0; index < subTaskNone.length; index++) {
        document.getElementById('subTaskStatus-' + subTaskNone[index]).classList.add('d-none')        
    }
}


/**
 * builds the task board
 * - builds the head with searchbar
 * - checks if a task list is empty
 * - builds the html content
 * @returns - the html content
 */
async function buildBoard() {

    let content
    content = buildTaskBoardHead();
    checkTaskStatusList();
    appendTaskStatusEmptyBox();
    content += buildBoardContent(toDoList, inProgressList, inAwaitList, inDoneList);
    return (content)
}


/**
 * builds the user icon 
 * - gets initals of user 
 * - builds the icon with the specific color
 * 
 * @param {list} users - list of users that should be shown as assigend user on a task
 * @returns - a list of the user icons
 */
async function getUserIconsList(users, iconType) {

    let userIcons = []
    for (let index = 0; index < users.length; index++) {
        let userInformations = usersDataArray[users[index]];
        let userInitials = getUserInitials(userInformations['name']);
        let icon = buildUserIcon(userInitials, userInformations['color'], iconType)
        userIcons.push(icon);
    }
    return (userIcons);
}


/**
 * collects all data of a task and generates the hmtl code to show the task details
 * 
 * @param {string} taskId - taskId in the database
 */
async function openTask(taskId) {
    let taskDetails = await getTaskDetails(taskId);
    let date = formatDate(taskDetails[4]);
    let html = showTaskOverlayTemplate(taskDetails[0], taskDetails[1], taskDetails[2], taskDetails[3], date, taskDetails[5], taskDetails[6], taskDetails[7], taskId);

    document.getElementById('boardEditTaskOverlay').classList.add('display');
    document.getElementById('boardEditTaskOverlay').innerHTML = html;
    document.body.classList.add('no-scroll');
}


/**
 * checks the task priority of a task and sets the correct priority image
 * 
 * @param {string} prio - prio name (low, medium, urgent) 
 * @returns - returns the html code to show the priority of a task
 */
function getPrioDiv(prio) {
    let prioImg
    if (prio === 'low') {
        prioImg = "priolowSmall.svg"
    }
    if (prio === 'medium') {
        prioImg = "priomediumSmall.svg"
    }
    if (prio === 'urgent') {
        prioImg = "priourgentSmall.svg"
    }
    html = prioDivOpenTask(prio, prioImg);
    return html;
}


/**
 * Gets all user informations that are needed to been shown on a task
 * 
 * @param {list} users - list of user Id´s
 * @returns - returns a html element to show asigned users
 */
async function getUserListForTask(users) {

    let usersDiv = []
    for (let index = 0; index < users.length; index++) {
        let userData = await loadUserFromDb(users[index]);
        let userList = [];
        userList.push(users[index]);
        let userIcon = await getUserIconsList(userList, 'userIconForOpenTask');
        let html = showTaskUserList(userIcon, userData['name']);
        usersDiv.push(html);
    }
    return usersDiv;
}


/**
 * Checks the status of all subtasks and builds the html code to show the status
 * 
 * @param {list} subtasks - list of all subtasks to a task
 * @param {string} taskId - id of a task
 * @returns - html code with the status view
 */
async function subTaskListForTask(subtasks, taskId) {

    let html = []
    for (let index = 0; index < subtasks.length; index++) {

        let statusImg
        if (subtasks[index]['status'] === 'done') { statusImg = 'checkBoxTrue.svg' };
        if (subtasks[index]['status'] === 'open') { statusImg = 'checkBoxFalse.svg' };
        subtaskHtml = showTaskSubTaskElement(statusImg, subtasks[index]['subtaskname'], taskId, index);
        html.push(subtaskHtml);
    }
    return html
}


function setMobileViewAddTaskBoard() {
    document.getElementById('taskActionBtnContainer').classList.add('addTaskInBoardMobile');

}