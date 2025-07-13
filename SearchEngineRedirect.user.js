// ==UserScript==
// @name                Search Engine Redirect
// @description         Redirect different search engines to the primary search engine
// @version             1.4
// @downloadURL         https://raw.githubusercontent.com/Nive9/userscripts/main/SearchEngineRedirect.user.js
// @updateURL           https://raw.githubusercontent.com/Nive9/userscripts/main/SearchEngineRedirect.user.js
// @icon                https://upload.wikimedia.org/wikipedia/commons/5/55/Magnifying_glass_icon.svg
// @match               *://*.bing.com/*
// @match               *://*.brave.com/*
// @match               *://*.duckduckgo.com/*
// @match               *://*.ecosia.org/*
// @match               *://*.google.com/*
// @match               *://*.qwant.com/*
// @match               *://*.startpage.com/*
// @match               *://*.yahoo.com/*
// @match               *://*.yandex.com/*
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
    { key: "Bing", name: "Bing", def: true, host: "bing.com", param: "q" },
    { key: "Brave", name: "Brave Search", def: true, host: "search.brave.com", param: "q" },
    { key: "DuckDuckGo", name: "DuckDuckGo", def: false, host: "duckduckgo.com", param: "q" },
    { key: "Ecosia", name: "Ecosia", def: true, host: "ecosia.org", param: "q" },
    { key: "Google", name: "Google", def: true, host: "google.com", param: "q" },
    { key: "Qwant", name: "Qwant", def: true, host: "qwant.com", param: "q" },
    { key: "Startpage", name: "Startpage", def: false, host: "startpage.com", param: "query" },
    { key: "Yahoo", name: "Yahoo", def: true, host: "yahoo.com", param: "p" },
    { key: "Yandex", name: "Yandex", def: true, host: "yandex.com", param: "text" }
];

// Function to set the primary search engine using a dropdown
function setPrimaryEngine() {
    const current = GM_getValue("PrimaryEngine", "Brave");
    const keys = engineList.map(e => e.key);
    const names = engineList.map(e => e.name);

    // Create the dropdown HTML
    const selectHTML = `
        <label style="font-family:sans-serif;font-size:14px;">
            Select your primary search engine:<br>
            <select id="ser-dropdown" style="margin-top:5px;font-size:14px;">
                ${names.map((n, i) =>
                    `<option value="${keys[i]}"${keys[i] === current ? " selected" : ""}>${n}${keys[i] === current ? " (current)" : ""}</option>`
                ).join("")}
            </select>
        </label>
        <button id="ser-ok" style="margin-left:10px;font-size:14px;">OK</button>
    `;

    // Create a modal
    const modal = document.createElement("div");
    modal.innerHTML = `
        <div style="position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.3);z-index:99999;display:flex;align-items:center;justify-content:center;">
            <div style="background:#fff;padding:20px 30px;border-radius:8px;box-shadow:0 2px 12px #0003;">
                ${selectHTML}
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector("#ser-ok").onclick = function() {
        const selected = modal.querySelector("#ser-dropdown").value;
        GM_setValue("PrimaryEngine", selected);
        document.body.removeChild(modal);
        location.reload();
    };
}

GM_registerMenuCommand(
    `Set Primary Search Engine (Current: ${engineList.find(e => e.key === GM_getValue("PrimaryEngine", "Brave")).name})`,
    setPrimaryEngine
);
GM_registerMenuCommand(" ", function() {});

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

        const target = engineList.find(e => e.key === primaryEngine) || engineList[0];
        const param = target.param;
        const host = target.host;
        const redirectURL = `https://${host}/search?${param}=${encodeURIComponent(query)}`;

        document.documentElement.innerHTML = "";
        location.replace(redirectURL);
    }
})();
