/* ===============================
   API CONFIGURATION
================================ */

const API_BASE_URL = "https://entrbnd.gaurish.one";
const API_KEY = "uwu";

/* ===============================
   ELEMENT REFERENCES
================================ */

const form = document.getElementById("registrationForm");
const overlay = document.getElementById("dialogOverlay");
const dialogMessage = document.getElementById("dialogMessage");
const submitButton = form.querySelector("button");

/* ===============================
   FORM SUBMISSION
================================ */

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim().toLowerCase();
  const regno = document.getElementById("regno").value.trim().toLowerCase();

  // Disable button while processing
  submitButton.disabled = true;
  submitButton.textContent = "Registering...";

  /* ---------- VALIDATIONS ---------- */

  if (!email.endsWith("@vitapstudent.ac.in")) {
    showDialog("Only VIT-AP student email IDs are allowed ❌");
    return;
  }

  // Extract reg no from email
  // Example: saqib.25bca7695@vitapstudent.ac.in
  const emailUser = email.split("@")[0];
  const parts = emailUser.split(".");

  if (parts.length < 2) {
    showDialog("Invalid email format ❌");
    return;
  }

  const regFromEmail = parts[1];

  if (regFromEmail !== regno) {
    showDialog("Registration number does not match email ❌");
    return;
  }

  /* ---------- API CALL ---------- */

  try {
    const response = await fetch(`${API_BASE_URL}/12feb/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": API_KEY
      },
      body: JSON.stringify({
        name: name,
        email: email,
        reg_number: regno
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("API Error:", error);
      showDialog("Registration failed. Please try again.");
      return;
    }

    showDialog("🎉 Registration successful!", true);
    form.reset();

  } catch (error) {
    console.error(error);
    showDialog("Something went wrong. Please try again.");
  }
});

/* ===============================
   DIALOG FUNCTIONS
================================ */

function showDialog(message, success = false) {
  dialogMessage.textContent = message;
  dialogMessage.style.color = success ? "green" : "red";
  overlay.classList.remove("hidden");
}

function closeDialog() {
  overlay.classList.add("hidden");
  resetButton();
}

/* ===============================
   BUTTON RESET
================================ */

function resetButton() {
  submitButton.disabled = false;
  submitButton.textContent = "Register";
}