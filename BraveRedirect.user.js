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

[
    { key: "DuckDuckGo", name: "DuckDuckGo", def: false },
    { key: "Bing", name: "Bing", def: true },
    { key: "Google", name: "Google", def: false },
    { key: "Yahoo", name: "Yahoo", def: true },
    { key: "Startpage", name: "Startpage", def: false },
    { key: "Ecosia", name: "Ecosia", def: true },
    { key: "Qwant", name: "Qwant", def: true },
    { key: "Yandex", name: "Yandex", def: true }
].forEach(engine => {
    GM_registerMenuCommand(
        `${getEngineEnabled(engine.key, engine.def) ? "✔️" : "❌"} ${engine.name} Redirect`,
        () => toggleEngine(engine.key, engine.name, engine.def)
    );
});

let DuckDuckGo = getEngineEnabled("DuckDuckGo", false);
let Bing = getEngineEnabled("Bing", true);
let Google = getEngineEnabled("Google", false);
let Yahoo = getEngineEnabled("Yahoo", true);
let Startpage = getEngineEnabled("Startpage", false);
let Ecosia = getEngineEnabled("Ecosia", true);
let Qwant = getEngineEnabled("Qwant", true);
let Yandex = getEngineEnabled("Yandex", true);

(function () {
    'use strict';

    const url = new URL(window.location.href);

    const engines = [
        {
            enabled: Bing,
            host: "bing.com",
            ref: "bing.com",
            param: "q"
        },
        {
            enabled: DuckDuckGo,
            host: "duckduckgo.com",
            ref: "duckduckgo.com",
            param: "q"
        },
        {
            enabled: Google,
            host: "google.com",
            ref: "google.com",
            param: "q"
        },
        {
            enabled: Yahoo,
            host: "yahoo.com",
            ref: "yahoo.com",
            param: "p"
        },
        {
            enabled: Startpage,
            host: "startpage.com",
            ref: "startpage.com",
            param: "query"
        },
        {
            enabled: Ecosia,
            host: "ecosia.org",
            ref: "ecosia.org",
            param: "q"
        },
        {
            enabled: Qwant,
            host: "qwant.com",
            ref: "qwant.com",
            param: "q"
        },
        {
            enabled: Yandex,
            host: "yandex.com",
            ref: "yandex.com",
            param: "text"
        }
    ];

    for (const engine of engines) {
        if (
            engine.enabled &&
            url.hostname.endsWith(engine.host) &&
            url.searchParams.has(engine.param) &&
            !document.referrer.includes(engine.ref)
        ) {
            const query = url.searchParams.get(engine.param);
            const braveSearchURL = `https://search.brave.com/search?q=${encodeURIComponent(query)}`;
            document.documentElement.innerHTML = "";
            location.replace(braveSearchURL);
            break;
        }
    }
})();