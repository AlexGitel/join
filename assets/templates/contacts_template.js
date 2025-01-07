function buildContactElementHtml(userIcon, name, email, userId) {
    return /*html*/ `
        <div onclick="loadContactInformations('${userId}')" id="${userId}" class="contactListEntry">
            ${userIcon}
            <div class="contactListEntryDiv">
                <p>${name}</p>
                <p class="emailAddress">${email}</p>
            </div>
        </div>
    `;
}


function contactListLetter(letter) {
    return /*html*/ `
        <div class="contactListLetter">
            <div style="height: 58px; padding-left: 36px; display: flex; align-items: center;">
                <p>${letter}</p>
            </div>
            <div>
                <p class="contactListLetterLine"></p>
            </div>
        </div> 
    `;
}


function finalContactPage(contactList) {
    return /*html*/ `

    <div class="contactsPage">
        <div class="contactList">
            <div class="addContactButtonContainer">
                <div class="addNewContactButton hover" onclick="addNewUserWindow()" >
                    <span class ="newContact">Add new contact</span>
                    <span style="height: 100%; display: flex; align-items: center;"><img src="./assets/img/person_add.svg" alt="person_icon"></span>
                </div>
            </div>

            <div class="contactsScrollList"> ${contactList}</div>
        </div>


        <div id="contactInfoMobile" class="headline-right contactInfoMobile">
                <img class="better-with-a-team" src="./assets/img/Frame50.svg" alt="">
            <div class="showMobileContactHeadlineContainer">
                <img class="better-with-a-team-mobile" src="./assets/img/showContactMobileHeadline.svg" alt="">
                <img class="showContactInfoCloseBtn" src="./assets/img/arrow.svg" onclick="closeContactInfoMobile()">
            </div>
            
            
            <div id="contactDetails" class="contactDetails fly-in"></div>
            
            <div class="contactsResponseflyInContainer cursor">
                <div class="popUpActionSaved popUpNewUserCreated d-none" id="popUpUserAdded">
                    <a>New user added</a>
                    <img src="./assets/img/contacts.svg">
                </div>
            </div>
        </div>
    </div>
    `;
}


function buildContactInfo(iconColor, initials, name, userId, email, phone) {
    return /*html*/ `
        <div class="contactShortInfo display-flex">
            <div class="userIconsContainer">
                <div style="background-color: ${iconColor}" class="contactsUserIcon">${initials}</div>
            </div>
            <div class="contactNameAction">
                <div class="name-size">${name}</div>
                <div class="display-flex">
                    <a onclick="editUser('${userId}')" class="editButtonText cursor"></a>
                    <a onclick="deleteUser('${userId}')" class="deleteButtonText cursor"></a>
                </div>
            </div>
        </div>
        <div>Contact Information</div>
        <div>
            <div class="contactInfoDiv">
                <p class="contactInfoTitle">Email</p>
                <p class="contactInfoValue emailAddress">${email}</p>
            </div>
            <div class="contactInfoDiv contactInfoPhoneNumberDiv">
                <p class="contactInfoTitle">Phone</p>
                <p class="contactInfoValue">${phone}</p>
            </div>
        </div>
    `;
}


function buildUserIconForEdit(iconColor, initials) {
    let html = ` <div style="background-color: ${iconColor}" class="contactsUserIcon">${initials}</div>`
    return html
}


function dropDownContactMobile(userId) {
    return /*html*/`
    <div onclick="closeDropDownContactInfo()" class="dropDownContactInfoContainer">
     <div class="dropDownContactInfo">
            <a onclick="editUser('${userId}')" class="editButtonTxtMobile cursor contactDropDownBtnMobile"></a>
            <a onclick="deleteUser('${userId}')" class="deleteButtonTxtMobile cursor contactDropDownBtnMobile"></a>
    </div>
    </div>
    `;
}

