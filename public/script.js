const tableBody = document.getElementById("tableBody");

const totalThreats = document.getElementById("totalThreats");
const criticalCount = document.getElementById("criticalCount");
const incidentCount = document.getElementById("incidentCount");

const form = document.getElementById("threatForm");

let activityChart;
let severityChart;

function updateClock() {
  document.getElementById("clock").innerText =
    new Date().toLocaleString();
}

setInterval(updateClock, 1000);
updateClock();

async function loadDashboard() {

  const response =
    await fetch("/api/dashboard");

  const data =
    await response.json();

  totalThreats.innerText =
    data.totalThreats;

  criticalCount.innerText =
    data.criticalAlerts;

  incidentCount.innerText =
    data.activeIncidents;
}

async function loadThreats() {

  const response =
    await fetch("/api/threats");

  const threats =
    await response.json();

  tableBody.innerHTML = "";

  let low = 0;
  let medium = 0;
  let high = 0;
  let critical = 0;

  threats.forEach(threat => {

    let severityClass = "";

    if (threat.severity === "Low") {
      severityClass = "low";
      low++;
    }

    if (threat.severity === "Medium") {
      severityClass = "medium";
      medium++;
    }

    if (threat.severity === "High") {
      severityClass = "high";
      high++;
    }

    if (threat.severity === "Critical") {
      severityClass = "critical-text";
      critical++;
    }

    tableBody.innerHTML += `
      <tr>
        <td>${threat.id}</td>
        <td>${threat.name}</td>
        <td class="${severityClass}">
          ${threat.severity}
        </td>
        <td>${threat.region}</td>
        <td>${threat.time}</td>
      </tr>
    `;

  });

  updateCharts(
    low,
    medium,
    high,
    critical
  );
}

function createCharts() {

  activityChart =
    new Chart(
      document.getElementById("activityChart"),
      {
        type: "line",
        data: {
          labels: [
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat",
            "Sun"
          ],
          datasets: [{
            label: "Threat Activity",
            data: [
              12,
              18,
              25,
              34,
              41,
              53,
              67
            ],
            borderColor: "#38bdf8",
            backgroundColor:
              "rgba(56,189,248,.2)",
            fill: true,
            tension: .4
          }]
        }
      }
    );

  severityChart =
    new Chart(
      document.getElementById("severityChart"),
      {
        type: "doughnut",
        data: {
          labels: [
            "Low",
            "Medium",
            "High",
            "Critical"
          ],
          datasets: [{
            data: [1,1,1,1]
          }]
        }
      }
    );

}

function updateCharts(
  low,
  medium,
  high,
  critical
) {

  severityChart.data.datasets[0].data = [
    low,
    medium,
    high,
    critical
  ];

  severityChart.update();
}

form.addEventListener(
  "submit",
  async (e) => {

    e.preventDefault();

    await fetch(
      "/api/threats",
      {
        method: "POST",

        headers: {
          "Content-Type":
          "application/json"
        },

        body: JSON.stringify({

          name:
          document.getElementById(
            "name"
          ).value,

          severity:
          document.getElementById(
            "severity"
          ).value,

          region:
          document.getElementById(
            "region"
          ).value,

          description:
          document.getElementById(
            "description"
          ).value

        })

      }
    );

    form.reset();

    loadThreats();
    loadDashboard();
  }
);

createCharts();

loadThreats();
loadDashboard();

setInterval(() => {

  loadThreats();
  loadDashboard();

}, 3000);