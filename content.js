// Inject the script that will read the settings from the DOM.
const s = document.createElement('script');
s.src = chrome.runtime.getURL('script.js');
(document.head || document.documentElement).appendChild(s);
s.onload = () => s.remove();

// Retrieve settings and inject them into a DOM element.
chrome.storage.sync.get({
    discountThreshold: -70,
    minPercentile: 75,
    highlighting: true,
    weights: { d: 0.4, r: 0.25, v: 0.2, t: 0.15 },
    extensionEnabled: true
}, function(items) {
    if (!items.extensionEnabled) {
        return;
    }

    const settings = {
        discountThreshold: items.discountThreshold,
        minPercentile: items.minPercentile,
        highlighting: items.highlighting,
        weights: items.weights
    };

    const settingsDiv = document.createElement('div');
    settingsDiv.id = 'steam-deal-finder-settings';
    settingsDiv.setAttribute('data-settings', JSON.stringify(settings));
    settingsDiv.style.display = 'none';
    (document.head || document.documentElement).appendChild(settingsDiv);
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "reload") {
        window.location.reload();
    }
}); 