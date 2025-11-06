let debounceTimeout;
let currentDraggedElement;

/**
 * checks wich status a task has and appends it to the correct list to show in the task dashboard
 * 
 * @param {string} task - task id 
 * @param {string} status - status of a task
 */
function addTaskToBoardViewList(task, status) {

    if (status === 'todo') toDoList.push(task);
    else if (status === 'progress') inProgressList.push(task);
    else if (status === 'await') inAwaitList.push(task);
    else if (status === 'done') inDoneList.push(task);
}

/**
 * returns a empty box div if a list on the dashboard is empty
 */
function checkTaskStatusList() {

    if (toDoList == '') toDoList.push(emptyBox('To Do'));
    if (inProgressList == '') inProgressList.push(emptyBox('In Progress'));
    if (inAwaitList == '') inAwaitList.push(emptyBox('Await feedback'));
    if (inDoneList == '') inDoneList.push(emptyBox('Done'));
}

/**
 * appends a emptybox to each tasklist to be shown we a object is moved
 */
function appendTaskStatusEmptyBox() {
    let emptyBox = `<div class="emptyTaskBox"></div>`
    toDoList.push(emptyBox);
    inProgressList.push(emptyBox);
    inAwaitList.push(emptyBox);
    inDoneList.push(emptyBox);
}

/**
 * Checks how many subtasks are already done in a task, to show the status
 * 
 * @param {json} subTasks - a json where are all subtasks listet with a status: allowed vaules: done, open 
 * @returns - number of subtasks in status done
 */
function checkSubTasksDone(subTasks) {
    if (!subTasks) { return 0; }
    let subTasksIdArray = Object.keys(subTasks);
    let done = 0
    for (let index = 0; index < subTasksIdArray.length; index++) {
        if (subTasks[subTasksIdArray[index]]['status'] === 'done') {
            done += 1
        }
    }
    return (done)
}

/**
 * Builds the correct task type text shown on the task in the dashboard
 * 
 * @param {string} type - type of task as stored in the database
 * @returns - the correct type text that shall be shown on the task
 */
function getTaskCategoryName(type) {
    let categoryText
    if (type === 'technical') categoryText = 'Technical Task';
    if (type === 'userstory') categoryText = 'User Story';
    return (categoryText);
}

/**
 * Emptys all task lists on the dashboard to render a new view
 * 
 */
function emptyTaskLists() {
    toDoList = [];
    inProgressList = [];
    inAwaitList = [];
    inDoneList = [];
    toDoListArrow = []
    doneListArrow = [];
}

/**
 * gets the initials of a user for the usericon by splitting the surname and lastname and takes the first letter
 * 
 * @param {string} userName - Username in database
 * @returns - intials e.g. G  (Guest)
 */
function getUserInitials(userName) {
    let names = userName.split(" ");
    let initials = names.map(names => names.charAt(0)).join("");
    return (initials);
}

/**
 * start the search process by typing a value (string) in the search field on the task dashboard
 * 
 */
async function runSearchTask() {

    let tasksInDb = await fetchAllTasks();
    tasks = searchInTasks(tasksInDb);
    emptyTaskLists();
    await buildTask(tasks);
    checkTaskStatusList();
    document.getElementById('boardTaskList').innerHTML = await buildBoardContent(toDoList, inProgressList, inAwaitList, inDoneList);
}

/**
 * searches for the value of the search input in the tasks in the database by name or description
 * 
 * @param {list} tasksInDb - list of all tasks in the database
 * @returns - a list of found tasks that match the search input
 */
function searchInTasks(tasksInDb) {

    let input = document.getElementById('searchInput').value.toLowerCase();
    let tasksIdArray = Object.keys(tasksInDb);
    let tasks = [];

    for (let index = 0; index < tasksIdArray.length; index++) {

        if (tasksInDb[tasksIdArray[index]]['name'].toLowerCase().includes(input)) {
            tasks.push(tasksInDb[tasksIdArray[index]]);
        } else if (tasksInDb[tasksIdArray[index]]['description'].toLowerCase().includes(input)) {
            tasks.push(tasksInDb[tasksIdArray[index]]);
        }
    }
    return (tasks);
}

function debounce(func, delay) {
    return function () {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => func.apply(this, arguments), delay);
    };
}

/**
 * moves a task from a list to a other list, controlled by drag and drop on the task dashboard
 * 
 * @param {string} taskId - the element id that needs to be moved
 * @param {string} destination - the name of the target list. Valid options: todo, process, await, done
 */
function moveTask(taskId, destination) {
    data = { status: destination }
    updateTaskToDb(taskId, data)
}

/**
 * This function writes the id of the element you want to drag and drop to a global variable 
 * 
 * @param {string} id - id of the element you want to move 
 */
function startDragging(id) {
    currentDraggedElement = id;
    document.getElementById(id).classList.add('rotation');
    document.querySelectorAll('.emptyTaskBox').forEach(element => { element.classList.add('display-flex') });
    document.querySelectorAll('.emptyTaskContainerBoard').forEach(element => { element.style.display = 'none' });
}

/**
 * This function allows to move and trop a element on the task dashboard
 * 
 * @param {*} ev 
 */
function allowDrop(ev) {
    ev.preventDefault();
}

/**
 * This function moves a task to a different List of Tasks
 * 
 * @param {string} targetList - this is the name of the list where you move a task to: bsp todo -> process
 */
async function moveTo(targetList) {
    await updateTaskToDb(currentDraggedElement, { "status": targetList });
    moveTaskinLocalData(currentDraggedElement, targetList);
    document.getElementById('contentMainPageSite').innerHTML = await recreatBoard();
    removeSubtaskStatus();
}

/**
 * gets all details (subtasks, asigned users, priority, description) of a task
 * 
 * @param {string} taskId - taskId in the database
 * @returns 
 */
async function getTaskDetails(taskId) {

    let task = await getTask(taskId);
    let typeName = getTaskCategoryName(task['type']);
    let title = task['name'];
    let description = task['description'];
    let date = task['date']
    let prioDiv = getPrioDiv(task['prio']);
    let usersDiv = (Array.isArray(task['users'])) ? await getUserListForTask(task['users']) : [`<div></div>`];
    let subtaskDiv = (Array.isArray(task['subtasks'])) ? await subTaskListForTask(task['subtasks'], taskId) : [`<div></div>`];
    return ([typeName, task['type'], title, description, date, prioDiv, usersDiv, subtaskDiv]);
}

/**
 * closes the edit Task overlay
 */
function closeEditTaskOverlay() {
    document.getElementById('boardEditTaskOverlay').classList.remove('display');
    document.body.classList.remove('no-scroll');
    openBoardPage();
}

/**
 * Switches a subtask from done to not down or from not done to done
 * 
 * @param {string} taskId - task Id
 * @param {string} statusImg - name of the status image
 * @param {string} subtaskId - subtask Id
 */
async function changeSubTaskStatus(taskId, statusImg, subtaskId) {

    let newStatus;
    let subtasks = await getsubtasks(taskId);

    if (statusImg === 'checkBoxTrue.svg') {
        newStatus = 'open'
    } else {
        newStatus = 'done'
    }

    subtasks[subtaskId].status = newStatus;

    const data = { "subtasks": subtasks };
    // updateTaskToDb(taskId, JSON.stringify(data));
    await updateTaskToDb(taskId, data);
    updateSubtaskStatusIcon(taskId + subtaskId, newStatus, subtaskId, taskId);
}

/**
 * updates the status icon of a subtask
 * 
 * @param {string} corollationId - html id of the subtask
 * @param {string} newStatus - new status from a subtask e.g. open or done
 * @param {string} subtaskId - subtask Id
 * @param {string} taskId - task Id
 */
function updateSubtaskStatusIcon(corollationId, newStatus, subtaskId, taskId) {
    img = document.getElementById(corollationId);
    if (newStatus === "open") {
        img.src = './assets/img/checkBoxFalse.svg';
        img.onclick = function () { changeSubTaskStatus(taskId, 'checkBoxFalse.svg', subtaskId) };
    }
    if (newStatus === "done") {
        img.src = './assets/img/checkBoxTrue.svg';
        img.onclick = function () { changeSubTaskStatus(taskId, 'checkBoxTrue.svg', subtaskId) };
    }
}

/**
 * Opens the add Task overlay in the board and sets some standards e.g. prio medium
 */
async function boardAddTask() {
    document.getElementById('boardAddTaskOverlay').classList.add('display');
    document.body.classList.add('no-scroll');
    let html = await buildAddTaskPage();
    document.getElementById('boardAddTaskForm').innerHTML = html;
    document.getElementById('hidden-action-icons').classList.add('hidden');
    setMedium();
    let inputField = document.getElementById('subtasks');
    inputField.addEventListener('focus', showSubtaskActions);
    setMobileViewAddTaskBoard();
    setDateToday();
}

/**
 * closes the add Task overlay
 */
function closeBoardAddTaskOverlay() {
    document.getElementById('boardAddTaskOverlay').classList.remove('display');
    document.body.classList.remove('no-scroll');
}

/**
 * deletes a task
 * 
 * @param {string} taskId - Id of the task that shall be deleted
 */
async function deleteTask(taskId) {
    await deleteTaskInDb(taskId);
    closeEditTaskOverlay();
}

/**
 * formats the shown date of a task
 * 
 * @param {date} date - date in task
 * @returns - formated date
 */
function formatDate(date) {
    let formatedDate = new Date(date);
    let options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    formatedDate = formatedDate.toLocaleDateString('de-DE', options);
    return formatedDate;
}

/**
 * opens a given Task and shows the details that can be changed
 * 
 * @param {string} taskId - Id of the task that shall be edited
 */
async function editTask(taskId, typeName, tasktype) {
    taskData = await getTask(taskId);
    let html = await getTaskInformations(taskData, taskId, typeName, tasktype);
    document.getElementById('boardEditTaskContainer').innerHTML = html;

    await new Promise(r => setTimeout(r, 20));
    setPrio();
    setDateToday();
    buildSubTasks(taskData);
    selectStoredContacts(taskData);
}

/**
 * Builds the "Edit Task Content" by fetching user names and creating a user dropdown.
 * 
 * @param {Array} users - An array of user objects, where each object contains information about a user (e.g., name, ID).
 * @returns {HTMLElement} - The constructed edit task form with a dropdown menu of users.
 */
async function getTaskInformations(taskData, taskId, typeName, tasktype) {
    let allUsers = await getUserNames();
    let userList = buildUserNameDropDown(allUsers);
    return buildEditTaskContent(userList, taskData, taskId, typeName, tasktype);
}

/**
 * sets the prio after loading the task to bee shown at editTask
 */
async function setPrio() {

    if (taskData.prio === 'low') { setLow() }
    if (taskData.prio === 'medium') { setMedium() }
    if (taskData.prio === 'urgent') { setUrgent() }
}

/**
 * builds the list of subtasks in editTask
 * 
 * @param {json} taskData - Task data from the database in json
 */
function buildSubTasks(taskData) {

    if (taskData.subtasks) {
        for (let index = 0; index < taskData.subtasks.length; index++) {
            document.getElementById('subtask-list').appendChild(createSubtaskItem(taskData.subtasks[index]['subtaskname']))
        }
    }
}

/**
 * 
 * Close the overlay if nothing will be changed
 * @param {string} elementIdOverlay - html element id of the overlay
 * @param {string} elementIdContainer - html elemnt id of the overlay container
 */
function closeTaskOverlayOnly(elementIdOverlay, elementIdContainer) {
    const overlay = document.getElementById(elementIdOverlay);
    const container = document.getElementById(elementIdContainer);

    container.classList.remove('fly-in');
    container.classList.add('fly-out');

    container.addEventListener('animationend', function handleAnimationEnd() {
        container.removeEventListener('animationend', handleAnimationEnd);

        overlay.classList.remove('display');
        container.classList.remove('fly-out');
        container.classList.add('fly-in');
    });
}

/**
 * 
 * Close the overlay if something has been changed, deleted or edit
 * @param {string} elementIdOverlay - html element id of the overlay
 * @param {string} elementIdContainer - html elemnt id of the overlay container
 */
async function closeOpenTaskOverlay(elementIdOverlay, elementIdContainer) {
    let overlay = document.getElementById(elementIdOverlay);
    let element = document.getElementById(elementIdContainer);

    element.classList.remove('fly-in');
    element.classList.add('fly-out');

    element.addEventListener('animationend', function handleAnimationEnd() {
        overlay.classList.remove('display');
        element.classList.remove('fly-out');
        element.classList.add('fly-in');
        element.removeEventListener('animationend', handleAnimationEnd);
    });
    document.getElementById('contentMainPageSite').innerHTML = await getAllTasksFromDataBase();
    removeSubtaskStatus();
}

/**
 * sets the selected users of a task in the edit task window by getting them from the database
 * 
 * @param {json} taskData - Task data from the database in json
 */
function selectStoredContacts(taskData) {

    let usersArray = taskData.users;

    if (usersArray) {
        document.querySelectorAll('.user-checkbox').forEach(checkbox => {

            if (usersArray.includes(checkbox.id)) {
                checkbox.checked = true;
            }
        });
        trackSelectedContacts();
    }
}

/**
 * Updates a Task that has been updatet and closes the overlay
 *  
 * @param {string} taskId - Id of the edited task
 */
async function updateDataEditTask(taskId) {
    const taskData = await getTask(taskId);
    const taskJson = getEditTaskData(taskData);
    await updateTaskToDb(taskId, taskJson);
    closeOpenTaskOverlay('boardEditTaskOverlay', 'boardEditTaskContainer');
}

/**
 * Collects and returns all task data from the form fields as an object.
 *
 * @returns {Object} - The task data including date, description, title, priority, 
 *                     status, subtasks, type, and assigned users.
 */
function getEditTaskData(taskData) {
    const status = taskData?.status || "todo";

    const subtasks = {};
    document.querySelectorAll('#subtask-list .subtask-item').forEach((item, index) => {
        const name = item.textContent.trim();
        if (name) {
            subtasks[`subtask${index}`] = { subtaskname: name, status: "open" };
        }
    });

    const users = selectedContactsArray
        .map(contact => contact.id)
        .filter(id => id != null && id !== '');

    return {
        date: document.getElementById('due-date')?.value.trim() || "",
        description: document.getElementById('description')?.value.trim() || "",
        name: document.getElementById('task-title')?.value.trim() || "",
        prio: selectedPriority.toLowerCase() || "medium",
        status: status,
        subtasks: subtasks,
        users: users
    };
}