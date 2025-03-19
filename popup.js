document.getElementById('applyFilter').addEventListener('click', () => {
    const type = document.getElementById('colorblindType').value;
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            action: 'applyFilter',
            type: type
        });
    });
});

document.getElementById('resetFilter').addEventListener('click', () => {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            action: 'reset'
        });
    });
});

// Tab switching
document.querySelectorAll('.tab-btn').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn, .tab-content').forEach(el => el.classList.remove('active'));
        button.classList.add('active');
        document.getElementById(button.dataset.tab + '-tab').classList.add('active');
    });
});

// Add new color pair
document.getElementById('addColorPair').addEventListener('click', () => {
    const newPair = document.querySelector('.color-pair').cloneNode(true);
    newPair.querySelector('.from-color').value = '#000000';
    newPair.querySelector('.to-color').value = '#000000';
    document.querySelector('.color-mapping').appendChild(newPair);
    setupColorPairListeners(newPair);
});

// Update setupColorPairListeners to handle both remove and color changes
function setupColorPairListeners(pairElement) {
    const removeBtn = pairElement.querySelector('.remove-pair');
    const fromColor = pairElement.querySelector('.from-color');
    const toColor = pairElement.querySelector('.to-color');

    removeBtn.addEventListener('click', () => {
        if (document.querySelectorAll('.color-pair').length > 1) {
            pairElement.remove();
            document.getElementById('applyCustom').click();
        }
    });

    [fromColor, toColor].forEach(input => {
        input.addEventListener('input', () => {
            document.getElementById('applyCustom').click();
        });
    });
}

// Initialize listeners for the first color pair
document.addEventListener('DOMContentLoaded', () => {
    const firstPair = document.querySelector('.color-pair');
    if (firstPair) {
        setupColorPairListeners(firstPair);
    }
});

document.getElementById('applyCustom').addEventListener('click', () => {
    const colorPairs = [...document.querySelectorAll('.color-pair')].map(pair => ({
        from: pair.querySelector('.from-color').value,
        to: pair.querySelector('.to-color').value
    })).filter(pair => pair.from && pair.to);

    if (colorPairs.length > 0) {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
                action: 'applyCustomColors',
                colorPairs: colorPairs
            });
        });
    }
});