/** @jsx React.DOM */
var GRID_SIZE = 40;

var BoardIntersection = React.createClass({
    handleClick: function() {
        this.props.board.play(this.props.row, this.props.col);
    },
    render: function() {
        var style = {
            top: this.props.row * GRID_SIZE,
            left: this.props.col * GRID_SIZE
        };

        var classes = "intersection";
        if (this.props.color != 0)
            classes += " " + (this.props.color == Board.BLACK ? "black" : "white");

        return (
            <div onClick={this.handleClick} className={classes} style={style}></div>
        );
    }
});

var BoardView = React.createClass({
    getInitialState: function() {
        var self = this;
        $(this.props.board).on("update", function(e) {
            console.log(e);
            self.setState({"board": self.props.board});
        });
        return {"board": this.props.board}
    },
    render: function() {
        var intersections = [];
        for (var i = 0; i < this.state.board.size; i++)
            for (var j = 0; j < this.state.board.size; j++)
                intersections.push(BoardIntersection({
                    board: this.state.board,
                    color: this.state.board.board[i][j],
                    row: i,
                    col: j
                }));
        var style = {
            width: this.state.board.size * GRID_SIZE,
            height: this.state.board.size * GRID_SIZE
        };
        return React.DOM.div({"style": style}, intersections);
    }
});

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
            m[i][j] = 0;
    }
    return m;
};

Board.prototype.play = function(i, j) {
    console.log("Played at " + i + ", " + j);   
    this.board[i][j] = this.current_color;
    $(this).trigger({
        type: "update",
        color: this.current_color,
        i: i,
        j: j
    });
    this.current_color = this.current_color == Board.BLACK ? Board.WHITE : Board.BLACK;
};

var board = new Board(13);

React.renderComponent(
    <BoardView board={board} />,
    document.getElementById('board')
);
