/**
 * html template to build the small task on the task dasbboard
 * 
 * @param {string} name 
 * @param {string} shortDescription 
 * @param {string} categoryColor 
 * @param {string} category 
 * @param {string} subTasksDone 
 * @param {string} subTasksTotal 
 * @param {list} users - list of user icons
 * @param {string} prio 
 * @param {string} taskId 
 * @returns - a html for the small task view
 */
function boardTaskTemplate(name, shortDescription, categoryColor, category, subTasksDone, subTasksTotal, users, prio, taskId, status) {
    return /* html */ `
    <div onclick="openTask('${taskId}')" id="${taskId}" class="taskContainerBoard flex-column cursor taskContainerInnerPadding" ondragstart="startDragging('${taskId}')" draggable="true">
        <div class="boardTaskBoxHeadline">
            <p class="taskCategory ${categoryColor}">${category}</p>
            <div class="display-flex">
                <img class="moveTaskUp moveArrow" id="moveTaskUp-${taskId}" src="./assets/img/arrowUp.svg" onclick="moveTaskUpMobile('${status}', '${taskId}')">
                <img class="moveTaskDown moveArrow" id="moveTaskDown-${taskId}" src="./assets/img/arrowDown.svg" onclick="moveTaskDownMobile('${status}', '${taskId}')">
            </div>
        </div>
        <div class="flex-column taskContainerInnerPadding">    
            <a class="taskTitle">${name}</a>
            <a style="color:#A8A8A8;padding-top:8px;font-size:16px;">${shortDescription.slice(0, 42)}...</a>
        </div>
        <div class="taskContainerInnerPadding subtasksStatus" id="subTaskStatus-${taskId}">
            <progress class="progressBar" id="progressBar" value="${subTasksDone}" max="${subTasksTotal}"></progress>
            <a class="subTaskProgressValues">${subTasksDone}/${subTasksTotal} Subtasks</a>
        </div>
        <div class="taskContainerInnerPadding taskUser-prio">
            <div class="userIconsContainer">
                ${users.map(item => `<div>${item}</div>`).join('')}
            </div>
            <div><img src="./assets/img/prio${prio}Small.svg"></div>
        </div>
    </div>
    `
}


/**
 * builds the columns on the task dashboard
 * 
 * @param {list} toDoList - list of tasks
 * @param {list} inProgressList - list of tasks
 * @param {list} inAwaitList - list of tasks
 * @param {list} inDoneList - list of tasks
 * @returns - a html with the four task lists
 */
function buildBoardContent(toDoList, inProgressList, inAwaitList, inDoneList) {
    return /* html */ `
        <div class="boardTaskColumnHeadlineDiv">
            <div class="boardRubrikHead"><a class="boardRubrikTitle">To do</a><button onclick="boardAddTask()" class="cursor addSubTaskBtn addTaskBtnDesk"></button><button onclick="window.location.href='./addtask.html';" class="cursor addSubTaskBtn addTaskBtnMobile"></button></div>
            <div ondragover="allowDrop(event)" ondragover="allowDrop(event)" ondrop="moveTo('todo')" class="boardTaskColumn">${toDoList.map(item => `${item}`).join('')}</div>                
        </div>
        <div class="boardTaskColumnHeadlineDiv">
            <div class="boardRubrikHead"><a class="boardRubrikTitle">In progress</a><button onclick="boardAddTask()" class="cursor addSubTaskBtn addTaskBtnDesk"></button></button><button onclick="window.location.href='./addtask.html';" class="cursor addSubTaskBtn addTaskBtnMobile"></div>
            <div ondragover="allowDrop(event)" ondragover="allowDrop(event)" ondrop="moveTo('progress')" class="boardTaskColumn">${inProgressList.map(item => `${item}`).join('')}</div>
        </div>
        <div class="boardTaskColumnHeadlineDiv">
            <div class="boardRubrikHead"><a class="boardRubrikTitle">Await feedback</a><button onclick="boardAddTask()" class="cursor addSubTaskBtn addTaskBtnDesk"></button></button><button onclick="window.location.href='./addtask.html';" class="cursor addSubTaskBtn addTaskBtnMobile"></div>
            <div ondragover="allowDrop(event)" ondragover="allowDrop(event)" ondrop="moveTo('await')" class="boardTaskColumn">${inAwaitList.map(item => `${item}`).join('')}</div>
        </div>
        <div class="boardTaskColumnHeadlineDiv">
            <div class="boardRubrikHead"><a class="boardRubrikTitle">Done</a></div>
            <div ondragover="allowDrop(event)" ondragover="allowDrop(event)" ondrop="moveTo('done')" class="boardTaskColumn">${inDoneList.map(item => `${item}`).join('')}</div>
        </div>
    `;
}


/**
 * creates a empty box if a task list is empty
 * 
 * @param {string} column - name to be shown in the box
 * @returns - html for the empty box
 */
function emptyBox(column) {
    return /* html */ `
        <div class="emptyTaskContainerBoard">
            <a>No tasks ${column}</a>
        </div>
    `;
}


/**
 * Builds the head task dashboard with the searchbar, add task button and column titles
 * 
 * @returns - html for the head of task dashboard
 */
function buildTaskBoardHead() {
    return /* html */ `
    <div class="boardHeadDiv">
        <div class="headLine_searchBar">
            <div class="boardHeadlineMobile">
                <a class="headLineText">Board</a> 
                <a onclick="window.location.href='./addtask.html'" class='addTaskBoardBtnMobile cursor'></a>
            </div>                 
            <div class="searchContainerAndAddTaskBtn">
                <div class="searchContainer">
                    <input type="text" placeholder="Find Task" class="inputSearch cursor" id="searchInput" oninput="debounce(runSearchTask, 300)()">
                    <img class="cursor" src="./assets/img/searchButton.svg">
                </div>
                <a onclick="boardAddTask()" class='addTaskBoardBtn cursor'></a>
            </div>
        </div>
    </div>  
        <div id="boardTaskList" class="boardTasksDiv">
    `;
}


/**
 * Builds the user icon 
 * 
 * @param {string} initials - the initials that shall be shown in the icon
 * @param {string} color - color of the icon
 * @returns - html with the user icon
 */
function buildUserIcon(initials, color, iconStyle) {
    return /* html */ `<div style="background-color: ${color}" class="taskUserIcon ${iconStyle}">${initials}</div>`;
}


function showTaskOverlayTemplate(typeName, tasktype, title, description, date, prioDiv, userDiv, subTaskDiv, taskId) {
    return /* html */ `

            <div id="boardEditTaskContainer" class="boardEditTaskContainer fly-in" onclick="event.stopPropagation()">

                <div class="editTaskHead"> 
                    <div class="${tasktype} openTaskType">${typeName}</div>
                    <div>
                        <a onclick="closeOpenTaskOverlay('boardEditTaskOverlay', 'boardEditTaskContainer')" class="editCloseSign cursor"></a>
                    </div>
                </div>



                <h1 class="padTop25 openTaskHeadline">${title}</h1>
                <a class="font-size20">${description}</a>
                <div class="display-flex padTop25">
                    <a class="font-size20 textColorColumnTitle taskOpenColumnHeadline">Due date:</a>
                    <a class="font-size20">${date}</a>
                </div>
                <div class="display-flex padTop25">
                    <a class="font-size20 textColorColumnTitle taskOpenColumnHeadline">Priority:</a>
                    ${prioDiv}                       
                </div>
                <a class="font-size20 textColorColumnTitle padTop25">Assigned To:</a>
                <div class="openTaskUserList">
                    ${userDiv.map(item => `<div>${item}</div>`).join('')}
                </div>

                <a class="font-size20 textColorColumnTitle padTop25">Subtasks</a>
                
                <div class="editSubTaskDiv">
                    ${subTaskDiv.map(item => `<div>${item}</div>`).join('')}
                </div>

                <div class="display-flex editActionBtnDiv padTop25">
                    <a onclick="deleteTask('${taskId}')" class="deleteButtonText cursor"></a>
                    <div class="dividingActionBtns"></div>
                    <a onclick="editTask('${taskId}')" class="editButtonText cursor"></a>
                </div>
            </div>
    `;
}


function showTaskUserList(userIcon, username) {
    return /* html */ `
        <div class="display-flex taskUserDiv">
            ${userIcon}
            <a class="font-size19">${username}</a>
        </div>
    `;
}


function showTaskSubTaskElement(statusImg, subTask, taskId, subtaskId) {
    return  /* html */`
        <div class="display-flex editSubTask">
            <img id="${taskId}${subtaskId}" onclick="changeSubTaskStatus('${taskId}', '${statusImg}', '${subtaskId}')" class="editSubTaskCheckbox cursor" src="./assets/img/${statusImg}">
            <a>${subTask}</a>
        </div>
    `;
}


function prioDivOpenTask(prio, prioImg) {
    return /* html */`
        <div class="align-center display-flex">
            <a class="font-size20">${prio}</a>
            <img class="editPriorityIcon" src="./assets/img/${prioImg}">
        </div>    
    `;
}


function htmlTaskListHeadLineToDo() {
    return `<div class="boardRubrikHead">
                <a class="boardRubrikTitle">To do</a>
                <button onclick="boardAddTask()" class="cursor addSubTaskBtn"></button>
            </div>`
}


function htmlTaskListHeadLineProgress() {
    return `<div class="boardRubrikHead">
                <a class="boardRubrikTitle">In progress</a>
                <button onclick="boardAddTask()" class="cursor addSubTaskBtn"></button>
            </div>`
}


function htmlTaskListHeadLineAwaitFeedback() {
    return `<div class="boardRubrikHead">
                <a class="boardRubrikTitle">Await feedback</a>
                <button onclick="boardAddTask()" class="cursor addSubTaskBtn"></button>
            </div>`
}


function htmlTaskListHeadLineDone() {
    return `<div class="boardRubrikHead">
                <a class="boardRubrikTitle">Done</a>
            </div>`
}


function buildEditTaskContent(users, taskData, taskId) {
    return /* html */`
    
        <div class="head-section">
            <div>
                <a onclick="closeOpenTaskOverlay('boardEditTaskOverlay', 'boardEditTaskContainer')" class="editCloseSign cursor"></a>
            </div>
        </div>   

            <div class="edit-task-container">
                <div class="edit-task-content">
                    <div class="task-input">
                        <label for="task-title">Title</label>
                        <input required type="text" id="task-title" oninput="validateForm()" class="addTaskInputSpace" value="${taskData.name}">
                        <span class="error-message" style="display: none; color: red;">This field is required</span>
                    </div>

                    <div class="task-input margin">
                        <label for="description">Description</label>
                        <textarea class="addTaskInputSpace" id="description" oninput="validateForm()">${taskData.description}</textarea>
                    </div>   
                
                    <div class="task-input">
                        <form style="margin-top: 20px;">
                            <label for="due-date">Due date</label>
                            <input class="addTaskInputSpace" type="date" required id="due-date" value="${taskData.date}" oninput="validateForm()">
                            <span class="error-message" style="display: none; color: red;">This field is required</span>
                        </form>
                    </div>

                    <div class="task-input priority margin">
                        <span class="section-label">Prio</span>

                        <div class="priority-buttons">
                            <button type="button" onclick="setUrgent(); validateForm();" class="priority-button urgen">Urgent
                                <img src="./assets/img/urgent.svg" alt="Urgent">
                            </button>

                            <button type="button" onclick="setMedium(); validateForm();" class="priority-button medium">Medium
                                <img src="./assets/img/equal-sign.ico" alt="Medium">
                            </button>

                            <button type="button" onclick="setLow(); validateForm();" class="priority-button low">Low
                                <img src="./assets/img/low.svg" alt="Low">
                            </button>
                        </div>
                    </div>

                   
                    <div style="position:relative;">
                        <div class="task-input margin">
                            <span class="section-label">Assigned to</span>

                            <div onclick="toggleContactsDropdown()" id="assigned-to-container" class="custom-dropdown">
                                <span id="assigned-to-count">Select contacts to assign</span>
                            
                                <div class="selected-options"></div>

                                <div class="drop-down-icon-container" onclick="event.stopPropagation(); toggleContactsDropdown()">
                                    <img id="dropdown-icon-down" class="dropdown-icon" src="./assets/img/arrow_drop_down.svg">
                                    <img id="dropdown-icon-up" class="dropdown-icon d-none" src="./assets/img/arrow_drop_up.svg">
                                </div>
                            </div>   
                        </div>

                        <div id="assigned-to-options" class="dropdown-options">
                            <span>${users}</span>
                        </div>

                        <div id="selected-contacts" class="contacts-selected">
                            <!-- Selected contacts will be displayed here -->
                        </div>
                    </div>


                
                    <div class="task-input margin">
                        <label for="subtasks">Subtasks</label>
                
                        <div class="subtask-wrapper">
                            <input type="text" id="subtasks" placeholder="Add new subtask" oninput="validateForm()">
                            <div class="icon-wrapper">
                                <div id="plus-icon" class="add-subtask" onclick="showSubtaskActions()">
                                    <img src="./assets/img/add.svg" alt="plus-button">
                                </div>
                            </div>

                                        <!-- usualy hidden -->
                            <div class="hidden-action-icons" id="hidden-action-icons">
                                <div id="x-icon" class=" close-done-icons action-icon d-none" onclick="cancelSubtask()">
                                    <img src="./assets/img/Close.svg" alt="close-button">
                                </div>
                                    <hr id="icon-divider" class="icon-divider d-none">
                                <div id="check-icon" class="close-done-icons action-icon d-none" onclick="addSubtask(); validateForm();">
                                    <img src="./assets/img/done.svg" alt="done-button">
                                </div>
                            </div>
                        </div>
                            <ul id="subtask-list" class="subtask-list"></ul> 
                    </div>

                        <!-- Hidden input for subtasks -->
                        <input type="hidden" id="subtask-data" name="subtasks">
                </div>
            </div>

            <div id="selected-category" class="selected-options d-none" onclick="validateForm()">${taskData.type}</div>
        
        <div class="futter-section">
            <button onclick="updateDataEditTask('${taskId}')" type="submit" id="createTaskButton" class="ok-button">Ok
                <img src="./assets/img/check.svg" alt="">
            </button>
        </div>  
    `;
}