// Wait for the entire page to load before running the script
document.addEventListener('DOMContentLoaded', () => {

  // 1. Select the important elements from the page
  const chatInput = document.querySelector('.chat-box input');
  const sendButton = document.querySelector('.icon.send');

  // 2. This is the main function that handles the submission
  const handleSubmit = () => {
    // Get the text from the input box
    const queryText = chatInput.value.trim();

    // If the input is empty, do nothing
    if (queryText === '') {
      return;
    }

    // --- Animation Logic ---
    // Get the exact position of the input box on the screen
    const inputRect = chatInput.getBoundingClientRect();

    // Create a new temporary element to animate
    const flyingEl = document.createElement('div');
    flyingEl.className = 'flying-text'; // Apply our CSS class
    flyingEl.textContent = queryText;

    // Position the new element exactly on top of the input box
    flyingEl.style.left = `${inputRect.left}px`;
    flyingEl.style.top = `${inputRect.top}px`;

    // Add the new element to the page
    document.body.appendChild(flyingEl);

    // Clear the input box
    chatInput.value = '';

    // --- Navigation Logic ---
    // Wait for the animation to finish (1000ms = 1s, matching our CSS)
    setTimeout(() => {
      // Encode the text to make it safe for a URL
      const encodedQuery = encodeURIComponent(queryText);
      // Redirect to the new page with the user's text as a parameter
      window.location.href = `results.html?query=${encodedQuery}`;
    }, 1000);
  };

  // 3. Listen for events
  // When the user clicks the send button
  sendButton.addEventListener('click', handleSubmit);

  // When the user presses the 'Enter' key in the input box
  chatInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  });

});