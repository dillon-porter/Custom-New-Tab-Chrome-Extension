// DOM elements cached for repeated use
const themeCheckbox = document.getElementById('theme-checkbox');
const themeIcon = document.getElementById('theme-icon');
const themeToggleText = document.getElementById('theme-toggle-text');
const linksList = document.getElementById('links-list');
const tasksList = document.getElementById('tasks');

// Initialize the extension
document.addEventListener('DOMContentLoaded', initExtension);

function initExtension() {
    updateClockAndDate();
    updateGreeting();
    loadQuickLinks();
    loadTodoItems();
    setInterval(updateClockAndDate, 1000);
    initTheme();

    // Event listeners
    themeCheckbox.addEventListener('change', handleThemeChange);
    document.getElementById('add-link').addEventListener('click', addQuickLink);
    document.getElementById('add-task').addEventListener('click', addTodoItem);
    document.getElementById('go-to-google').addEventListener('click', () => window.open('https://www.google.com', '_blank'));
    document.getElementById('clear-lists').addEventListener('click', clearAllLists);
    linksList.addEventListener('click', handleLinkAction);
    tasksList.addEventListener('click', handleTaskAction);
}

function initTheme() {
    const savedTheme = localStorage.getItem('selectedTheme') || 'light';
    updateThemeUI(savedTheme === 'dark');
    changeTheme(savedTheme);
}

function updateThemeUI(isDark) {
    themeCheckbox.checked = isDark;
    themeIcon.textContent = isDark ? '🌜' : '🌞';
    themeToggleText.textContent = isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode';
}

function changeTheme(theme) {
    document.body.classList.toggle('theme-night', theme === 'dark');
    document.body.classList.toggle('theme-light', theme !== 'dark');
    localStorage.setItem('selectedTheme', theme);
}

function handleThemeChange() {
    const isDark = themeCheckbox.checked;
    updateThemeUI(isDark);
    changeTheme(isDark ? 'dark' : 'light');
}

function addQuickLink() {
    const nameInput = document.getElementById('new-link-name');
    const urlInput = document.getElementById('new-link-url');
    if (nameInput.value && validateURL(urlInput.value)) {
        createLinkElement(nameInput.value, urlInput.value);
        nameInput.value = '';
        urlInput.value = '';
        saveQuickLinks();
    } else {
        alert('Please enter a valid URL.');
    }
}

function validateURL(url) {
    const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(url);
}

function addTodoItem() {
    const taskInput = document.getElementById('new-task');
    if (taskInput.value) {
        createTodoElement(taskInput.value);
        taskInput.value = '';
        saveTodoItems();
    }
}

function createLinkElement(name, url) {
    const li = document.createElement('li');
    li.innerHTML = `<a href="${url}" target="_blank">${name}</a>
                    <button class="update-link">Update</button>
                    <button class="delete-link">Delete</button>`;
    linksList.appendChild(li);
}

function createTodoElement(task) {
    const li = document.createElement('li');
    li.innerHTML = `${task}
                    <button class="update-task">Update</button>
                    <button class="delete-task">Delete</button>`;
    tasksList.appendChild(li);
}

function handleLinkAction(event) {
    if (event.target.className === 'delete-link') {
        event.target.parentElement.remove();
        saveQuickLinks();
    } else if (event.target.className === 'update-link') {
        updateLink(event.target.previousElementSibling);
    }
}

function handleTaskAction(event) {
    if (event.target.className === 'delete-task') {
        event.target.parentElement.remove();
        saveTodoItems();
    } else if (event.target.className === 'update-task') {
        updateTask(event.target.parentElement);
    }
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
    const newTask = prompt('Update task:', li.childNodes[0].nodeValue);
    if (newTask) {
        li.childNodes[0].nodeValue = newTask;
        saveTodoItems();
    }
}

function saveQuickLinks() {
    const links = Array.from(linksList.querySelectorAll('a')).map(a => ({ name: a.textContent, url: a.href }));
    localStorage.setItem('quickLinks', JSON.stringify(links));
}

function saveTodoItems() {
    const tasks = Array.from(tasksList.childNodes).map(li => li.childNodes[0].nodeValue);
    localStorage.setItem('todoItems', JSON.stringify(tasks));
}

function loadQuickLinks() {
    const links = JSON.parse(localStorage.getItem('quickLinks')) || [];
    links.forEach(link => createLinkElement(link.name, link.url));
}

function loadTodoItems() {
    const tasks = JSON.parse(localStorage.getItem('todoItems')) || [];
    tasks.forEach(createTodoElement);
}

function updateClockAndDate() {
    const now = new Date();
    const formattedTime = formatTime(now);
    const formattedDate = formatDate(now);

    document.getElementById('clock').textContent = `🕙 ${formattedTime}`;
    document.getElementById('date').textContent = formattedDate;
}

function formatTime(date) {
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const amPm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${amPm}`;
}

function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

function updateGreeting() {
    const now = new Date();
    const hour = now.getHours();
    const [greeting, emoji] = getGreetingAndEmoji(hour);

    document.getElementById('greeting').textContent = `${emoji} ${greeting}!`;
}

function getGreetingAndEmoji(hour) {
    if (hour < 12) {
        return ["Good Morning", "🌅"];
    } else if (hour < 18) {
        return ["Good Afternoon", "☀️"];
    } else {
        return ["Good Evening", "🌙"];
    }
}

function clearAllLists() {
    clearList(linksList, 'quickLinks');
    clearList(tasksList, 'todoItems');
}

function clearList(listElement, storageKey) {
    while (listElement.firstChild) {
        listElement.removeChild(listElement.firstChild);
    }
    localStorage.removeItem(storageKey);
}