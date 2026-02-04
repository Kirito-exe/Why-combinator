/* ===============================
   FIREBASE INITIALIZATION
================================ */

// 🔴 REPLACE these values with your Firebase project config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

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
    resetButton();
    return;
  }

  // Extract reg no from email
  // Example: saqib.25bca7695@vitapstudent.ac.in
  const emailUser = email.split("@")[0];
  const parts = emailUser.split(".");

  if (parts.length < 2) {
    showDialog("Invalid email format ❌");
    resetButton();
    return;
  }

  const regFromEmail = parts[1];

  if (regFromEmail !== regno) {
    showDialog("Registration number does not match email ❌");
    resetButton();
    return;
  }

  /* ---------- FIREBASE CHECK ---------- */

  try {
    const userDoc = db.collection("registrations").doc(email);
    const snapshot = await userDoc.get();

    if (snapshot.exists) {
      showDialog("You have already registered ❗");
      resetButton();
      return;
    }

    /* ---------- SAVE REGISTRATION ---------- */

    await userDoc.set({
      name: name,
      email: email,
      regno: regno,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    showDialog("🎉 Registration successful!", true);
    form.reset();

  } catch (error) {
    console.error(error);
    showDialog("Something went wrong. Please try again.");
  }

  resetButton();
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
}

/* ===============================
   BUTTON RESET
================================ */

function resetButton() {
  submitButton.disabled = false;
  submitButton.textContent = "Register";
}