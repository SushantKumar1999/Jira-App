let addBtn = document.querySelector(".add");
let body = document.querySelector("body");
let grid = document.querySelector(".grid");
let colors = ["pink", "blue", "green", "black"];

let allFiltersChildren = document.querySelectorAll(".filter div");

for (let i = 0; i < allFiltersChildren.length; i++) {
    allFiltersChildren[i].addEventListener("click", function (e) {
        if (e.currentTarget.classList.contains("colour-selected")) {
            e.currentTarget.classList.remove("colour-selected");
            loadTasks();
            return;
        } else {
            e.currentTarget.classList.add("colour-selected");
        }
        let filterColor = e.currentTarget.classList[0];
        loadTasks(filterColor);
    });
}

// Function to generate a simple unique ID
function generateUniqueId() {
  return '_' + Math.random().toString(36).substr(2, 9);
}

let deleteBtn = document.querySelector(".delete");
let deleteMode = false;

if (localStorage.getItem("AllTickets") == undefined) {
    let allTickets = {};
    allTickets = JSON.stringify(allTickets);
    localStorage.setItem("AllTickets", allTickets);
}

loadTasks();

deleteBtn.addEventListener("click", function (e) {
    if (e.currentTarget.classList.contains("delete-selected")) {
        e.currentTarget.classList.remove("delete-selected");
        deleteMode = false;
    } else {
        e.currentTarget.classList.add("delete-selected");
        deleteMode = true;
    }
});

addBtn.addEventListener("click", function () {
    deleteBtn.classList.remove("delete-selected");
    deleteMode = false;

    let preModal = document.querySelector(".modal");

    if (preModal != null) return;

    let div = document.createElement("div");
    div.classList.add("modal");
    div.innerHTML = `<div class="task-section">
                        <div class="task-inner-container" contenteditable="true"></div>
                     </div>
                     <div class="modal-priority-section">
                        <div class="priority-inner-container">
                           <div class="modal-priority pink"></div>
                           <div class="modal-priority blue"></div>
                           <div class="modal-priority green"></div>
                           <div class="modal-priority black selected"></div>
                        </div>
                     </div>
                     <button class="submit-task-btn">Submit Task</button>`;

    let ticketColor = "black";

    let allModalPriority = div.querySelectorAll(".modal-priority");
    for (let i = 0; i < allModalPriority.length; i++) {
        allModalPriority[i].addEventListener("click", function (e) {
            for (let j = 0; j < allModalPriority.length; j++) {
                allModalPriority[j].classList.remove("selected");
            }

            e.currentTarget.classList.add("selected");

            ticketColor = e.currentTarget.classList[1];
        });
    }

    // Event listener for the "Submit Task" button
    let submitBtn = div.querySelector(".submit-task-btn");
    submitBtn.addEventListener("click", function () {
        let task = div.querySelector(".task-inner-container").innerText;

        // Update local storage
        let id = generateUniqueId();
        let allTickets = JSON.parse(localStorage.getItem("AllTickets")) || {};
        let ticketObj = {
            color: ticketColor,
            taskValue: task,
        };
        allTickets[id] = ticketObj;
        localStorage.setItem("AllTickets", JSON.stringify(allTickets));

        // Create new ticket element and add it to the grid
        let ticketDiv = document.createElement("div");
        ticketDiv.classList.add("ticket");
        ticketDiv.setAttribute("data-id", id);
        ticketDiv.innerHTML = `<div data-id="${id}" class="ticket-color ${ticketColor}"></div>
                               <div class="ticket-id">#${id}</div>
                               <div data-id="${id}" class="actual-task" contenteditable="true">${task}</div>`;

        // ... (Add event listeners for updating and deleting tasks)

        grid.append(ticketDiv);

        // Remove the modal after task addition
        div.remove();
    });

    body.append(div);
});

function loadTasks(color) {
    let ticketsOnUi = document.querySelectorAll(".ticket");

    for (let i = 0; i < ticketsOnUi.length; i++) {
        ticketsOnUi[i].remove();
    }

    let allTickets = JSON.parse(localStorage.getItem("AllTickets"));

    for (x in allTickets) {
        let currTicketId = x;
        let singleTicketObj = allTickets[x];

        if (color) {
            if (color != singleTicketObj.color) continue;
        }

        let ticketDiv = document.createElement("div");
        ticketDiv.classList.add("ticket");
        ticketDiv.setAttribute("data-id", currTicketId);
        ticketDiv.innerHTML = `<div data-id="${currTicketId}" class="ticket-color ${singleTicketObj.color}"></div>
                               <div class="ticket-id">#${currTicketId}</div>
                               <div data-id="${currTicketId}" class="actual-task" contenteditable="true">${singleTicketObj.taskValue}</div>`;

        let ticketColorDiv = ticketDiv.querySelector(".ticket-color");
        let actualTaskDiv = ticketDiv.querySelector(".actual-task");

        actualTaskDiv.addEventListener("input", function (e) {
            let updatedTask = e.currentTarget.innerText;
            let currTicketId = e.currentTarget.getAttribute("data-id");
            let allTickets = JSON.parse(localStorage.getItem("AllTickets"));

            allTickets[currTicketId].taskValue = updatedTask;
            localStorage.setItem("AllTickets", JSON.stringify(allTickets));
        });

        ticketColorDiv.addEventListener("click", function (e) {
            let currTicketId = e.currentTarget.getAttribute("data-id");
            let currColor = e.currentTarget.classList[1];
            let index = colors.indexOf(currColor);
            index = (index + 1) % colors.length;
            let newColor = colors[index];
            let allTickets = JSON.parse(localStorage.getItem("AllTickets"));
            allTickets[currTicketId].color = newColor;
            localStorage.setItem("AllTickets", JSON.stringify(allTickets));
            ticketColorDiv.classList.remove(currColor);
            ticketColorDiv.classList.add(newColor);
        });

        ticketDiv.addEventListener("click", function (e) {
            if (deleteMode) {
                let currTicketId = e.currentTarget.getAttribute("data-id");
                e.currentTarget.remove();
                let allTickets = JSON.parse(localStorage.getItem("AllTickets"));
                delete allTickets[currTicketId];
                localStorage.setItem("AllTickets", JSON.stringify(allTickets));
            }
        });

        grid.append(ticketDiv);
    }
}