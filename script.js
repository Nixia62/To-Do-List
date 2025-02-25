
let coins = localStorage.getItem("coins") ? parseInt(localStorage.getItem("coins")) : 0;
let purchasedItems = localStorage.getItem("purchasedItems") ? localStorage.getItem("purchasedItems").split(",") : []; 

// DOM elements
const taskInput = document.getElementById("task-input");
const addButton = document.getElementById("add-task-btn");
const taskList = document.getElementById("task-list");
const coinCount = document.getElementById("coin-count");
const feedSection = document.getElementById("feed");
const feedList = document.createElement("ul");
const notificationBox = document.getElementById("notification-box");
const inventoryList = document.getElementById("inventory-list");
const hungerBar = document.getElementById("hunger-bar");
const feedButton = document.getElementById("feed-btn");
const characterImage = document.getElementById("character-image");


coinCount.textContent = coins;


const coinValues = {
    easy: 20,
    medium: 40,
    hard: 60
};


function showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.classList.add("notification", type);
    notification.textContent = message;
    
    notificationBox.appendChild(notification);


    setTimeout(() => {
        notification.remove();
    }, 3000);
}


addButton.addEventListener("click", function () {
    const task = taskInput.value.trim();
    const difficulty = document.getElementById("difficulty").value;

    if (task) {
        const li = document.createElement("li");
        li.textContent = `${task} - Difficulty: ${difficulty}`;

       
        li.addEventListener("click", function () {
            coins += coinValues[difficulty];
            localStorage.setItem("coins", coins); 
            coinCount.textContent = coins;
            li.remove();

            showNotification(`Task completed! You earned ${coinValues[difficulty]} coins.`, "success");
        });

        taskList.appendChild(li);
        taskInput.value = "";
    } else {
        showNotification("Please enter a task!", "warning");
    }
});


taskInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        addButton.click();
    }
});


function updateFeed() {
    // Clear the existing list
    inventoryList.innerHTML = "";

    // Check if the user has purchased anything
    if (purchasedItems.length === 0 || purchasedItems[0] === "") {
        inventoryList.innerHTML = "<p>You haven't bought anything yet!</p>";
    } else {


        purchasedItems.forEach(item => {
            const invItem = document.createElement("li");
            invItem.textContent = item;
            inventoryList.appendChild(invItem);
        });
    }
}





let hunger = localStorage.getItem("hunger") ? parseInt(localStorage.getItem("hunger")) : 100;



function updateHungerDisplay() {
    hungerBar.style.width = hunger + "%";
    hungerBar.textContent = hunger + "%";
    updateCharacterImage(hunger);
    localStorage.setItem("hunger", hunger);
}



function updateCharacterImage(hungerValue) {
    if (hungerValue >= 90) {
        characterImage.src = "bg-assets/90percent.jpeg";
    } else if (hungerValue >= 80) {
        characterImage.src = "bg-assets/80percent.jpeg";
    } else if (hungerValue >= 60) {
        characterImage.src = "bg-assets/60percent.jpeg";
    } else if (hungerValue >= 40) {
        characterImage.src = "bg-assets/40percent.jpeg";
    } else if(hungerValue >= 20){
        characterImage.src = "bg-assets/20percent.jpeg";
    }
    else {
        characterImage.src = "bg-assets/10percent.jpeg";
    }
}


feedButton.addEventListener("click", function () {
    if (purchasedItems.length > 0) {
        purchasedItems.shift(); 
        localStorage.setItem("purchasedItems", purchasedItems.join(","));
        updateFeed();
        
        hunger = Math.min(hunger + 20, 100); 
        updateHungerDisplay();

}
});


setInterval(() => {
    if (hunger > 0) {
        hunger = Math.max(hunger - 1, 0);
        updateHungerDisplay();
    }
}, 40000);


updateHungerDisplay();


document.addEventListener("DOMContentLoaded", () => {
    updateFeed();

    const links = document.querySelectorAll(".nav-left .nav-item");
    const sections = document.querySelectorAll("section");

    links.forEach((link) => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            
            sections.forEach((section) => section.classList.remove("active"));
            
            const target = link.getAttribute("href").substring(1);
            document.getElementById(target).classList.add("active");
        });
    });

    // Handle Buy button clicks
    document.querySelectorAll(".buy").forEach(button => {
        button.addEventListener("click", function() {
            const productName = this.getAttribute("data-name");
            const price = parseInt(this.getAttribute("data-price"));

            if (coins >= price) {
                coins -= price; 
                purchasedItems.push(productName);
                localStorage.setItem("coins", coins);
                localStorage.setItem("purchasedItems", purchasedItems.join(","));
                coinCount.textContent = coins;
                updateFeed(); 
                showNotification(`Successfully Bought ${productName}!`, "success");
            } else {
                showNotification("Not enough coins! Get ur ass back to tasks!", "error");
            }
        });
    });
});
