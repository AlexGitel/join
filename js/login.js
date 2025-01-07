let showPass = false;
//let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
let userDataValid = true;


/**
 * for Button Sign Up
 */
function signUp() {
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('mypassword').value = '';
    document.getElementById('confirmPassword').value = '';
    document.getElementById('next-visibility-off-icon').classList.add('d-none');
    document.getElementById('thirth-visibility-off-icon').classList.add('d-none');
    document.getElementById('next-lock-icon').classList.remove('d-none');
    document.getElementById('thirth-lock-icon').classList.remove('d-none');
    // popUp you signed successfully
    document.getElementById('pop-up-bg').classList.remove('d-none');
    setTimeout(() => {
        document.getElementById('pop-up-bg').classList.add('d-none');
    }, 1500);
}


/**
 * show signUp form in login page
 */
function showSignupForm() {
    document.getElementById('login-overlay').classList.add('d-none');
    document.getElementById('signup-form').classList.remove('d-none');
    document.getElementById('for_mobile').classList.add('d-none');
}


/**
 * hide signUp form in login page
 */
function hideSignupForm() {
    document.getElementById('signup-form').classList.add('d-none');
    document.getElementById('login-overlay').classList.remove('d-none');
    document.getElementById('for_mobile').classList.remove('d-none');
}


/**
 * lock icon, visibility-off-icon in login page
 */
function hideLockIcon() {
    document.getElementById('lock-icon').classList.add('d-none');
    document.getElementById('visibility-off-icon').classList.remove('d-none');
}


/**
 * lock icon, visibility-off-icon in sign up page
 */
function hideLockIconSignUpForm() {
    document.getElementById('next-lock-icon').classList.add('d-none');
    document.getElementById('next-visibility-off-icon').classList.remove('d-none');
}


/**
 * lock icon, visibility-off-icon in sign up page
 */
function hideLockIconConfirm() {
    document.getElementById('thirth-lock-icon').classList.add('d-none');
    document.getElementById('thirth-visibility-off-icon').classList.remove('d-none');
}


/**
 * change the visibility of login password
 */
function showHideLogInPassword() {
    document.getElementById('visibility-off-icon').classList.add('d-none');
    document.getElementById('visibility-icon').classList.remove('d-none');

    showPass = !showPass;
    if (showPass) {
        myPassword.type = 'text';
    } else {
        myPassword.type = 'password';
    }
}


/**
 * change the visibility of sign up password
 */
function showHideSignUpPassword() {
    document.getElementById('next-visibility-off-icon').classList.add('d-none');
    document.getElementById('next-visibility-icon').classList.remove('d-none');

    showPass = !showPass;
    if (showPass) {
        mypassword.type = 'text';
    } else {
        mypassword.type = 'password';
    }
}


/**
 * change the visibility of sign up confirmed password
 */
function showHideConfirmPassword() {
    document.getElementById('thirth-visibility-off-icon').classList.add('d-none');
    document.getElementById('thirth-visibility-icon').classList.remove('d-none');

    showPass = !showPass;
    if (showPass) {
        confirmPassword.type = 'text';
    } else {
        confirmPassword.type = 'password';
    }
}


/**
 * change icons in login input
 */
function changeIcons() {
    document.getElementById('visibility-off-icon').classList.remove('d-none');
    document.getElementById('visibility-icon').classList.add('d-none');
}


/**
 * change icons, input Sign Up Form
 */
function changeIconsSignUpForm() {
    document.getElementById('next-visibility-off-icon').classList.remove('d-none');
    document.getElementById('next-visibility-icon').classList.add('d-none');
}


/**
 * change icons, input confirm Password
 */
function changeIconsConfirm() {
    document.getElementById('thirth-visibility-off-icon').classList.remove('d-none');
    document.getElementById('thirth-visibility-icon').classList.add('d-none');
}

/**
 * gets the given user and password from the login and starts the check
 *  @param {string} event - Formevent to block reload
 */
async function startLogin(event) {
    event.preventDefault();
    loginEmail = document.getElementById('login-email').value;
    loginPassword = document.getElementById('myPassword').value;
    await checkUserCredentials(loginEmail, loginPassword); 
}


/**
 * cecks the credentials from the login form if they are valid
 * @param {*} loginEmail - email of the login form
 * @param {*} loginPassword - password of the login form
 */
async function checkUserCredentials(loginEmail, loginPassword) {
    
    users = await getAllUsers();
    userArray = Object.keys(users);
    let loginValid = false;
    for (let index = 0; index < userArray.length; index++) {
        let userInformations = (users[userArray[index]]);
        if (userInformations['email'].toLowerCase() === loginEmail.toLowerCase() && userInformations['password'] === loginPassword) {
            window.location.href = 'summary.html';
            loginValid = true;
            loginUserProcess(userArray, index, userInformations['name']);
    }
    if (loginValid === false) {
        setInvalidLoginSettings();
    }
    }
}


/**
 * Marks the logindata fields red and shows a error message
 */
function setInvalidLoginSettings() {
    document.getElementById('invalidLoginTxt').classList.remove('d-none');
    document.getElementById('login-email').classList.add('valueNotValid');
    document.getElementById('myPassword').classList.add('valueNotValid');
}


/**
 * saves userinformation in browser storage to show the correct informations
 * @param {*} userArray - userdata from database
 * @param {*} index - index of for loop form checkUserCredentials() function
 * @param {*} name - username of logged in user
 */
function loginUserProcess(userArray, index, name){
    localStorage.setItem('activeUserStatus', 'true');
    localStorage.setItem('userId', userArray[index]); 
    localStorage.setItem('name', name);
    let initals = getUserInitials(localStorage.getItem('name'))
    //document.getElementById('userIconValueHead').innerHTML = initals;
}


/**
 * starts the registration process by getting the values and checks them. If the are valid, user account is been created
 * 
 * @param {*} event - form event to prevent default form actions
 */
async function startRegistration(event) {
    event.preventDefault();
    email = document.getElementById('email').value;
    password = document.getElementById('mypassword').value;
    confirmPassword = document.getElementById('confirmPassword').value;
    username = document.getElementById('name').value;
    policyCheckBox = document.getElementById('accept-checkbox');
    await checkIfDataValid(email, password, confirmPassword, username, policyCheckBox);
    if (userDataValid) {addUser(email, password, username)};
}


/**
 * checks in the database if emailadress in registartion process already exists
 * 
 * @param {string} email - email of user
 * @returns 
 */
async function checkNewUserExists(email) {
    users = await getAllUsers();
    userArray = Object.keys(users);
    let userExists = false;
    
    for (let index = 0; index < userArray.length; index++) {
        
        let userInformations = (users[userArray[index]]);

        if (userInformations['email'].toLowerCase() === email.toLowerCase()) {
            userExists = true;}
    }
    return userExists;
}


/**
 * function to run checks if all provided data by user is valid
 * 
 * @param {string} email 
 * @param {string} password 
 * @param {string} confirmPassword 
 * @param {string} username 
 * @param {true/false} policyCheckBox 
 */
async function checkIfDataValid(email, password, confirmPassword, username, policyCheckBox){
    
    resetRegistrationErrors();
    checkEmailIsValid(email);
    await checkEmailIfExists(email);
    checkPasswordConfirm(password, confirmPassword);
    checkPasswordLenght(password);
    checkNameIsValid(username);
    checkPolicy(policyCheckBox);
}


/**
 * checks if the give emailadress is a valid email form
 * 
 * @param {string} email 
 */
function checkEmailIsValid(email) {
    if (emailRegex.test(email) == false) {
        document.getElementById('email').classList.add('valueNotValid');
        document.getElementById('emailInvalid').classList.remove('d-none');
        userDataValid = false;
    };
}


/**
 * checks if the given email at registration already exists in database
 * 
 * @param {string} email 
 */
async function checkEmailIfExists(email) {
    let emailCheck = await checkNewUserExists(email)
    if (emailCheck) {
        document.getElementById('email').classList.add('valueNotValid');
        document.getElementById('emailExsists').classList.remove('d-none');
        userDataValid = false;
    } 
}


/**
 * checks the password and confirm password is the same
 * 
 * @param {string} password 
 * @param {string} confirmPassword 
 */
function checkPasswordConfirm(password, confirmPassword) {
    if (password !== confirmPassword) {
        document.getElementById('mypassword').classList.add('valueNotValid');
        document.getElementById('confirmPassword').classList.add('valueNotValid');
        document.getElementById('passwordsDontMatch').classList.remove('d-none');
        userDataValid = false;
    }
}


/**
 * checks if the given password has at least 4 letters
 * 
 * @param {string} password 
 */
function checkPasswordLenght(password) {
    if (password.length <=3) {
        document.getElementById('mypassword').classList.add('valueNotValid');
        document.getElementById('confirmPassword').classList.add('valueNotValid');
        document.getElementById('passwortToShort').classList.remove('d-none');
        userDataValid = false;
    }
}


/**
 * checks if the given username has at leat 4 letters
 * 
 * @param {string} username 
 */
function checkNameIsValid(username) {
    if (username.length <= 3) {
        document.getElementById('name').classList.add('valueNotValid');
        document.getElementById('nameToShort').classList.remove('d-none');
        userDataValid = false;
    }
}


/**
 * checks if the policy has been accepted while registration
 * 
 * @param {true/false} policyCheckBox 
 */
function checkPolicy(policyCheckBox) {
    if (policyCheckBox.checked) {
        document.getElementById('policyCheckBox').classList.add('d-none');
    } else {
        document.getElementById('policyCheckBox').classList.remove('d-none');
        userDataValid = false;
    }
}


/**
 * resets all error messages to default when user restarts the registration process
 */
function resetRegistrationErrors() {
    document.getElementById('email').classList.add('valueNotValid');
    document.getElementById('emailInvalid').classList.add('d-none');
    document.getElementById('email').classList.remove('valueNotValid');
    document.getElementById('emailExsists').classList.add('d-none');
    document.getElementById('mypassword').classList.remove('valueNotValid');
    document.getElementById('confirmPassword').classList.remove('valueNotValid');
    document.getElementById('passwordsDontMatch').classList.add('d-none');
    document.getElementById('mypassword').classList.remove('valueNotValid');
    document.getElementById('confirmPassword').classList.remove('valueNotValid');
    document.getElementById('passwortToShort').classList.add('d-none');
    document.getElementById('name').classList.remove('valueNotValid');
    document.getElementById('nameToShort').classList.add('d-none');
    document.getElementById('policyCheckBox').classList.add('d-none');
}


/**
 * adds the new user in database and redirects to login page
 * 
 * @param {string} email 
 * @param {string} password 
 * @param {string} username 
 */
async function addUser(email, password, username) {
    await registerNewContact(username, email, password);
    document.getElementById('pop-up-bg').classList.remove('d-none');
    window.location.href = 'login.html';
}


/**
 * allows a Guest user to login and sets the guest state to the browser storage
 */
async function guestLogin(){
    localStorage.setItem('activeUserStatus', 'true');
    localStorage.setItem('userId', 'guest'); 
    localStorage.setItem('name', 'Guest');
    let initals = getUserInitials('Guest')
    window.location.href='summary.html'
    //document.getElementById('userIconValueHead').innerHTML = initals;
}