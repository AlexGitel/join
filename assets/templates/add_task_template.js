function buildAddTaskDiv(users, environment) {
    return /*html*/ `

        <form id="taskForm" class="task-form"onkeydown="preventEnterSubmit(event)"  onsubmit="event.preventDefault();submitForm()">
            <div class="addTaskHeadlineDiv">
                <h1 class="addTaskHeadline">Add Task</h1>
            </div>

            <div class="boardTaskEditContainerCloseButton"></div>

            <div class="inputs_buttons_container">
                
                <div class="task-input-container">
                    <div class="task-left-column">
                        <div class="task-input">
                            <label for="task-title">Title<span class="required">*</span></label>
                            <input required type="text" id="task-title" placeholder="Enter a title" oninput="validateForm()" class="addTaskInputSpace">
                            <span class="error-message" style="display: none; color: red;">This field is required</span>
                        </div>

                        <div class="task-input margin">
                            <label for="description">Description</label>
                            <textarea class="addTaskInputSpace" id="description" placeholder="Enter a Description" oninput="validateForm()"></textarea>
                        </div>
                        
                        <div>
                            <div class="task-input margin">
                                <span class="section-label">Assigned to</span>

                                <div onclick="toggleContactsDropdown()" id="assigned-to-container" class="custom-dropdown">
                                    <span  id="assigned-to-count">Select contacts to assign</span>
                                    
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

                            <div id="selected-contacts" class="selected-contacts">
                                <!-- Selected contacts will be displayed here -->
                            </div>
                        </div>
                    </div>

                    <hr class="task-separater">

                    <div class="task-right-column">
                        <div class="task-input">
                            <form>
                                <label for="due-date">Due date<span class="required">*</span></label>
                                <input class="addTaskInputSpace" type="date" required id="due-date" placeholder="dd/mm/yyyy" oninput="validateForm()">
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

                        <div class="task-input margin">
                            <span class="section-label">Category<span class="required">*</span></span>

                            <div onclick="toggleCategoryDropdown()" id="category-container" class="custom-dropdown">
                                <div id="selected-category" class="selected-options" onclick="validateForm()">Select task category</div>

                                <div onclick="event.stopPropagation(); toggleCategoryDropdown()" class="drop-down-icon-container">
                                    <img id="category-dropdown-icon-down" class="dropdown-icon" src="./assets/img/arrow_drop_down.svg">
                                    <img id="category-dropdown-icon-up" class="dropdown-icon d-none" src="./assets/img/arrow_drop_up.svg">
                                </div>
                            </div>
                        
                            <div>
                                <div id="category-options" class="dropdown-options-category d-none">
                                    <div class="dropdown-option" onclick="selectCategory('technical'); validateForm();">Technical Task</div>
                                    <div class="dropdown-option" onclick="selectCategory('userstory'); validateForm();">User Story</div>
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
                                </div>
                                <ul id="subtask-list"></ul> 
                            </div>

                                <!-- active only up to 1020px - -->
                            <div class="note_text_hidden">
                                <span class="required">* </span>This field is required
                            </div>
                            
                        </div>

                            <!-- Hidden input for subtasks -->
                        <input type="hidden" id="subtask-data" name="subtasks">
                    </div>
                </div>

                <div class="required_actions_div">
                    <div class="note_text" id="addTaskFooterText">
                        <span class="required ">* </span>This field is required
                    </div>
            
                    <div class="actions" id='taskActionBtnContainer'>
                        <button onclick="resetForm()" class="clear_button cursor">Clear
                            <img class="close_button" src="./assets/img/close.png" alt="close_button">
                        </button>

                        <button onclick="submitForm()" type="submit" id="createTaskButton" class="create-task" disabled>Create Task
                            <img src="./assets/img/check.svg" alt="">
                        </button>
                    </div>
                </div> 
            </div>
        
            <!-- Pop Up "Task added to board" (Initially hidden) -->
            <div class="d-none" id="pop-up-bg">
                <div class="popup-sign animation">
                    <span>Task added to board</span><span style="height: 30px;"><img style="width: 30px;" src="./assets/img/board.svg" alt="board_icon"></span>
                </div> 
            </div>

        </form>  
            

    `;
}