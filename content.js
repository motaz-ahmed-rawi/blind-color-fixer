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
    const oldSvg = document.querySelector('#custom-color-svg');
    if (oldSvg) oldSvg.remove();

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.id = 'custom-color-svg';
    svg.style.display = 'none';

    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    filter.id = 'custom-filter';

    // Add a color matrix for overall adjustment
    const baseMatrix = document.createElementNS('http://www.w3.org/2000/svg', 'feColorMatrix');
    baseMatrix.setAttribute('type', 'matrix');
    baseMatrix.setAttribute('result', 'original');
    baseMatrix.setAttribute('values', '1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0');
    filter.appendChild(baseMatrix);

    colorPairs.forEach((pair, index) => {
        const fromColor = hexToRgb(pair.from);
        const toColor = hexToRgb(pair.to);

        // Create color detection matrix
        const detectMatrix = document.createElementNS('http://www.w3.org/2000/svg', 'feColorMatrix');
        detectMatrix.setAttribute('in', index === 0 ? 'SourceGraphic' : `color${index - 1}`);
        detectMatrix.setAttribute('type', 'matrix');
        detectMatrix.setAttribute('values', `
            ${fromColor.r/255} 0 0 0 0
            0 ${fromColor.g/255} 0 0 0
            0 0 ${fromColor.b/255} 0 0
            0 0 0 1 0
        `);
        detectMatrix.setAttribute('result', `detect${index}`);

        // Create replacement matrix
        const replaceMatrix = document.createElementNS('http://www.w3.org/2000/svg', 'feColorMatrix');
        replaceMatrix.setAttribute('type', 'matrix');
        replaceMatrix.setAttribute('values', `
            ${toColor.r/fromColor.r} 0 0 0 0
            0 ${toColor.g/fromColor.g} 0 0 0
            0 0 ${toColor.b/fromColor.b} 0 0
            0 0 0 1 0
        `);
        replaceMatrix.setAttribute('result', `replace${index}`);

        // Blend the results
        const composite = document.createElementNS('http://www.w3.org/2000/svg', 'feComposite');
        composite.setAttribute('in', `detect${index}`);
        composite.setAttribute('in2', `replace${index}`);
        composite.setAttribute('operator', 'arithmetic');
        composite.setAttribute('k1', '0');
        composite.setAttribute('k2', '1');
        composite.setAttribute('k3', '0');
        composite.setAttribute('k4', '0');
        composite.setAttribute('result', `color${index}`);

        filter.appendChild(detectMatrix);
        filter.appendChild(replaceMatrix);
        filter.appendChild(composite);
    });

    // Add final blend
    const finalBlend = document.createElementNS('http://www.w3.org/2000/svg', 'feBlend');
    finalBlend.setAttribute('in', `color${colorPairs.length - 1}`);
    finalBlend.setAttribute('in2', 'SourceGraphic');
    finalBlend.setAttribute('mode', 'normal');
    filter.appendChild(finalBlend);

    defs.appendChild(filter);
    svg.appendChild(defs);
    document.body.appendChild(svg);

    document.body.style.filter = 'url(#custom-filter)';
}

// Helper function to calculate color similarity
function colorDistance(color1, color2) {
    return Math.sqrt(
        Math.pow(color1.r - color2.r, 2) +
        Math.pow(color1.g - color2.g, 2) +
        Math.pow(color1.b - color2.b, 2)
    );
}

// Add new functions for saving and loading custom colors
function saveCustomColors(colorPairs) {
    chrome.storage.sync.set({
        'savedColorPairs': colorPairs
    }, function() {
        console.log('Color pairs saved');
    });
}

function loadCustomColors() {
    return new Promise((resolve) => {
        chrome.storage.sync.get('savedColorPairs', function(result) {
            if (result.savedColorPairs) {
                applyCustomColors(result.savedColorPairs);
                resolve(result.savedColorPairs);
            } else {
                resolve(null);
            }
        });
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
    if (request.action === 'applyFilter') {
        applyColorFilter(request.type);
    } else if (request.action === 'reset') {
        document.body.style.filter = 'none';
        const oldSvg = document.querySelector('#custom-color-svg');
        if (oldSvg) oldSvg.remove();
    } else if (request.action === 'applyCustomColors') {
        applyCustomColors(request.colorPairs);
        // Save the colors when they are applied
        saveCustomColors(request.colorPairs);
    } else if (request.action === 'loadSavedColors') {
        loadCustomColors().then(colorPairs => {
            sendResponse({ success: true, colorPairs: colorPairs });
        });
        return true; // Required for async response
    }
});

// Load saved colors when the page loads
document.addEventListener('DOMContentLoaded', () => {
    loadCustomColors();
});