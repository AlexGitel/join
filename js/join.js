// TEMP
let userInitials = 'AM'
includeHTML();


/**
 * opens the summary page - see summary.js as next
 */
async function openSummeryPage() {
    checkIfValidLogin();
    clearAktiveTabs();
    setActiveTab('summeryPage');
    document.getElementById('contentMainPageSite').innerHTML = await buildSummeryBoard(localStorage.getItem('name'));
    userGreeting(); // function is in summary.js
    userGreetingMobile() // function is in summary.js
    document.getElementById('header').classList.remove('d-none');
    let initals = getUserInitials(localStorage.getItem('name'))
    document.getElementById('userIconValueHead').innerHTML = initals;
}


/**
 * opens the add task page 
 */
async function openAddTaskPage() {
    checkIfValidLogin();
    clearAktiveTabs();
    setActiveTab('addTaskPage');
    document.getElementById('contentMainPageSite').innerHTML = await buildAddTaskPage('openAddTaskPage');
    document.getElementById('header').classList.remove('d-none');
    setMedium();
    await initializeAddTaskPage();
    let inputField = document.getElementById('subtasks');
    inputField.addEventListener('focus', showSubtaskActions);
    let initals = getUserInitials(localStorage.getItem('name'))
    document.getElementById('userIconValueHead').innerHTML = initals;
    setDateToday();
}


/**
 * opens the task dashbaord page
 */
async function openBoardPage() {
    usersDataArray = await getAllUsers();
    checkIfValidLogin();
    clearAktiveTabs();
    setActiveTab('boardPage');
    document.getElementById('contentMainPageSite').innerHTML = await getAllTasksFromDataBase();
    removeSubtaskStatus();
    document.getElementById('header').classList.remove('d-none');
    let initals = getUserInitials(localStorage.getItem('name'))
    document.getElementById('userIconValueHead').innerHTML = initals;
}


/**
 * opens the contacts page
 */
async function openContactsPage() {
    checkIfValidLogin();
    clearAktiveTabs();
    setActiveTab('contactPage');
    document.getElementById('contentMainPageSite').innerHTML = await buildContactsPage();
    document.getElementById('header').classList.remove('d-none');
    let initals = getUserInitials(localStorage.getItem('name'));
    document.getElementById('userIconValueHead').innerHTML = initals;
    let userId = localStorage.getItem('newUserId');
    if (userId) {
        localStorage.removeItem('newUserId');
        loadContactInformations(userId);
    };
}


/**
 * reloads the data in contacts after changing or creating a contact
 * 
 * @param {string} msgTxt - text that shall be shown in the message box e.g. contact changes saved
 */
async function reloadUserDataContactsPage(msgTxt) {
    checkIfValidLogin();
    clearAktiveTabs();
    setActiveTab('contactPage');
    document.getElementById('contentMainPageSite').innerHTML = await buildContactsPage();
    document.getElementById('header').classList.remove('d-none');
    let initals = getUserInitials(localStorage.getItem('name'));
    document.getElementById('userIconValueHead').innerHTML = initals;
    let userId = localStorage.getItem('newUserId');
    if (userId) {
        loadContactInformations(userId);
    };
    showMsgTxt(msgTxt);
}


/**
 * shows the message box after contacts changing or creating a contact
 * 
 * @param {*} msgTxt - text that shall be shown in the message box e.g. contact changes saved
 */
function showMsgTxt(msgTxt) {
    document.getElementById('popup').innerHTML = msgTxt
    document.getElementById('overlay_popup_contact_created').classList.remove('d-none');

    setTimeout(() => { document.getElementById('overlay_popup_contact_created').classList.add('fly-out-msgTxt'); }, 500);
    setTimeout(() => {
        document.getElementById('overlay_popup_contact_created').classList.remove('fly-out-msgTxt');
        document.getElementById('overlay_popup_contact_created').classList.add('d-none');
    }, 4000);
}

/**
 * marks the acutal used section of the page by adding a css class
 * 
 * @param {string} actualTab - name of the active tab e.g. summary, addtask, board, contacts
 */
function setActiveTab(actualTab) {
    document.getElementById(actualTab).classList.add('tabActive');
}


/**
 * removes the css class of all sections that shows the active tab
 */
function clearAktiveTabs() {
    let tabList = ['summeryPage', 'addTaskPage', 'boardPage', 'contactPage'];
    for (let index = 0; index < tabList.length; index++) {
        document.getElementById(tabList[index]).classList.remove('tabActive');
    }
}


/**
 * navigatates the browser to the given url
 * 
 * @param {string} path 
 */
function navigateToPage(path) {
    window.location.href = path;
}


/*+
 * shows the description: about join
 */
function showHelp() {
    document.getElementById('contentMainPageSite').innerHTML = buildHelpPage();  // is in help_template.js
    document.getElementById('questionIcon').classList.add('d-none');
    document.getElementById('summeryPage').classList.remove('tabActive');
    document.getElementById('addTaskPage').classList.remove('tabActive');
    document.getElementById('boardPage').classList.remove('tabActive');
    document.getElementById('contactPage').classList.remove('tabActive');
    let initals = getUserInitials(localStorage.getItem('name'))
    document.getElementById('userIconValueHead').innerHTML = initals;
}


/**
* to get to previous site
*/
function goBack() {
    window.location.href = document.referrer;
}


/** 
 * opens the drop_down_div with Links 
 */
function showDropDownBox() {
    document.getElementById('drop_down_container').classList.remove('d-none');
    document.getElementById('drop_down_container').innerHTML = buildDropDownBox();
}


/** 
 * close the drop_down_div with Links 
 */
function closeDropDownBox() {
    document.getElementById('drop_down_container').classList.add('d-none');
}

/**
 * open policy page
 */
function openPrivacyPolicy() {
    // setTimeout(() => { document.getElementById('header').classList.add('d-none'); }, 10);
    document.getElementById('policy_link').classList.add('tabActive');
    document.getElementById('policy_link').classList.add('pointerOff');
}

/**
 * open legal page
 */
function openLegalPage() {
    // setTimeout(() => { document.getElementById('header').classList.add('d-none'); }, 10);
    document.getElementById('legal_link').classList.add('tabActive');
    document.getElementById('legal_link').classList.add('pointerOff');
}


/**
 * opens the private policy in a new tab
 */
function openPolicyInNewTab() {
    document.getElementById('policy_link').classList.add('tabActive');
    document.getElementById('policy_link').classList.add('pointerOff');
}


/**
 * opens the legal notice in a new tab
 */
async function openLegalInNewTab() {
    document.getElementById('legal_link').classList.add('tabActive');
    document.getElementById('legal_link').classList.add('pointerOff');
}


function includeHTML() {
    var z, i, elmnt, file, xhttp;
    /* Loop through a collection of all HTML elements: */
    z = document.getElementsByTagName("*");
    for (i = 0; i < z.length; i++) {
        elmnt = z[i];
        /*search for elements with a certain attribute:*/
        file = elmnt.getAttribute("w3-include-html");
        if (file) {
            /* Make an HTTP request using the attribute value as the file name: */
            xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4) {
                    if (this.status == 200) { elmnt.innerHTML = this.responseText; }
                    if (this.status == 404) { elmnt.innerHTML = "Page not found."; }
                    /* Remove the attribute, and call this function once more: */
                    elmnt.removeAttribute("w3-include-html");
                    includeHTML();
                }
            }
            xhttp.open("GET", file, true);
            xhttp.send();
            /* Exit the function: */
            return;
        }
    }
}


/**
 * checks if a user is sigend in
 */
function checkIfValidLogin() {
    let session = localStorage.getItem('activeUserStatus');
    if (session === 'false') {
        window.location.href = 'login.html';
    }
}