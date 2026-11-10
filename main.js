const loadUsersButton = document.getElementById("loadUsersButton");
const statusLine = document.getElementById("status");
const userList = document.getElementById("userList");
const searchInput = document.getElementById("searchInput");
let users = [];

async function getUsers() {
    try {
        statusLine.textContent = "Loading users...";

        loadUsersButton.disabled = true;

        const response = await fetch("https://jsonplaceholder.typicode.com/users");

        if (!response.ok) {
            throw new Error("Failed to retrieve users.")
        }

        users = await response.json();

        userList.innerHTML = "";

        users.forEach(user => {
            userInfo(user);
        });

        statusLine.textContent = users.length + " Users successfully loaded!";

        searchInput.hidden = false;

        searchInput.value = "";

    } catch (error) {
        statusLine.textContent = "Failed to load users, please try again."
        userList.innerHTML = "";
        searchInput.hidden = true;
        users = [];
        console.log(error);
    } finally {
        loadUsersButton.disabled = false;
    }
}

function searchUsers() {
    const searchTerm = searchInput.value.toLowerCase();

    const filteredUsers = users.filter((user) => {
        return user.name.toLowerCase().includes(searchTerm);
    });

    userList.innerHTML = "";

    filteredUsers.forEach(user => {
        userInfo(user);
    });

    statusLine.textContent = filteredUsers.length + " Users found!";

    if (filteredUsers.length === 0) {
        statusLine.textContent = "No users found."
    }
}

function userInfo(user) {
    const listItem = document.createElement("li"); 

    listHelper("h3", user.name, listItem);

    listHelper("p", "Email: " + user.email, listItem);

    listHelper("p", "Phone: " + user.phone, listItem);

    listHelper("p", "Company: " + user.company.name, listItem);

    listHelper("p", "Website: " + user.website, listItem);

    listHelper("p", "Address: " + user.address.street + ", " + user.address.suite + ", " + user.address.city + " " + user.address.zipcode, listItem);

    userList.appendChild(listItem);
}

function listHelper(type, content, listItem){
    const newElement = document.createElement(type);
    newElement.textContent = content;
    listItem.appendChild(newElement);
}

loadUsersButton.addEventListener("click", getUsers);
searchInput.addEventListener("input", searchUsers);
