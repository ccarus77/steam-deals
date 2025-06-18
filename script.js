function initializeDealFinder() {
    const settingsDiv = document.getElementById('steam-deal-finder-settings');
    if (!settingsDiv) {
        // If settings aren't ready, wait a bit and try again.
        setTimeout(initializeDealFinder, 100);
        return;
    }

    const settings = JSON.parse(settingsDiv.getAttribute('data-settings'));
    settingsDiv.remove(); // Clean up the DOM

    const patchScrollHandler = () => {
        if (typeof InitInfiniteScroll === 'undefined' || !InitInfiniteScroll.oController || !InitInfiniteScroll.oController.OnScroll) {
            return;
        }

        const originalOnScroll = InitInfiniteScroll.oController.OnScroll;

        const runFilter = () => {
            $J('a.search_result_row').each(function() {
                const a = $J(this);
                if (a.data('deal-finder-processed')) {
                    return;
                }
                a.data('deal-finder-processed', true);

                // Step 1: Filter by discount (delete if not met)
                const discountPctText = a.find('div.discount_pct').text().trim();
                if (discountPctText) {
                    const d = parseFloat(discountPctText);
                    if (!isNaN(d) && d > settings.discountThreshold) {
                        a.remove();
                        return; // Stop processing this item
                    }
                }else{
                    a.remove();
                    return;
                }

                // Step 2: Highlight by review criteria (if met)
                const tooltipHtml = a.find('span[data-tooltip-html]').attr('data-tooltip-html');
                if (!tooltipHtml) {
                    return; // No tooltip, so we can't highlight it. Continue.
                }

                let meetsReviewCriteria = false;
                const match = tooltipHtml.match(/(\d+)% of the/);
                if (match && match[1]) {
                    const percentile = parseInt(match[1], 10);
                    if (percentile >= settings.minPercentile) {
                        meetsReviewCriteria = true;
                    }
                }

                if (meetsReviewCriteria) {
                    a.css({
                        'background-color': '#4a4a00',
                        'box-shadow': '0 0 10px yellow'
                    });
                }
            });
        };

        InitInfiniteScroll.oController.OnScroll = function() {
            const result = originalOnScroll.apply(this, arguments);
            runFilter();
            return result;
        };

        // Run once for the content that's already on the page
        runFilter();
    };

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        patchScrollHandler();
    } else {
        window.addEventListener('load', patchScrollHandler, { once: true });
    }
}

initializeDealFinder(); 
initializeDealFinder(); 