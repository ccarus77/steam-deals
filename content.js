// Inject the script that will read the settings from the DOM.
const s = document.createElement('script');
s.src = chrome.runtime.getURL('script.js');
(document.head || document.documentElement).appendChild(s);
s.onload = () => s.remove();

// Retrieve settings and inject them into a DOM element.
chrome.storage.sync.get({
    discountThreshold: -70,
    minPercentile: 80
}, function(items) {
    const settings = {
        discountThreshold: items.discountThreshold,
        minPercentile: items.minPercentile
    };

    const settingsDiv = document.createElement('div');
    settingsDiv.id = 'steam-deal-finder-settings';
    settingsDiv.setAttribute('data-settings', JSON.stringify(settings));
    settingsDiv.style.display = 'none';
    (document.head || document.documentElement).appendChild(settingsDiv);
}); 