let jsonTaskTemplate = {
        "date": "",
        "description": "",
        "name": "",
        "prio": "",
        "status": "",
        "subtasks": "",
        "type": "",
        "users": ""}


const baseUrl = 'https://join-c4326-default-rtdb.europe-west1.firebasedatabase.app/'


/**
 * gets all Tasks from the database
 * 
 * @returns - a json of all tasks returned by the database
 */
async function fetchAllTasks(){
    let tasks = await (await fetch(baseUrl + "tasks.json")).json();
    return(tasks);
}


/**
 * gets all informations of a specific task
 * 
 * @param {string} taskId - id of the specific task 
 * @returns 
 */
async function getTask(taskId){
    let task = await (await fetch(baseUrl + "tasks/" + taskId + ".json")).json();
    return(task);
}


/**
 * gets all informations of a specific task
 * 
 * @param {string} taskId - id of the specific task 
 * @returns 
 */
async function getsubtasks(taskId){
    let task = await (await fetch(baseUrl + "tasks/" + taskId + "/subtasks.json")).json();
    return(task);
}



/**
 * gets all Users from the database
 * 
 * @returns - a json of all users returned by the database
 */
async function getAllUsers(){
    let users = await (await fetch(baseUrl + "users.json")).json();
    return(users)
}


/**
 * load user information of a user
 * 
 * @param {string} userId - id of a user
 * @returns - a json of all informations about a user returned by the database
 */
async function  loadUserFromDb(userId) {
    let user = await (await fetch(baseUrl + "users/" + userId + ".json")).json();
    return(user);
}


/**
 * adds a task to the database
 
* jsonTaskTemplate = {
        "date": "string", 2024-04-01
        "description": "string",
        "name": "string",
        "prio": "string", low, medium, high
        "status": "string",
        "subtasks": "json of subtasks",
        "type": "string",
        "users": "json of users"}
 * 
 * @param {json} data - a json with all informations that shall be writen in the database
 * 
 */
async function addTaskToDb(data) {
    await fetch(baseUrl + "tasks.json", {
        method: "POST",
        header: {
            "Content-Type": "application/json"
        },
        
        body: JSON.stringify(data)
    })
}


/**
 * updates task informations in the database
 * 
 * @param {string} taskId - id of the task 
 * @param {json} taskJson - json with the informations that shall be updated eg. {"name":"max default", "status":"done"} ...
 *
 */
async function updateTaskToDb(taskId, taskJson) {
    
    await fetch(baseUrl + "tasks/" + taskId + ".json", {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: (taskJson)
    })
}


/**
 * adds a new user to the database
 * @param {json} data - user informations in a json eg. "name":"test user", "email":"testuser@test.de"
 */
async function addUserToDb(data) {
    let response = await fetch(baseUrl + "users.json", {
        method: "POST",
        header: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    let responseData = await response.json();
    let responseId = responseData.name;
    return(responseId);
}


/**
 * updates a new user to the database
 * @param {json} params - user informations in a json 
 */
async function updateUserToDb(data, userId) {
    await fetch(baseUrl + "users/" + userId + ".json", {
        method: "PATCH",
        header: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
}


/**
 * deletes a exisitng user in the database
 * 
 * @param {string} userId 
 */
async function deleteUserInDb(userId) {
    await fetch(baseUrl + "users/" + userId + ".json", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    })
    await removeDelUserFromTask(userId)
}


/**
 * deletes a existing task in the database
 * 
 * @param {string} taskId 
 */
async function deleteTaskInDb(taskId) {
    await fetch(baseUrl + "tasks/" + taskId + ".json", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    })
}


/**
 * json template to create a new task
 * - Push Users as a List Object => ['1', '4', '5']
 * - Push Tasks as a List Object => [{"status":"done", "subtaskname": "testtask"}, {"status":"done", "subtaskname": "testtask"}] 
 * 
 * @param {string} date 
 * @param {string} description
 * @param {string} name 
 * @param {string} prio 
 * @param {string} status 
 * @param {json} subtasks 
 * @param {string} type 
 * @param {json} users 
 * @returns 
 */
function dbTaskJsonTemplate(date, description, name, prio, status, subtasks, type, users) {
    
    let json = jsonTaskTemplate;     
    json.date = date;
    json.description = description;
    json.name = name;
    json.prio = prio;
    json.status = status;
    json.subtasks = subtasks;
    json.type = type;
    json.users = users;
    return(json)
}


/**
 * removes a deleted user from all tasks that the user is asigned to 
 * 
 * @param {string} userId - Id of the deleted user
 */
async function removeDelUserFromTask (userId) {

    let tasks = await fetchAllTasks();
    let tasksIdArray = Object.keys(tasks);
    
    for (let i = 0; i < tasksIdArray.length; i++) {
        
        tasks = await fetchAllTasks();
        let tasksUserArray
        let userInTask = false
        if (tasks[tasksIdArray[i]]['users'] !== undefined) {tasksUserArray = Object.keys(tasks[tasksIdArray[i]]['users'])} else {continue};
        
        for (let x = 0; x < tasksUserArray.length; x++) {
            if ((tasks[tasksIdArray[i]]['users'][tasksUserArray[x]]) == userId) {
                userInTask = true
            }
            }
        if (userInTask === true) {
            newUserList = (tasks[tasksIdArray[i]]['users']);
            
            let indexVal = newUserList.indexOf(userId);
            if (indexVal !== -1) {newUserList.splice(indexVal, 1);}
            
            let json = ('{"users":' + JSON.stringify(newUserList)+ '}');
            updateTaskToDb(tasksIdArray[i], json)
        }
    
        userInTask = false;
}
}