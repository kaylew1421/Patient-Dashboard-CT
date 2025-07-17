// API credentials and endpoint
const username = 'coalition';
const password = 'skills-test';
const apiUrl = 'https://fedskillstest.coalitiontechnologies.workers.dev';

const credentials = btoa(`${username}:${password}`);
let bpChartInstance = null;
let currentPatient = null;

// Fetch patient data
async function fetchPatientData() {
  try {
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const patients = await response.json();
    if (!Array.isArray(patients) || patients.length === 0) throw new Error("No patients data returned");

    renderPatientsList(patients);
    renderPatientsTabList(patients);

    currentPatient = patients.find(p => p.name.toLowerCase() === 'jessica taylor') || patients[0];
    updateOverview(currentPatient);

  } catch (error) {
    console.error('Error fetching patient data:', error);
    document.querySelector('.patient-info h2').textContent = 'Failed to load patient data.';
  }
}

// Patients list (sidebar)
function renderPatientsList(patients) {
  const listEl = document.getElementById('patients-list');
  listEl.innerHTML = '';

  const filteredPatients = patients.filter(p => p.name.toLowerCase() === 'jessica taylor');

  filteredPatients.forEach(patient => {
    const li = document.createElement('li');
    li.classList.add('active');

    const img = document.createElement('img');
    img.classList.add('patient-pic');
    img.src = patient.profile_picture || '../assets/profile_pic.png';
    img.alt = patient.name;

    const detailsDiv = document.createElement('div');
    detailsDiv.classList.add('patient-details');

    const nameDiv = document.createElement('div');
    nameDiv.classList.add('patient-name');
    nameDiv.textContent = patient.name;

    const infoSubDiv = document.createElement('div');
    infoSubDiv.classList.add('patient-info-sub');

    let age = '--';
    if (patient.date_of_birth) {
      const dob = new Date(patient.date_of_birth);
      const ageDifMs = Date.now() - dob.getTime();
      const ageDate = new Date(ageDifMs);
      age = Math.abs(ageDate.getUTCFullYear() - 1970);
    }

    infoSubDiv.textContent = `${patient.gender || '--'}, ${age}`;
    detailsDiv.appendChild(nameDiv);
    detailsDiv.appendChild(infoSubDiv);

    li.appendChild(img);
    li.appendChild(detailsDiv);

    li.addEventListener('click', () => {
      updateOverview(patient);
      document.querySelectorAll('#patients-list li').forEach(item => item.classList.remove('active'));
      li.classList.add('active');
    });

    listEl.appendChild(li);
  });

  if (filteredPatients.length === 0) {
    listEl.innerHTML = '<li>No patient named Jessica Taylor found.</li>';
  }
}

// Patients list (tab)
function renderPatientsTabList(patients) {
  const listEl = document.getElementById('patients-list-tab');
  listEl.innerHTML = '';

  const filteredPatients = patients.filter(p => p.name.toLowerCase() === 'jessica taylor');

  filteredPatients.forEach(patient => {
    const li = document.createElement('li');
    li.textContent = patient.name;
    li.addEventListener('click', () => {
      document.querySelector('[data-tab="overview"]').click();
      updateOverview(patient);
    });
    listEl.appendChild(li);
  });

  if (filteredPatients.length === 0) {
    listEl.innerHTML = '<li>No patient named Jessica Taylor found.</li>';
  }
}

// Update overview panel
function updateOverview(patient) {
  if (!patient) return;
  currentPatient = patient;

  const img = document.getElementById('profile-pic');
  img.src = patient.profile_picture || '../assets/profile_pic.png';
  img.alt = `${patient.name} Profile Picture`;

  document.getElementById('patient-main-name').textContent = patient.name;
  document.getElementById('dob').textContent = patient.date_of_birth || '--';
  document.getElementById('gender').textContent = patient.gender || '--';
  document.getElementById('phone').textContent = patient.phone_number || '--';
  document.getElementById('emergency').textContent = patient.emergency_contact || '--';
  document.getElementById('insurance').textContent = patient.insurance_type || '--';

  renderBloodPressureChart(patient.diagnosis_history);
  updateVitalWidgets(patient);
  updateDiagnosticList(patient);
  updateLabResults(patient);
}

// Blood pressure chart
function renderBloodPressureChart(history) {
  if (!history || history.length === 0) {
    if (bpChartInstance) {
      bpChartInstance.destroy();
      bpChartInstance = null;
    }
    return;
  }

  const sortedHistory = history.slice().sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    const months = {
      January:1, February:2, March:3, April:4, May:5, June:6,
      July:7, August:8, September:9, October:10, November:11, December:12
    };
    return (months[a.month] || 0) - (months[b.month] || 0);
  });

  const labels = sortedHistory.map(d => `${d.month} ${d.year}`);
  const systolic = sortedHistory.map(d => d.blood_pressure.systolic.value);
  const diastolic = sortedHistory.map(d => d.blood_pressure.diastolic.value);

  const ctx = document.getElementById('bpChart').getContext('2d');
  if (bpChartInstance) bpChartInstance.destroy();

  bpChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Systolic',
          data: systolic,
          borderColor: '#4a90e2',
          backgroundColor: 'rgba(74, 144, 226, 0.2)',
          fill: true,
          tension: 0.3,
        },
        {
          label: 'Diastolic',
          data: diastolic,
          borderColor: '#50bfa5',
          backgroundColor: 'rgba(80, 191, 165, 0.2)',
          fill: true,
          tension: 0.3,
        }
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        title: { display: true, text: 'Blood Pressure', font: { size: 18, weight: 'bold' } },
      },
      scales: {
        y: {
          beginAtZero: false,
          suggestedMin: 40,
          suggestedMax: 140,
          title: { display: true, text: 'mm Hg' },
        },
        x: { title: { display: true, text: 'Month Year' } },
      },
    },
  });
}

// Update vitals
function updateVitalWidgets(patient) {
  if (!patient.diagnosis_history || patient.diagnosis_history.length === 0) {
    document.getElementById('respiratory-rate-value').textContent = '-- breaths/min';
    document.getElementById('respiratory-rate-status').textContent = '';
    document.getElementById('temperature-value').textContent = '-- °F';
    document.getElementById('temperature-status').textContent = '';
    document.getElementById('heart-rate-value').textContent = '-- bpm';
    document.getElementById('heart-rate-status').textContent = '';
  } else {
    const latest = patient.diagnosis_history.slice().sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      const months = {
        January:1, February:2, March:3, April:4, May:5, June:6,
        July:7, August:8, September:9, October:10, November:11, December:11
      };
      return (months[b.month] || 0) - (months[a.month] || 0);
    })[0];

    const rr = latest.respiratory_rate;
    const temp = latest.temperature;
    const hr = latest.heart_rate;

    document.getElementById('respiratory-rate-value').textContent = `${rr.value} breaths/min`;
    document.getElementById('respiratory-rate-status').textContent = rr.status || '';

    document.getElementById('temperature-value').textContent = `${temp.value} °F`;
    document.getElementById('temperature-status').textContent = temp.status || '';

    document.getElementById('heart-rate-value').textContent = `${hr.value} bpm`;
    document.getElementById('heart-rate-status').textContent = hr.status || '';
  }
}

// Diagnostics table
function updateDiagnosticList(patient) {
  const diagnosticListEl = document.getElementById('diagnostic-list');
  diagnosticListEl.innerHTML = '';
  if (patient.diagnostic_list && patient.diagnostic_list.length > 0) {
    patient.diagnostic_list.forEach(diagnosis => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${diagnosis.name}</td>
        <td>${diagnosis.description}</td>
        <td>${diagnosis.status}</td>
      `;
      diagnosticListEl.appendChild(tr);
    });
  } else {
    diagnosticListEl.innerHTML = `<tr><td colspan="3">No diagnostics available.</td></tr>`;
  }
}

// Lab results
function updateLabResults(patient) {
  const labResultsEl = document.getElementById('lab-results-list');
  labResultsEl.innerHTML = '';
  if (patient.lab_results && patient.lab_results.length > 0) {
    patient.lab_results.forEach(result => {
      const li = document.createElement('li');
      li.textContent = result;

      const icon = document.createElement('img');
      icon.src = '../assets/download.jpg';
      icon.alt = 'Download';
      icon.classList.add('download-icon');
      li.appendChild(icon);

      labResultsEl.appendChild(li);
    });
  } else {
    labResultsEl.innerHTML = '<li>No lab results available.</li>';
  }
}

// Tab navigation
document.querySelectorAll('.top-menu li').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.top-menu li').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    const target = tab.getAttribute('data-tab');
    document.querySelectorAll('.tab-content').forEach(tc => {
      tc.classList.toggle('active', tc.id === target);
    });
  });
});

// Start
fetchPatientData();
