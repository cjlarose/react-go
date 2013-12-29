var Board = function(size) {
    this.current_color = Board.BLACK;
    this.size = size;
    this.board = this.create_board(size);
};

Board.EMPTY = 0;
Board.BLACK = 1;
Board.WHITE = 2;

Board.prototype.create_board = function(size) {
    var m = [];
    for (var i = 0; i < size; i++) {
        m[i] = [];
        for (var j = 0; j < size; j++)
            m[i][j] = Board.EMPTY;
    }
    return m;
};

Board.prototype.play = function(i, j) {
    console.log("Played at " + i + ", " + j);   
    this.board[i][j] = this.current_color;
    $(this).trigger("update");
    this.current_color = this.current_color == Board.BLACK ? Board.WHITE : Board.BLACK;
};

Board.prototype.get_adjacent_intersections = function(i , j) {
    var neighbors = []; 
    if (i > 0)
        neighbors.push([i - 1, j]);
    if (j < this.size - 1)
        neighbors.push([i, j + 1]);
    if (i < this.size - 1)
        neighbors.push([i + 1, j]);
    if (j > 0)
        neighbors.push([i, j - 1]);
    return neighbors;
};

Board.prototype.count_liberties = function(i, j) {

    var color = this.board[i][j];
    if (color == Board.EMPTY)
        return null;

    var visited = {};
    var queue = [[i, j]];
    var count = 0;

    while (queue.length > 0) {
        var node = queue.pop();
        if (visited[node])
            continue;

        var neighbors = this.get_adjacent_intersections(node[0], node[1]);
        for (var n = 0; n < neighbors.length; n++) {
            var state = this.board[neighbors[n][0]][neighbors[n][1]];
            if (state == Board.EMPTY)
                count++;
            if (state == color)
                queue.push([neighbors[n][0], neighbors[n][1]]);
        }

        visited[node] = true;
    }

    return count;
};
