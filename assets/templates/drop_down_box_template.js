function buildDropDownBox() {
    return /*html*/`
     <div class="drop_down_box">
        <span class="link help_in_drop_down_box" onclick="showHelp()">Help</span>
        <a class="link" href="./legalNotice.html">Legal Notice</a>
        <a class="link" href="./privatePolicy.html">Privacy Policy</a>
        <a class="link" onclick="logoutUser()">Log out</a>
    </div>
    `;
}