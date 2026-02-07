const API_BASE_URL = "https://entrbnd.gaurish.one";
const API_KEY = "uwu";

async function loadUsers() {
  try {
    const res = await fetch(`${API_BASE_URL}/12feb/users`, {
      headers: {
        "X-API-Key": API_KEY
      }
    });

    if (!res.ok) {
      throw new Error("Failed to fetch users");
    }

    const users = await res.json();
    renderUsers(users);

  } catch (err) {
    console.error(err);
    document.getElementById("usersContainer").textContent =
      "Failed to load registrations.";
  }
}

let tableData = [];

function renderUsers(users) {
  const container = document.getElementById("usersContainer");

  if (!users || users.length === 0) {
    container.textContent = "No registrations yet.";
    document.getElementById("csvButton").style.display = "none";
    return;
  }

  tableData = users;
  const table = document.createElement("table");
  
  const headerRow = document.createElement("tr");
  const headers = ["Name", "Registration Number", "Email", "Registered At"];
  headers.forEach(headerText => {
    const th = document.createElement("th");
    th.textContent = headerText;
    headerRow.appendChild(th);
  });
  table.appendChild(headerRow);

  users.forEach(user => {
    const row = document.createElement("tr");
    const createdAt = user.created_at ? new Date(user.created_at).toLocaleString() : "N/A";
    
    const cells = [
      user.name,
      user.reg_number,
      user.email,
      createdAt
    ];
    
    cells.forEach(cellText => {
      const td = document.createElement("td");
      td.textContent = cellText;
      row.appendChild(td);
    });
    table.appendChild(row);
  });

  container.innerHTML = "";
  container.appendChild(table);
  document.getElementById("csvButton").style.display = "block";
}

function copyTableToClipboard() {
  if (!tableData || tableData.length === 0) {
    alert("No data to copy");
    return;
  }

  const headers = ["Name", "Registration Number", "Email", "Registered At"];
  const rows = [headers.map(h => `"${h}"`).join(",")];

  tableData.forEach(user => {
    const createdAt = user.created_at ? new Date(user.created_at).toLocaleString() : "N/A";
    const row = [
      `"${user.name}"`,
      `"${user.reg_number}"`,
      `"${user.email}"`,
      `"${createdAt}"`
    ].join(",");
    rows.push(row);
  });

  const csv = rows.join("\n");
  navigator.clipboard.writeText(csv).then(() => {
    const button = document.getElementById("csvButton");
    const originalText = button.textContent;
    button.textContent = "✓ Copied!";
    setTimeout(() => {
      button.textContent = originalText;
    }, 2000);
  }).catch(err => {
    console.error("Failed to copy:", err);
    alert("Failed to copy CSV");
  });
}

loadUsers();
