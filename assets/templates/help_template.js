function buildHelpPage() {
    return /* html */ `
    <div class="content">                     
        <div class="help_arrow_div">

            <h1>Help</h1>

            <div class="step_back_arrow cursor">
                <img onclick="goBack()" src="./assets/img/arrow.svg" alt="step_back_arrow">
            </div>
        </div>
                    
        <span class="text">Welcome to the help page for <span style="color: #29ABE2;">Join</span>, your guide to using our kanban project management tool. 
            Here, we'll provide an overview of what <span style="color: #29ABE2;">Join</span> is, how it can benefit you, and how to use it.</span>
                    
            <h3>What is Join?</h3>
        <span class="text"><span style="color: #29ABE2;">Join</span> is a kanban-based project management tool designed and built by a group of dedicated students as part of their web development bootcamp at the Developer Akademie.</span>
                    
        <span class="text">Kanban, a Japanese term meaning "billboard", is a highly effective method to visualize work, limit work-in-progress, and maximize efficiency (or flow). 
        <span style="color: #29ABE2;">Join</span> leverages the principles of kanban to help users manage their tasks and projects in an intuitive, visual interface.</span>
                                    
        <span class="text">It is important to note that <span style="color: #29ABE2;">Join</span> is designed as an educational exercise and is not intended for extensive business usage. 
            While we strive to ensure the best possible user experience, we cannot guarantee consistent availability, reliability, accuracy, or other aspects of quality regarding <span style="color: #29ABE2;">Join</span>.</span>
                    
            <h3>How to use it</h3>
                    
        <span class="text">Here is a step-by-step guide on how to use <span style="color: #29ABE2;">Join</span>:</span>
                    
        <div class="row_div">
            <div class="consecutive_number"><h3>1.</h3></div>
            <div class="comment_div">
                <h4>Exploring the Board</h4>
                <span class="text">When you log in to <span style="color: #29ABE2;">Join</span>, you'll find a default board. This board represents your project and contains four default lists: "To Do", "In Progress", “Await feedback” and "Done".</span>
            </div>
        </div>
                    
        <div class="row_div">
            <div class="consecutive_number"><h3>2.</h3></div>
            <div class="comment_div">
                <h4>Creating Contacts</h4>
                <span class="text">
                    In <span style="color: #29ABE2;">Join</span>, you can add contacts to collaborate on your projects. Go to the "Contacts" section, click on "New contact", and fill in the required information. 
                    Once added, these contacts can be assigned tasks and they can interact with the tasks on the board.</span>
            </div>
        </div>

        <div class="row_div">
            <div class="consecutive_number"><h3>3.</h3></div>
            <div class="comment_div">
                <h4>Adding Cards</h4>
                <span class="text">
                    Now that you've added your contacts, you can start adding cards. Cards represent individual tasks. Click the "+" button under the appropriate list to create a new card. Fill in the task details in the card, like task name, description, due date, assignees, etc.</span>
            </div>
        </div>
                    
        <div class="row_div">
            <div class="consecutive_number"><h3>4.</h3></div>
            <div class="comment_div">
                <h4>Moving Cards</h4>
                <span class="text">
                     As the task moves from one stage to another, you can reflect that on the board by dragging and dropping the card from one list to another.</span>
            </div>
        </div>
                    
        <div class="row_div">
            <div class="consecutive_number"><h3>5.</h3></div>
            <div class="comment_div">
                <h4>Deleting Cards</h4>
                <span class="text">Once a task is completed, you can either move it to the "Done" list or delete it. Deleting a card will permanently remove it from the board. Please exercise caution when deleting cards, as this action is irreversible.</span> 
                <span class="text"> Remember that using <span style="color: #29ABE2;">Join</span> effectively requires consistent updates from you and your team to ensure the board reflects the current state of your project.</span> 
                <span class="text">Have more questions about <span style="color: #29ABE2;">Join</span>? Feel free to contact us at [Your Contact Email]. We're here to help you!</span>
            </div>
        </div>
                    
            <h3 style="padding-top: 24px;">Enjoy using Join!</h3>                 
    </div>
    `;
}