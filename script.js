const wageInput = document.getElementById('wage');
const salaryInput = document.getElementById('salary');
const hoursInput = document.getElementById('hours');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const earnedDisplay = document.getElementById('earned');
const emojiOutput = document.getElementById('emojiOutput');
const modeRadios = document.querySelectorAll('input[name="mode"]');
const hourlyInputs = document.getElementById('hourlyInputs');
const yearlyInputs = document.getElementById('yearlyInputs');
const editPricesBtn = document.getElementById('editPricesBtn');
const priceModal = document.getElementById('priceModal');
const priceInputs = document.getElementById('priceInputs');
const savePrices = document.getElementById('savePrices');
const cancelPrices = document.getElementById('cancelPrices');

let intervalId = null;
let earnings = 0;
let perSecond = 0;

let items = [
    { name: "Beer", emoji: "🍺", price: 5 },
    { name: "Burger", emoji: "🍔", price: 10 },
    { name: "Movie", emoji: "🎬", price: 25 },
    { name: "Shirt", emoji: "👕", price: 50 },
    { name: "Flight", emoji: "✈️", price: 300 }
];

modeRadios.forEach(radio => {
    radio.addEventListener('change', () => {
        hourlyInputs.classList.toggle('hidden', radio.value !== 'hourly');
        yearlyInputs.classList.toggle('hidden', radio.value !== 'yearly');
    });
});

function calculateHourlyRate() {
    const mode = document.querySelector('input[name="mode"]:checked').value;
    if (mode === "hourly") {
        const wage = parseFloat(wageInput.value);
        return isNaN(wage) || wage <= 0 ? null : wage;
    } else {
        const salary = parseFloat(salaryInput.value);
        const hours = parseFloat(hoursInput.value);
        if (isNaN(salary) || salary <= 0 || isNaN(hours) || hours <= 0) {
            return null;
        }
        return salary / (hours * 52);
    }
}

function updateEarnings() {
    earnings += perSecond;
    earnedDisplay.textContent = earnings.toFixed(2);
    updateEmojiDisplay();
}

function updateEmojiDisplay() {
    emojiOutput.innerHTML = "";
    items.forEach(item => {
        const count = Math.floor(earnings / item.price);
        if (count > 0) {
            emojiOutput.innerHTML += `${item.emoji} x ${count}<br>`;
        }
    });
}

function startTracking() {
    const hourlyRate = calculateHourlyRate();
    if (hourlyRate == null) {
        alert("Please enter valid numbers.");
        return;
    }

    perSecond = hourlyRate / 3600;
    intervalId = setInterval(updateEarnings, 1000);

    startBtn.classList.add("hidden");
    pauseBtn.classList.remove("hidden");
    resetBtn.classList.remove("hidden");
    wageInput.disabled = true;
    salaryInput.disabled = true;
    hoursInput.disabled = true;
}

function pauseTracking() {
    clearInterval(intervalId);
    intervalId = null;
    startBtn.textContent = "Resume";
    startBtn.classList.remove("hidden");
    pauseBtn.classList.add("hidden");
}

function resetTracking() {
    clearInterval(intervalId);
    intervalId = null;
    earnings = 0;
    earnedDisplay.textContent = "0.00";
    emojiOutput.innerHTML = "";
    startBtn.textContent = "Start";
    wageInput.disabled = false;
    salaryInput.disabled = false;
    hoursInput.disabled = false;
    wageInput.value = "";
    salaryInput.value = "";
    hoursInput.value = "";
    startBtn.classList.remove("hidden");
    pauseBtn.classList.add("hidden");
    resetBtn.classList.add("hidden");
    updateEmojiDisplay();
}

updateEmojiDisplay();

startBtn.addEventListener("click", startTracking);
pauseBtn.addEventListener("click", pauseTracking);
resetBtn.addEventListener("click", resetTracking);

editPricesBtn.addEventListener("click", () => {
    priceInputs.innerHTML = "";
    items.forEach((item, i) => {
        priceInputs.innerHTML += `
      <label>${item.emoji} ${item.name} ($):</label>
      <input type="number" id="item-${i}" value="${item.price}" min="0.01" step="0.01"/>
    `;
    });
    priceModal.classList.remove("hidden");
});

cancelPrices.addEventListener("click", () => {
    priceModal.classList.add("hidden");
});

savePrices.addEventListener("click", () => {
    items.forEach((item, i) => {
        const input = document.getElementById(`item-${i}`);
        const val = parseFloat(input.value);
        if (!isNaN(val) && val > 0) item.price = val;
    });
    priceModal.classList.add("hidden");
    updateEmojiDisplay();
});
