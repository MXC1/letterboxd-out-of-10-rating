// Function to modify ratings
function addScoreSuffix() {
    // Select all elements with ratings
    const ratingElements = document.querySelectorAll('span.rating[class*="rated-"]');
    
    ratingElements.forEach(ratingElement => {
      // Skip if the parent element has the class 'rating-histogram'
      if (ratingElement.closest('.rating-histogram')) {
        return;
      }

      // Extract rating value from the class name (e.g., "rated-6" or "rated-large-9" -> 6 or 9)
      const ratingMatch = ratingElement.className.match(/rated(?:-large)?-(\d+)/);
      if (ratingMatch) {
        const ratingValue = ratingMatch[1];
        
        // Avoid adding duplicate score suffix
        if (!ratingElement.parentElement.querySelector(`span[data-rating="${ratingValue}"]`)) {
          // Create a new span for the /10 suffix
          const suffixSpan = document.createElement('span');
          suffixSpan.textContent = ` (${ratingValue}/10)`;
          suffixSpan.style.verticalAlign = "top";
          suffixSpan.setAttribute('data-rating', ratingValue);
          
          // Match the rating size class
          const sizeClass = ratingElement.className.match(/-tiny|-green|-large|-nano/);
          if (sizeClass) {
              suffixSpan.className = sizeClass[0];
              if (sizeClass[0] === '-nano') {
                  suffixSpan.style.fontSize = "10px";
                  suffixSpan.style.lineHeight = "20px";
                  suffixSpan.style.verticalAlign = "middle";
                  suffixSpan.style.textAlign = "center";
                  suffixSpan.style.display = "block";
              }
              if (sizeClass[0] === '-green') {
                  suffixSpan.style.marginLeft = "-4px";
                  suffixSpan.style.marginRight = "4px";
              }
            }
  
          // Insert the suffix span based on the rating size class
          if (ratingElement.className.includes('rating-large') || ratingElement.className.includes('-nano') || ratingElement.className.includes('-tiny') || ratingElement.className.includes('-green')) {
            ratingElement.insertAdjacentElement('afterend', suffixSpan);
          } else {
            // Create a <br> element
            const brElement = document.createElement('br');
            ratingElement.parentElement.appendChild(brElement);
            ratingElement.parentElement.appendChild(suffixSpan);
          }
        }
      }
    });
  }
  
  // Run the function when the DOM is loaded
  document.addEventListener("DOMContentLoaded", addScoreSuffix);
  
  // Run the function on subsequent page updates (for SPAs)
  const observer = new MutationObserver(addScoreSuffix);
  observer.observe(document.body, { childList: true, subtree: true });
