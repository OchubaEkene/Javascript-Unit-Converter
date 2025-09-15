// EKENE OCHUBA
// Modern JavaScript Unit Converter with Real-time Currency API

// Main converter class that handles all conversion logic
class UnitConverter {
  constructor() {
    this.selectedFromCurrency = null;
    this.selectedToCurrency = null;
    this.exchangeRates = {};
    this.isLoading = false;
    
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.loadExchangeRates();
    this.setupKeyboardNavigation();
  }

  // Event Listeners Setup
  setupEventListeners() {
    // Tab navigation
    document.querySelectorAll('.tab-button').forEach(button => {
      button.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
    });

    // Temperature conversion
    document.getElementById('convert-temp-btn').addEventListener('click', () => this.convertTemperature());
    
    // Currency conversion
    document.getElementById('convert-currency-btn').addEventListener('click', () => this.convertCurrency());
    
    // Speed conversion
    document.getElementById('convert-speed-btn').addEventListener('click', () => this.convertSpeed());

    // Currency selection
    document.querySelectorAll('#from-currencies .currency-option').forEach(option => {
      option.addEventListener('click', (e) => this.selectCurrency(e.target, 'from'));
    });
    
    document.querySelectorAll('#to-currencies .currency-option').forEach(option => {
      option.addEventListener('click', (e) => this.selectCurrency(e.target, 'to'));
    });

    // Speed unit selection
    this.setupCustomSelects();

    // Input validation
    this.setupInputValidation();

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => this.handleOutsideClick(e));
  }

  // Tab Switching
  // I learnt the Tab-switching method from this YouTube video (https://www.youtube.com/watch?v=Pg1dxp0W7eg)
  switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-button').forEach(btn => {
      btn.classList.remove('active');
      btn.setAttribute('aria-selected', 'false');
    });
    
    const activeButton = document.querySelector(`[data-tab="${tabName}"]`);
    activeButton.classList.add('active');
    activeButton.setAttribute('aria-selected', 'true');

    // Update panels
    document.querySelectorAll('.converter-panel').forEach(panel => {
      panel.classList.remove('active');
      panel.setAttribute('aria-hidden', 'true');
    });
    
    const activePanel = document.getElementById(`${tabName}-panel`);
    activePanel.classList.add('active');
    activePanel.setAttribute('aria-hidden', 'false');

    // Reset title
    document.getElementById('title').textContent = 'Unit Converter';
  }

  // Temperature Conversion
// I learnt the Temperature converter logic from this YouTube video("https://www.youtube.com/watch?v=6xrTdpIAsb0&t=643s")
  convertTemperature() {
    const input = document.getElementById('temp-input');
    const selected = document.querySelector('input[name="temp-conv"]:checked');
    const resultDiv = document.getElementById('temp-result');
    const errorDiv = document.getElementById('temp-error');

    // Clear previous errors
    this.clearError('temp-error');

    // Validation
    if (!this.validateInput(input.value, 'temp-error')) return;
    if (!selected) {
      this.showError('temp-error', 'Please select a conversion type.');
        return;
    }

    const value = parseFloat(input.value);
    const conversion = selected.value;
    
    try {
      const result = this.calculateTemperature(value, conversion);
      this.displayTemperatureResult(result, conversion, value);
    } catch (error) {
      this.showError('temp-error', 'Invalid temperature value.');
    }
  }

  calculateTemperature(value, conversion) {
    // Temperature conversion formulas
    const conversions = {
      'CtoF': (c) => (c * 9/5) + 32,        // Celsius to Fahrenheit
      'FtoC': (f) => (f - 32) * 5/9,        // Fahrenheit to Celsius
      'CtoK': (c) => c + 273.15,            // Celsius to Kelvin
      'KtoC': (k) => k - 273.15,            // Kelvin to Celsius
      'CtoR': (c) => (c + 273.15) * 9/5,    // Celsius to Rankine
      'RtoC': (r) => (r - 491.67) * 5/9     // Rankine to Celsius
    };

    return conversions[conversion](value);
  }

  displayTemperatureResult(result, conversion, originalValue) {
    const resultDiv = document.getElementById('temp-result');
    const units = {
      'CtoF': '°F', 'FtoC': '°C', 'CtoK': 'K', 
      'KtoC': '°C', 'CtoR': '°R', 'RtoC': '°C'
    };

    const unit = units[conversion];
    resultDiv.textContent = `${originalValue} → ${result.toFixed(2)} ${unit}`;
    
    // Color coding based on temperature
    this.applyTemperatureColor(resultDiv, result, conversion, originalValue);
  }

  applyTemperatureColor(element, result, conversion, originalValue) {
    // Convert to Celsius for color coding
    // Color scheme: Blue (cold < 10°C), Orange (warm 10-25°C), Red (hot > 25°C)
    let celsius;
    if (conversion.includes('toC')) {
      celsius = result;
    } else if (conversion === 'CtoF' || conversion === 'CtoK' || conversion === 'CtoR') {
      celsius = originalValue;
    } else if (conversion === 'KtoC' || conversion === 'RtoC') {
      celsius = result;
    } else {
      celsius = (originalValue - 32) * 5/9; // F to C
    }

    element.style.color = celsius < 10 ? '#1e90ff' :  // Cold - Blue
                         celsius < 25 ? '#ffa500' :    // Warm - Orange
                         '#ff4500';                    // Hot - Red
  }

  // Currency Conversion
  // Learnt from this video ("https://www.youtube.com/watch?v=BdxpX0130rM&pp=ygUdamF2YXNjcmlwdCBjdXJyZW5jeSBjb252ZXJ0ZXI%3D")
  async convertCurrency() {
    const input = document.getElementById('currency-input');
    const resultDiv = document.getElementById('curr-result');
    
    this.clearError('currency-error');

    if (!this.validateInput(input.value, 'currency-error')) return;
    if (!this.selectedFromCurrency || !this.selectedToCurrency) {
      this.showError('currency-error', 'Please select both currencies.');
      return;
    }

    if (this.selectedFromCurrency === this.selectedToCurrency) {
      resultDiv.textContent = `Same currency selected. Result: ${input.value}`;
      return;
    }
  
    const amount = parseFloat(input.value);
    
    try {
      this.showLoading(true);
      const result = await this.calculateCurrency(amount, this.selectedFromCurrency, this.selectedToCurrency);
      resultDiv.textContent = `${amount} ${this.selectedFromCurrency} = ${result.toFixed(2)} ${this.selectedToCurrency}`;
    } catch (error) {
      this.showError('currency-error', 'Failed to fetch exchange rates. Please try again.');
    } finally {
      this.showLoading(false);
    }
  }

  async calculateCurrency(amount, from, to) {
    if (!this.exchangeRates[from] || !this.exchangeRates[from][to]) {
      throw new Error('Exchange rate not available');
    }
    return amount * this.exchangeRates[from][to];
  }

  selectCurrency(element, type) {
    const container = element.closest('.currency-options');
    const allOptions = container.querySelectorAll('.currency-option');
    
    // Remove selection from all options
    allOptions.forEach(opt => {
      opt.setAttribute('aria-pressed', 'false');
      opt.classList.remove('selected');
    });
    
    // Select clicked option
    element.setAttribute('aria-pressed', 'true');
    element.classList.add('selected');
  
    // Store selection
    const currency = element.dataset.currency;
    if (type === 'from') {
      this.selectedFromCurrency = currency;
    } else {
      this.selectedToCurrency = currency;
    }
  }

  // Speed Conversion
  // Learnt using this video ("https://www.youtube.com/watch?v=5XbzF23Y35A")
  convertSpeed() {
    const input = document.getElementById('speed-input');
    const fromText = document.getElementById('from-unit-text').textContent;
    const toText = document.getElementById('to-unit-text').textContent;
    const resultDiv = document.getElementById('speed-result');
    
    this.clearError('speed-error');

    if (!this.validateInput(input.value, 'speed-error')) return;
    if (fromText === 'Select unit' || toText === 'Select unit') {
      this.showError('speed-error', 'Please select both units.');
      return;
    }
  
    const value = parseFloat(input.value);
    const fromUnit = fromText.split(' ')[0]; // Extract unit from display text
    const toUnit = toText.split(' ')[0];

    try {
      const result = this.calculateSpeed(value, fromUnit, toUnit);
      resultDiv.textContent = `${value} ${fromUnit} = ${result.toFixed(2)} ${toUnit}`;
    } catch (error) {
      this.showError('speed-error', 'Invalid speed conversion.');
    }
  }

  calculateSpeed(value, from, to) {
    // Convert to m/s first (meters per second as base unit)
    const toMetersPerSecond = {
      'm/s': (v) => v,                    // Already in m/s
      'km/h': (v) => v / 3.6,            // km/h to m/s
      'mph': (v) => v * 0.44704,         // mph to m/s
      'kn': (v) => v * 0.514444,         // knots to m/s
      'ft/s': (v) => v * 0.3048          // ft/s to m/s
    };

    // Convert from m/s to target unit
    const fromMetersPerSecond = {
      'm/s': (v) => v,                    // m/s to m/s
      'km/h': (v) => v * 3.6,            // m/s to km/h
      'mph': (v) => v / 0.44704,         // m/s to mph
      'kn': (v) => v / 0.514444,         // m/s to knots
      'ft/s': (v) => v / 0.3048          // m/s to ft/s
    };

    const valueInMps = toMetersPerSecond[from](value);
    return fromMetersPerSecond[to](valueInMps);
  }

  // Custom Select Setup
  // Learnt from this video ("https://www.youtube.com/watch?v=TWiy3dGSmgk&list=PLImJ3umGjxdBzMlTvJk1iz3qFyJhl28S5")
  setupCustomSelects() {
    document.querySelectorAll('.custom-select').forEach(select => {
      const button = select.querySelector('.select-button');
      const options = select.querySelector('.select-options');
      const optionItems = select.querySelectorAll('.select-option');

      button.addEventListener('click', () => this.toggleSelect(select));
      
      optionItems.forEach(option => {
        option.addEventListener('click', () => this.selectOption(select, option));
      });
    });
  }

  toggleSelect(select) {
    const isOpen = select.querySelector('.select-button').getAttribute('aria-expanded') === 'true';
    
    // Close all selects
    document.querySelectorAll('.custom-select').forEach(s => {
      s.querySelector('.select-button').setAttribute('aria-expanded', 'false');
      s.querySelector('.select-options').classList.remove('show');
    });
    
    // Toggle current select
    if (!isOpen) {
      select.querySelector('.select-button').setAttribute('aria-expanded', 'true');
      select.querySelector('.select-options').classList.add('show');
    }
  }

  selectOption(select, option) {
    const button = select.querySelector('.select-button');
    const textSpan = button.querySelector('span');
    const value = option.dataset.value;
    
    textSpan.textContent = option.textContent;
    button.setAttribute('aria-expanded', 'false');
    select.querySelector('.select-options').classList.remove('show');
  }

  // Input Validation
  setupInputValidation() {
    const inputs = document.querySelectorAll('.input-field');
    inputs.forEach(input => {
      input.addEventListener('input', () => this.validateInput(input.value, input.id.replace('-input', '-error')));
      input.addEventListener('blur', () => this.handleInputBlur(input));
    });
  }

  validateInput(value, errorId) {
    if (!value || value.trim() === '') {
      this.showError(errorId, 'This field is required.');
      return false;
    }
    
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      this.showError(errorId, 'Please enter a valid number.');
      return false;
    }
    
    if (numValue < 0) {
      this.showError(errorId, 'Please enter a positive number.');
      return false;
    }
    
    this.clearError(errorId);
    return true;
  }

  handleInputBlur(input) {
    // Function to change Input Text Color for better readability when focus is lost
    if (input.value.trim() !== '') {
      input.style.color = 'var(--text-primary)';
    } else {
      input.style.color = 'var(--text-secondary)';
    }
  }

  // Error Handling
  showError(errorId, message) {
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.color = '#ff6b6b';
    }
  }

  clearError(errorId) {
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
      errorElement.textContent = '';
    }
  }

  // Loading States
  showLoading(show) {
    const indicator = document.getElementById('loading-indicator');
    if (show) {
      indicator.classList.add('show');
      indicator.setAttribute('aria-hidden', 'false');
    } else {
      indicator.classList.remove('show');
      indicator.setAttribute('aria-hidden', 'true');
    }
  }

  // Exchange Rates API
  async loadExchangeRates() {
    try {
      this.showLoading(true);
      
      // Using a free currency API (you can replace with your preferred API)
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      const data = await response.json();
      
      // Convert to our format
      this.exchangeRates = this.convertExchangeRates(data.rates);
      
    } catch (error) {
      console.warn('Failed to load real-time rates, using fallback rates');
      this.loadFallbackRates();
    } finally {
      this.showLoading(false);
    }
  }

  convertExchangeRates(rates) {
    const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'NGN'];
    const result = {};
    
    currencies.forEach(from => {
      result[from] = {};
      currencies.forEach(to => {
        if (from === to) {
          result[from][to] = 1;
        } else {
          result[from][to] = rates[to] / rates[from];
        }
      });
    });
    
    return result;
  }

  loadFallbackRates() {
    // Fallback rates (update these periodically when API is unavailable)
    // These are the same rates from the original implementation
    this.exchangeRates = {
      USD: { EUR: 0.91, GBP: 0.78, JPY: 148, NGN: 1600 },
      EUR: { USD: 1.10, GBP: 0.86, JPY: 163, NGN: 1760 },
      GBP: { USD: 1.28, EUR: 1.16, JPY: 190, NGN: 2050 },
      JPY: { USD: 0.0068, EUR: 0.0061, GBP: 0.0053, NGN: 10.8 },
      NGN: { USD: 0.00063, EUR: 0.00057, GBP: 0.00049, JPY: 0.092 }
    };
  }

  // Keyboard Navigation
  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        // Close all dropdowns
        document.querySelectorAll('.select-options').forEach(option => {
          option.classList.remove('show');
        });
        document.querySelectorAll('.select-button').forEach(button => {
          button.setAttribute('aria-expanded', 'false');
        });
      }
    });
  }

  // Outside Click Handler
  handleOutsideClick(event) {
    if (!event.target.closest('.custom-select')) {
      document.querySelectorAll('.select-options').forEach(option => {
        option.classList.remove('show');
      });
      document.querySelectorAll('.select-button').forEach(button => {
        button.setAttribute('aria-expanded', 'false');
      });
    }
  }
}

// Initialize the converter when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new UnitConverter();
});

// Service Worker registration for offline functionality (optional)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => console.log('SW registered'))
      .catch(error => console.log('SW registration failed'));
  });
}