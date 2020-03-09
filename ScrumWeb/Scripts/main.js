const fill = document.querySelector('.fill');
const empties = document.querySelectorAll('.empty');

var $counter = 0;
var $newTask = {};

//Index of task being dragged around 
var taskIndex = "";
var dragTaskID = "";

//setup
$(document).ready(function () {
    AdjustScrumBoardHeightBasedOnTasks();
    $('.fill').each(function () {
        $counter += 1;
        $newTask[($counter)] = this;
        $(this).attr('index', $counter);
        this.addEventListener('dragstart', dragStart);
        this.addEventListener('dragend', dragEnd);
    });
});

$("#IterationProjectID").addClass("form-control");
$("#AllProjects").addClass("form-control");
$("select").addClass("form-control");

// Loop through empty boxes and add listeners
for (const empty of empties) {
    empty.addEventListener('dragover', dragOver);
    empty.addEventListener('dragenter', dragEnter);
    empty.addEventListener('dragleave', dragLeave);
    empty.addEventListener('drop', dragDrop);
}

// Drag Functions

function dragStart() {
    this.className += ' hold';
    taskIndex = $(this).attr('index');
    dragTaskID = $(this).attr('id');
    setTimeout(() => (this.className = 'invisible'), 0);
}

function dragEnd() {
    this.className = 'fill';
    this.className += ' col-sm-4';
}

function dragOver(e) {
    e.preventDefault();
}

function dragEnter(e) {
    e.preventDefault();
    this.className += ' hovered';
}

function dragLeave() {
    this.className = 'empty';
    this.className += ' col-sm-4';
}

function dragDrop() {
    this.className += 'empty';
    this.className += ' col-sm-4';
    console.log(dragTaskID);
    var elementToAppend = document.getElementById(dragTaskID);
    this.append(elementToAppend);
    SaveTaskWithAjax(elementToAppend);
}

function SaveTaskWithAjax(elementToAppend) {

    //declare variables
    var taskID = $(elementToAppend).attr("id");
    var taskText = $(elementToAppend).children("textarea").val();
    var taskDesc = $(elementToAppend).children("textarea").attr("title");
    var taskUser = $(elementToAppend).attr("data-user");
    var taskIteration = $(elementToAppend).attr("data-iteration");

    var newStatus = "";

    if (elementToAppend === undefined) {
    //triggered if called from scrumboard checkmark
        taskID = $(fill).attr("id");
        taskText = $(fill).children("textarea").val();
        taskDesc = $(fill).children("textarea").attr("title");
        taskUser = $(fill).attr("data-user");
        taskIteration = $(fill).attr("data-iteration");

        //Identify column to set status
        if ($(fill).parent().attr("id") === "todoColumn") {
            newStatus = "TODO";
        }
        else if ($(fill).parent().attr("id") === "inprogressColumn") {
            newStatus = "INPROGRESS";
        }
        else if ($(fill).parent().attr("id") === "doneColumn") {
            newStatus = "DONE";
        }
    }
    else {
    //triggered from moving
        taskID = $(elementToAppend).attr("id");
        taskText = $(elementToAppend).children("textarea").val();
        taskDesc = $(elementToAppend).children("textarea").attr("title");
        taskUser = $(elementToAppend).attr("data-user");
        taskIteration = $(elementToAppend).attr("data-iteration");

        if ($(elementToAppend).parent().attr("id") === "todoColumn") {
            newStatus = "TODO";
        }
        else if ($(elementToAppend).parent().attr("id") === "inprogressColumn") {
            newStatus = "INPROGRESS";
        }
        else if ($(elementToAppend).parent().attr("id") === "doneColumn") {
            newStatus = "DONE";
        }
    }

    $.ajax
        ({
            type: "POST",
            url: "/Tasks/SaveWithAjax",
            dataType: "json",
            data: { TaskID: taskID, TaskName: taskText, TaskDescription: taskDesc, TaskStatus: newStatus, TaskAssignedToUser: taskUser, IterationID: taskIteration },
            success: function (result) {
            },
            error: function () {
                alert("Save failed...")
            }
        })
}

function DeleteTask(taskID) {
    if (confirm("Delete this task?")) {
        $.ajax
            ({
                type: "POST",
                url: "/Tasks/DeleteTask",
                dataType: "json",
                data: { TaskID: taskID },
                success: function (result) {
                    document.getElementById(taskID).remove();
                    var trCount = $("#tasksTable tr").length;
                    if (trCount === 1) {
                        $("#tasksTable tr").html("<th>No backlog items have been created yet...</th>");
                    }
                },
                error: function () {
                    alert("Delete failed...")
                }
            })
    } else {
        //Keep task
    }
}

function DeleteProject(projectID) {
    if (confirm("Delete this project?")) {
        $.ajax
            ({
                type: "POST",
                url: "/Projects/DeleteProject",
                dataType: "json",
                data: { ProjectID: projectID },
                success: function (result) {
                    document.getElementById(projectID).remove();
                    var trCount = $("#projectsTable tr").length;
                    if (trCount === 1) {
                        $("#projectsTable tr").html("<th>No projects have been created yet...</th>");
                    }

                },
                error: function () {
                    alert("Delete failed...")
                }
            })
    } else {
        //Keep task
    }
}

function DeleteIteration(iterationID) {
    if (confirm("Delete this iteration?")) {
        $.ajax
            ({
                type: "POST",
                url: "/Iterations/DeleteIteration",
                dataType: "json",
                data: { IterationID: iterationID },
                success: function (result) {
                    document.getElementById(iterationID).remove();
                    var trCount = $("#iterationsTable tr").length;
                    if (trCount === 1) {
                        $("#iterationsTable tr").html("<th>No iterations have been created yet...</th>");
                    }

                },
                error: function () {
                    alert("Delete failed...")
                }
            })
    } else {
        //Keep task
    }
}

function AdjustScrumBoardHeightBasedOnTasks() {
    var taskCount = $('.fill').length;
    var setHeight = 215 * taskCount;
    $('.empty').css('min-height', setHeight + 'px');
}