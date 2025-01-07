/**
 * Builds the "Add Task" page by fetching user names and creating a user dropdown.
 * 
 * @param {Array} users - An array of user objects, where each object contains information about a user (e.g., name, ID).
 * @returns {HTMLElement} - The constructed task addition form with a dropdown menu of users.
 */
async function buildAddTaskPage() {
    const users = await getUserNames();
    const userList = buildUserNameDropDown(users);
    return buildAddTaskDiv(userList);
}


function setDateToday() {
    let today = new Date();
    let yyyy = today.getFullYear();
    let mm = String(today.getMonth() + 1).padStart(2, '0'); // Monate von 0-11, daher +1
    let dd = String(today.getDate()).padStart(2, '0');
    let minDate = `${yyyy}-${mm}-${dd}`;
    document.getElementById('due-date').setAttribute('min', minDate);
}


/**
 * Initializes the "Add Task" page by populating the assigned-to dropdown.
 * - Fetches user names and inserts them into the dropdown.
 * - Logs an error if the dropdown element is not found.
 */
async function initializeAddTaskPage() {
    const assignedToOptions = document.getElementById('assigned-to-options');

    if (assignedToOptions) {
        const users = await getUserNames();
        const userList = buildUserNameDropDown(users);
        assignedToOptions.innerHTML = userList;
    } else {
        console.error('Element with ID "assigned-to-options" not found during initialization.');
    }
}


/**
 * Retrieves user information and extracts user names, IDs, colors, and initials.
 * - Fetches all users asynchronously.
 * - Extracts user names, IDs, colors, and creates initials from the names.
 * 
 * @returns {Array} - An array containing four arrays: [users, userIds, userColors, userInitials].
 */
async function getUserNames() {
    const usersJson = await getAllUsers();
    const tasksIdArray = Object.keys(usersJson);
    let users = [];
    let userIds = [];
    let userColors = [];
    let userInitials = [];

    for (let index = 0; index < tasksIdArray.length; index++) {
        const userName = usersJson[tasksIdArray[index]]['name'];
        users.push(userName);
        userIds.push(tasksIdArray[index]);
        const initials = userName.split(' ').map(name => name[0]).join('');
        userInitials.push(initials);
        userColors.push(usersJson[tasksIdArray[index]]['color']);
    }
    return [users, userIds, userColors, userInitials];
}



let selectedPriority = '';
let selectedContactsArray = [];
let isDropdownOpen = false;

/**
 * Builds the HTML structure for a dropdown menu to select users.
 * Each option in the dropdown contains a user's avatar, name, and a checkbox.
 * 
 * @param {Array} users - A nested array where user names, IDs, background colors and user initials are displayed:
 * @returns {string} - The generated HTML string for the dropdown.
 */
function buildUserNameDropDown(users) {
    let html = '';

    for (let index = 0; index < users[0].length; index++) {
        html += `
         <div class="dropdown-option" id="user-${users[1][index]}" onclick="toggleUserSelection(event)">
               <span class="contactsTo-assign" style="background-color: ${users[2][index]};">${users[3][index]}</span>
               <label for="${users[1][index]}" class="user-name" >${users[0][index]}</label>
                 
               <input type="checkbox" id="${users[1][index]}" class="user-checkbox" style="pointer-events: none;">
               
               <span class="checkbox-container">
                   <img src="./assets/img/checkBoxTrue.svg" class="checkmark-true" alt="checkmark" style="display: none;">
                   <img src="./assets/img/checkBoxFalse.svg" class="checkmark-false" alt="checkmark" style="display: inline;">
               </span>
         </div>
          `;
    }
    return html;

}


/**
 * Updates the visual appearance of a selection based on whether it's checked or not.
 */
function updateSelectionAppearance(parentOption, isChecked) {
    const label = parentOption.querySelector('.user-name');
    const checkmarkTrue = parentOption.querySelector('.checkmark-true');
    const checkmarkFalse = parentOption.querySelector('.checkmark-false');

    parentOption.style.backgroundColor = isChecked ? '#2A3647' : '';
    label.style.color = isChecked ? 'white' : 'black';
    checkmarkTrue.style.display = isChecked ? 'inline-block' : 'none';
    checkmarkFalse.style.display = isChecked ? 'none' : 'inline-block';
    checkmarkTrue.style.filter = isChecked ? 'brightness(0) invert(1)' : 'none';
}


/**
 * Toggles the selection of a user when their checkbox is clicked.
 * It updates the appearance and tracks the selected contacts.
 *
 * @param {Event} event - The click event triggered by selecting a user.
 */
function toggleUserSelection(event) {
    event.stopPropagation();
    const parentOption = event.currentTarget;
    const checkbox = parentOption.querySelector('.user-checkbox');
    checkbox.checked = !checkbox.checked;

    updateSelectionAppearance(parentOption, checkbox.checked);
    trackSelectedContacts();
}


/**
 * Sets up event listeners to change the background color of a user option
 * when the checkbox is checked or unchecked.
 */
function setupBackgroundColorChange() {
    document.querySelectorAll('.user-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', (event) => {
            const parentOption = event.target.closest('.dropdown-option');
            updateSelectionAppearance(parentOption, event.target.checked);
        });
    });
}


/**
 * Retrieves the selected checkbox option and adds the user to the selectedContactsArray.
 * Returns the formatted HTML for the selected user.
 */
function getCheckboxOption(checkbox) {
    const parent = checkbox.closest('.dropdown-option');
    const id = checkbox.id.replace('user-checkbox-', '');
    const assignEl = parent.querySelector('.contactsTo-assign');
    const userName = parent.querySelector('label').textContent;

    selectedContactsArray.push({ id, name: userName });
    return `<span class="selected-User" style="background-color: ${assignEl.style.backgroundColor};">${assignEl.textContent}</span>`;
}


/**
 * Tracks selected contacts and updates the UI accordingly.
 */
function trackSelectedContacts() {
    selectedContactsArray = [];
    let selectedHtml = '', selectedCount = 0;

    document.querySelectorAll('.user-checkbox').forEach(checkbox => {
        if (checkbox.checked) {
            selectedHtml += getCheckboxOption(checkbox);
            selectedCount++;
        }
    });

    document.getElementById('assigned-to-count').textContent = `${selectedCount} contact${selectedCount !== 1 ? 's' : ''} assigned`;
    document.getElementById('selected-contacts').innerHTML = selectedHtml;
    //updateSelectedContactsInForm();

    // Add or remove the class based on selection count
    const taskRightColumn = document.querySelector('.task-right-column');
    if (selectedCount > 0) {
        taskRightColumn.classList.add('selected-user');
    } else {
        taskRightColumn.classList.remove('selected-user');
    }
}


/**
 * Retrieves and returns the dropdown-related elements.
 * @returns {Object} An object containing the dropdown elements.
 */
function getDropdownElements() {
    const options = document.getElementById('assigned-to-options');
    const iconDown = document.getElementById('dropdown-icon-down');
    const iconUp = document.getElementById('dropdown-icon-up');
    const container = document.getElementById('assigned-to-container');
    return { options, iconDown, iconUp, container };
}


/**
 * Updates the User interface elements to show the dropdown's open state.
 * @param {Object} elements - The dropdown elements.
 */
function updateDropdownElements({ iconDown, iconUp, container }) {
    iconDown.classList.add('d-none');
    iconUp.classList.remove('d-none');
    container.classList.add('changeBorderColor');
}


/**
 * Displays the dropdown and updates elements.
 */
async function showDropdown() {
    const { options, iconDown, iconUp, container } = getDropdownElements();
    if (!options || !iconDown || !iconUp || !container) {
        return;
    }
    if (!options.innerHTML.trim()) {     // Initialize dropdown content if empty
        try {
            await initializeAddTaskPage();
        } catch (error) {
            console.error('Failed to initialize dropdown:', error);
            return;
        }
    }
    options.style.display = 'flex';
    setupBackgroundColorChange();
    updateDropdownElements({ iconDown, iconUp, container })
    document.addEventListener('click', handleClickOutside);
    isDropdownOpen = true;
}


/**
 * Toggles the visibility of the dropdown.
 */
async function toggleContactsDropdown(event) {
    if (event) event.stopPropagation();

    if (!isDropdownOpen) {
        await showDropdown();
    } else {
        closeDropdown();
    }
}


/**
 * Handles clicks outside the dropdown to close it.
 * @param {Event} event - The click event.
 */
function handleClickOutside(event) {
    const { container } = getDropdownElements();
    if (!container.contains(event.target)) {
        closeDropdown();
    }
}


/**
 * Closes the dropdown and resets UI elements.
 */
function closeDropdown() {
    const { options, iconDown, iconUp, container } = getDropdownElements();
    if (!options || !iconDown || !iconUp || !container) {
        return;
    }
    options.style.display = 'none';
    iconDown.classList.remove('d-none');
    iconUp.classList.add('d-none');
    container.classList.remove('changeBorderColor');
    document.removeEventListener('click', handleClickOutside);
    isDropdownOpen = false;
}


/**
 * Toggles the visibility of the "Assigned to" dropdown.
 * If the dropdown is opened, it populates user data (if not already loaded),
 * updates the icon, and applies the necessary styles.
 */
function toggleCategoryDropdown() {
    const optionsContainer = document.getElementById('category-options');
    const dropdownIconDown = document.getElementById('category-dropdown-icon-down');
    const dropdownIconUp = document.getElementById('category-dropdown-icon-up');

    optionsContainer.classList.toggle('d-none');
    dropdownIconDown.classList.toggle('d-none');
    dropdownIconUp.classList.toggle('d-none');
}


/**
 * Updates the displayed task category based on the selected type 
 * and closes the category dropdown.
 *
 * @param {string} type - The type identifier for the selected category.
 */
function selectCategory(type) {
    const selectedCategory = document.getElementById('selected-category');
    const categoryText = getTaskCategoryName(type);

    selectedCategory.innerText = categoryText;
    toggleCategoryDropdown();
}


/**
 * Resets the styles of all priority buttons.
 * Removes the 'active' class and resets the background color for each button.
 */
function resetButtonStyles() {
    const buttons = document.querySelectorAll('.priority-button');
    buttons.forEach(button => {
        button.classList.remove('active');
        button.style.backgroundColor = '';
    });
}


/**
 * Sets the priority to "Urgent".
 * Resets the button styles, applies the active state to the "Urgent" button,
 * updates its background color to red, and sets the selected priority to "Urgent".
 */
function setUrgent() {
    resetButtonStyles();
    const button = document.querySelector('.priority-button.urgen');
    button.classList.add('active');
    button.style.backgroundColor = 'red';
    selectedPriority = 'Urgent';
}


/**
 * Sets the priority to "Medium".
 * Resets the button styles, applies the active state to the "Medium" button,
 * updates its background color to orange, and sets the selected priority to "Medium".
 */
function setMedium() {
    resetButtonStyles();
    const button = document.querySelector('.priority-button.medium');
    button.classList.add('active');
    button.style.backgroundColor = 'orange';
    selectedPriority = 'Medium';
}


/**
 * Sets the priority to "Low".
 * Resets the button styles, applies the active state to the "Low" button,
 * updates its background color to green, and sets the selected priority to "Low".
 */
function setLow() {
    resetButtonStyles();
    const button = document.querySelector('.priority-button.low');
    button.classList.add('active');
    button.style.backgroundColor = 'green';
    selectedPriority = 'Low';
}


/**
 * Validates the task submission form.
 * Checks if the task title, due date, and category are valid, 
 * and enables or disables the "Create Task" button based on that.
 */
function validateForm() {
    const title = document.getElementById('task-title').value.trim();
    const dueDate = document.getElementById('due-date').value.trim();
    const categorySelected = document.getElementById('selected-category').innerText !== 'Select task category';
    const subtasksExist = document.getElementById('subtask-list').children.length > 0;
    const createTaskButton = document.getElementById('createTaskButton');

    const isValid = title && dueDate && categorySelected  && subtasksExist;
    createTaskButton.disabled = !isValid;
    createTaskButton.classList.toggle('enabled', isValid);
}


/**
 * Prevents the form from submitting when the Enter key is pressed 
 * if the currently active element has an ID of 'subtasks'.
 * Instead, it triggers the addSubtask() function.
 *
 * @param {Event} event - The keypress event.
 */
function preventEnterSubmit(event) {
    const activeElement = document.activeElement;
    if (event.key === 'Enter' && activeElement.id === 'subtasks') {
        event.preventDefault();
        addSubtask();
    }
}


/**
 * Submits the form by validating input, setting default priority if needed, 
 * saving task data to the database, and resetting the form. 
 * Displays a popup and redirects after successful submission.
 */
function submitForm() {
    validateForm();
    if (document.getElementById('createTaskButton').disabled) return;
    if (!selectedPriority) setMedium();

    const taskData = gatherTaskData();
    addTaskToDb(taskData);
    resetForm();

    displayPopupAndRedirect();
}


/**
 * Collects and returns all task data from the form fields as an object.
 *
 * @returns {Object} - The task data including date, description, title, priority, 
 *                     status, subtasks, type, and assigned users.
 */
function gatherTaskData() {
    return {
        date: document.getElementById('due-date').value.trim(),
        description: document.getElementById('description').value.trim(),
        name: document.getElementById('task-title').value.trim(),
        prio: selectedPriority.toLowerCase(),
        status: "todo",
        subtasks: Array.from(document.querySelectorAll('#subtask-list .subtask-item')).map(item => ({
            status: "open",
            subtaskname: item.textContent.trim()
        })),
        type: determineTaskType(),
        users: selectedContactsArray.map(contact => contact.id)
    };
}


/**
 * Displays a popup briefly, then hides it, loads content, 
 * and redirects the user to the board page.
 */
function displayPopupAndRedirect() {
    document.getElementById('pop-up-bg').classList.remove('d-none');
    setTimeout(async () => {
        document.getElementById('pop-up-bg').classList.add('d-none');
        const content = await getAllTasksFromDataBase();
        document.getElementById('contentMainPageSite').innerHTML = content;
    }, 1500);

    setTimeout(() => {
        window.location.replace('board.html');
    }, 1500);
}


/**
 * Determines the task type based on the selected category text.
 * Returns "technical" for "Technical Task", "userstory" for "User Story",
 * or the original text if it matches neither.
 *
 * @returns {string} - The task type identifier.
 */
function determineTaskType() {
    const typeValue = document.getElementById('selected-category').innerText.trim();
    return typeValue === "Technical Task" ? "technical" : typeValue === "User Story" ? "userstory" : typeValue;
}


/**
 * Resets the task form to its initial state by clearing inputs, 
 * resetting default values, and disabling the submit button.
 */
function resetForm() {
    document.getElementById('taskForm').reset();
    document.getElementById('selected-category').innerText = 'Select task category';
    document.getElementById('subtask-list').innerHTML = '';
    document.getElementById('selected-contacts').innerHTML = '';
    selectedContactsArray = [];
    document.getElementById('assigned-to-count').innerText = 'Select contacts to assign';
    setMedium();
    document.getElementById('createTaskButton').disabled = true;
    document.getElementById('createTaskButton').classList.remove('enabled');
    resetBackgroundColor();
}


/**
 * Resets the BackgroundColor 
 *
 */
function resetBackgroundColor() {
    document.querySelectorAll('.dropdown-option').forEach(option => {
        option.style.backgroundColor = '';
        const label = option.querySelector('.user-name');
        if (label) label.style.color = 'black';
        const checkmarkTrue = option.querySelector('.checkmark-true');
        const checkmarkFalse = option.querySelector('.checkmark-false');
        if (checkmarkTrue) checkmarkTrue.style.display = 'none';
        if (checkmarkFalse) checkmarkFalse.style.display = 'inline-block';
    });
}


/**
 * Toggles visibility of subtask action icons.
 * Used when transitioning from adding a subtask to providing action options.
 *  */
function showSubtaskActions() {
    document.getElementById('plus-icon').classList.add('d-none');
    document.getElementById('hidden-action-icons').classList.remove('hidden');
    document.getElementById('x-icon').classList.remove('d-none');
    document.getElementById('check-icon').classList.remove('d-none');
    document.getElementById('icon-divider').classList.remove('d-none');
}


/**
 * Adds a new subtask to the list if the input is valid, 
 *  Revalidate form after adding a subtask
 * clears the input, and updates the subtask data.
 */
function addSubtask() {
    let subtaskInput = document.getElementById('subtasks').value;
    if (!subtaskInput) return;
    let listItem = createSubtaskItem(subtaskInput);
    document.getElementById('subtask-list').appendChild(listItem);

    document.getElementById('subtasks').value = '';
    cancelSubtask();
    updateSubtaskData();
    // showTemporaryMessage('Subtask added successfully!');
    validateForm();
}
document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('taskForm');
    if (!taskForm) return;

    taskForm.addEventListener('keydown', checkForEnterKey);
});


/**
 * Listens for the 'Enter' key press to add a subtask if the input field is focused.
 * Prevents the default action (form submission) when 'Enter' is pressed.
 *
 * @param {Event} event - The key press event triggered by the user.
 */
function checkForEnterKey(event) {
    if (event.key === 'Enter' && document.activeElement.id === 'subtasks') {
        event.preventDefault();
        addSubtask();
    }
}


/**
 * Resets the subtask input and toggles the user Interface elements.
 * Clears the subtask input field.
 *  Used to cancel the current subtask entry and return to the default state.
 */
function cancelSubtask() {
    document.getElementById('x-icon').classList.add('d-none');
    document.getElementById('check-icon').classList.add('d-none');
    document.getElementById('icon-divider').classList.add('d-none');
    document.getElementById('plus-icon').classList.remove('d-none');
    document.getElementById('subtasks').value = '';
}


/**
 * Collects the current subtask texts and updates the hidden input field.
 * - Gathers all subtask text items from the list.
 * - Converts the text items to a JSON string and stores them in a hidden input field.
 * Revalidate form after updating a subtask
 * Used to keep track of the subtasks in a format suitable for form submission.
 */
function updateSubtaskData() {
    const subtasks = Array.from(document.querySelectorAll('#subtask-list .subtask-item .subtask-text'))
        .map(subtask => subtask.textContent.trim());

    document.getElementById('subtask-data').value = JSON.stringify(subtasks);
    validateForm();
}


/**
 * Creates a button with an image inside.
 *
 * @param {string} src - The image source.
 * @param {string} alt - The alt text for the image.
 * @param {string} className - The class to apply to the button.
 * @returns {HTMLElement} - The created button element.
 */
function createButton(src, alt, className) {
    let button = document.createElement('span'),
        img = document.createElement('img');
    img.src = src;
    img.alt = alt;
    button.classList.add(className);
    button.appendChild(img);
    return button;
}


/**
 * Creates a subtask list item with text, edit, and delete buttons.
 *
 * @param {string} subtaskTextContent - The text content of the subtask.
 * @returns {HTMLElement} - The subtask list item.
 */
function createSubtaskItem(subtaskTextContent) {
    const listItem = document.createElement('li');
    listItem.classList.add('subtask-item');

    const subtaskText = createSubtaskText(subtaskTextContent);
    const editButton = createButton('./assets/img/pensil_small.svg', 'Edit', 'edit-icon');
    const deleteButton = createButton('./assets/img/delete.svg', 'Delete', 'delete-icon');

    [subtaskText, editButton].forEach(el => el.onclick = () => startEditingSubtask(listItem, subtaskText, editButton, deleteButton));
    deleteButton.onclick = () => { listItem.remove(); updateSubtaskData(); };

    listItem.append(subtaskText, editButton, deleteButton);
    return listItem;
}


/**
 * Creates a span element for subtask text.
 *
 * @param {string} textContent - The content to display in the subtask.
 * @returns {HTMLElement} - The span element containing the subtask text.
 */
function createSubtaskText(textContent) {
    const subtaskText = document.createElement('span');
    subtaskText.classList.add('subtask-text');
    subtaskText.textContent = textContent;
    return subtaskText;
}


/**
 * Initiates editing for a subtask by replacing the text with an input field.
 *
 * @param {HTMLElement} listItem - The list item containing the subtask.
 * @param {HTMLElement} subtaskText - The span element with the current subtask text.
 * @param {HTMLElement} editButton - The edit button for the subtask.
 * @param {HTMLElement} deleteButton - The delete button for the subtask.
 */
function startEditingSubtask(listItem, subtaskText, editButton, deleteButton) {
    const input = createEditInput(subtaskText.textContent);

    listItem.classList.add('editing');
    listItem.replaceChild(input, subtaskText);
    input.focus();

    setButtonToSave(editButton, listItem, input, subtaskText, deleteButton);
    deleteButton.style.display = 'inline-block';

    input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') saveSubtaskText(listItem, input, subtaskText, editButton, deleteButton);
    });
}


/**
 * Creates an input field pre-filled with the given text for editing.
 *
 * @param {string} text - The initial text value for the input field.
 * @returns {HTMLElement} - The created input element.
 */
function createEditInput(text) {
    const input = document.createElement('input');
    input.type = 'text';
    input.value = text;
    input.classList.add('edit-input');
    input.style.cssText = 'background-color: white; border: 1px solid #5DBEE7; outline: none; padding: 5px;';
    return input;
}


/**
 * Changes the edit button to a save button with a check icon.
 *
 * @param {HTMLElement} editButton - The edit button to modify.
 * @param {HTMLElement} listItem - The list item containing the subtask.
 * @param {HTMLElement} input - The input field for editing the subtask text.
 * @param {HTMLElement} subtaskText - The original subtask text element.
 * @param {HTMLElement} deleteButton - The delete button for the subtask.
 */
function setButtonToSave(editButton, listItem, input, subtaskText, deleteButton) {
    editButton.innerHTML = '';
    let checkImg = document.createElement('img');
    checkImg.src = './assets/img/done.svg';
    checkImg.alt = 'Save';
    editButton.appendChild(checkImg);

    editButton.onclick = () => saveSubtaskText(listItem, input, subtaskText, editButton, deleteButton);
}


/**
 * Saves the edited subtask text and switches the edit button back to the edit mode.
 *
 * @param {HTMLElement} listItem - The list item containing the subtask.
 * @param {HTMLElement} input - The input field containing the new subtask text.
 * @param {HTMLElement} subtaskText - The original subtask text element.
 * @param {HTMLElement} editButton - The button to toggle between edit and save modes.
 * @param {HTMLElement} deleteButton - The delete button for the subtask.
 */
function saveSubtaskText(listItem, input, subtaskText, editButton, deleteButton) {
    subtaskText.textContent = input.value;
    if (subtaskText.textContent !== '') {
    listItem.classList.remove('errorSubtask')
    listItem.replaceChild(subtaskText, input);

    editButton.innerHTML = '';
    let editImg = document.createElement('img');
    editImg.src = './assets/img/pensil_small.svg';
    editImg.alt = 'Edit';
    editButton.appendChild(editImg);
    editButton.onclick = function () {
        startEditingSubtask(listItem, subtaskText, editButton, deleteButton);
    };
    listItem.classList.remove('editing');
    deleteButton.style.display = 'inline-block';
    listItem.style.backgroundColor = '';
    }
    else {listItem.classList.add('errorSubtask')}
}