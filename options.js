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

function getWeightData() {
    const rawWeights = {
        discount: parseInt(weightInputs.discount.value, 10) || 0,
        review: parseInt(weightInputs.review.value, 10) || 0,
        popularity: parseInt(weightInputs.popularity.value, 10) || 0,
        age: parseInt(weightInputs.age.value, 10) || 0,
    };

    const totalWeight = Object.values(rawWeights).reduce((sum, w) => sum + w, 0);

    const proportions = {
        discount: totalWeight > 0 ? rawWeights.discount / totalWeight : 0.25,
        review: totalWeight > 0 ? rawWeights.review / totalWeight : 0.25,
        popularity: totalWeight > 0 ? rawWeights.popularity / totalWeight : 0.25,
        age: totalWeight > 0 ? rawWeights.age / totalWeight : 0.25
    };
    
    return { rawWeights, proportions };
}

const weightInputs = {
    discount: document.getElementById('discountWeight'),
    review: document.getElementById('reviewWeight'),
    popularity: document.getElementById('popularityWeight'),
    age: document.getElementById('ageWeight')
};

const weightOutputs = {
    discount: document.getElementById('discountWeightOutput'),
    review: document.getElementById('reviewWeightOutput'),
    popularity: document.getElementById('popularityWeightOutput'),
    age: document.getElementById('ageWeightOutput')
};

const weightValueOutputs = {
    discount: document.getElementById('discountWeightValue'),
    review: document.getElementById('reviewWeightValue'),
    popularity: document.getElementById('popularityWeightValue'),
    age: document.getElementById('ageWeightValue')
};

function drawStarPlot() {
    const canvas = document.getElementById('starPlotCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    const { proportions } = getWeightData();

    // Update percentage labels
    Object.keys(weightValueOutputs).forEach(key => {
        weightValueOutputs[key].textContent = `${(proportions[key] * 100).toFixed(0)}%`;
    });

    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = '#2a475e';
    ctx.fillStyle = 'rgba(102, 192, 244, 0.3)';
    ctx.lineWidth = 1;

    // Draw axes
    ctx.beginPath();
    ctx.moveTo(centerX, 10);
    ctx.lineTo(centerX, height - 10);
    ctx.moveTo(10, centerY);
    ctx.lineTo(width - 10, centerY);
    ctx.stroke();

    // Draw the star shape
    ctx.beginPath();
    // Top point (discount)
    ctx.moveTo(centerX, centerY - (10 + proportions.discount * (centerY - 10)));
    // Left point (review)
    ctx.lineTo(centerX - (10 + proportions.review * (centerX - 10)), centerY);
    // Bottom point (age)
    ctx.lineTo(centerX, centerY + (10 + proportions.age * (centerY - 10)));
    // Right point (popularity)
    ctx.lineTo(centerX + (10 + proportions.popularity * (centerX - 10)), centerY);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
}

function get_settings_from_dom() {
  const discountSlider = document.getElementById('discountSlider').value;
  const reviewSlider = document.getElementById('reviewSlider').value;
  const highlightToggle = document.getElementById('highlightToggle').checked;
  const extensionEnabled = document.getElementById('extensionEnabledToggle').checked;

  const { rawWeights, proportions } = getWeightData();
  const storageProportions = {
      d: proportions.discount,
      r: proportions.review,
      v: proportions.popularity,
      t: proportions.age,
  };

  return {
    discountThreshold: -parseInt(discountSlider, 10),
    minPercentile: parseInt(reviewSlider, 10),
    highlighting: highlightToggle,
    weights: storageProportions,
    rawWeights: rawWeights,
    extensionEnabled: extensionEnabled
  };
}

function auto_save_options() {
  const settings = get_settings_from_dom();
  chrome.storage.sync.set(settings);
}

function save_options() {
  const settings = get_settings_from_dom();
  chrome.storage.sync.set(settings, function() {
    const saveButton = document.getElementById('save');
    const status = document.getElementById('status');
    
    // Hide the save button and show status
    saveButton.style.display = 'none';
    status.style.display = 'block';
    status.textContent = 'Options saved, refreshing...';
    
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs[0] && tabs[0].id) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "reload" });
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
    minPercentile: 95,
    highlighting: true,
    rawWeights: { discount: 90, review: 90, popularity: 30, age: 10 },
    weights: { d: 0.9, r: 0.9, v: 0.3, t: 0.1 },
    extensionEnabled: true
  }, function(items) {
    const discountSlider = document.getElementById('discountSlider');
    const reviewSlider = document.getElementById('reviewSlider');
    const highlightToggle = document.getElementById('highlightToggle');
    const extensionEnabledToggle = document.getElementById('extensionEnabledToggle');
    
    discountSlider.value = -items.discountThreshold;
    reviewSlider.value = items.minPercentile;
    highlightToggle.checked = items.highlighting;
    extensionEnabledToggle.checked = items.extensionEnabled;
    
    weightInputs.discount.value = items.rawWeights.discount;
    weightInputs.review.value = items.rawWeights.review;
    weightInputs.popularity.value = items.rawWeights.popularity;
    weightInputs.age.value = items.rawWeights.age;
    
    Object.keys(weightInputs).forEach(key => {
        if (weightInputs[key] && weightOutputs[key]) {
            weightOutputs[key].textContent = weightInputs[key].value;
        }
    });

    drawStarPlot();

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

document.getElementById('discountSlider').addEventListener('input', () => {
    updateDiscountLabel();
    auto_save_options();
});

document.getElementById('reviewSlider').addEventListener('input', () => {
    updateReviewLabel();
    auto_save_options();
});

document.getElementById('reviewSlider').addEventListener('change', () => {
    handleReviewSliderChange();
    auto_save_options();
});

document.getElementById('highlightToggle').addEventListener('change', auto_save_options);
document.getElementById('extensionEnabledToggle').addEventListener('change', auto_save_options);

Object.keys(weightInputs).forEach(key => {
    const input = weightInputs[key];
    const output = weightOutputs[key];
    if (input && output) {
        input.addEventListener('input', () => {
            output.textContent = input.value;
            drawStarPlot();
            auto_save_options();
        });
    }
}); 