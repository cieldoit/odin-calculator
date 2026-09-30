// Basic math functions
function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    if (b === 0) {
        return "Nice try! Can't divide by zero.";
    }

    return a / b;
}


// Performs an operation using two numbers
function operate(operator, a, b) {
    if (operator === "+") {
        return add(a, b);
    }

    if (operator === "-") {
        return subtract(a, b);
    }

    if (operator === "*") {
        return multiply(a, b);
    }

    if (operator === "/") {
        return divide(a, b);
    }
}


// Calculator variables
let firstNumber = null;
let secondNumber = null;
let currentOperator = null;

let displayValue = "0";
let waitingForSecondNumber = false;
let resultDisplayed = false;


// Select calculator elements
const display = document.querySelector("#display");
const numberButtons = document.querySelectorAll(".number");
const operatorButtons = document.querySelectorAll(".operator");

const decimalButton = document.querySelector("#decimal");
const equalsButton = document.querySelector("#equals");
const clearButton = document.querySelector("#clear");
const backspaceButton = document.querySelector("#backspace");


// Updates the calculator display
function updateDisplay() {
    display.textContent = displayValue;
}


// Handles number input
function inputNumber(number) {

    // Start a new number after an operator or result
    if (waitingForSecondNumber || resultDisplayed) {
        displayValue = number;
        waitingForSecondNumber = false;
        resultDisplayed = false;
    } else {
        if (displayValue === "0") {
            displayValue = number;
        } else {
            displayValue += number;
        }
    }

    updateDisplay();
}


// Handles decimal input
function inputDecimal() {

    // Start a decimal number after an operator
    if (waitingForSecondNumber || resultDisplayed) {
        displayValue = "0.";
        waitingForSecondNumber = false;
        resultDisplayed = false;
        updateDisplay();
        return;
    }

    // Prevent multiple decimal points
    if (!displayValue.includes(".")) {
        displayValue += ".";
        updateDisplay();
    }
}


// Rounds long decimal results
function roundResult(number) {
    return Math.round(number * 100000000) / 100000000;
}


// Handles operator buttons
function chooseOperator(operator) {
    const inputValue = Number(displayValue);

    // Replace the operator when operators are pressed consecutively
    if (currentOperator !== null && waitingForSecondNumber) {
        currentOperator = operator;
        return;
    }

    // Store the first number
    if (firstNumber === null) {
        firstNumber = inputValue;
    }

    // Calculate the previous operation before starting another one
    else if (currentOperator !== null) {
        secondNumber = inputValue;

        const result = operate(
            currentOperator,
            firstNumber,
            secondNumber
        );

        // Handle division by zero
        if (typeof result === "string") {
            displayValue = result;
            updateDisplay();
            resetCalculatorData();
            resultDisplayed = true;
            return;
        }

        displayValue = String(roundResult(result));
        firstNumber = result;

        updateDisplay();
    }

    currentOperator = operator;
    waitingForSecondNumber = true;
    resultDisplayed = false;
}


// Calculates when the equals button is pressed
function calculate() {

    // Do nothing if the operation is incomplete
    if (
        firstNumber === null ||
        currentOperator === null ||
        waitingForSecondNumber
    ) {
        return;
    }

    secondNumber = Number(displayValue);

    const result = operate(
        currentOperator,
        firstNumber,
        secondNumber
    );

    // Handle division by zero
    if (typeof result === "string") {
        displayValue = result;
        updateDisplay();
        resetCalculatorData();
        resultDisplayed = true;
        return;
    }

    displayValue = String(roundResult(result));

    updateDisplay();

    // Reset stored operation after showing result
    firstNumber = null;
    secondNumber = null;
    currentOperator = null;

    resultDisplayed = true;
}


// Clears stored calculator data
function resetCalculatorData() {
    firstNumber = null;
    secondNumber = null;
    currentOperator = null;
    waitingForSecondNumber = false;
}


// Clears the entire calculator
function clearCalculator() {
    resetCalculatorData();

    displayValue = "0";
    resultDisplayed = false;

    updateDisplay();
}


// Removes the last entered digit
function backspace() {

    // Do not edit a completed result
    if (resultDisplayed || waitingForSecondNumber) {
        return;
    }

    if (displayValue.length > 1) {
        displayValue = displayValue.slice(0, -1);
    } else {
        displayValue = "0";
    }

    updateDisplay();
}


// Number button events
numberButtons.forEach((button) => {
    button.addEventListener("click", () => {
        inputNumber(button.dataset.number);
    });
});


// Operator button events
operatorButtons.forEach((button) => {
    button.addEventListener("click", () => {
        chooseOperator(button.dataset.operator);
    });
});


// Other button events
decimalButton.addEventListener("click", inputDecimal);
equalsButton.addEventListener("click", calculate);
clearButton.addEventListener("click", clearCalculator);
backspaceButton.addEventListener("click", backspace);


// Keyboard support
document.addEventListener("keydown", (event) => {
    const key = event.key;

    // Number keys
    if (key >= "0" && key <= "9") {
        inputNumber(key);
    }

    // Operator keys
    else if (
        key === "+" ||
        key === "-" ||
        key === "*" ||
        key === "/"
    ) {
        chooseOperator(key);
    }

    // Decimal key
    else if (key === ".") {
        inputDecimal();
    }

    // Enter or equals
    else if (key === "Enter" || key === "=") {
        event.preventDefault();
        calculate();
    }

    // Backspace key
    else if (key === "Backspace") {
        backspace();
    }

    // Escape key clears calculator
    else if (key === "Escape") {
        clearCalculator();
    }
});


// Initial display
updateDisplay();