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
  }
  
  // Run the function when the DOM is loaded
  document.addEventListener("DOMContentLoaded", addScoreSuffix);
  
  // Run the function on subsequent page updates (for SPAs)
  const observer = new MutationObserver(addScoreSuffix);
  observer.observe(document.body, { childList: true, subtree: true });
