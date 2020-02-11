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
    //Change checkmark to spinner and back after ajax call
    //var checkMark = $(fill).find("i.fas fa-check");
    //$(checkMark).css("color", "red");

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
                //
            },
            error: function () {
                alert("Save failed...")
            }
        })
}