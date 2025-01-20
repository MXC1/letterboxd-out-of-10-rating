// Function to create a suffix span element
function createSuffixSpan(ratingValue, sizeClass) {
    const suffixSpan = document.createElement('span');
    suffixSpan.textContent = ` (${ratingValue}/10)`;
    suffixSpan.style.verticalAlign = "top";
    suffixSpan.setAttribute('data-rating', ratingValue);

    if (sizeClass) {
        suffixSpan.className = sizeClass;
        switch (sizeClass) {
            case '-nano':
                Object.assign(suffixSpan.style, {
                    fontSize: "10px",
                    lineHeight: "20px",
                    verticalAlign: "middle",
                    textAlign: "center",
                    display: "block"
                });
                break;
            case '-green':
                Object.assign(suffixSpan.style, {
                    marginLeft: "-4px",
                    marginRight: "4px"
                });
                break;
            case '-micro':
                suffixSpan.style.lineHeight = "7px";
                break;
        }
    } else {
        suffixSpan.style.fontSize = "11px";
    }

    return suffixSpan;
}

// Function to add score suffix to rating elements
function addScoreSuffix() {
    const ratingElements = document.querySelectorAll('span.rating[class*="rated-"]');
    
    ratingElements.forEach(ratingElement => {
        if (ratingElement.closest('.rating-histogram')) return;

        if (ratingElement.className.match(/rated(?:-large)?-(\d+)/)) return;

        const ratingValue = ratingMatch[1];
        if (ratingElement.parentElement.querySelector(`span[data-rating="${ratingValue}"]`)) return;

        const sizeClass = ratingElement.className.match(/-tiny|-green|-large|-nano|-micro/);
        const suffixSpan = createSuffixSpan(ratingValue, sizeClass ? sizeClass[0] : null);

        if (['rating-large', '-nano', '-tiny', '-green'].some(cls => ratingElement.className.includes(cls))) {
            ratingElement.insertAdjacentElement('afterend', suffixSpan);
        } else {
            ratingElement.parentElement.appendChild(document.createElement('br'));
            ratingElement.parentElement.appendChild(suffixSpan);
        }
    });

    const likedReviews = document.getElementById('liked-reviews');
    if (likedReviews) {
        likedReviews.style.height = '100%';
    }
}

// Function to add score suffix to rateit elements
function addRateitScoreSuffix() {
    const rateitElements = document.querySelectorAll('div[class~="rateit"]:not(.panel-rateit)');

    rateitElements.forEach(rateitElement => {
        const rangeElement = rateitElement.querySelector('.rateit-range');
        if (!rangeElement) return;

        const ratingValue = rangeElement.getAttribute('aria-valuenow');
        if (!ratingValue || ratingValue == 0) return;
        // if (rangeElement.querySelector('span[data-rating]')) return;

        const existingSpan = (rangeElement.querySelector('span[data-rating]'));

        // Check if a span already exists, ignoring the rating value
        if (existingSpan) {
            existingSpan.textContent = ` (${ratingValue}/10)`;
            existingSpan.setAttribute('data-rating', ratingValue);
            return;
        }

        const suffixSpan = createSuffixSpan(ratingValue, null);
        const selectedElement = rangeElement.querySelector('.rateit-selected');
        if (selectedElement) {
            selectedElement.appendChild(document.createElement('br'));
            selectedElement.appendChild(suffixSpan);
        }
    });
}

// Function to handle panel rateit elements
function handlePanelRateitElements() {
    const panelRateitElements = document.querySelectorAll('div.rateit.panel-rateit.instant-rating');

    panelRateitElements.forEach(panelRateitElement => {
        const rangeElement = panelRateitElement.querySelector('.rateit-range');
        if (!rangeElement) return;

        const ratingValue = rangeElement.getAttribute('aria-valuenow');
        if (!ratingValue || ratingValue == 0) return;

        const existingSpan = panelRateitElement.querySelector('span[data-rating]');
        if (existingSpan) {
            existingSpan.textContent = ` (${ratingValue}/10)`;
            existingSpan.setAttribute('data-rating', ratingValue);
            return;
        }

        const panelSuffixSpan = createSuffixSpan(ratingValue, null);
        panelRateitElement.appendChild(document.createElement('br'));
        panelRateitElement.appendChild(panelSuffixSpan);
    });
}

// Run the functions when the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    addScoreSuffix();
    addRateitScoreSuffix();
    handlePanelRateitElements();
});

// Run the functions on subsequent page updates (for SPAs)
const observer = new MutationObserver(() => {
    addScoreSuffix();
    addRateitScoreSuffix();
    handlePanelRateitElements();
});
observer.observe(document.body, { childList: true, subtree: true });
