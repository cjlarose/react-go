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

    if (this.board[i][j] != Board.EMPTY)
        return;

    var color = this.board[i][j] = this.current_color;
    var captured = [];
    var neighbors = this.get_adjacent_intersections(i, j);
    var atari = false;

    var self = this;
    _.each(neighbors, function(n) {
        var state = self.board[n[0]][n[1]];
        if (state != Board.EMPTY && state != color) {
            var group = self.get_group(n[0], n[1]);
            console.log(group);
            if (group["liberties"] == 0)
                captured.push(group);
            else if (group["liberties"] == 1)
                atari = true;
        }
    });

    // detect suicide
    if (_.isEmpty(captured) && this.get_group(i, j)["liberties"] == 0) {
        this.board[i][j] = Board.EMPTY;
        console.log("suicide");
        return;
    }

    var self = this;
    _.each(captured, function(group) {
        _.each(group["nodes"], function(node) {
            self.board[node[0]][node[1]] = Board.EMPTY;
        });
    });

    $(this).trigger("update");

    if (atari)
        $(this).trigger("atari");

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

Board.prototype.get_group = function(i, j) {

    var color = this.board[i][j];
    if (color == Board.EMPTY)
        return null;

    var visited = {}; // for O(1) lookups
    var visited_list = []; // for returning
    var queue = [[i, j]];
    var count = 0;

    while (queue.length > 0) {
        var node = queue.pop();
        if (visited[node])
            continue;

        var neighbors = this.get_adjacent_intersections(node[0], node[1]);
        var self = this;
        _.each(neighbors, function(n) {
            var state = self.board[n[0]][n[1]];
            if (state == Board.EMPTY)
                count++;
            if (state == color)
                queue.push([n[0], n[1]]);
        });

        visited[node] = true;
        visited_list.push(node);
    }

    return {
        "liberties": count,
        "nodes": visited_list
    }
}
