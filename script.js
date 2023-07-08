var cols, rows;
var w = 40;
var grid = [];
var current;

var stack = [];

function setup() {
    createCanvas(400,400);
    frameRate(5);
    cols = floor(width / w);
    rows = floor(height / w);

    for(var j = 0; j < rows; j++) {
        for(var i = 0; i < cols; i++) {
            var cell = new Cell(i,j);
            grid.push(cell);
        }
    }

    current = grid[20];
}

function draw() {
    background(44, 47, 51);

    for(var i = 0; i < grid.length; i++) {
        grid[i].show();
    }

    current.visited = true;
    var next = current.checkNeighbours();
    if(next) {
        stack.push(current);
        next.visited = true;
        removeWall(current, next);
        current = next;
    } else if(stack.length > 0) {
        current = stack.pop();
    }
    // in the else condition is where the backtracing happens. i push onto a stack the current pos each time i go forward. i pop the top
    // of the stack and go there to backtrace.
}

function index(i, j) {
    if(i < 0 || i > cols - 1 || j < 0 || j > rows - 1)
        return -1;
    return i + j * cols;
}

function removeWall(current, next) {
    var i = current.i - next.i;
    var j = current.j - next.j;
    if(i === 0 && j === 1) {
        current.walls[0] = false;
        next.walls[2] = false;
    }
    if(i === -1 && j === 0) {
        current.walls[1] = false;
        next.walls[3] = false;
    }
    if(i === 0 && j === -1) {
        current.walls[2] = false;
        next.walls[0] = false;
    }
    if(i === 1 && j === 0) {
        current.walls[3] = false;
        next.walls[1] = false;
    }
}

function Cell(i, j) {
    this.i = i;
    this.j = j;
    this.walls = [true, true, true, true]; //top right bottom left
    this.visited = false; 

    this.show = function() {
        var x = this.i * w;
        var y = this.j * w;
        stroke(35, 39, 42);
        strokeWeight(1);
        if(this.walls[0]) {
            line(x,y,x + w, y);
        }
        if(this.walls[1]) {
            line(x + w,y, x + w, y + w);
        }
        if(this.walls[2]) {
            line(x + w,y + w, x, y + w);
        }
        if(this.walls[3]) {
            line(x, y + w, x, y);
        }
        if(this.visited) {
            noStroke();
            fill(114, 137, 218);
            rect(x, y, w, w);
        }
        // we need a function which checks if cells nearby have been visited.
        // we need to call that function in show to update the value of walls
    }

    this.checkNeighbours = function() {
        //we need to check for (pos = j * cols + i) 
        //grid[pos + 1], grid[pos - 1], grid[pos + cols], grid[pos - cols] 
        //and change the wall values for the current cell and the respective cells.
        var neighbours = [];

        var top = grid[index(i,j - 1)];
        var right = grid[index(i + 1, j)];
        var bottom = grid[index(i, j + 1)];
        var left = grid[index(i - 1, j)];

        if(top && !top.visited)
            neighbours.push(top);
        if(right && !right.visited)
            neighbours.push(right);
        if(bottom && !bottom.visited)
            neighbours.push(bottom);
        if(left && !left.visited)
            neighbours.push(left);
        
        if(neighbours.length > 0) {
            var r = floor(random(0, neighbours.length));
            return neighbours[r];
        } else {
            return undefined;
        }
    }
}