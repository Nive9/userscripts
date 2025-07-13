// ==UserScript==
// @name                Search Engine Redirect
// @description         Redirect different search engines to the primary search engine
// @version             1.3
// @downloadURL         https://raw.githubusercontent.com/Nive9/userscripts/main/SearchEngineRedirect.user.js
// @updateURL           https://raw.githubusercontent.com/Nive9/userscripts/main/SearchEngineRedirect.user.js
// @icon                https://search.brave.com/favicon.ico
// @match               *://*.duckduckgo.com/*
// @match               *://*.bing.com/*
// @match               *://*.google.com/*
// @match               *://*.yahoo.com/*
// @match               *://*.startpage.com/*
// @match               *://*.ecosia.org/*
// @match               *://*.qwant.com/*
// @match               *://*.yandex.com/*
// @match               *://*.brave.com/*
// @run-at              document-start
// @grant               GM_getValue
// @grant               GM_setValue
// @grant               GM_registerMenuCommand
// ==/UserScript==

function getEngineEnabled(key, def) {
    return GM_getValue(key, def);
}

function toggleEngine(key, name, def) {
    const current = GM_getValue(key, def);
    GM_setValue(key, !current);
    location.reload();
}

const engineList = [
    { key: "Brave", name: "Brave Search", def: true, host: "search.brave.com", param: "q" },
    { key: "DuckDuckGo", name: "DuckDuckGo", def: false, host: "duckduckgo.com", param: "q" },
    { key: "Bing", name: "Bing", def: true, host: "bing.com", param: "q" },
    { key: "Google", name: "Google", def: true, host: "google.com", param: "q" },
    { key: "Yahoo", name: "Yahoo", def: true, host: "yahoo.com", param: "p" },
    { key: "Startpage", name: "Startpage", def: false, host: "startpage.com", param: "query" },
    { key: "Ecosia", name: "Ecosia", def: true, host: "ecosia.org", param: "q" },
    { key: "Qwant", name: "Qwant", def: true, host: "qwant.com", param: "q" },
    { key: "Yandex", name: "Yandex", def: true, host: "yandex.com", param: "text" }
];

// Function to set the primary search engine
function setPrimaryEngine() {
    const current = GM_getValue("PrimaryEngine", "Brave");
    const keys = engineList.map(e => e.key);
    const names = engineList.map(e => e.name);
    const choice = prompt(
        `Select your primary search engine:\n${names.map((n, i) => `${i}: ${n}${keys[i] === current ? " (current)" : ""}`).join("\n")}`,
        keys.indexOf(current)
    );
    if (choice !== null && names[choice]) {
        GM_setValue("PrimaryEngine", keys[choice]);
        alert(`Primary search engine set to: ${names[choice]}`);
    }
}

GM_registerMenuCommand("Set Primary Search Engine", setPrimaryEngine);
GM_registerMenuCommand("--------------------------", function() {});

engineList.forEach(engine => {
    GM_registerMenuCommand(
        `${getEngineEnabled(engine.key, engine.def) ? "✔️" : "❌"} ${engine.name} Redirect`,
        () => toggleEngine(engine.key, engine.name, engine.def)
    );
});

const enabledEngines = {};
engineList.forEach(engine => {
    enabledEngines[engine.key] = getEngineEnabled(engine.key, engine.def);
});
const primaryEngine = GM_getValue("PrimaryEngine", "Brave");

(function () {
    'use strict';

    const url = new URL(window.location.href);

    const currentEngine = engineList.find(engine =>
        enabledEngines[engine.key] &&
        url.hostname.endsWith(engine.host) &&
        url.searchParams.has(engine.param) &&
        !document.referrer.includes(engine.host)
    );

    if (currentEngine) {
        const query = url.searchParams.get(currentEngine.param);

        const target = engineList.find(e => e.name === primaryEngine) || engineList[0];
        const param = target.param;
        const host = target.host;
        const redirectURL = `https://${host}/search?${param}=${encodeURIComponent(query)}`;

        document.documentElement.innerHTML = "";
        location.replace(redirectURL);
    }
})();
