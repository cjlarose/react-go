/** @jsx React.DOM */
var GRID_SIZE = 40;

var BoardIntersection = React.createClass({
    getInitialState: function() {
        return {"color": null};
    },
    handleClick: function() {
        this.setState({"color": this.props.board.current_color});
        this.props.board.current_color = this.props.board.current_color == "black" ? "white" : "black";
    },
    render: function() {
        var style = {
            top: this.props.row * GRID_SIZE,
            left: this.props.col * GRID_SIZE
        };

        var classes = "intersection";
        if (this.state.color)
            classes += " " + this.state.color;

        return (
            <div onClick={this.handleClick} className={classes} style={style}></div>
        );
    }
});

var BoardView = React.createClass({
    render: function() {
        var intersections = [];
        for (var i = 0; i < this.props.board.size; i++)
            for (var j = 0; j < this.props.board.size; j++)
                intersections.push(BoardIntersection({
                    board: this.props.board,
                    row: i,
                    col: j
                }));
        var style = {
            width: this.props.board.size * GRID_SIZE,
            height: this.props.board.size * GRID_SIZE
        };
        return React.DOM.div({"style": style}, intersections);
    }
});

var Board = function(size) {
    this.current_color = "black";
    this.size = size;
    this.board = this.create_board(size);
    this.BLACK = 1;
    this.WHITE = 2;
};

Board.prototype.create_board = function(size) {
    var m = [];
    for (var i = 0; i < size; i++) {
        m[i] = [];
        for (var j = 0; j < size; j++)
            m[i][j] = 0;
    }
    return m;
};

var board = new Board(13);

React.renderComponent(
    <BoardView board={board} />,
    document.getElementById('board')
);
