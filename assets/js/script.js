// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;
const myModal = document.getElementById('exampleModal');
const myInput = document.getElementById('task-title');

// Todo: create a function to generate a unique task id
function generateTaskId() {
    let newId = nextId++;
    localStorage.setItem("nextId", JSON.stringify(nextId));
    return newId;
  }


function readProjectsFromStorage() {
let projects = JSON.parse(localStorage.getItem('projects'));

if (!projects) {
    projects = [];
  }
  return projects;
}

function saveProjectsToStorage(projects) {
  localStorage.setItem('projects', JSON.stringify(projects));
}

// Todo: create a function to create a task card
function createTaskCard(task) {
  const taskCard = $('<div>')
      .addClass('card project-card draggable my-3')
      .attr('data-project-id', task.id);
  const cardHeader = $('<div>').addClass('card-header h4').text(task.name);
  const cardBody = $('<div>').addClass('card-body');
  const cardDescription = $('<p>').addClass('card-text').text(task.type);
  const cardDueDate = $('<p>').addClass('card-text').text(task.dueDate);
  const cardDeleteBtn = $('<button>')
      .addClass('btn btn-danger delete')
      .text('Delete')
      .attr('data-project-id', task.id);
  cardDeleteBtn.on('click', handleDeleteTask);

  // Sets the card background color based on due date. Only apply the styles if the dueDate exists and the status is not done.
  if (task.dueDate && task.status !== 'Completed') {
      const now = dayjs();
      const taskDueDate = dayjs(task.dueDate, 'YYYY-MM-DD');

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


// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
  taskList.forEach(task => {
      const taskCard = createTaskCard(task);
      if (task.status === 'Not Yet Started') {
          $('#not-started-tasks').append(taskCard);
      } else if (task.status === 'In Progress') {
          $('#in-progress-tasks').append(taskCard);
      } else if (task.status === 'Completed') {
          $('#completed-tasks').append(taskCard);
      }
  });

  // Make task cards draggable
  $('.draggable').draggable({
      revert: true, 
      cursor: 'move' 
  });
}
}

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
  event.preventDefault();

  const projectName = $('#task-title').val().trim();
  const projectType = $('#task-desciption').val().trim();
  const projectDate = $('#due-date').val().trim();

  const newTask = {
      id: generateTaskId(),
      name: projectName,
      type: projectType,
      dueDate: projectDate,
      status: 'Not Yet Started'
  };

  taskList.push(newTask);
  localStorage.setItem("tasks", JSON.stringify(taskList));

  renderTaskList();

  $('#exampleModal').modal('hide');

  $('#task-title').val('');
  $('#task-desciption').val('');
  $('#due-date').val('');
}


// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {
  const taskId = $(this).attr('data-project-id');
  const index = taskList.findIndex(task => task.id === taskId);
  if (index !== -1) {
      taskList.splice(index, 1);
      localStorage.setItem("tasks", JSON.stringify(taskList));
      $(this).closest('.project-card').remove();
  }
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
  const taskId = ui.draggable.attr('data-project-id');
  const newStatus = $(this).attr('data-status');
  const taskIndex = taskList.findIndex(task => task.id === taskId);
  if (taskIndex !== -1) {
      taskList[taskIndex].status = newStatus;
      localStorage.setItem("tasks", JSON.stringify(taskList));
      ui.draggable.detach().appendTo($(this).find('.task-list'));
  }
}


// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker

$(document).ready(function () {
  renderTaskList();
  $('#project-form').on('submit', handleAddTask);
  $('.lane').droppable({
      accept: '.draggable',
      drop: handleDrop
  });
  $('#due-date').datepicker(); 
});

$('#save-task').on('click', handleAddTask);
