// ==UserScript==
// @name         Amazon Archive Button
// @version      1.3.2
// @description  Restores the archive button on the order page
// @author       Nive9
// @downloadURL  https://github.com/Nive9/userscripts/raw/refs/heads/main/amazonArchiveButton.user.js
// @updateURL    https://github.com/Nive9/userscripts/raw/refs/heads/main/amazonArchiveButton.user.js
// @match        *://*.amazon.de/*
// @match        *://*.amazon.fr/*
// @match        *://*.amazon.it/*
// @match        *://*.amazon.es/*
// @match        *://*.amazon.nl/*
// @match        *://*.amazon.se/*
// @match        *://*.amazon.pl/*
// @match        *://*.amazon.in/*
// @match        *://*.amazon.com/*
// @match        *://*.amazon.co.jp/*
// @match        *://*.amazon.co.uk/*
// @match        *://*.amazon.com.mx/*
// @match        *://*.amazon.com.au/*
// @match        *://*.amazon.com.be/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    // TODO: Optimise 'see archived orders' filter on mobile
    // TODO: Add Button to Order Overview Page
    // TODO: Add un-archive button

    // The link to the archival page
    // https://www.amazon.com/gp/css/order-history/archive/archiveModal.html?orderId= YourOrderIdHere

    const langMap = {
        'de': 'Bestellung archivieren',
        'fr': 'Archiver la commande',
        'it': 'Archivia ordine',
        'es': 'Archivar pedido',
        'nl': 'Bestelling archiveren',
        'se': 'Arkivera beställning',
        'pl': 'Archiwizuj zamówienie',
        'in': 'आदेश संग्रहित करें',
        'com': 'Archive order',
        'co.jp': '注文をアーカイブ',
        'co.uk': 'Archive order',
        'com.mx': 'Archivar pedido',
        'com.au': 'Archive order',
        'com.be': 'Archiver la commande'
    };

    // Get TLD
    console.log('Fetching Public Suffix List')
    fetch('https://publicsuffix.org/list/public_suffix_list.dat')
    .then(response => response.text())
    .then(data => {
        const suffixes = data.split('\n').filter(line => !line.startsWith('//'));
        function getTLDWithSuffixList(hostname, suffixes) {
            const parts = hostname.split('.').reverse();
            for (let i = 0; i < parts.length; i++) {
                const suffix = parts.slice(0, i + 1).reverse().join('.');
                if (suffixes.includes(suffix)) {
                return suffix;
                }
            }
            return null;
        }
        
        const url = new URL(window.location.href);
        const parsedUrl = new URL(url);
        const tld = getTLDWithSuffixList(parsedUrl.hostname, suffixes);
        if (url.searchParams.has("orderID") || url.searchParams.has("oid")) {
            const orderID = url.searchParams.get("orderID");
            const oid = url.searchParams.get("oid")
            const archiveBaseURL = 'https://www.amazon.' + tld + '/gp/css/order-history/archive/archiveModal.html?orderId=';
            
            let archiveURL;
            if (orderID) {
                archiveURL = archiveBaseURL + orderID;
            } else if (oid) {
                archiveURL = archiveBaseURL + oid;
            }
            
            // Add Archive Button to Order Details Page (Desktop)
            const shipmentSection = document.querySelector('[data-component="shipmentConnections"]');
            if (shipmentSection) {
                const buttonStack = shipmentSection.querySelector('.a-button-stack.a-spacing-mini');
                if (buttonStack) {
                    let outerSpan = document.createElement('span');
                    outerSpan.className = 'a-button a-button-normal a-spacing-mini a-button-base archive-outer-span';

                    let innerSpan = document.createElement('span');
                    innerSpan.className = 'a-button-inner archive-inner-span';

                    const archiveButton = document.createElement('a');
                    archiveButton.classList.add("a-button-text");

                    const host = url.hostname;
                    let langKey = Object.keys(langMap).find(key => host.endsWith('amazon.' + key)) || 'com';
                    archiveButton.textContent = langMap[langKey];
                    archiveButton.href = archiveURL;

                    innerSpan.appendChild(archiveButton);
                    outerSpan.appendChild(innerSpan);
                    buttonStack.appendChild(outerSpan);
                }
            }

            // Add Archive Button to Order Details Page (Mobile)
            const orderSection = document.querySelector('[data-component="briefOrderSummary"]');
            if (orderSection) {
                console.log("Order Section available");
                const boxGroup = document.querySelector('.a-box-group');
                if (boxGroup) {
                    console.log("Box Section available");
                    let outerSection = document.createElement('a');
                    outerSection.className = 'a-touch-link a-box';

                    let innerSection = document.createElement('div');
                    innerSection.className = 'a-box-inner';

                    const innerSectionIcon = document.createElement('i');
                    innerSectionIcon.classList.add("a-icon", "a-icon-touch-link");

                    const host = url.hostname;
                    let langKey = Object.keys(langMap).find(key => host.endsWith('amazon.' + key)) || 'com';
                    outerSection.href = archiveURL;

                    innerSection.appendChild(innerSectionIcon);
                    innerSection.appendChild(document.createTextNode(langMap[langKey]));
                    outerSection.appendChild(innerSection);
                    boxGroup.appendChild(outerSection);
                }
            }
        }

        // Add Archive Link to Order Filters Page (Mobile)
        if (window.location.href.includes('/your-account/order-history#filterView')) {
            const filterContainer = document.querySelector('.js-time-filter-container');
            if (filterContainer) {
                let accessArchiveBtn = document.createElement('a');
                accessArchiveBtn.href = 'https://www.amazon.' + tld + '/your-orders/orders?timeFilter=archived';
                accessArchiveBtn.textContent = 'See Archived Orders';
                accessArchiveBtn.className = 'a-button a-button-normal a-button-base';
                filterContainer.appendChild(accessArchiveBtn);
                accessArchiveBtn.style.padding = '10px 0';
                accessArchiveBtn.style.margin = '10px 0';
            };
        };
    });

})();