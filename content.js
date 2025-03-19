// Add logger utility at the top
const Logger = {
    debug: (msg, ...args) => console.debug(`[ColorblindFixer] ${msg}`, ...args),
    error: (msg, ...args) => console.error(`[ColorblindFixer] ${msg}`, ...args)
};

let isExtensionEnabled = true;

function removeAllFilters() {
    // Remove SVG filters
    const customSvg = document.querySelector('#custom-color-svg');
    if (customSvg) customSvg.remove();
    
    // Remove filter SVG elements
    const filterSvg = document.querySelector('svg[style="display:none"]');
    if (filterSvg) filterSvg.remove();
    
    // Remove filter from body
    document.body.style.transition = 'filter 0.3s ease-in-out';
    document.body.style.filter = 'none';
}

// Update initial state check
chrome.storage.local.get(['isEnabled', 'lastFilter', 'lastCustomColors'], function(result) {
    isExtensionEnabled = result.isEnabled !== false;
    
    if (isExtensionEnabled) {
        if (result.lastFilter) {
            applyColorFilter(result.lastFilter);
        } else if (result.lastCustomColors) {
            applyCustomColors(result.lastCustomColors);
        }
    } else {
        removeAllFilters();
    }
});

// Listen for toggle changes
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'toggleExtension') {
        isExtensionEnabled = request.isEnabled;
        if (isExtensionEnabled) {
            applyColorCorrection();
        } else {
            removeColorCorrection();
        }
    }
});

function applyColorCorrection() {
    // ...existing color correction code...
}

function removeColorCorrection() {
    // Remove any applied filters or color corrections
    document.documentElement.style.filter = 'none';
}

function applyColorFilter(type) {
    const filters = {
        'protanopia': 'url("#protanopia-filter")',
        'protanomaly': 'url("#protanomaly-filter")',
        'deuteranopia': 'url("#deuteranopia-filter")',
        'deuteranomaly': 'url("#deuteranomaly-filter")',
        'tritanopia': 'url("#tritanopia-filter")',
        'tritanomaly': 'url("#tritanomaly-filter")',
        'achromatopsia': 'url("#achromatopsia-filter")',
        'achromatomaly': 'url("#achromatomaly-filter")',
        'proto_deuter': 'url("#proto-deuter-filter")',
        'deuter_trit': 'url("#deuter-trit-filter")',
        'proto_trit': 'url("#proto-trit-filter")',
        'full_combo': 'url("#full-combo-filter")'
    };

    const svg = `
        <svg style="display:none">
            <defs>
                <filter id="protanopia-filter">
                    <feColorMatrix type="matrix" values="0.567,0.433,0,0,0 0.558,0.442,0,0,0 0,0.242,0.758,0,0 0,0,0,1,0"/>
                </filter>
                <filter id="protanomaly-filter">
                    <feColorMatrix type="matrix" values="0.817,0.183,0,0,0 0.333,0.667,0,0,0 0,0.125,0.875,0,0 0,0,0,1,0"/>
                </filter>
                <filter id="deuteranopia-filter">
                    <feColorMatrix type="matrix" values="0.625,0.375,0,0,0 0.7,0.3,0,0,0 0,0.3,0.7,0,0 0,0,0,1,0"/>
                </filter>
                <filter id="deuteranomaly-filter">
                    <feColorMatrix type="matrix" values="0.8,0.2,0,0,0 0.258,0.742,0,0,0 0,0.142,0.858,0,0 0,0,0,1,0"/>
                </filter>
                <filter id="tritanopia-filter">
                    <feColorMatrix type="matrix" values="0.95,0.05,0,0,0 0,0.433,0.567,0,0 0,0.475,0.525,0,0 0,0,0,1,0"/>
                </filter>
                <filter id="tritanomaly-filter">
                    <feColorMatrix type="matrix" values="0.967,0.033,0,0,0 0,0.733,0.267,0,0 0,0.183,0.817,0,0 0,0,0,1,0"/>
                </filter>
                <filter id="achromatopsia-filter">
                    <feColorMatrix type="matrix" values="0.299,0.587,0.114,0,0 0.299,0.587,0.114,0,0 0.299,0.587,0.114,0,0 0,0,0,1,0"/>
                </filter>
                <filter id="achromatomaly-filter">
                    <feColorMatrix type="matrix" values="0.618,0.320,0.062,0,0 0.163,0.775,0.062,0,0 0.163,0.320,0.516,0,0 0,0,0,1,0"/>
                </filter>
                <filter id="proto-deuter-filter">
                    <feColorMatrix type="matrix" values="
                        0.625,0.375,0,0,0
                        0.7,0.3,0,0,0
                        0,0.3,0.7,0,0
                        0,0,0,1,0"/>
                    <feColorMatrix type="matrix" values="
                        0.567,0.433,0,0,0
                        0.558,0.442,0,0,0
                        0,0.242,0.758,0,0
                        0,0,0,1,0"/>
                </filter>
                <filter id="deuter-trit-filter">
                    <feColorMatrix type="matrix" values="
                        0.625,0.375,0,0,0
                        0.7,0.3,0,0,0
                        0,0.3,0.7,0,0
                        0,0,0,1,0"/>
                    <feColorMatrix type="matrix" values="
                        0.95,0.05,0,0,0
                        0,0.433,0.567,0,0
                        0,0.475,0.525,0,0
                        0,0,0,1,0"/>
                </filter>
                <filter id="proto-trit-filter">
                    <feColorMatrix type="matrix" values="
                        0.567,0.433,0,0,0
                        0.558,0.442,0,0,0
                        0,0.242,0.758,0,0
                        0,0,0,1,0"/>
                    <feColorMatrix type="matrix" values="
                        0.95,0.05,0,0,0
                        0,0.433,0.567,0,0
                        0,0.475,0.525,0,0
                        0,0,0,1,0"/>
                </filter>
                <filter id="full-combo-filter">
                    <feColorMatrix type="matrix" values="
                        0.7,0.3,0,0,0
                        0.7,0.3,0,0,0
                        0.7,0.3,0,0,0
                        0,0,0,1,0"/>
                </filter>
            </defs>
        </svg>`;

    document.body.insertAdjacentHTML('beforeend', svg);
    document.body.style.filter = filters[type];
}

function applyCustomColors(colorPairs) {
    try {
        if (!Array.isArray(colorPairs) || !colorPairs.length) {
            throw new Error('Invalid color pairs provided');
        }

        const oldSvg = document.querySelector('#custom-color-svg');
        if (oldSvg) oldSvg.remove();

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.id = 'custom-color-svg';
        svg.style.display = 'none';

        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
        filter.id = 'custom-filter';

        // Create lookup table for better performance
        const lookupTable = new Map();
        colorPairs.forEach(pair => {
            const fromRgb = hexToRgb(pair.from);
            const toRgb = hexToRgb(pair.to);
            lookupTable.set(pair.from, {
                matrix: calculateColorMatrix(fromRgb, toRgb),
                threshold: 0.1
            });
        });

        // Add color adjustment filters
        colorPairs.forEach((pair, index) => {
            const { matrix } = lookupTable.get(pair.from);
            
            const colorMatrix = document.createElementNS('http://www.w3.org/2000/svg', 'feColorMatrix');
            colorMatrix.setAttribute('type', 'matrix');
            colorMatrix.setAttribute('values', matrix.join(' '));
            colorMatrix.setAttribute('result', `color${index}`);

            // Add gaussian blur for smoother transitions
            const blur = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
            blur.setAttribute('stdDeviation', '0.5');
            blur.setAttribute('result', `blur${index}`);

            filter.appendChild(colorMatrix);
            filter.appendChild(blur);
        });

        // Add final composition
        const composite = document.createElementNS('http://www.w3.org/2000/svg', 'feComposite');
        composite.setAttribute('operator', 'arithmetic');
        composite.setAttribute('k1', '0');
        composite.setAttribute('k2', '1');
        composite.setAttribute('k3', '0');
        composite.setAttribute('k4', '0');

        filter.appendChild(composite);
        defs.appendChild(filter);
        svg.appendChild(defs);
        document.body.appendChild(svg);

        // Apply with transition
        requestAnimationFrame(() => {
            document.body.style.transition = 'filter 0.3s ease-in-out';
            document.body.style.filter = 'url(#custom-filter)';
        });

        Logger.debug('Custom colors applied successfully');
        return true;
    } catch (error) {
        Logger.error('Error applying custom colors:', error);
        return false;
    }
}

// Add new helper function for color matrix calculation
function calculateColorMatrix(fromColor, toColor) {
    const scaleR = toColor.r / Math.max(fromColor.r, 1);
    const scaleG = toColor.g / Math.max(fromColor.g, 1);
    const scaleB = toColor.b / Math.max(fromColor.b, 1);

    return [
        scaleR, 0, 0, 0, 0,
        0, scaleG, 0, 0, 0,
        0, 0, scaleB, 0, 0,
        0, 0, 0, 1, 0
    ];
}

// Helper function to calculate color similarity
function colorDistance(color1, color2) {
    return Math.sqrt(
        Math.pow(color1.r - color2.r, 2) +
        Math.pow(color1.g - color2.g, 2) +
        Math.pow(color1.b - color2.b, 2)
    );
}

// Improve save function with error handling
function saveCustomColors(colorPairs) {
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.sync.set({
                'savedColorPairs': colorPairs,
                'timestamp': Date.now()
            }, () => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                    return;
                }
                Logger.debug('Color pairs saved successfully');
                resolve(true);
            });
        } catch (error) {
            Logger.error('Error saving colors:', error);
            reject(error);
        }
    });
}

function loadCustomColors() {
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.sync.get('savedColorPairs', function(result) {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                    return;
                }
                if (result.savedColorPairs) {
                    applyCustomColors(result.savedColorPairs);
                    resolve(result.savedColorPairs);
                } else {
                    resolve(null);
                }
            });
        } catch (error) {
            Logger.error('Error loading colors:', error);
            reject(error);
        }
    });
}

// Keep the hexToRgb function as is
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
}

// Update the message listener
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    try {
        if (request.action === 'toggleExtension') {
            isExtensionEnabled = request.isEnabled;
            if (isExtensionEnabled) {
                // Restore last used settings
                chrome.storage.local.get(['lastFilter', 'lastCustomColors'], function(result) {
                    if (result.lastFilter) {
                        applyColorFilter(result.lastFilter);
                    } else if (result.lastCustomColors) {
                        applyCustomColors(result.lastCustomColors);
                    }
                });
            } else {
                removeAllFilters();
            }
            sendResponse({ success: true });
            return;
        }

        // If extension is disabled, don't process any other actions
        if (!isExtensionEnabled) {
            sendResponse({ success: false, error: 'Extension is disabled' });
            return;
        }

        switch (request.action) {
            case 'applyFilter':
                if (isExtensionEnabled) {
                    applyColorFilter(request.type);
                }
                sendResponse({ success: true });
                break;
            case 'reset':
                document.body.style.transition = 'filter 0.3s ease-in-out';
                document.body.style.filter = 'none';
                const oldSvg = document.querySelector('#custom-color-svg');
                if (oldSvg) oldSvg.remove();
                sendResponse({ success: true });
                break;
            case 'applyCustomColors':
                if (isExtensionEnabled) {
                    const success = applyCustomColors(request.colorPairs);
                    if (success) {
                        saveCustomColors(request.colorPairs)
                            .then(() => sendResponse({ success: true }))
                            .catch(error => sendResponse({ success: false, error: error.message }));
                        return true; // Keep channel open for async response
                    }
                    sendResponse({ success: false, error: 'Failed to apply colors' });
                } else {
                    sendResponse({ success: false, error: 'Extension is disabled' });
                }
                break;
            case 'loadSavedColors':
                loadCustomColors()
                    .then(colorPairs => sendResponse({ success: true, colorPairs }))
                    .catch(error => sendResponse({ success: false, error: error.message }));
                return true; // Keep channel open for async response
        }
    } catch (error) {
        Logger.error('Error in message listener:', error);
        sendResponse({ success: false, error: error.message });
    }
});

// Load saved colors when the page loads
document.addEventListener('DOMContentLoaded', () => {
    loadCustomColors();
});