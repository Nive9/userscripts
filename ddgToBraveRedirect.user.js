// ==UserScript==
// @name                Brave Search Redirect
// @description         Redirect different search engines to Brave Search
// @version             1.1
// @downloadURL         https://raw.githubusercontent.com/Nive9/userscripts/main/BraveRedirect.user.js
// @updateURL           https://raw.githubusercontent.com/Nive9/userscripts/main/BraveRedirect.user.js
// @icon                https://search.brave.com/favicon.ico
// @match               *://*.duckduckgo.com/*
// @match               *://*.bing.com/*
// @match               *://*.google.com/*
// @match               *://*.yahoo.com/*
// @run-at              document-start
// ==/UserScript==

let DuckDuckGo = true;
let Bing = true;
let Google = false;
let Yahoo = true;

(function () {
    'use strict';

    const url = new URL(window.location.href);

    const engines = [
        {
            enabled: Bing,
            host: "bing.com",
            ref: "bing.com"
        },
        {
            enabled: DuckDuckGo,
            host: "duckduckgo.com",
            ref: "duckduckgo.com"
        },
        {
            enabled: Google,
            host: "google.com",
            ref: "google.com"
        },
        {
            enabled: Yahoo,
            host: "yahoo.com",
            ref: "yahoo.com"
        }
    ];

    for (const engine of engines) {
        if (
            engine.enabled &&
            url.hostname === engine.host &&
            url.searchParams.has("q") &&
            !document.referrer.includes(engine.ref)
        ) {
            const query = url.searchParams.get("q");
            const braveSearchURL = `https://search.brave.com/search?q=${encodeURIComponent(query)}`;
            window.location.href = braveSearchURL;
            break;
        }
    }
})();