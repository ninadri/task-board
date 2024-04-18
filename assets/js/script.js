// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;
const taskNameInputEl = $('#task-name-input');
const taskTypeInputEl = $('#task-description-input');
const taskDateInputEl = $('#due-date-input');
const taskFormEl = $('#task-form');


console.log("Retrieved taskList from localStorage:", taskList);
$('#due-date-input').datepicker(); 

// Todo: create a function to generate a unique task id
function generateTaskId() {
    let newId = nextId++;
    localStorage.setItem("nextId", JSON.stringify(nextId));
    return newId;
}

function readTasksFromStorage() {

  let tasks = JSON.parse(localStorage.getItem('tasks'));

  if (!tasks) {
    tasks = [];
  }
  return tasks;
}

function saveTasksToStorage(tasks) {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Todo: create a function to create a task card
function createTaskCard(task) {
  const taskCard = $('<div>')
      .addClass('card project-card draggable my-3')
      .attr('id', 'draggable-nonvalid')
      .attr('data-project-id', task.id)
      .attr('data-droppable-id', 'droppable');
  const cardHeader = $('<div>')
      .addClass('card-header h4')
      .text(task.name);
  const cardBody = $('<div>')
      .addClass('card-body');
  const cardDescription = $('<p>')
      .addClass('card-text').text(task.type);
  const cardDueDate = $('<p>').addClass('card-text')
      .text(task.dueDate);
  const cardDeleteBtn = $('<button>')
      .addClass('btn btn-danger delete')
      .text('Delete')
      .attr('data-project-id', task.id);
  cardDeleteBtn.on('click', handleDeleteTask);

  if (task.dueDate && task.status !== 'done') {
    const now = dayjs();
    const taskDueDate = dayjs(task.dueDate, 'DD/MM/YYYY');

    // If the task is due today, make the card yellow. If it is overdue, make it red.
    if (now.isSame(taskDueDate, 'day')) {
      taskCard.addClass('bg-warning text-white');
    } else if (now.isAfter(taskDueDate)) {
      taskCard.addClass('bg-danger text-white');
      cardDeleteBtn.addClass('border-light');
    }
  }

  cardBody.append(cardDescription, cardDueDate, cardDeleteBtn);
  taskCard.append(cardHeader, cardBody);

  return taskCard;
}


// // Todo: create a function to render the task list and make cards draggable
 function renderTaskList() {
  const tasks = readTasksFromStorage();

const todoList = $('#not-started-tasks');
 todoList.empty();

 const inProgressList = $('#in-progress-tasks');
 inProgressList.empty();

 const doneList = $('#completed-tasks');
 doneList.empty();

 todoList.append('<h3 class="text-center">To Do</h3>'); 
 inProgressList.append('<h3 class="text-center">In Progress</h3>'); 
 doneList.append('<h3 class="text-center">Done</h3>');


 for (let task of tasks) {
   if (task.status === 'to-do') {
     todoList.append(createTaskCard(task));
   } else if (task.status === 'in-progress') {
    inProgressList.append(createTaskCard(task));
   } else if (task.status === 'done') {
     doneList.append(createTaskCard(task));
   }
 }

   $('.draggable').draggable({
     opacity: 0.7,
     zIndex: 100,
     helper: function (e) {
       const original = $(e.target).hasClass('ui-draggable')
         ? $(e.target)
         : $(e.target).closest('.ui-draggable');
       return original.clone().css({
        width: original.outerWidth(),
    });
   },
   });
  }

// Todo: create a function to handle deleting a task
function handleDeleteTask() {
  const projectId = $(this).attr('data-project-id');
  const tasks = readTasksFromStorage();

  for (let i = 0; i < tasks.length; i++) { 
    if (tasks[i].id === projectId) { 
      tasks.splice(i, 1); break; } }

        
  saveTasksToStorage(tasks);
  renderTaskList();
}

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
  event.preventDefault();

  const taskName = taskNameInputEl.val().trim();
  const taskType = taskTypeInputEl.val(); 
  const taskDate = taskDateInputEl.val();

  const newTask = {
      name: taskName,
      type: taskType,
      dueDate: taskDate,
      status: 'to-do'
  };

  const tasks = readTasksFromStorage();
  tasks.push(newTask);

  saveTasksToStorage(tasks);

  renderTaskList();

  taskNameInputEl.val('');
  taskTypeInputEl.val('');
  taskDateInputEl.val('');

  $('#exampleModal').modal('hide');
}



// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
  const tasks = readTasksFromStorage();

  const projectId = ui.draggable[0].dataset.projectId;
  const newStatus = event.target.id;

  for (let task of tasks) {
    if (task.id === projectId) {
      task.status = newStatus;
    }
}

localStorage.setItem('tasks', JSON.stringify(tasks));
renderTaskList();
}

taskFormEl.on('submit', handleAddTask);
taskFormEl.on('click', '.btn-delete-project', handleDeleteTask);

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
	// jQuery Ui Droppable
  $(function() {
    $('.droppable').droppable ({
      accept: ".draggable",
      classes: {
        "ui-droppable-active": "ui-state-active",
        "ui-droppable-hover": "ui-state-hover"
      },
      drop: function(event, ui) {
        $(this)
          .addClass("ui-state-highlight")
          .find("p")
          .html("Dropped!");
      }
    });
  });

$(document).ready(function () {
  renderTaskList();

  $('#taskDueDate').datepicker({
    changeMonth: true,
    changeYear: true,
  });
});

$('#save-task').on('click', handleAddTask);

window.addEventListener('beforeunload', (event) => {
  localStorage.clear();
});


