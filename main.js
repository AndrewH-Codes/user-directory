const reloadUsersButton = document.getElementById("reloadUsersButton");
const statusLine = document.getElementById("status");
const userList = document.getElementById("userList");
const searchInput = document.getElementById("searchInput");
const optionPicker = document.getElementById("optionPicker");
const cityPicker = document.getElementById("cityPicker");
let users = [];

async function getUsers() {
    try {
        statusLine.textContent = "Loading users...";

        reloadUsersButton.disabled = true;
        reloadUsersButton.hidden = true;


        const response = await fetch("https://jsonplaceholder.typicode.com/users");

        if (!response.ok) {
            throw new Error("Failed to retrieve users.");
        }

        users = await response.json();

        citySearchFilterDisplay();

        fillCityFilter();

        statusLine.textContent = users.length + " Users successfully loaded!";

        searchInput.hidden = false;

        optionPicker.hidden = false;

        cityPicker.hidden = false;

        searchInput.value = "";

    } catch (error) {
        statusLine.textContent = "Failed to load users. Please try again."
        userList.innerHTML = "";
        searchInput.hidden = true;
        optionPicker.hidden = true;
        cityPicker.hidden = true;
        reloadUsersButton.hidden = false;
        reloadUsersButton.disabled = false;
        users = [];
        console.log(error);
    }
}

function citySearchFilterDisplay() {
    const searchTerm = searchInput.value.toLowerCase();
    
    let filteredUsers = users.filter((user) => {
        return user.name.toLowerCase().includes(searchTerm);
    });

    userList.innerHTML = "";

    const city = cityPicker.value;

    if(city !== "noFilter"){
        filteredUsers = filteredUsers.filter((user) => {
            return user.address.city === city;
        });
    }

    const option = optionPicker.value;

    if (option === "nameA-Z"){

        filteredUsers = filteredUsers.sort((a,b) => a.name.localeCompare(b.name));
        
    } else if (option === "nameZ-A"){

        filteredUsers = filteredUsers.sort((a,b) => b.name.localeCompare(a.name));

    } else if (option === "cityA-Z"){

        filteredUsers = filteredUsers.sort((a,b) => a.address.city.localeCompare(b.address.city));

    } 

    statusLine.textContent = filteredUsers.length + " Users found!";

    if (filteredUsers.length === 0) {
        statusLine.textContent = "No users found."
    }

    filteredUsers.forEach(user => {
        userInfo(user);
    });


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

function fillCityFilter() {
    const cities = users.map(user => user.address.city);

    cities.sort();

    const uniqueCities = [...new Set(cities)];

    uniqueCities.forEach(city => {
        const cityItem = document.createElement("option");
        cityItem.value = city;
        cityItem.textContent = city;
        cityPicker.appendChild(cityItem);
    })
}


getUsers();
reloadUsersButton.addEventListener("click", getUsers);
searchInput.addEventListener("input", citySearchFilterDisplay);
optionPicker.addEventListener("change", citySearchFilterDisplay);
cityPicker.addEventListener("change", citySearchFilterDisplay);
