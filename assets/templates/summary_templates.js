function buildSummeryPage(tasksToDo, tasksDone, tasksUrgent, taskDeadline, tasksInBoard, tasksInProgres, tasksAwaiting, userName) {

    return /*html*/ `
    <div class="summary_content">
        <img class="join360_img" src="./assets/img/Frame 40.svg" alt="Join_360">
    
        <div class="summary_and_user_container">
            <div class="summary-container">

                <img class="join360_mobile" src="./assets/img/Frame203.svg" alt="Join_360">  <!--  only for mobile  -->

                <div class="summary-top">
                    <div onclick="navigateToPage('board.html')" class="left zoom cursor">
                        <div class="circle">
                            <img class="pencil" src="./assets/img/edit.png" alt="pencil_icon">
                        </div>
                        <div>
                            <h1 class="myH1">${tasksToDo}</h1>
                            <p class="p20">To-do</p>
                        </div>
                    </div>

                    <div onclick="navigateToPage('board.html')" class="right zoom cursor">
                        <div class="circle">
                            <img class="done_icon" src="./assets/img/Vector.png" alt="done_icon">
                        </div>
                        <div>
                            <h1 class="myH1">${tasksDone}</h1>
                            <p class="p20">Done</p>
                        </div>  
                    </div>   
                </div>

                <div onclick="navigateToPage('board.html')" class="summary-middle zoom cursor">
                    <div class="red_urgent">   
                        <img class="circle_red" src="./assets/img/Group 7.svg">
                        <div class="urgent">
                            <h1 class="myH1">${tasksUrgent}</h1>
                            <p class="p16">Urgent</p>
                        </div>                     
                    </div>
                        <div class="verticalLine"></div> 
                    <div class="date_deadline">
                        <p class="date">${taskDeadline}</p>
                        <p class="p16">Upcoming Deadline</p>
                    </div>
                </div>

                <div class="summary-bottom">
                    <div onclick="navigateToPage('board.html')" class="task_box zoom cursor">
                        <div>
                            <h1 class="myH1">${tasksInBoard}</h1>
                            <p class="p20">Tasks in Board</p>
                        </div>
                    </div>

                    <div onclick="navigateToPage('board.html')" class="task_box zoom cursor">
                        <div>
                            <h1 class="myH1">${tasksInProgres}</h1>
                            <p class="p20">Tasks in Progress</p>
                        </div>  
                    </div>

                    <div onclick="navigateToPage('board.html')" class="task_box zoom cursor">
                        <div>
                            <h1 class="myH1">${tasksAwaiting}</h1>
                            <p class="p20">Awaiting Feedback</p>
                        </div>  
                    </div> 
                </div>
            </div>

            <div class="user_container">
                <p id="userGreeting" class="greeting">Good morning</p>
                <p id="greetingsName" class="currentUserName" style="color: #29ABE2;">${userName}</p>
            </div>
        </div>

        <!--- for mobile only - start overlay --->
        <div id="user_container_overlay" class="user_container_overlay">
            <p id="userGreetingMobile" class="greetingMobile">Good morning</p>
            <p id="greetingsNameMobile" class="currentUserNameMobile" style="color: #29ABE2;">${userName}</p>
        </div>

    </div>
    `;
}