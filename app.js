// Global variable
let currentPhrase = null;

// Generate random phrase using serverless function
async function generatePhrase() {
    const generateBtn = document.getElementById('generateBtn');
    const interpretBtn = document.getElementById('interpretBtn');
    const status = document.getElementById('status');

    try {
        // Disable buttons during generation
        generateBtn.disabled = true;
        interpretBtn.disabled = true;
        status.textContent = 'Generating random phrase...';
        hideError();

        // Call serverless function to generate phrase
        const response = await fetch('/api/generate-phrase', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.error || 'Failed to generate phrase');
        }

        currentPhrase = data.phrase;

        // Display the phrase
        document.getElementById('phraseDisplay').textContent = currentPhrase;

        // Show indices and whether fallback was used
        let statusMessage = `Generated using random indices: ${data.indices[0]}, ${data.indices[1]}`;
        if (data.fallback) {
            statusMessage += ' (using fallback randomizer)';
        }
        status.textContent = statusMessage;

        // Enable interpret button
        interpretBtn.disabled = false;
        generateBtn.disabled = false;

        // Hide previous interpretation
        document.getElementById('interpretationDisplay').style.display = 'none';

    } catch (error) {
        showError('Failed to generate phrase: ' + error.message);
        generateBtn.disabled = false;
        status.textContent = '';
    }
}

// Interpret phrase using serverless function
async function interpretPhrase() {
    if (!currentPhrase) {
        showError('No phrase to interpret. Please generate a phrase first.');
        return;
    }

    const interpretBtn = document.getElementById('interpretBtn');
    const status = document.getElementById('status');
    const interpretationDisplay = document.getElementById('interpretationDisplay');

    try {
        interpretBtn.disabled = true;
        status.textContent = 'Interpreting phrase with AI...';
        hideError();
        interpretationDisplay.style.display = 'none';

        const response = await fetch('/api/interpret', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ phrase: currentPhrase })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Server error: ${response.status}`);
        }

        const data = await response.json();

        // Display the interpretation
        interpretationDisplay.textContent = data.interpretation;
        interpretationDisplay.style.display = 'block';
        status.textContent = 'Interpretation complete!';
        interpretBtn.disabled = false;

    } catch (error) {
        showError('Failed to interpret phrase: ' + error.message);
        interpretBtn.disabled = false;
        status.textContent = '';
    }
}

// Error handling
function showError(message) {
    const errorDiv = document.getElementById('error');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

function hideError() {
    document.getElementById('error').style.display = 'none';
}
