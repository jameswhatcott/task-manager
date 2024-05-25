// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Todo: create a function to generate a unique task id
function generateTaskId() {
    return `task-${Date.now()}`
}

// Todo: create a function to create a task card
function createTaskCard(task) {

        const taskCards = []

        task.forEach((card) => {
                const today = dayjs();
                const taskDates = dayjs(card.date);                
                let dateClass = '';

                if(taskDates.isSame(today, "day")) {
                dateClass = "warn"
                } else if  (taskDates.isBefore(today)){
                dateClass = 'late'
                }
    
            const taskCard = `
                <div class="task-card ${dateClass}" id="${card.id}">
                    <header>Add Task</header>
                    <div class="inputs">
                        <div>
                            ${card.title}   
                        </div>
                        <div>
                            ${card.date} 
                        </div>      
                    </div>
                    <div class="description-section">
                        ${card.description}
                    </div>
                        <button class="delete-task">delete</button>   
                </div>
                `;
            const cardEl = $(taskCard)

            taskCards.push(cardEl)

        });


        return taskCards
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
   $('#todo-cards').empty();
   $('#in-progress-cards').empty();
   $('#done-cards').empty();

   const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
   console.log(tasks)
  

   tasks.forEach(task => {
    console.log(task)
    const taskCard = createTaskCard([task])[0];
    console.log(taskCard)
    console.log(task.lane)
    switch(task.lane) {
        case 'to-do': 
            $('#todo-cards').append(taskCard);
            break;
        case 'in-progress': 
            $('#in-progress-cards').append(taskCard);
            break;
        case 'done': 
            $('#done-cards').append(taskCard);
            break;
    }
   
   });   
    
}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
    event.preventDefault();
    const taskTitle = $('#task-input').val();
    const taskDate = $('#task-date').val();
    const taskDescription = $('#description').val()
    const taskLane = 'to-do'

    const newTask = {
        id: generateTaskId(),
        title: taskTitle,
        date: taskDate,
        description: taskDescription,
        lane: taskLane
    };

    taskList.push(newTask)
    localStorage.setItem('tasks', JSON.stringify(taskList));
    createTaskCard(taskList)
    renderTaskList()
    $('#formModal').modal('hide');

    $('#task-input').val('');
    $('#task-date').val('');
    $('#description').val('');
    document.location.reload()
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
    event.preventDefault();
    const taskId = $(this).closest('.task-card').attr('id')
       $(`#${taskId}`).remove();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    event.preventDefault();
    const taskId = ui.draggable.attr('id');
    const laneId = $(this).attr("id");

    // Find the original task card in the DOM
    const originalCard = $(`#${taskId}`);

    // Append the original task card to the new lane
    $(this).append(originalCard);

    // Update the task's lane property
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.lane = laneId;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        document.location.reload()// Re-render the task list to reflect the changes
    }
}
     




// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    $('#add-task').on('click',  handleAddTask);
    
    renderTaskList()

    $('.delete-task').on('click', handleDeleteTask);

    $('.task-card').draggable({
        revert: 'invalid',
        containment: 'document',
      // Clone the element being dragged
    });
    
    // Droppable configuration
    $('.lane').droppable({
        accept: '.task-card',
        drop: handleDrop
        
    });

});



