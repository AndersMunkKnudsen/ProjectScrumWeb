const fill = document.querySelector('.fill');
const empties = document.querySelectorAll('.empty');

// Fill listeners
fill.addEventListener('dragstart', dragStart);
fill.addEventListener('dragend', dragEnd);

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
    var taskID = $(fill).attr("id");
    var taskText = $(fill).children("textarea").val();
    var taskDesc = $(fill).children("textarea").attr("title");

    //needs updating
    var newStatus = "INPROGRESS";

    this.className += 'empty';
    this.className += ' col-sm-4';
    this.append(fill);

    SaveTaskWithAjax();
}

function SaveTaskWithAjax() {
    //$(fill).append("<div id='loading' class='spinner-border' role='status'><span class='sr-only'>Loading...</span ></div >");

    var taskID = $(fill).attr("id");
    var taskText = $(fill).children("textarea").val();
    var taskDesc = $(fill).children("textarea").attr("title");
    var newStatus = "";

    if ($(fill).parent().hasClass("todoColumn")) {
        newStatus = "TODO";
    }
    else if ($(fill).parent().hasClass("inprogressColumn")) {
        newStatus = "INPROGRESS";
    }
    else if ($(fill).parent().hasClass("doneColumn")) {
        newStatus = "DONE";
    }

    $.ajax
        ({
            type: "POST",
            url: "/Tasks/SaveOnDrop",
            dataType: "json",
            data: { TaskID: taskID, TaskName: taskText, TaskDescription: taskDesc, TaskStatus: newStatus },
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
                        $("#tasksTable tr").html("<th>No projects have been created yet...</th>");
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