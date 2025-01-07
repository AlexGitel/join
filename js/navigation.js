
/**
* Navigates to a specific page based on the tab clicked.
* 
* @param {string} tabId - ID of the tab clicked
*/
function handleNavigation(tabId) {
    switch (tabId) {
        case 'summeryPage':
            openSummeryPage();
            break;
        case 'addTaskPage':
            openAddTaskPage();
            break;
        case 'boardPage':
            openBoardPage();
            break;
        case 'contactPage':
            openContactsPage();
            break;
        default:
            console.error(`Unknown tab ID: ${tabId}`);
    }
}

// Add event listeners for both desktop and mobile tabs
document.addEventListener('DOMContentLoaded', () => {
    const navButtons = document.querySelectorAll('.sideBarTask, .navButton');
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.id;
            handleNavigation(tabId);
        });
    });
});


/**
 * Marks the current active tab for both sidebar and navbar by adding a CSS class.
 * 
 * @param {string} actualTab - The ID of the active tab (e.g., 'summeryPage', 'addTaskPage').
 */
function setActiveTab(actualTab) {
    clearAktiveTabs();
    // Add the active class to the sidebar and navbar buttons with the same ID
    const activeElements = document.querySelectorAll(`#${actualTab}`);
    activeElements.forEach(element => {
        element.classList.add('tabActive');
    });
}


/**
 * Removes the 'tabActive' CSS class from all tabs in both sidebar and navbar.
 */
function clearAktiveTabs() {
    const tabs = document.querySelectorAll('.sideBarTask, .navButton');
    tabs.forEach(tab => {
        tab.classList.remove('tabActive');
    });
}