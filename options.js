const reviewSteps = [0, 50, 75, 90, 95, 100];

function getSentiment(value) {
    if (value >= 95) return { text: "Overwhelmingly Positive", class: "bg-primary" };
    if (value >= 90) return { text: "Very Positive", class: "bg-info" };
    if (value >= 75) return { text: "Mostly Positive", class: "bg-success" };
    if (value >= 50) return { text: "Mixed", class: "bg-warning text-dark" };
    if (value >= 0) return { text: "Mostly Negative", class: "bg-danger" };
    return { text: "Any", class: "bg-secondary" };
}

function snapToStep(value) {
    return reviewSteps.reduce((prev, curr) => 
        (Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev)
    );
}

function save_options() {
  const discountSlider = document.getElementById('discountSlider').value;
  const reviewSlider = document.getElementById('reviewSlider').value;

  chrome.storage.sync.set({
    discountThreshold: -parseInt(discountSlider, 10),
    minPercentile: parseInt(reviewSlider, 10)
  }, function() {
    const status = document.getElementById('status');
    status.innerHTML = '<div class="alert alert-success p-2" role="alert">Options saved, refreshing...</div>';
    
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs[0] && tabs[0].id) {
        chrome.tabs.reload(tabs[0].id);
      }
    });

    setTimeout(() => { 
      window.close(); 
    }, 1000);
  });
}

function restore_options() {
  chrome.storage.sync.get({
    discountThreshold: -70,
    minPercentile: 75
  }, function(items) {
    const discountSlider = document.getElementById('discountSlider');
    const reviewSlider = document.getElementById('reviewSlider');
    
    discountSlider.value = -items.discountThreshold;
    reviewSlider.value = items.minPercentile;
    
    updateDiscountLabel();
    updateReviewLabel();
  });
}

function updateDiscountLabel() {
    const value = document.getElementById('discountSlider').value;
    document.getElementById('discountValue').textContent = `-${value}%`;
}

function updateReviewLabel() {
    const value = document.getElementById('reviewSlider').value;
    const sentiment = getSentiment(value);
    const label = document.getElementById('reviewSentimentLabel');

    document.getElementById('reviewValue').textContent = `${value}%+`;
    label.textContent = sentiment.text;
    label.className = `badge ${sentiment.class}`;
}

function handleReviewSliderChange() {
    const reviewSlider = document.getElementById('reviewSlider');
    const snappedValue = snapToStep(reviewSlider.value);
    reviewSlider.value = snappedValue;
    updateReviewLabel();
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
document.getElementById('discountSlider').addEventListener('input', updateDiscountLabel);
document.getElementById('reviewSlider').addEventListener('input', updateReviewLabel);
document.getElementById('reviewSlider').addEventListener('change', handleReviewSliderChange); 