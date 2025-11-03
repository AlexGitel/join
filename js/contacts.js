let userList = []
let currentLetter = '';
let contactList = '';
let alphabetLists = {};
let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
let finalHtml;
let users;
let actualMarkedUser = '';
const userColors = ["#FF7A00", "#9327FF", "#6E52FF", "#FC71FF", "#FFBB2B", "#1FD7C1", "#462F8A", "#FF4646", "#00BEE8", "#FF7A00"];
let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
let phoneRegex = /^\+?[1-9]\d{1,14}$/;
let userRegex = /^(?!\d+$)[a-zA-Z0-9 äöüÄÖÜ]{4,}$/;

/**
 * gets all users from the database and delivers a final html to show a user list
 * 
 * @returns - userlist as html code
 */
async function buildContactsPage() {

    alphabetList();
    users = await getAllUsers();
    userArray = Object.keys(users);
    let userId

    for (let index = 0; index < userArray.length; index++) {

        userId = userArray[index]
        buildContactListEntry(users[userArray[index]], userId);
    }
    let contactListHtml = buildContactListHtml();
    let finalHtml = finalContactPage(contactListHtml, userId);
    return finalHtml;
}


/**
 * Builds the contactlist entry in the users list
 * 
 * @param {array} userData - information about the user
 * @param {string} userId - user id
 */
function buildContactListEntry(userData, userId) {
    let userIcon = getUserIcons(userData);
    let name = userData['name'];
    let email = userData['email'];
    let contactHtml = buildContactElementHtml(userIcon, name, email, userId);
    addUserToList(contactHtml, name);
}


/**
 * builds the user icon as html code
 * 
 * @param {array} userInformations - user informations to get the initials
 * @returns - delivers the user icon
 */
function getUserIcons(userInformations) {
    let userInitials = getUserInitials(userInformations['name']);
    let icon = buildUserIcon(userInitials, userInformations['color'])
    return (icon);
}


/**
 * Sorts the user to the correct list to be sorted by alpahbet
 * 
 * @param {html} html - html code of the user element
 * @param {string} name - username to sort in List
 */
function addUserToList(html, name) {

    let firstLetter = name[0].toUpperCase();

    if (alphabetLists[firstLetter]) {
        if (alphabetLists[firstLetter].length == 0) {
            alphabetLists[firstLetter].push(contactListLetter(firstLetter));
        }
        alphabetLists[firstLetter].push(html);
    }
}


/**
 * creates a list with all letters of the alphabet. The alphaebetLists is a global var
 */
function alphabetList() {
    alphabet.forEach(letter => { alphabetLists[letter] = []; })
}


/**
 * checks if a user entry is there for the alphabet letters
 * 
 * @returns - a html element to show the users list sorted by alphabet
 */
function buildContactListHtml() {

    let alphabetArray = Object.keys(alphabetLists);
    let html = ''
    for (let index = 0; index < alphabetArray.length; index++) {

        if (alphabetLists[alphabetArray[index]].length !== 0) {
            html += (alphabetLists[alphabetArray[index]].join(''));
        }
    }
    return (html);
}



/**
 * loads the contact information after clicking the user in the users list
 * 
 * @param {string} userId - userId
 */
function loadContactInformations(userId) {
    let contactDetailsContainer = document.getElementById('contactDetails');
    initials = getUserInitials(users[userId]['name']);
    if (actualMarkedUser !== '') document.getElementById(actualMarkedUser).classList.remove("contactListEntryClicked");
    document.getElementById(userId).classList.add("contactListEntryClicked");
    actualMarkedUser = userId;
    contactDetailsContainer.innerHTML = buildContactInfo(users[userId]['color'], initials, users[userId]['name'], userId, users[userId]['email'], users[userId]['phone']);
    buildContactInfoMobile(userId);
    setTimeout(() => { contactDetailsContainer.classList.add('fly-in'); }, 10);
}


/**
 * loads mobile user data 
 * 
 * @param {string} userId - Id of the user
 */
function buildContactInfoMobile(userId) {
    let contactInfoContainer = document.getElementById('contactInfoMobile');
    contactInfoContainer.classList.add("display-block");
    contactInfoContainer.innerHTML += `<img onclick="showDropDownContactInfo('${userId}')" class="mobileActionBtn" id='mobileActionBtn' src="./assets/img/actionBtnMobileContactInfo.svg"></img>`;
    contactInfoContainer.innerHTML += `<div id='contactMobileActions' class='d-none'></div>`;
}


/**
 * closes the mobile view of contact details and removes details from browser
 */
function closeContactInfoMobile() {
    document.getElementById('contactInfoMobile').classList.remove('display-block');
    document.getElementById('contactMobileActions').classList.add('d-none');
    document.getElementById('mobileActionBtn').remove();
    document.getElementById('contactMobileActions').remove();
}


/**
 * Deletes a user 
 * 
 * @param {string} userId - user Id that shall be deleted
 */
async function deleteUser(userId) {
    await deleteUserInDb(userId);
    actualMarkedUser = '';
    localStorage.removeItem('newUserId');
    openContactsPage();
}

/**
 * Opens the create new user overlay
 */
function addNewUserWindow() {
    document.getElementById('addContactOverlay').classList.add('display');
}


/**
 * closes the add new user overlay
 * 
 * @param {string} elementIdOverlay - html element id for the overlay
 * @param {string} elementIdContainer - html element id for the overlay container
 */
function closeOverlay(elementIdOverlay, elementIdContainer) {
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
    clearNewContactValues();
    resetFormErrors();

    //window.location.reload();
}


/**
 * Formats the data for a new user to create it in the database
 * 
 * @param {string} name - given username
 * @param {string} email  - given email
 * @param {string} phone  - given phonenumber
 * @returns - the created user id from the database
 */
async function addNewContact(name, email, phone) {
    let color = getRandomUserColor();
    data = {
        "name": name,
        "email": email,
        "phone": phone,
        "color": color,
        "password": "helloworld"
    }
    let userId = await addUserToDb(data);
    users = await getAllUsers();
    return (userId)
}


/**
 * validates the data for a new user
 */
async function validateAndSubmitForm() {
    let form = document.getElementById('contactForm');
    let name = document.getElementById('inputContactName');
    let email = document.getElementById('inputContactEmail');
    let phone = document.getElementById('inputContactPhone');
    let isValid = true;
    resetFormErrors();

    if (name.value.trim() === '' || userRegex.test(name.value) == false) {
        document.getElementById('inputName').classList.add('error');
        document.getElementById('invalidAddContactNameTxt').classList.remove('d-none');
        isValid = false;
    }
    if (email.value.trim() === '' || emailRegex.test(email.value) == false) {
        document.getElementById('inputEmail').classList.add('error');
        document.getElementById('invalidAddContactEmailTxt').classList.remove('d-none');
        isValid = false;
    }
    if (phone.value.trim() === '' || phoneRegex.test(phone.value) == false) {
        document.getElementById('inputPhone').classList.add('error');
        document.getElementById('invalidAddContactPhoneTxt').classList.remove('d-none');
        isValid = false;
    }
    if (isValid) {
        userId = await addNewContact(name.value, email.value, phone.value);
        localStorage.setItem('newUserId', userId);
        closeOverlay('addContactOverlay', 'addContactContainer');
        clearNewContactValues();
        reloadUserDataContactsPage('Contact succesfully created');
    }
}


/**
 * resets the form errors that are displayed when the given values are invalid
 */
function resetFormErrors() {
    document.getElementById('inputName').classList.remove('error');
    document.getElementById('inputEmail').classList.remove('error');
    document.getElementById('inputPhone').classList.remove('error');
    document.getElementById('editInputName').classList.remove('error');
    document.getElementById('editInputEmail').classList.remove('error');
    document.getElementById('editInputPhone').classList.remove('error');
}


/**
 * creates a random color for the user icon by creating a new user
 * 
 * @returns - color hex code
 */
function getRandomUserColor() {
    let random = Math.floor(Math.random() * userColors.length);
    let radomColor = userColors[random];
    return (radomColor);
}


/**
 * sets new parameter for a existing user
 * 
 * @param {string} userId - id of the existing user
 */
async function editUser(userId) {
    let userData = await loadUserFromDb(userId);
    let userInitals = getUserInitials(userData['name']);
    document.getElementById('userIconEditContactPage').innerHTML = buildUserIconForEdit(userData['color'], userInitals);
    document.getElementById('editInputContactName').value = userData['name'];
    document.getElementById('editInputContactEmail').value = userData['email'];
    document.getElementById('editInputContactPhone').value = userData['phone'];
    document.getElementById('validateAndSubmitEditForm').onclick = function () { validateAndSubmitEditForm(userId) };
    localStorage.setItem('newUserId', userId);
    editUserWindow()
}


/**
 * opens the edit user overlay window
 */
function editUserWindow() {
    document.getElementById('editContactOverlay').classList.add('display');
}


/**
 * validates the the edit user values
 * 
 * @param {string} userId - id of the existing user
 */
async function validateAndSubmitEditForm(userId) {

    let form = document.getElementById('editContactForm');
    let name = document.getElementById('editInputContactName');
    let email = document.getElementById('editInputContactEmail');
    let phone = document.getElementById('editInputContactPhone');
    let isValid = true;
    resetFormErrors();

    if (name.value.trim() === '' || userRegex.test(name.value) == false) {
        document.getElementById('editInputName').classList.add('error');
        document.getElementById('invalidEditContactNameTxt').classList.remove('d-none');
        isValid = false;
    }
    if (email.value.trim() === '' || emailRegex.test(email.value) == false) {
        document.getElementById('editInputEmail').classList.add('error');
        document.getElementById('invalidEditContactEmailTxt').classList.remove('d-none');
        isValid = false;
    }
    if (phone.value.trim() === '' || phoneRegex.test(phone.value) == false) {
        document.getElementById('editInputPhone').classList.add('error');
        document.getElementById('invalidEditContactPhoneTxt').classList.remove('d-none');
        console.log('test')
        isValid = false;
    }
    if (isValid) {
        await editContact(name.value, email.value, phone.value, userId);
        closeOverlay('editContactOverlay', 'editContactContainer');
        reloadUserDataContactsPage('Contact succesfully updated');
        clearNewContactValues();
    }
}


function clearNewContactValues() {
    document.getElementById('inputContactName').value = '';
    document.getElementById('inputContactEmail').value = '';
    document.getElementById('inputContactPhone').value = '';
    document.getElementById('invalidAddContactNameTxt').classList.add('d-none');
    document.getElementById('invalidAddContactEmailTxt').classList.add('d-none');
    document.getElementById('invalidAddContactPhoneTxt').classList.add('d-none');
    document.getElementById('invalidEditContactNameTxt').classList.add('d-none');
    document.getElementById('invalidEditContactEmailTxt').classList.add('d-none');
    document.getElementById('invalidEditContactPhoneTxt').classList.add('d-none');
    document.getElementById('inputName').classList.remove('error');
    document.getElementById('inputEmail').classList.remove('error');
    document.getElementById('inputPhone').classList.remove('error');
}


/**
 * builds the data json to be send to the database to change a existing user
 * 
 * @param {string} name - username
 * @param {string} email - user email
 * @param {string} phone - user phone
 * @param {string} userId - user id
 */
async function editContact(name, email, phone, userId) {
    data = {
        "name": name,
        "email": email,
        "phone": phone,
    }
    await updateUserToDb(data, userId);
}


/**
 * builds the data json to be send to the database to create a user that registers himself
 * 
 * @param {string} username 
 * @param {string} email 
 * @param {string} password 
 */
async function registerNewContact(username, email, password) {
    let color = getRandomUserColor();
    data = {
        "name": username,
        "email": email,
        "color": color,
        "password": password
    }
    await addUserToDb(data);
}


/**
* shows the edit user dropdown on mobile view 
 * @param {string} userId - user id to know wich user shall be edited
 */
function showDropDownContactInfo(userId) {
    html = dropDownContactMobile(userId);
    document.getElementById('contactMobileActions').classList.remove('d-none');
    document.getElementById('contactMobileActions').innerHTML = html;
    //document.getElementById('contactInfoMobile').addEventListener('click', closeDropDownContactInfo);
}


/**
 * closes the edit user dropdown on mobile view
 */
function closeDropDownContactInfo() {
    document.getElementById('contactMobileActions').classList.add('d-none');
}