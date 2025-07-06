// ==UserScript==
// @name                pxf.io Links to Target URL Redirect
// @description         Redirect pxf.io links to target URL
// @version             1.0
// @downloadURL         https://github.com/Nive9/userscripts/raw/refs/heads/main/pxf.ioToTargetRedirect.user.js
// @updateURL           https://github.com/Nive9/userscripts/raw/refs/heads/main/pxf.ioToTargetRedirect.user.js
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