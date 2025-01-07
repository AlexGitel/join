toDoListArrow = []
doneListArrow = []


/**
 * checks the status and calls a fucntion that adds a move up button in mobile view to move the task to other status
 * 
 * @param {string} status 
 * @param {string} taskId 
 */
function moveTaskUpMobile(status, taskId) {
    event.stopPropagation();
    if (status === 'progress') {moveTaskToMobile(taskId, 'todo')}
    if (status === 'await') {moveTaskToMobile(taskId, 'progress')}
    if (status === 'done') {moveTaskToMobile(taskId, 'await')}
}

/**
 * checks the status and calls a fucntion that adds a move down button in mobile view to move the task to other status
 * 
 * @param {string} status 
 * @param {string} taskId 
 */
function moveTaskDownMobile(status, taskId) {
    event.stopPropagation();
    if (status === 'todo') {moveTaskToMobile(taskId, 'progress')}
    if (status === 'progress') {moveTaskToMobile(taskId, 'await')}
    if (status === 'await') {moveTaskToMobile(taskId, 'done')}
}


/**
 * This function moves a task to a different List of Tasks
 * 
 * @param {string} targetList - this is the name of the list where you move a task to: bsp todo -> process
 */
async function moveTaskToMobile(taskId, targetList) {

    await updateTaskToDb(taskId, JSON.stringify({ "status": targetList }));
    document.getElementById('contentMainPageSite').innerHTML = await getAllTasksFromDataBase();
}


/**
 * adds the mobile button to move the task
 */
async function checkMobileTaskMoveBtn() {
    
    await pause(50);
    for (let index = 0; index < toDoListArrow.length; index++) {
        let taskId = 'moveTaskUp-' + toDoListArrow[index];
        document.getElementById(taskId).classList.add('d-none')
    }
    
    for (let index = 0; index < doneListArrow.length; index++) {
        let taskId = 'moveTaskDown-' + doneListArrow[index];
        document.getElementById(taskId).classList.add('d-none')
    }
}


/**
 * checks the status of a task and adds it to a list to stear the up and down buttons
 * 
 * @param {string} taskId 
 * @param {string} taskStatus 
 */
function holdTaskStatus(taskId, taskStatus) {
    if (taskStatus === 'todo') {toDoListArrow.push(taskId)}
    if (taskStatus === 'done') {doneListArrow.push(taskId)}
}


/**
 * pause until all tasks are loaded
 * 
 * @param {int} ms 
 * @returns 
 */
function pause(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}