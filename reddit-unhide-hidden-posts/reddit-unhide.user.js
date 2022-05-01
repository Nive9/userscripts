// ==UserScript==
// @name         Reddit Unhide Hidden Posts
// @namespace    https://github.com/Nive9/userscripts
// @version      1.0
// @description  Unhides all hidden posts when visiting https://np.reddit.com/user/USERNAME/hidden/ (USERNAME = logged in user's name)
// @author       Nive
// @downloadURL  https://raw.githubusercontent.com/Nive9/userscripts/reddit-unhide-hidden-posts/main/reddit-unhide.user.js
// @match        https://np.reddit.com/user/*
// @icon         https://icons.duckduckgo.com/ip3/www.reddit.com.ico
// @grant        none
// ==/UserScript==

function unhide () {
    const classUnhideExists = document.getElementsByClassName('unhide-button').length > 0;
    const classNextBtnExists = document.getElementsByClassName('next-button').length > 0;

    while (classNextBtnExists && classUnhideExists) {
            Array.from({ length: 25 }, () => {$('.unhide-button a')[0].click()})
            .then(location.reload());
        }
}

unhide();