function getStarRating(sentimentText) {
    switch (sentimentText) {
        case 'Overwhelmingly Positive':
            return 5;
        case 'Very Positive':
            return 4;
        case 'Mostly Positive':
            return 3;
        case 'Mixed':
            return 2;
        case 'Mostly Negative':
            return 1;
        default:
            return 0;
    }
}

function calculateDiscountQualityScore(reviewStars, numReviews, releaseDate, maxDiscount, priceDiff, weights) {
    const days = Math.max((Date.now() - releaseDate.getTime()) / 86400000, 1);
    
    const d = Math.abs(priceDiff) / maxDiscount;
    const r = reviewStars / 5;
    const v = Math.log10(numReviews / days + 1) / Math.log10(50);
    const t = Math.max(0, 1 - (Math.log10(days) / Math.log10(3650)));
    
    return weights.d * d + weights.r * r + weights.v * v + weights.t * t;
}

function AddDummySortItem() {
    $J("#sort_by_trigger").text("Deal Score")
    $J($J("#sort_by_droplist li a")[0]).text("Deal Score");
}

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

        AddDummySortItem();

        var maxDiscount = 0;

        const runFilter = () => {

            

            // Process new rows
            $J('a.search_result_row').each(function() {
                const a = $J(this);
                //if (a.data('deal-finder-processed')) {
                //    return;
                //}
                //a.data('deal-finder-processed', true);

                // Step 1: Filter by discount
                const discountPctText = a.find('div.discount_pct').text().trim();
                if (discountPctText) {
                    const d = parseFloat(discountPctText); // This is negative, e.g. -90
                    if (!isNaN(d) && d > settings.discountThreshold) {
                        a.remove();
                        return; // Stop processing this item
                    }
                } else {
                    a.remove(); // No discount, remove it.
                    return;
                }

                const originalPrice = parseFloat(a.find('div.discount_original_price').text().trim().substring(1));
                const discountPrice = parseFloat(a.find('div.discount_final_price').text().trim().substring(1));
                const priceDiff = originalPrice - discountPrice;
                if (maxDiscount < priceDiff) maxDiscount = priceDiff;

                const discount = parseFloat(discountPctText.replace('-', '').replace('%', ''));
                const tooltipHtml = a.find('span[data-tooltip-html]').attr('data-tooltip-html');
                const sentimentText = tooltipHtml ? tooltipHtml.split('<br>')[0] : '';
                const reviewStars = getStarRating(sentimentText);
                const reviewMatch = tooltipHtml ? tooltipHtml.match(/(\d+)% of the ([\d,]+) user reviews/) : null;
                const reviewScore = reviewMatch && reviewMatch[1] ? parseInt(reviewMatch[1], 10) : 0;
                const numReviews = reviewMatch && reviewMatch[2] ? parseInt(reviewMatch[2].replace(/,/g, ''), 10) : 0;
                const releaseDateText = a.find('div.search_released').text().trim();
                const releaseDate = releaseDateText ? new Date(releaseDateText) : new Date();

                if(releaseDateText == null || releaseDateText == '') {
                    a.remove();
                    return;
                }

                // Step 3: Highlight by review criteria
                //if (settings.highlighting && reviewScore >= settings.minPercentile) {
                    //a.find('.search_review_summary').addClass('deal-finder-highlight');
                //}

                if (settings.highlighting && tooltipHtml && reviewScore >= settings.minPercentile) {
                    a.addClass('deal-finder-highlight');
                }
                // Step 4: Calculate and display score
                let score = 0;
                if (discount && reviewScore && numReviews && releaseDate) {

                    score = calculateDiscountQualityScore(reviewStars, numReviews, releaseDate, maxDiscount, priceDiff, settings.weights);
                    const scoreDisplay = $J('<div class="deal_score"></div>');
                    scoreDisplay.text(`Score: ${(score * 100).toFixed(2)}`);
                    scoreDisplay.css({
                        'position': 'absolute',
                        'top': '4px',
                        'right': '50px',
                        'color': 'white',
                        'background-color': 'rgba(0, 0, 0, 0.6)',
                        'padding': '2px 5px',
                        'border-radius': '5px',
                        'font-size': '12px',
                        'width': '45px'
                    });
                    a.find('.deal_score').remove();
                    a.css('position', 'relative').append(scoreDisplay);
                }
                a.data('deal-score', score);
            });

            // Step 5: Sort all visible rows based on score
            const rows = $J('a.search_result_row'); // Re-query DOM for visible rows
            const sortedRows = rows.get().sort(function(a, b) {
                const scoreA = $J(a).data('deal-score') || 0;
                const scoreB = $J(b).data('deal-score') || 0;
                return scoreB - scoreA;
            });

            const searchResultsContainer = $J('#search_resultsRows');
            searchResultsContainer.append(sortedRows);
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