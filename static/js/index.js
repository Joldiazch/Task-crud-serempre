window.onload = function() {
    // set Graphql query to get all task stored on DB
    let Query = {
        query : `
        {
            allTasks{
              id
              title
              description
              estimatedTime
              workedTime
              latitude
              longitude
              finished
            }
        }
        `
    }

    // request for get data. is using POST methos because is a graphql query 
    fetch("http://localhost/graphql/", {
        method: "POST",
        body: JSON.stringify(Query),
        headers: new Headers({
            'Content-Type': 'application/json',
        })
    }).then(r => r.json())
    .then(res => {
        // using data for populate with li elements to ulElemenet on html document
        let ulElement = document.querySelector("#task-list");
        var tasks = res?.data?.allTasks;
        tasks.map((task) => {
            ulElement.insertAdjacentHTML(
                'beforeend',
                `
                <li id="task-${task.id}">
                    <div class="container form-check ${task?.finished ? "completed" : ""}">
                        <div class="row">
                            <div class="col-sm-1 form-check-label">
                                <input class="checkbox" type="checkbox" id="taskInput-${task.id}" onclick="handleCheck(${task.id})" ${ task?.finished ? "checked" : ""}>
                                <i class="input-helper"></i>
                            </div>
                            <div class="col-sm" data-bs-toggle="modal" data-bs-target="#updateModal" data-task-id="${task.id}" style="cursor: pointer;">
                                ${task?.title}
                            </div>
                            <div class="col-sm" data-bs-toggle="modal" data-bs-target="#updateModal" data-task-id="${task.id}" style="cursor: pointer;">
                                ${truncateString(task?.description, 32)}
                            </div>
                            <div class="col-sm-1" data-bs-toggle="modal" data-bs-target="#updateModal" data-task-id="${task.id}" style="cursor: pointer;">
                                ${task?.estimatedTime - task?.workedTime}
                            </div>
                        </div>
                    </div>
                    <i class="remove far fa-times" onclick="deleteTask(${task.id})"></i>
                </li>
                `
            );
        });
    });
}

function handleCheck(taskId) {
    /*
    * Function for handler checkboxes, if an li is selected
    * then we send a grphql mutation for storage this action (close or finish task) in DB 
     */
    let inputElement = document.querySelector(`#taskInput-${taskId}`);
    let Mutation = {
        query : `
            mutation{
                updateTask(input:{
                    id: ${taskId}
                    finished: ${inputElement.checked}
                }){
                    ok
                }
            }
        `
    }
    fetch("http://localhost/graphql/", {
        method: "POST",
        body: JSON.stringify(Mutation),
        headers: new Headers({
            'Content-Type': 'application/json',
        })
    }).then(r => r.json())
    .then(res => {
        console.log(res)
        if (res?.data?.updateTask?.ok) {
            if (inputElement.checked) {
                document.querySelector(`#task-${taskId} div`).classList.add("completed");
            } else {
                document.querySelector(`#task-${taskId} div`).classList.remove("completed");
            }
            
        } else {
            alert("No is posible this action")
        }
    });
}


function truncateString(str, num) {
    if (str.length <= num) {
        console.log(str)
      return str
    }
    // Return str truncated with '...' concatenated to the end of str.
    return str.slice(0, num) + '...'
}
  
var updateModal = document.getElementById('updateModal')
updateModal.addEventListener('show.bs.modal', function (event) {
    /* Handle Update task modal formpopulate this with respective task
    *  information
    */

    // Element that triggered the modal
    var element = event.relatedTarget
    // Extract info from data-* attributes
    var taskId = element.getAttribute('data-task-id')

    // Query for get especific task with taskId
    let Query = {
        query : `
        {
            task(taskId: ${taskId}){
                id
                title
                description
                estimatedTime
                workedTime
                latitude
                longitude
                finished
            }
            }
        `
    }

    // request for get data
    fetch("http://localhost/graphql/", {
        method: "POST",
        body: JSON.stringify(Query),
        headers: new Headers({
            'Content-Type': 'application/json',
        })
    }).then(r => r.json())
    .then(res => {
        /* Populate modasl with task data  
        */

        var task = res?.data?.task;
        // Update the modal's content.
        //var modalTitle = updateModal.querySelector('.modal-title')
        var titleInput = updateModal.querySelector('.modal-body form input[id="title"]')
        var descriptionInput = updateModal.querySelector('.modal-body form textarea')
        var estimatedTimeInput = updateModal.querySelector('.modal-body form input[id="estimatedTime"]')
        var workedTimeInput = updateModal.querySelector('.modal-body form input[id="workedTime"]')
        var timeLeftInput = updateModal.querySelector('.modal-body form input[id="timeLeft"]')
        var latitudeInput = updateModal.querySelector('.modal-body form input[id="latitude"]')
        var longitudeInput = updateModal.querySelector('.modal-body form input[id="longitude"]')
        var submitButton = updateModal.querySelector('.modal-footer button[name="save"]')

        titleInput.value = task.title
        descriptionInput.textContent = task.description
        estimatedTimeInput.value = task.estimatedTime
        workedTimeInput.value = task.workedTime
        timeLeftInput.value = task.estimatedTime - task.workedTime
        latitudeInput.value = task.latitude
        longitudeInput.value = task.longitude
        
        // Save changes
        submitButton.onclick = function () {
            /*
            * Function that Save all changes on a specific task
            */

            // Mutation for update task 
            let Mutation = {
                query : `
                    mutation{
                        updateTask(input:{
                            id: ${task.id}
                            title: "${titleInput.value}"
                            description: "${descriptionInput.value}"
                            estimatedTime: ${estimatedTimeInput.value === "" ? 0 : parseFloat(estimatedTimeInput.value)}
                            workedTime: ${workedTimeInput.value === "" ? 0 : parseFloat(workedTimeInput.value)}
                        }){
                            ok
                        }
                    }
                `
            }
            // request for save new data
            fetch("http://localhost/graphql/", {
                method: "POST",
                body: JSON.stringify(Mutation),
                headers: new Headers({
                    'Content-Type': 'application/json',
                })
            }).then(r => r.json())
            .then(res => {
                console.log(res)
                if (res?.data?.updateTask?.ok) {
                    console.log("update succes");
                    window.location.reload(true);
                } else {
                    alert("No is posible this action")
                }
            });
        }
    });
})

function enableWorkedTimeInput() {
    /* Enable worked time input for 5 secund */
    updateModal.querySelector('.modal-body form input[id="workedTime"]').disabled = false;
    setTimeout(() => {
        updateModal.querySelector('.modal-body form input[id="workedTime"]').disabled = true;
    }, 5000)
}

function deleteTask(taskId) {
    let Mutation = {
        query : `
        mutation{
            deleteTask(input: {
                id: ${taskId}
            }){
                ok
            }
        }
        `
    }
    fetch("http://localhost/graphql/", {
        method: "POST",
        body: JSON.stringify(Mutation),
        headers: new Headers({
            'Content-Type': 'application/json',
        })
    }).then(r => r.json())
    .then(res => {
        console.log(res)
        if (res?.data?.deleteTask?.ok) {
            console.log("Delete succes");
            window.location.reload(true);
        } else {
            alert("No is posible this action")
        }
    });
}

var createTaskModal = document.getElementById('createTaskModal')
createTaskModal.addEventListener('show.bs.modal', async function (event) {
    // Element that triggered the modal
    var element = event.relatedTarget
    // Extract info from input
    var createTaskTitleInput = document.getElementById("createTaskInputTitle");
    var titleInput = createTaskModal.querySelector('.modal-body form input[id="create-title"]')
    var descriptionInput = createTaskModal.querySelector('.modal-body form textarea')
    var estimatedTimeInput = createTaskModal.querySelector('.modal-body form input[id="create-estimatedTime"]')
    titleInput.value = createTaskTitleInput.value;
    createTaskTitleInput.value = "";

    let locationData = await fetch("https://demo.waterlinked.com/api/v1/position/global").then(r => r.json())
    console.log(locationData.lat)

    var createButton = createTaskModal.querySelector('.modal-footer button[name="create"]')

    createButton.onclick = function () {
        let Mutation = {
            query : `
            mutation{
                createTask(input: {
                  title: "${titleInput.value}"
                  description: "${descriptionInput.value}"
                  estimatedTime: ${estimatedTimeInput.value}
                  latitude: ${locationData.lat}
                  longitude: ${locationData.lon}
                }){
                  ok
                }
            }
             `
        }

        fetch("http://localhost/graphql/", {
            method: "POST",
            body: JSON.stringify(Mutation),
            headers: new Headers({
                'Content-Type': 'application/json',
            })
        }).then(r => r.json())
        .then(res => {
            console.log(res)
            if (res?.data?.createTask?.ok) {
                console.log("Create succes");
                window.location.reload(true);
            } else {
                alert("No is posible this action")
            }
        });
    }
})
