![when user first opens page](images/firstPage.png)


![when user clicks on Add task, a modal will appear](images/AddTitle.png)

![when user saves input, it will create a task card that is draggable and droppable](images/dragAndDrop.png)


I received help from Chipo in the AskLearn is Slack. The code he gave me that fixed mine is below
" $('.lane').droppable({
  accept: '.draggable',
  drop: handleDrop 
}); "

" for (let task of tasks) {
    if (task.id === parseInt(projectId)) {
      task.status = newStatus;
    }
  }  "