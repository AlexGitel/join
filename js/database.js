let jsonTaskTemplate = {
    "date": "",
    "description": "",
    "name": "",
    "prio": "",
    "status": "",
    "subtasks": "",
    "type": "",
    "users": ""
}

const baseUrl = 'https://realtime-database-d6d9e-default-rtdb.europe-west1.firebasedatabase.app/'

/**
 * gets all Tasks from the database
 * 
 * @returns - a json of all tasks returned by the database
 */
async function fetchAllTasks() {
    let tasks = await (await fetch(baseUrl + "tasks.json")).json();
    return (tasks);
}

/**
 * gets all informations of a specific task
 * 
 * @param {string} taskId - id of the specific task 
 * @returns 
 */
async function getTask(taskId) {
    let task = await (await fetch(baseUrl + "tasks/" + taskId + ".json")).json();
    return (task);
}

/**
 * gets all informations of a specific task
 * 
 * @param {string} taskId - id of the specific task 
 * @returns 
 */
async function getsubtasks(taskId) {
    let task = await (await fetch(baseUrl + "tasks/" + taskId + "/subtasks.json")).json();
    return (task);
}

/**
 * gets all Users from the database
 * 
 * @returns - a json of all users returned by the database
 */
async function getAllUsers() {
    let users = await (await fetch(baseUrl + "users.json")).json();
    return (users)
}

/**
 * load user information of a user
 * 
 * @param {string} userId - id of a user
 * @returns - a json of all informations about a user returned by the database
 */
async function loadUserFromDb(userId) {
    let user = await (await fetch(baseUrl + "users/" + userId + ".json")).json();
    return (user);
}

/**
 * adds a task to the database
 * 
 * @param {json} data - a json with all informations that shall be writen in the database
 * 
 */
async function addTaskToDb(data) {
    await fetch(baseUrl + "tasks.json", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
}

/**
 * updates task informations in the database
 * 
 * @param {string} taskId - id of the task 
 * @param {Object} taskJson - object with the informations that shall be updated eg. {"name":"max default", "status":"done"} ...
 */
async function updateTaskToDb(taskId, taskJson) {
    try {
        const response = await fetch(baseUrl + "tasks/" + taskId + ".json", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(taskJson)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result;

    } catch (error) {
        console.error("Error updating task:", error);
        throw error;
    }
}

/**
 * adds a new user to the database
 * @param {json} data - user informations in a json eg. "name":"test user", "email":"testuser@test.de"
 */
async function addUserToDb(data) {
    let response = await fetch(baseUrl + "users.json", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    let responseData = await response.json();
    let responseId = responseData.name;
    return (responseId);
}

/**
 * updates an existing user in the database
 * @param {json} data - user informations in a json 
 * @param {string} userId - ID of the user to update
 */
async function updateUserToDb(data, userId) {
    try {
        let response = await fetch(baseUrl + "users/" + userId + ".json", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        let result = await response.json();
        return result;

    } catch (error) {
        console.error("Error updating user:", error);
        throw error;
    }
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
    await removeDelUserFromTask(userId);
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
    return (json)
}

/**
 * removes a deleted user from all tasks that the user is assigned to 
 * 
 * @param {string} userId - Id of the deleted user
 */
async function removeDelUserFromTask(userId) {
    let tasks = await fetchAllTasks();
    if (!tasks) tasks = {};

    const tasksIdArray = Object.keys(tasks);

    for (let taskId of tasksIdArray) {
        const task = tasks[taskId];
        if (!task || !task.users) continue;

        const newUserList = task.users.filter(id => id !== userId);

        if (newUserList.length !== task.users.length) {
            await updateTaskToDb(taskId, { users: newUserList });
        }
    }
}