// Function to modify ratings
function addScoreSuffix() {
    // Select all elements with ratings
    const ratingElements = document.querySelectorAll('span.rating[class*="rated-"]');
    
    ratingElements.forEach(ratingElement => {
        // Skip if the parent element has the class 'rating-histogram'
        if (ratingElement.closest('.rating-histogram')) return;

        // Extract rating value from the class name (e.g., "rated-6" or "rated-large-9" -> 6 or 9)
        const ratingMatch = ratingElement.className.match(/rated(?:-large)?-(\d+)/);
        if (!ratingMatch) return;

        const ratingValue = ratingMatch[1];
        
        // Avoid adding duplicate score suffix
        if (ratingElement.parentElement.querySelector(`span[data-rating="${ratingValue}"]`)) return;

        // Create a new span for the /10 suffix
        const suffixSpan = document.createElement('span');
        suffixSpan.textContent = ` (${ratingValue}/10)`;
        suffixSpan.style.verticalAlign = "top";
        suffixSpan.setAttribute('data-rating', ratingValue);
        
        // Match the rating size class
        const sizeClass = ratingElement.className.match(/-tiny|-green|-large|-nano|-micro/);
        if (sizeClass) {
            suffixSpan.className = sizeClass[0];
            switch (sizeClass[0]) {
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

        if (['rating-large', '-nano', '-tiny', '-green'].some(cls => ratingElement.className.includes(cls))) {
            ratingElement.insertAdjacentElement('afterend', suffixSpan);
        } else {
            ratingElement.parentElement.appendChild(document.createElement('br'));
            ratingElement.parentElement.appendChild(suffixSpan);
        }
    });

    // Select the parent ul element with id "liked-reviews"
    const likedReviews = document.getElementById('liked-reviews');
    if (likedReviews) {
        likedReviews.style.height = '100%';
    }
}

// Function to modify rateit elements
function addRateitScoreSuffix() {
    const rateitElements = document.querySelectorAll('div[class~="rateit"]:not(.panel-rateit)');

    rateitElements.forEach(rateitElement => {
        const rangeElement = rateitElement.querySelector('.rateit-range');
        if (!rangeElement) return;

        const ratingValue = rangeElement.getAttribute('aria-valuenow');
        if (!ratingValue || ratingValue == 0) return;

        // Avoid adding duplicate score suffix
        // if (rangeElement.querySelector('span[data-rating]')) return;

        const existingSpan = rangeElement.querySelector('span[data-rating]');

        if (existingSpan) {
            if (existingSpan.textContent.includes(`(${ratingValue}/10)`)) return;

            existingSpan.textContent = ` (${ratingValue}/10)`;
            existingSpan.setAttribute('data-rating', ratingValue);
            return;
        }

        // Create a new span for the /10 suffix
        const suffixSpan = document.createElement('span');
        suffixSpan.textContent = ` (${ratingValue}/10)`;
        suffixSpan.style.verticalAlign = "top";
        suffixSpan.style.fontSize = "11px";
        suffixSpan.setAttribute('data-rating', ratingValue);

        // Add the suffixSpan and a <br> tag to the rateit-selected element
        const selectedElement = rangeElement.querySelector('.rateit-selected');
        if (selectedElement) {
            selectedElement.appendChild(document.createElement('br'));
            selectedElement.appendChild(suffixSpan);
        }
    });
}

// Updated function to handle panelRateitElements
function handlePanelRateitElements() {
    const panelRateitElements = document.querySelectorAll('div.rateit.panel-rateit.instant-rating');
    panelRateitElements.forEach(panelRateitElement => {
        const rangeElement = panelRateitElement.querySelector('.rateit-range');
        if (!rangeElement) return;

        const ratingValue = rangeElement.getAttribute('aria-valuenow');
        if (!ratingValue || ratingValue == 0) return;

        // Check if a span already exists, ignoring the rating value
        const existingSpan = panelRateitElement.querySelector('span[data-rating]');
        if (existingSpan) {
            existingSpan.textContent = ` (${ratingValue}/10)`;
            existingSpan.setAttribute('data-rating', ratingValue);
            return;
        }

        const panelSuffixSpan = document.createElement('span');
        panelSuffixSpan.textContent = ` (${ratingValue}/10)`;
        panelSuffixSpan.setAttribute('data-rating', ratingValue);
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