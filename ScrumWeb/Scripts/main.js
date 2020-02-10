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
    console.log("dragStart");
    this.className += ' hold';
    setTimeout(() => (this.className = 'invisible'), 0);
}

function dragEnd() {
    console.log("dragEnd");
    this.className = 'fill';
    this.className += ' col-sm-4';
}

function dragOver(e) {
    console.log("dragOver");
    e.preventDefault();
}

function dragEnter(e) {
    console.log("dragEnter");
    e.preventDefault();
    this.className += ' hovered';
}

function dragLeave() {
    console.log("dragLeave");
    this.className = 'empty';
    this.className += ' col-sm-4';
}

function dragDrop() {
    console.log("dragDrop");
    this.className = 'empty';
    this.className += ' col-sm-4';
    this.append(fill);
}