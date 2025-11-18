const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');

let currentInput = '';

// Function to update the display
function updateDisplay(value) {
    display.value = value;
}

// Function to evaluate the expression
function calculate() {
    try {
        // Replace '←' and '%' characters with valid JavaScript
        let expression = currentInput.replace('←', ''); // Backspace handled differently
        expression = expression.replace(/%/g, '/100*'); // Simple % as division by 100 for visual appeal

        // NOTE: eval() is powerful but should be avoided in production for security reasons.
        // For a basic learning project, it's acceptable.
        let result = eval(expression);

        // Handle division by zero
        if (!isFinite(result)) {
            currentInput = 'Error';
        } else {
            currentInput = result.toString();
        }
    } catch (e) {
        currentInput = 'Error';
    }
    updateDisplay(currentInput);
}

// Handle all button clicks
buttons.forEach(button => {
    button.addEventListener('click', () => {
        const value = button.getAttribute('data-value');

        if (value === 'C') { // Clear Screen
            currentInput = '';
        } else if (value === '=') { // Calculate Result
            calculate();
            return; // Exit after calculation to prevent appending '='
        } else if (value === '←') { // Backspace (Delete Last Character)
            currentInput = currentInput.slice(0, -1);
        } else { // All other buttons (Numbers and Operators)
            // Add a simple check to prevent multiple operators/decimals next to each other
            const lastChar = currentInput.slice(-1);
            const isOperator = ['+', '-', '*', '/', '%'].includes(value);
            const lastIsOperator = ['+', '-', '*', '/'].includes(lastChar);
            
            if (isOperator && lastIsOperator) {
                // Replace the last operator with the new one
                currentInput = currentInput.slice(0, -1) + value;
            } else {
                currentInput += value;
            }
        }
        
        updateDisplay(currentInput || '0'); // Show '0' if display is empty
    });
});

// Bonus: Keyboard Support
document.addEventListener('keydown', (event) => {
    const key = event.key;
    const validKeys = '0123456789+-*/.%';

    if (validKeys.includes(key)) {
        // Simulate button click for numbers and operators
        document.querySelector(`.btn[data-value="${key}"]`)?.click();
    } else if (key === 'Enter' || key === '=') {
        // Calculate on Enter key
        event.preventDefault(); // Prevents default form submission if any
        document.querySelector('.btn-equal').click();
    } else if (key === 'Backspace') {
        // Backspace functionality
        document.querySelector('.btn[data-value="←"]').click();
    } else if (key.toLowerCase() === 'c' || key === 'Delete') {
        // Clear on 'c' or 'Delete'
        document.querySelector('.btn-clear').click();
    }
});