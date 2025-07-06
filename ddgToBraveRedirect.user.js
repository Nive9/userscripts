// ==UserScript==
// @name                   DuckDuckGo to Brave Search Redirect
// @description            Redirect DuckDuckGo searches to Brave Search
// @match                  *://*.duckduckgo.com/*
// @run-at                 document-start
// ==/UserScript==

(function () {
    'use strict';

    const url = new URL(window.location.href);

    if (url.hostname === "duckduckgo.com" && url.searchParams.has("q")) {
        const query = url.searchParams.get("q"); // Extract the search query
        const braveSearchURL = `https://search.brave.com/search?q=${encodeURIComponent(query)}`;

        if (!document.referrer.includes("duckduckgo.com")) {
            window.location.href = braveSearchURL;
        }
    }
})();