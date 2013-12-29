/** @jsx React.DOM */

function create_board(size) {
    var m = [];
    for (var i = 0; i < size; i++) {
        m[i] = [];
        for (var j = 0; j < size; j++)
            m[i][j] = 0;
    }
    return m;
}

var board = create_board(13);

var GRID_SIZE = 40;

var BoardIntersection = React.createClass({
    getInitialState: function() {
        return {"color": null};
    },
    handleClick: function() {
        this.setState({"color": current_color});
        current_color = current_color == "black" ? "white" : "black";
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

var current_color = "black";

var BoardView = React.createClass({
    render: function() {
        var intersections = [];
        for (var i = 0; i < this.props.board.length; i++)
            for (var j = 0; j < this.props.board[0].length; j++)
                intersections.push(BoardIntersection({row: i, col: j}));
        var style = {
            width: this.props.board.length * GRID_SIZE,
            height: this.props.board.length * GRID_SIZE
        };
        return React.DOM.div({"style": style}, intersections);
    }
});

React.renderComponent(
    <BoardView board={board} />,
    document.getElementById('board')
);
