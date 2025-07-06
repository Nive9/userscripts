// ==UserScript==
// @name                pxf.io Links to Target URL Redirect
// @description         Redirect pxf.io links to target URL
// @version             1.0
// @downloadURL         https://raw.githubusercontent.com/Nive9/userscripts/main/pxf.ioToTargetRedirect.user.js
// @updateURL           https://raw.githubusercontent.com/Nive9/userscripts/main/pxf.ioToTargetRedirect.user.js
// @icon                https://www.pixiv.net/favicon.ico
// @match               *://*.pxf.io/*
// @run-at              document-start
// ==/UserScript==

(function () {
    'use strict';

    const url = new URL(window.location.href);

    if (url.hostname.includes("pxf.io") && url.searchParams.has("u")) {
        const query = url.searchParams.get("u");
        const targetURL = decodeURIComponent(query);

        if (window.location.href !== targetURL) {
            window.location.href = targetURL;
        }
    }
})();