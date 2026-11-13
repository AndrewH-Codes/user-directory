const reloadUsersButton = document.getElementById("reloadUsersButton");
const statusLine = document.getElementById("status");
const userList = document.getElementById("userList");
const searchInput = document.getElementById("searchInput");
const optionPicker = document.getElementById("optionPicker");
let users = [];

async function getUsers() {
    try {
        statusLine.textContent = "Loading users...";

        //loadUsersButton.disabled = true;


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

        optionPicker.hidden = false;

        searchInput.value = "";

    } catch (error) {
        statusLine.textContent = "Failed to load users. Please try again."
        userList.innerHTML = "";
        searchInput.hidden = true;
        optionPicker.hidden = true;
        reloadUsersButton.hidden = false;
        users = [];
        console.log(error);
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

    listItem.classList.add("user-card");

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

function sortHelper(){
    const option = optionPicker.value;
    let sortedItems = [];
    if (option === "nameA-Z"){

        sortedItems = [...users].sort((a,b) => a.name.localeCompare(b.name));
        
    } else if (option === "nameZ-A"){

        sortedItems = [...users].sort((a,b) => b.name.localeCompare(a.name));

    } else if (option === "cityA-Z"){

        sortedItems = [...users].sort((a,b) => a.address.city.localeCompare(b.address.city));

    }
    userList.innerHTML = "";
    sortedItems.forEach(item =>{
        userInfo(item);
    });
}
getUsers();
reloadUsersButton.addEventListener("click", getUsers);
searchInput.addEventListener("input", searchUsers);
optionPicker.addEventListener("change", sortHelper);
