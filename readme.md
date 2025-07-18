Access at: https://kaylew1421.github.io/Patient-Dashboard-CT/

# Patient Dashboard

A responsive web application to display and manage patient data including vitals, diagnostics, lab results, and medical history. Built with HTML, CSS, JavaScript, and Chart.js.

## Features

- Responsive grid layout with sidebar, top navigation, main content, and right sidebar.
- Dynamic patient list with profile pictures and basic info.
- Clickable patient list to load detailed patient overview.
- Overview includes vital signs widgets (respiratory rate, temperature, heart rate).
- Interactive blood pressure history chart using Chart.js.
- Diagnostic list table showing problem, description, and status.
- Lab results list with downloadable icons.
- Multiple tabs: Overview, Patients, Schedule, Messages, Transactions (placeholder content).
- User-friendly UI with hover states and active menu highlighting.
- Fetches live patient data from a secured API endpoint.

## Technologies Used

- HTML5 & CSS3 (Flexbox, CSS Grid)
- JavaScript (ES6+)
- Chart.js (for charts)
- Fetch API for data retrieval

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/patient-dashboard.git
   cd patient-dashboard
2. Open index.html in your preferred web browser.

3. Ensure you have an internet connection to load Chart.js from CDN.

  ## Usage
  
-The app loads patient data automatically on page load.

-Use the left sidebar or the Patients tab to select a patient.

-The Overview tab displays detailed vitals, diagnostics, and charts for the selected patient.

-Navigate other tabs to see placeholder content for Schedule, Messages, and Transactions.

## API Credentials
The app uses basic auth to fetch patient data from the API:

Username: coalition
Password: skills-test

These are hardcoded in the JS file for demo purposes.

## Project Structure

patient-dashboard/

├── assets/                # Images and icons

├── index.html             # Main HTML file

├── styles.css             # Stylesheet

├── script.js              # JavaScript logic

└── README.md              # This documentationContributing


## Contributing
Feel free to fork the repository and submit pull requests for improvements or bug fixes.

## License
This project is open source and available under the MIT License. 



Made with ❤️ by Kayla Lewis


