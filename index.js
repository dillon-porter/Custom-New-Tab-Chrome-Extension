document.addEventListener('DOMContentLoaded', () => {
    updateClockAndDate();
    updateGreeting();
    loadQuickLinks();
    loadTodoItems();
    setInterval(updateClockAndDate, 1000); // Update the clock every second
});

// Event Listeners for Adding Links and Todo Items
document.getElementById('add-link').addEventListener('click', addQuickLink);
document.getElementById('add-task').addEventListener('click', addTodoItem);
document.getElementById('go-to-google').addEventListener('click', () => {
    window.open('https://www.google.com', '_blank');
});

function addQuickLink() {
    const nameInput = document.getElementById('new-link-name');
    const urlInput = document.getElementById('new-link-url');
    createLinkElement(nameInput.value, urlInput.value);
    nameInput.value = '';
    urlInput.value = '';
    saveQuickLinks();
}

function addTodoItem() {
    const taskInput = document.getElementById('new-task');
    createTodoElement(taskInput.value);
    taskInput.value = '';
    saveTodoItems();
}

function createLinkElement(name, url) {
    if (!name || !url) return;

    const li = document.createElement('li');
    const a = document.createElement('a');
    const deleteButton = document.createElement('button');
    const updateButton = document.createElement('button');

    a.href = url;
    a.textContent = name;
    a.target = '_blank';

    updateButton.textContent = 'Update';
    updateButton.onclick = () => updateLink(a);
    deleteButton.textContent = 'Delete';
    deleteButton.onclick = () => {
        li.remove();
        saveQuickLinks();
    };

    li.appendChild(a);
    li.appendChild(updateButton);
    li.appendChild(deleteButton);
    document.getElementById('links-list').appendChild(li);
}

function createTodoElement(task) {
    if (!task) return;

    const li = document.createElement('li');
    const deleteButton = document.createElement('button');
    const updateButton = document.createElement('button');

    updateButton.textContent = 'Update';
    updateButton.onclick = () => updateTask(li);
    deleteButton.textContent = 'Delete';
    deleteButton.onclick = () => {
        li.remove();
        saveTodoItems();
    };

    li.textContent = task;
    li.appendChild(updateButton);
    li.appendChild(deleteButton);
    document.getElementById('tasks').appendChild(li);
}

function updateLink(a) {
    const newName = prompt('Enter new name:', a.textContent);
    const newUrl = prompt('Enter new URL:', a.href);
    if (newName && newUrl) {
        a.textContent = newName;
        a.href = newUrl;
        saveQuickLinks();
    }
}

function updateTask(li) {
    const newTask = prompt('Update task:', li.textContent);
    if (newTask) {
        li.firstChild.nodeValue = newTask;
        saveTodoItems();
    }
}

function saveQuickLinks() {
    const links = Array.from(document.querySelectorAll('#links-list li a')).map(a => {
        return { name: a.textContent, url: a.href };
    });
    localStorage.setItem('quickLinks', JSON.stringify(links));
}

function saveTodoItems() {
    const tasks = Array.from(document.querySelectorAll('#tasks li')).map(li => li.firstChild.nodeValue);
    localStorage.setItem('todoItems', JSON.stringify(tasks));
}

function loadQuickLinks() {
    const links = JSON.parse(localStorage.getItem('quickLinks')) || [];
    links.forEach(link => createLinkElement(link.name, link.url));
}

function loadTodoItems() {
    const tasks = JSON.parse(localStorage.getItem('todoItems')) || [];
    tasks.forEach(task => createTodoElement(task));
}

function updateClockAndDate() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const clockEmoji = "🕙";
    const amPm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const formattedTime = `${hours}:${minutes} ${amPm}`;

    document.getElementById('clock').textContent = `${clockEmoji} ${formattedTime}`;
    document.getElementById('date').textContent = `${day}/${month}/${year}`;
}

function updateGreeting() {
    const now = new Date();
    const hour = now.getHours();
    let greeting;
    let emoji;

    if (hour < 12) {
        greeting = "Good Morning";
        emoji = "🌅"; // Sun emoji
    } else if (hour < 18) {
        greeting = "Good Afternoon";
        emoji = "☀️"; // Sun emoji
    } else {
        greeting = "Good Evening";
        emoji = "🌙"; // Moon emoji
    }

    document.getElementById('greeting').textContent = `${emoji} ${greeting}!`;
}

document.getElementById('clear-lists').addEventListener('click', clearAllLists);

function clearAllLists() {
    // Clear the Quick Links from the page and local storage
    document.getElementById('links-list').innerHTML = '';
    localStorage.removeItem('quickLinks');

    // Clear the To-Do List from the page and local storage
    document.getElementById('tasks').innerHTML = '';
    localStorage.removeItem('todoItems');
}