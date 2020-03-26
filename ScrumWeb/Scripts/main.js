const fill = document.querySelector('.fill');
const empties = document.querySelectorAll('.empty');

var $counter = 0;
var $newTask = {};

//Index of task being dragged around 
var taskIndex = "";
var dragTaskID = "";

//setup
$(document).ready(function () {
    if (window.location.pathname == "/Tasks") {
        AdjustScrumBoardHeightBasedOnTasks();
        $('.fill').each(function () {
            $counter += 1;
            $newTask[($counter)] = this;
            $(this).attr('index', $counter);
            this.addEventListener('dragstart', dragStart);
            this.addEventListener('dragend', dragEnd);
        });
        setTimeout(function () {
            CheckForExpiredIteration();
        }, 750);
    }
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

function FadeScreenOnAjax(doFade) {
    if (doFade) {
        $("body").css("opacity", "0.1");
    }
    else {
        $("body").css("opacity", "1");
    }
} 

function SaveTaskWithAjax(elementToAppend) {
    FadeScreenOnAjax(true);
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

        //Identify column to set status.
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
                FadeScreenOnAjax(false);
            },
            error: function () {
                alert("Save failed...")
                FadeScreenOnAjax(false);
            }
        })
}

function DeleteTask(taskID) {
    if (confirm("Delete this task?")) {
        FadeScreenOnAjax(true);
        $.ajax
            ({
                type: "POST",
                url: "/Tasks/DeleteTask",
                dataType: "json",
                data: { TaskID: taskID },
                success: function (result) {
                    document.getElementById(taskID).remove();
                    FadeScreenOnAjax(false);
                    var trCount = $("#tasksTable tr").length;
                    if (trCount === 1) {
                        $("#tasksTable tr").html("<th>No backlog items have been created yet...</th>");
                    }
                },
                error: function () {
                    alert("Delete failed...")
                    FadeScreenOnAjax(false);
                }
            })
    } else {
        //Keep task
    }
}

function DeleteProject(projectID) {
    if (confirm("CAUTION! Deleting this project removes all associated iterations and tasks. Delete this project? ")) {
        FadeScreenOnAjax(true);
        $.ajax
            ({
                type: "POST",
                url: "/Projects/DeleteProject",
                dataType: "json",
                data: { ProjectID: projectID },
                success: function (result) {
                    document.getElementById(projectID).remove();
                    FadeScreenOnAjax(false);
                    var trCount = $("#projectsTable tr").length;
                    if (trCount === 1) {
                        $("#projectsTable tr").html("<th>No projects have been created yet...</th>");
                    }

                },
                error: function () {
                    alert("Delete failed...")
                    FadeScreenOnAjax(false);
                }
            })
    } else {
        //Keep task
    }
}

function DeleteIteration(iterationID) {
    if (confirm("Delete this iteration?")) {
        FadeScreenOnAjax(true);
        $.ajax
            ({
                type: "POST",
                url: "/Iterations/DeleteIteration",
                dataType: "json",
                data: { IterationID: iterationID },
                success: function (result) {
                    document.getElementById(iterationID).remove();
                    FadeScreenOnAjax(false);
                    var trCount = $("#iterationsTable tr").length;
                    if (trCount === 1) {
                        $("#iterationsTable tr").html("<th>No iterations have been created yet...</th>");
                    }

                },
                error: function () {
                    alert("Delete failed...")
                    FadeScreenOnAjax(false);
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

function CheckForExpiredIteration() {
    // Check if current iteration has expired
    var currentIterationEndDateAsString = $("#currentIteration").val();
    var bits = currentIterationEndDateAsString.split(/\D/);
    var currentIterationEndDateAsDate = new Date(bits[2], --bits[1], bits[0]);
    var today = new Date();

    if (currentIterationEndDateAsDate < today) {
        var result = confirm('Your current iteration has ended or no iteration has been created yet. Create a new iteration and move tasks to that iteration? (Tasks marked as done in this iteration will be moved to "Finished tasks" and unfinished tasks to the new iteration.)');
        if (result == true) {
            //Create new template iteration
            var newIterationTemplateID = CreateTemplateIteration();
            console.log(newIterationTemplateID); //DOES NOT GET ID!
            //Move tasks from current iteration to new template iteration
            MoveTasks(newIterationTemplateID);

            //Redirect to new template iteration. 
            window.location.href = '/Iterations/Edit/' + newIterationTemplateID;
        }
        else {
            // Cancel clicked. Allows user to make final changes before
            // moving on to a new iteration. 
        }
    }
}

// create a new template iteration with ajax
function CreateTemplateIteration() {
   FadeScreenOnAjax(false);
   var msg = "";
   $.ajax({
       contentType: 'application/json; charset=utf-8',
       dataType: 'json',
       type: 'POST',
       async: false,  
       url: '/Iterations/CreateTemplateIteration',
       data: "",
       success: function (data) {
           FadeScreenOnAjax(false);
           msg = data.Msg;
       },
       error: function () {
           FadeScreenOnAjax(false);
       }
   })
   return msg;
}

// move tasks in current iteration to new template 
// iteration and finished tasks to log of finished tasks
function MoveTasks(newIterationTemplateID) {
    FadeScreenOnAjax(true);
    var tasksArr = new Array();

    $("#todoColumn").find(".fill").each(function () {
        tasksArr.push(this.id);
    });
    $("#inprogressColumn").find(".fill").each(function () {
        tasksArr.push(this.id);
    });
    $("#doneColumn").find(".fill").each(function () {
        tasksArr.push(this.id);
    });

    $.ajax({
        type: "POST",
        url: "/Tasks/MoveTasks",
        async: false,  
        data: { tasksArr: tasksArr, newIterationTemplateID: newIterationTemplateID },
        success: function (data) {
            FadeScreenOnAjax(false);
        },
        dataType: "json",
        traditional: true,
        error: function () {
            FadeScreenOnAjax(false);
        }
    });
}