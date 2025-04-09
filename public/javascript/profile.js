async function renderUpdateUser(username) {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/auth/get-user/${username}`);
    const result = await response.json();
    const user = result.data.user;

    if (!response.ok) {
      console.error("Signup failed:", result);
    }

    console.log(Object.keys(user));

    modalBody.innerHTML = Object.keys(user)
      .map((property) => {
        if (property !== "_id") {
          return `
          <div class="row-data">
            <label class="label-edit-form">${property}:</label>
            <input type="text" id="${property}" class="update-inputs" value="${user[property]}" placeholder="${property}" />
          </div>
          `;
        }
      })
      .join("");

    modalFooter.innerHTML = `
      <button class="button" onclick="updateUser('${username}')">Save</button>
      <button class="button" onclick="closeModal()">Cancel</button>
    `;

    openModal();
  } catch (error) {
    console.error("error in profile>renderUpdateUser", error);
  }
}

async function updateUser(username) {
  console.log(username);
  const updateInputs = Array.from(document.querySelectorAll(".update-inputs"));
  for (const input of updateInputs) {
    if (input.value.trim() === "") return alert("invalid input");
  }
  console.log(updateInputs);

  const data = {};
  updateInputs.forEach((input) => {
    data[input.id] = input.value;
  });
  console.log("data", data);

  try {
    const response = await fetch(`http://127.0.0.1:8000/api/auth/editUser/${username}`, {
      method: "PATCH",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    closeModal();
    window.location.reload();
  } catch (error) {
    console.error("error in profile>updateUser", error);
  }
}

async function logOut(username) {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/auth/logout/${username}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    window.location.href = "http://127.0.0.1:8000/login";
  } catch (error) {
    console.error("error in profile>updateUser", error);
  }
}
