const signupSubmitBtn = document.getElementById("signup-submit-btn");
const loginBtn = document.getElementById("login-btn");

signupSubmitBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  const firstname = document.getElementById("firstname-input").value;
  const lastname = document.getElementById("lastname-input").value;
  const username = document.getElementById("username-input").value;
  const email = document.getElementById("email-input").value;
  const password = document.getElementById("create-password-input").value;
  const confirmPassword = document.getElementById("confirm-password-input").value;
  const gender = document.querySelector('input[name="gender"]:checked').value;
  const agreeTerms = document.getElementById("agree-terms");

  console.log({ firstname, lastname, email, username, password, gender });

  if (!agreeTerms.checked) {
    displayErrorMessage("Please agree to the terms and conditions", false);

    return;
  }

  if (password !== confirmPassword) {
    displayErrorMessage("Passwords do not match", false);
    return;
  }

  try {
    const response = await fetch("http://127.0.0.1:8000/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstname,
        lastname,
        username,
        email,
        password,
        gender,
      }),
    });
    const data = await response.json();

    if (!response.ok) {
      const errorMsg = data.message || `Registration failed: ${response.status}`;
      console.log(errorMsg);
      throw new Error(errorMsg);
    }
    displayErrorMessage("Registration successful!", true);
    window.location.href = "http://127.0.0.1:8000/login";
  } catch (error) {
    displayErrorMessage("An error occurred. Please try again.", false);
  }
});

function displayErrorMessage(message, isSuccess) {
  const errorMessageElement = document.querySelector(".error-message");
  errorMessageElement.style.display = "block";
  errorMessageElement.textContent = message;

  errorMessageElement.style.color = isSuccess ? "green" : "red";
  setTimeout(() => {
    errorMessageElement.style.display = "none";
  }, 5000);
}

loginBtn.addEventListener("click", (e) => {
  e.preventDefault();

  window.location.href = "http://127.0.0.1:8000/login";
});
