// Variables for input fields
const inputContainer = document.querySelector('.input-container');
const countdownForm = document.querySelector('#countdownForm');
const dateEl = document.querySelector('#date-picker');

// Variables for countdown values
let countdownTitle = '';
let countdownDate = '';
let countdownValue = '';
let countdownActive;
let savedCountdown;

// Variables for countdown display elements
const countdownEl = document.querySelector('.countdown');
const countdownElTitle = document.querySelector('.countdown-title');
const countdownBtn = document.querySelector('.countdown-button');
const timeElements = document.querySelectorAll('span');

// Variables for complete display elements
const completeEl = document.querySelector('.complete');
const completeElInfo = document.querySelector('.complete-info');
const completeBtn = document.querySelector('#complete-btn');

// Constants for time values
const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

// set Date input minimum with today's date
const today = new Date().toISOString().split('T')[0];
dateEl.setAttribute('min', today);

// Populate Countdown / Complete UI
const updateDOM = () => {
    (countdownActive = setInterval(() => {
        const now = new Date().getTime();
        const distance = countdownValue - now;

        // Time calculations
        const days = Math.floor(distance / day);
        const hours = Math.floor((distance % day) / hour);
        const minutes = Math.floor((distance % hour) / minute);
        const seconds = Math.floor((distance % minute) / second);

        // Hide input
        inputContainer.hidden = true;

        // If the countdown has ended, show complete
        if (distance < 0) {
            // Stop countdown
            clearInterval(countdownActive);
            countdownEl.hidden = true;
            completeElInfo.textContent = `${countdownTitle} finished on ${countdownDate}`;
            completeEl.hidden = false;
        } else {
            // Populate countdown
            countdownElTitle.textContent = `${countdownTitle}`;
            timeElements[0].textContent = `${days}`;
            timeElements[1].textContent = `${hours}`;
            timeElements[2].textContent = `${minutes}`;
            timeElements[3].textContent = `${seconds}`;

            // Hide input
            inputContainer.hidden = true;
            // Show countdown
            countdownEl.hidden = false;
        }
    })),
        second;
};

// Take values from form input
const updateCountdown = (e) => {
    e.preventDefault();
    countdownTitle = e.srcElement[0].value;
    countdownDate = e.srcElement[1].value;
    savedCountdown = {
        title: countdownTitle,
        date: countdownDate,
    }
    
    // Save to localStorage info about countdown
    localStorage.setItem('countdown', JSON.stringify(savedCountdown));

    // Check for valid date
    if (countdownDate === '') {
        alert('Please select a date for the countdown.');
    } else {
        // Get number version of current Date, updateDOM
        countdownValue = new Date(countdownDate).getTime();
        updateDOM();
    }
};

// Reset all values
const reset = () => {
    // Hide countdown, show input
    countdownEl.hidden = true;
    completeEl.hidden = true;
    inputContainer.hidden = false;

    // Stop the countdown
    clearInterval(countdownActive);

    // Reset values
    countdownTitle = '';
    countdownDate = '';
    localStorage.removeItem('countdown');
};

// Restore previous countdown
const restorePreviousCountdown = () => {
    // Get countdown from localStorage if available
    if (localStorage.getItem('countdown')) {
        inputContainer.hidden = true;
        savedCountdown = JSON.parse(localStorage.getItem('countdown'));
        countdownTitle = savedCountdown.title;
        countdownDate = savedCountdown.date;
        countdownValue = new Date(countdownDate).getTime();
        updateDOM();
    }
};

// Event listeners
countdownForm.addEventListener('submit', updateCountdown);
[countdownBtn, completeBtn].forEach((btn) =>
    btn.addEventListener('click', reset)
);

// On load, check localStorage
restorePreviousCountdown();
