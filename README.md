# Unit Converter

A modern, responsive web application for converting units across different categories including temperature, currency, and speed. Built with vanilla JavaScript, CSS3, and HTML5.

## Features

### 🌡️ Temperature Conversion
- Celsius, Fahrenheit, Kelvin, and Rankine scales
- Real-time color-coded results based on temperature ranges
- Intuitive radio button selection

### 💱 Currency Conversion
- Real-time exchange rates using external API
- Support for USD, EUR, GBP, JPY, and NGN
- Fallback rates for offline functionality
- Visual currency selection with flag icons

### 🚀 Speed Conversion
- Multiple units: m/s, km/h, mph, knots, ft/s
- Custom dropdown selectors
- Precise conversion calculations

### ✨ Modern Features
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Accessibility**: Full ARIA support, keyboard navigation, screen reader friendly
- **Glass Morphism UI**: Beautiful modern design with backdrop blur effects
- **Real-time Validation**: Instant input validation with helpful error messages
- **Offline Support**: Service worker for offline functionality
- **Progressive Web App**: Can be installed on devices

## Technologies Used

- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Modern layout with Grid, Flexbox, and CSS Custom Properties
- **JavaScript ES6+**: Class-based architecture with modern features
- **Font Awesome**: Icons for better UX
- **Google Fonts**: Outfit and Bebas Neue typography

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/Javascript-Unit-Converter.git
   ```

2. Open `index.html` in your web browser or serve it using a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   ```

3. Navigate to `http://localhost:8000` in your browser

## Usage

### Temperature Conversion
1. Enter a temperature value
2. Select the conversion type (e.g., Celsius to Fahrenheit)
3. Click "Calculate" to see the result

### Currency Conversion
1. Enter an amount
2. Select "From" and "To" currencies
3. Click "Calculate" for real-time conversion

### Speed Conversion
1. Enter a speed value
2. Select "From" and "To" units using the dropdowns
3. Click "Calculate" for conversion

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Performance Features

- **Lazy Loading**: Images and resources load as needed
- **Caching**: Service worker caches resources for offline use
- **Optimized CSS**: Uses CSS custom properties for consistent theming
- **Minimal Dependencies**: Only external dependencies are fonts and icons

## Accessibility Features

- **ARIA Labels**: Proper labeling for screen readers
- **Keyboard Navigation**: Full keyboard support
- **Focus Management**: Clear focus indicators
- **High Contrast**: Support for high contrast mode
- **Reduced Motion**: Respects user's motion preferences

## Author

**Ekene Ochuba**

## Acknowledgments

- Exchange Rate API for real-time currency data
- Font Awesome for icons
- Google Fonts for typography
- Modern CSS techniques and best practices

