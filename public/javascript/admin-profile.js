const adminUsername = document.querySelector("h2").textContent;
renderTable(adminUsername);
const thead = document.querySelector("thead");
const tbody = document.querySelector("tbody");

// Rendering Functions
async function renderTable() {
  try {
    const response = await fetch(
      `http://127.0.0.1:8000/api/admin/getUsers/${adminUsername}`
    );
    const result = await response.json();
    const users = result.data.users;
    console.log(users);

    thead.innerHTML = "";
    tbody.innerHTML = "";
    const tableColumns = [
      "No.",
      "User ID",
      "First Name",
      "Last Name",
      "Username",
      "Email",
      "Gender",
      "Role",
      "Created At",
      "delete",
    ];

    const headerRow = tableColumns.map((column) => `<th>${column}</th>`).join("");
    thead.innerHTML = `<tr>${headerRow}</tr>`;

    users.forEach((user, index) => {
      const createdAt = new Date(user.createdAt).toLocaleDateString();

      tbody.innerHTML += `
    <tr  >
      <td>${index + 1}</td>
      <td>${user._id}</td>
      <td>${user.firstname}</td>
      <td>${user.lastname}</td>
      <td>${user.username}</td>
      <td>${user.email}</td>
      <td>${user.gender}</td>
      <td>${user.role}</td>
      <td>${createdAt}</td>
      <td style="color: red ; cursor: pointer" onclick="deleteUser('${
        user.username
      }')">delete</td>
    </tr>`;
    });
  } catch (error) {
    console.error("Error rendering user table:", error);
  }
}

async function deleteUser(username) {
  try {
    console.log(username);
    const response = await fetch(`http://127.0.0.1:8000/api/admin/delete/${username}`, {
      method: "DELETE",
      "Content-Type": "application/json",
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    window.location.reload();
  } catch (error) {
    console.error("Delete error:", error);
  }
}
