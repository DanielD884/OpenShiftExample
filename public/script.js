let playerData = [];
let filteredData = [];
let sortDirections = [true, true, true, true, true]; // Standardmäßig aufsteigend

async function loadStats() {
  try {
    const response = await fetch("handball_kumulierte_stats_sorted.json");
    const data = await response.json();
    playerData = data;
    filteredData = data;

    populateTable(data);
    populateFilterOptions(data);
    updateTopScorers(data);
  } catch (error) {
    console.error("Fehler beim Laden der Daten:", error);
  }
}

function populateTable(data) {
  const tableBody = document.querySelector("#stats-table tbody");
  tableBody.innerHTML = "";

  data.forEach((player) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${player.name}</td>
            <td>${player.verein}</td>
            <td>${player.gesamt_tore}</td>
            <td>${player.gesamt_2_minuten}</td>
            <td>${player.spiele_gespielt}</td>
            <td>${player.durchschnitt_tore.toFixed(2)}</td>
        `;
    tableBody.appendChild(row);
  });
}

function populateFilterOptions(data) {
  const select = document.getElementById("verein-filter");
  const vereine = [...new Set(data.map((player) => player.verein))];

  vereine.forEach((verein) => {
    const option = document.createElement("option");
    option.value = verein;
    option.textContent = verein;
    select.appendChild(option);
  });

  select.addEventListener("change", applyFilter);
}

function applyFilter() {
  const selectedVerein = document.getElementById("verein-filter").value;

  filteredData = selectedVerein
    ? playerData.filter((player) => player.verein === selectedVerein)
    : playerData;

  populateTable(filteredData);
  updateTopScorers(filteredData);
}

function updateTopScorers(data) {
  const sortedPlayers = [...data]
    .sort((a, b) => b.gesamt_tore - a.gesamt_tore)
    .slice(0, 3);

  document.getElementById("first-name").textContent = sortedPlayers[0]
    ? sortedPlayers[0].name
    : "-";
  document.getElementById("second-name").textContent = sortedPlayers[1]
    ? sortedPlayers[1].name
    : "-";
  document.getElementById("third-name").textContent = sortedPlayers[2]
    ? sortedPlayers[2].name
    : "-";
}

function sortTable(columnIndex) {
  const isAscending = sortDirections[columnIndex];
  sortDirections[columnIndex] = !isAscending; // Toggle Sortierreihenfolge

  filteredData.sort((a, b) => {
    let valueA, valueB;
    switch (columnIndex) {
      case 0:
        valueA = a.name;
        valueB = b.name;
        break;
      case 1:
        valueA = a.verein;
        valueB = b.verein;
        break;
      case 2:
        valueA = a.gesamt_tore;
        valueB = b.gesamt_tore;
        break;
      case 3:
        valueA = a.gesamt_2_minuten;
        valueB = b.gesamt_2_minuten;
        break;
      case 4:
        valueA = a.spiele_gespielt;
        valueB = b.spiele_gespielt;
        break;
      case 5:
        valueA = a.durchschnitt_tore;
        valueB = b.durchschnitt_tore;
        break;
      default:
        return 0;
    }

    return isAscending ? (valueA > valueB ? 1 : -1) : valueA < valueB ? 1 : -1;
  });

  populateTable(filteredData);
}

loadStats();
