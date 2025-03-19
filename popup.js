document.getElementById('applyFilter').addEventListener('click', () => {
    const type = document.getElementById('colorblindType').value;
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            action: 'applyFilter',
            type: type
        });
    });
    chrome.storage.local.set({ lastFilter: type });
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
        chrome.storage.local.set({ activeTab: button.dataset.tab });
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
        chrome.storage.local.set({ lastCustomColors: colorPairs });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const enableToggle = document.getElementById('enableExtension');
    const container = document.querySelector('.container');
    const colorblindType = document.getElementById('colorblindType');

    // Load all saved settings
    chrome.storage.local.get(['isEnabled', 'lastFilter', 'lastCustomColors', 'activeTab'], function(result) {
        // Restore enable state
        enableToggle.checked = result.isEnabled !== false;
        updateInterface(enableToggle.checked);

        // Restore active tab
        if (result.activeTab) {
            document.querySelector(`[data-tab="${result.activeTab}"]`).click();
        }

        // Restore last filter selection
        if (result.lastFilter) {
            colorblindType.value = result.lastFilter;
            if (enableToggle.checked) {
                document.getElementById('applyFilter').click();
            }
        }

        // Restore custom colors
        if (result.lastCustomColors) {
            restoreCustomColors(result.lastCustomColors);
        }
    });

    function updateInterface(enabled) {
        // Disable all interactive elements except the toggle
        const elements = container.querySelectorAll('button:not(#enableExtension), select, input[type="color"]');
        elements.forEach(el => {
            el.disabled = !enabled;
            el.style.opacity = enabled ? '1' : '0.5';
        });
    }

    // Save state when toggle changes
    enableToggle.addEventListener('change', function() {
        const isEnabled = enableToggle.checked;
        chrome.storage.local.set({ isEnabled });
        updateInterface(isEnabled);
        
        // Notify content script
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
                action: 'toggleExtension',
                isEnabled: isEnabled
            });
        });
    });

    // Helper function to restore custom colors
    function restoreCustomColors(colorPairs) {
        const colorMapping = document.querySelector('.color-mapping');
        colorMapping.innerHTML = ''; // Clear existing pairs

        colorPairs.forEach(pair => {
            const newPair = document.querySelector('.color-pair').cloneNode(true);
            newPair.querySelector('.from-color').value = pair.from;
            newPair.querySelector('.to-color').value = pair.to;
            colorMapping.appendChild(newPair);
            setupColorPairListeners(newPair);
        });

        if (enableToggle.checked) {
            document.getElementById('applyCustom').click();
        }
    }
});