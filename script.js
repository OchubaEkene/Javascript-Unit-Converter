// EKENE OCHUBA - 3155904



// --- TEMPERATURE CONVERSION RADIO BUTTON ---
// I learnt the Temperature converter logic from this YouTube video("https://www.youtube.com/watch?v=6xrTdpIAsb0&t=643s")
function convertTempRadio() {
    var value = parseFloat(document.getElementById("temp-input").value);
    var selected = document.querySelector('input[name="temp-conv"]:checked');

    if (selected === null) {
        document.getElementById("temp-result").innerText = "Please select a conversion type.";
        return;
    }

    var result;
    var unit = "";

    switch (selected.value) {
        case "CtoF":
            result = (value * 9 / 5) + 32;
            unit = "F";
            break;
        case "FtoC":
            result = (value - 32) * 5 / 9;
            unit = "C";
            break;
        case "CtoK":
            result = value + 273.15;
            unit = "K";
            break;
        case "KtoC":
            result = value - 273.15;
            unit = "C";
            break;
        case "CtoR":
            result = (value + 273.15) * 9 / 5;
            unit = "°R";
            break;
        case "RtoC":
            result = (value - 491.67) * 5 / 9;
            unit = "°C";
            break;
        default:
            result = "Invalid Selection";
    }

    // Get result element
    const resultElement = document.getElementById("temp-result");

    // Set the result text
    resultElement.innerText = "Result: " + result.toFixed(2) + " " + unit;

    // Determine color based on result (using Celsius as baseline)
    let tempCelsius;
    if (selected.value.includes("toC")) {
        tempCelsius = result;
    } else if (selected.value === "CtoF") {
        tempCelsius = value;
    } else if (selected.value === "CtoK" || selected.value === "CtoR") {
        tempCelsius = value;
    } else if (selected.value === "KtoC" || selected.value === "RtoC") {
        tempCelsius = result;
    } else {
        tempCelsius = value; // fallback
    }

    // Apply color styling based on temperature
    if (tempCelsius < 10) {
        resultElement.style.color = "#1e90ff"; // Cold - Blue
    } else if (tempCelsius >= 10 && tempCelsius < 25) {
        resultElement.style.color = "#ffa500"; // Warm - Orange
    } else {
        resultElement.style.color = "#ff4500"; // Hot - Red
    }

    console.log("Result is:", result);
}



// SPEED CONVERSION LOGIC
// Learnt using this video ("https://www.youtube.com/watch?v=5XbzF23Y35A")
function convertSpeed() {
    var input = parseFloat(document.getElementById("speed-input").value);
    var from = document.getElementById("sfrom-text").textContent.trim();
    var to = document.getElementById("s-to-text").textContent.trim();
  
    if (isNaN(input) || from === "Select unit" || to === "Select unit") {
      document.getElementById("speed-result").innerText = "Please enter a valid input and select both units.";
      return;
    }
  
    // Convert from any unit to m/s
    var valueInMetersPerSecond;
    if (from === "m/s") valueInMetersPerSecond = input;
    else if (from === "km/h") valueInMetersPerSecond = input / 3.6;
    else if (from === "mph") valueInMetersPerSecond = input * 0.44704;
    else if (from === "kn") valueInMetersPerSecond = input * 0.514444;
    else if (from === "ft/s") valueInMetersPerSecond = input * 0.3048;
  
    // Convert m/s to target unit
    var result;
    if (to === "m/s") result = valueInMetersPerSecond;
    else if (to === "km/h") result = valueInMetersPerSecond * 3.6;
    else if (to === "mph") result = valueInMetersPerSecond / 0.44704;
    else if (to === "kn") result = valueInMetersPerSecond / 0.514444;
    else if (to === "ft/s") result = valueInMetersPerSecond / 0.3048;
  
    document.getElementById("speed-result").innerText = input + " " + from + " = " + result.toFixed(2) + " " + to;
    document.getElementById("title").innerText = "Your Result is Ready!";
  }
  


// CURRENCY CONVERSION LOGIC
// Learnt from this video ("https://www.youtube.com/watch?v=BdxpX0130rM&pp=ygUdamF2YXNjcmlwdCBjdXJyZW5jeSBjb252ZXJ0ZXI%3D")
let selectedFromCurrency = null;
let selectedToCurrency = null;

function selectCurrency(element, type) {
    const allOptions = document.querySelectorAll(`#${type}-currencies .optionCurr`);
    
    // Remove highlight from all
    allOptions.forEach(opt => opt.classList.remove('selected'));
  
    // Add highlight to clicked one
    element.classList.add('selected');
  
    // Save selection
    const currency = element.dataset.currency;
    if (type === 'from') {
      selectedFromCurrency = currency;
    } else {
      selectedToCurrency = currency;
    }
  }

// Predefined exchange rates 
const exchangeRates = {
    USD: { EUR: 0.91, GBP: 0.78, JPY: 148, NGN: 1600 },
    EUR: { USD: 1.10, GBP: 0.86, JPY: 163, NGN: 1760 },
    GBP: { USD: 1.28, EUR: 1.16, JPY: 190, NGN: 2050 },
    JPY: { USD: 0.0068, EUR: 0.0061, GBP: 0.0053, NGN: 10.8 },
    NGN: { USD: 0.00063, EUR: 0.00057, GBP: 0.00049, JPY: 0.092 },
};

  // Handle selection and highlight
  function convertCurrency() {
    const amount = parseFloat(document.getElementById('currency-input').value);
    const resultDiv = document.getElementById('curr-result');
  
    if (!selectedFromCurrency || !selectedToCurrency || isNaN(amount)) {
      resultDiv.innerText = "Please select both currencies and enter an amount.";
      return;
    }
  
    if (selectedFromCurrency === selectedToCurrency) {
      resultDiv.innerText = `Same currency selected. Result: ${amount}`;
      return;
    }
  
    const rate = exchangeRates[selectedFromCurrency][selectedToCurrency];
  
    if (!rate) {
      resultDiv.innerText = "Exchange rate not available for this pair.";
      return;
    }
  
    // Calculation logic
    const converted = amount * rate;
    resultDiv.innerText = `${amount} ${selectedFromCurrency} = ${converted.toFixed(2)} ${selectedToCurrency}`;
    document.getElementById("title").innerText = "Your Result is Ready!";
  }




// --- TOGGLE DROPDOWN FOR CURRENCY/SPEED/ETC ---
// Learnt from this vidio ("https://www.youtube.com/watch?v=TWiy3dGSmgk&list=PLImJ3umGjxdBzMlTvJk1iz3qFyJhl28S5")
function toggleDropdown(id) {
    // List of all dropdowns
    var dropdownIds = ['from-options', 'to-options', 'from-options2', 'to-options2'];

    // Hide all dropdowns first
    for (var i = 0; i < dropdownIds.length; i++) {
        var el = document.getElementById(dropdownIds[i]);
        if (el !== null) {
            el.style.display = 'none';
        }
    }

    // Show the selected dropdown
    var target = document.getElementById(id);
    if (target !== null) {
        target.style.display = 'block';
    } else {
        console.warn("Element with id \"" + id + "\" not found.");
    }
}

// Learnt from this vidio ("https://www.youtube.com/watch?v=TWiy3dGSmgk&list=PLImJ3umGjxdBzMlTvJk1iz3qFyJhl28S5")
// --- HANDLE CUSTOM SELECT DROPDOWNS (e.g. Speed unit) ---
function selectOption(type, value) {
    // Update the label text
    var textElement = document.getElementById(type + "-text");
    if (textElement !== null) {
        textElement.innerText = value;
    } else {
        console.warn(type + "-text element not found.");
    }

    // Determine the correct dropdown ID based on type
    let dropdownId = "";

    if (type === "sfrom") {
        dropdownId = "from-options2";
    } else if (type === "s-to") {
        dropdownId = "to-options2";
    }

    // Hide the dropdown
    var optionsDropdown = document.getElementById(dropdownId);
    if (optionsDropdown !== null) {
        optionsDropdown.style.display = "none";
    } else {
        console.warn(dropdownId + " element not found.");
    }
}


  // Close dropdown if user clicks outside the box
    document.addEventListener("click", function (event) {
        if (event.target.closest(".custom-select") === null) {
            var dropdowns = document.querySelectorAll(".options");
            for (var i = 0; i < dropdowns.length; i++) {
                dropdowns[i].style.display = "none";
            }
        }
    });


// I learnt the Tab-switching method from this YouTube video (https://www.youtube.com/watch?v=Pg1dxp0W7eg)
// --- SWITCHING BETWEEN TABS (Temperature, Currency, Speed) ---
function switchTab(tabName) {
    document.getElementById("title").innerText = "Unit Converter";
    // Remove 'active' class from all content blocks
    var contents = document.querySelectorAll(".tab .content");
    for (var i = 0; i < contents.length; i++) {
        contents[i].classList.remove("active");
    }

    // Remove 'active' class from all tab buttons
    var buttons = document.querySelectorAll(".btn");
    for (var j = 0; j < buttons.length; j++) {
        buttons[j].classList.remove("active");
    }

    // Add 'active' to the clicked button
    var clickedButton = document.querySelector('[onclick="switchTab(\'' + tabName + '\')"]');
    if (clickedButton !== null) {
        clickedButton.classList.add("active");
    } else {
        console.warn("Tab button not found.");
    }

    // Add 'active' to the content section of the selected tab
    var selectedTab = document.getElementById(tabName);
    if (selectedTab !== null) {
        var innerContent = selectedTab.querySelector(".content");
        if (innerContent !== null) {
            innerContent.classList.add("active");
        } else {
            console.error("No .content inside tab: " + tabName);
        }
    } else {
        console.error("No tab found with id: " + tabName);
    }
}


// Function to change Input Text Color for better readability when focus is lost
function handleFocus(input) {
    input.style.color = "black"; // Text turns black when typing (focused)
}

function handleBlur(input) {
    if (input.value.trim() !== "") {
        input.style.color = "white"; // Keep black if input is not empty
    } else {
        input.style.color = "grey"; // Grey if empty
    }
}

window.onload = function () {
    var inputs = document.querySelectorAll("#enter-input, #from-input, #to-input, #temp-input, #currency-input, #speed-input");

    for (var i = 0; i < inputs.length; i++) {
        (function(input) {
            input.addEventListener("focus", function () {
                handleFocus(input);
            });

            input.addEventListener("blur", function () {
                handleBlur(input);
            });

            handleBlur(input); // Set initial state on page load
        })(inputs[i]);
    }
};

  