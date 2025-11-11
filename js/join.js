
includeHTML();

/**
 * opens the summary page - see summary.js as next
 */
async function openSummaryPage() {
    checkIfValidLogin();
    clearAktiveTabs();
    document.getElementById('contentMainPageSite').innerHTML = await buildSummaryBoard(localStorage.getItem('name'));
    setTimeout(() => setActiveTab('summaryPage'), 100);

    const greetingAlreadyShown = localStorage.getItem('greetingShown') === 'true';

    if (!greetingAlreadyShown) {
        userGreeting();
        userGreetingMobile();
        localStorage.setItem('greetingShown', 'true');
    } else {
        document.getElementById('user_container_overlay')?.classList.add('d-none');
    }

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
    document.getElementById('contentMainPageSite').innerHTML = await buildAddTaskPage('openAddTaskPage');
    setTimeout(() => setActiveTab('addTaskPage'), 100);
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
    document.getElementById('contentMainPageSite').innerHTML = await getAllTasksFromDataBase();
    setTimeout(() => setActiveTab('boardPage'), 100);
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
    document.getElementById('contentMainPageSite').innerHTML = await buildContactsPage();
    setTimeout(() => setActiveTab('contactPage'), 100);
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
    document.getElementById('contentMainPageSite').innerHTML = buildHelpPage();
    document.getElementById('questionIcon').classList.add('d-none');
    document.getElementById('summaryPage').classList.remove('tabActive');
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
    window.history.back();
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
    clearAktiveTabs();
    setTimeout(() => {
        const policyLink = document.getElementById('policy_link');
        if (policyLink) {
            policyLink.classList.add('tabActive');
            policyLink.classList.add('pointerOff');
        }
    }, 100);
}

/**
 * open legal page
 */
function openLegalPage() {
    clearAktiveTabs();
    setTimeout(() => {
        const legalLink = document.getElementById('legal_link');
        if (legalLink) {
            legalLink.classList.add('tabActive');
            legalLink.classList.add('pointerOff');
        }
    }, 100);
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

/**
 * checks if a user is sigend in
 */
function checkIfValidLogin() {
    let session = localStorage.getItem('activeUserStatus');
    if (session === 'false') {
        window.location.href = 'index.html';
    }
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
            return;
        }
    }
}