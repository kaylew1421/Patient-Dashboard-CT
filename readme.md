<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Patient Dashboard - Jessica Taylor</title>
  <link rel="stylesheet" href="styles/styles.css" />
  <!-- Chart.js CDN -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
  <header class="header">
    <h1>Patient Dashboard</h1>
  </header>

  <main class="container">
    <section class="patient-info">
      <img src="" alt="Jessica Taylor Profile Picture" id="profile-pic" />
      <h2 id="patient-name">Jessica Taylor</h2>
      <p id="patient-details">Loading patient details...</p>
    </section>

    <section class="blood-pressure-chart">
      <h3>Annual Blood Pressure</h3>
      <canvas id="bpChart" width="400" height="200"></canvas>
    </section>

    <!-- Additional sections like diagnosis history, lab results, etc., can be added here -->

  </main>

  <script src="scripts/script.js"></script>
</body>
</html>
