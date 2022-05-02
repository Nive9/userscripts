// ==UserScript==
// @name         Reddit Unhide Hidden Posts
// @namespace    https://github.com/Nive9/userscripts/blob/main/reddit-unhide-hidden-posts/reddit-unhide.user.js
// @version      2.0.0
// @description  Unhides all hidden posts when visiting https://np.reddit.com/user/USERNAME/hidden/ (USERNAME = logged in user's name)
// @author       Nive
// @downloadURL  https://raw.githubusercontent.com/Nive9/userscripts/reddit-unhide-hidden-posts/main/reddit-unhide.user.js
// @match        *://np.reddit.com/user/*
// @icon         https://icons.duckduckgo.com/ip3/www.reddit.com.ico
// @grant        none
// ==/UserScript==

function unhide () {
    // const classUnhideExists = document.getElementsByClassName('unhide-button').length > 0;
    const classNextBtnExists = document.getElementsByClassName('next-button').length > 0;

        setInterval(
            function() {$('.unhide-button a')[0].click();
                       }, 750);


        setTimeout(function(){
            if(classNextBtnExists) {
            (location.reload());
            }
        }, 20000);
}

unhide();