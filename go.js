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
        var style = {
            width: this.props.board.size * GRID_SIZE,
            height: this.props.board.size * GRID_SIZE
        };
        return React.DOM.div({"style": style}, this.props.board.intersections);
    }
});

var Board = function(size) {
    this.current_color = "black";
    this.size = size;
    this.board = this.create_board(size);
    this.intersections = this.create_intersections(size);
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

Board.prototype.create_intersections = function(size) {
    var intersections = [];
    for (var i = 0; i < size; i++)
        for (var j = 0; j < size; j++)
            intersections.push(BoardIntersection({
                board: this,
                row: i,
                col: j
            }));
    return intersections;
};

var board = new Board(13);

React.renderComponent(
    <BoardView board={board} />,
    document.getElementById('board')
);
