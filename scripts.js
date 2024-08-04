document.addEventListener('DOMContentLoaded', () => {
    const scheduleForm = document.getElementById('scheduleForm');
    const classList = document.getElementById('classList');
    const classSearch = document.getElementById('classSearch');
    const taskForm = document.getElementById('taskForm');
    const taskList = document.getElementById('taskList');
    const taskSearch = document.getElementById('taskSearch');

    loadFromLocalStorage();

    scheduleForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const className = document.getElementById('className').value;
        const classTime = document.getElementById('classTime').value;
        addClass(className, classTime);
        saveToLocalStorage();
        scheduleForm.reset();
    });

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const taskName = document.getElementById('taskName').value;
        const taskDate = document.getElementById('taskDate').value;
        const taskPriority = document.getElementById('taskPriority').value;
        addTask(taskName, taskDate, taskPriority);
        saveToLocalStorage();
        taskForm.reset();
    });

    classSearch.addEventListener('input', () => filterItems(classSearch.value, classList));
    taskSearch.addEventListener('input', () => filterItems(taskSearch.value, taskList));

    function addClass(name, time) {
        const li = createListItem(`${name} - ${time}`, () => {
            li.remove();
            saveToLocalStorage();
        });
        classList.appendChild(li);
    }

    function addTask(name, date, priority) {
        const li = createListItem(`${name} - ${date} - ${priority.charAt(0).toUpperCase() + priority.slice(1)}`, () => {
            li.remove();
            saveToLocalStorage();
        });
        taskList.appendChild(li);
    }

    function createListItem(text, onDelete) {
        const li = document.createElement('li');
        li.textContent = text;

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.className = 'edit-btn';
        editButton.addEventListener('click', () => editItem(li, onDelete));
        li.appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', onDelete);
        li.appendChild(deleteButton);

        return li;
    }

    function editItem(li, onDelete) {
        const [name, time, priority] = li.textContent.split(' - ');
        const isTask = li.parentNode.id === 'taskList';

        const inputName = document.createElement('input');
        inputName.type = 'text';
        inputName.value = name;
        const inputTime = document.createElement('input');
        inputTime.type = isTask ? 'date' : 'text';
        inputTime.value = time;

        li.innerHTML = '';
        li.appendChild(inputName);
        li.appendChild(inputTime);

        if (isTask) {
            const inputPriority = document.createElement('select');
            ['Low', 'Medium', 'High'].forEach(level => {
                const option = document.createElement('option');
                option.value = level.toLowerCase();
                option.textContent = level;
                if (level.toLowerCase() === priority.toLowerCase()) {
                    option.selected = true;
                }
                inputPriority.appendChild(option);
            });
            li.appendChild(inputPriority);
        }

        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save';
        saveButton.className = 'edit-btn';
        saveButton.addEventListener('click', () => {
            const newName = inputName.value;
            const newTime = inputTime.value;
            if (isTask) {
                const newPriority = inputPriority.value;
                li.textContent = `${newName} - ${newTime} - ${newPriority.charAt(0).toUpperCase() + newPriority.slice(1)}`;
            } else {
                li.textContent = `${newName} - ${newTime}`;
            }
            li.appendChild(editButton);
            li.appendChild(deleteButton);
            saveToLocalStorage();
        });
        li.appendChild(saveButton);

        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancel';
        cancelButton.addEventListener('click', () => {
            if (isTask) {
                li.textContent = `${name} - ${time} - ${priority}`;
            } else {
                li.textContent = `${name} - ${time}`;
            }
            li.appendChild(editButton);
            li.appendChild(deleteButton);
        });
        li.appendChild(cancelButton);
    }

    function filterItems(query, list) {
        const items = list.getElementsByTagName('li');
        Array.from(items).forEach(item => {
            const text = item.textContent.toLowerCase();
            item.style.display = text.includes(query.toLowerCase()) ? '' : 'none';
        });
    }

    function saveToLocalStorage() {
        const classes = Array.from(classList.getElementsByTagName('li')).map(li => li.textContent);
        const tasks = Array.from(taskList.getElementsByTagName('li')).map(li => li.textContent);
        localStorage.setItem('classes', JSON.stringify(classes));
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadFromLocalStorage() {
        const classes = JSON.parse(localStorage.getItem('classes')) || [];
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        classes.forEach(text => {
            const li = createListItem(text, () => {
                li.remove();
                saveToLocalStorage();
            });
            classList.appendChild(li);
        });
        tasks.forEach(text => {
            const li = createListItem(text, () => {
                li.remove();
                saveToLocalStorage();
            });
            taskList.appendChild(li);
        });
    }
});
