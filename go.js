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
        return React.DOM.div({"style": style, "id": "board"}, intersections);
    }
});

var AlertView = React.createClass({
    getInitialState: function() {
        var self = this;
        $(this.props.board).on("atari", function(e) {
            self.setState({"text": "ATARI!"});
        });
        $(this.props.board).on("suicide", function(e) {
            self.setState({"text": "SUICIDE!"});
        });
        $(this.props.board).on("update", function(e) {
            self.setState({"text": null});
        });

        return {"text": null};
    },
    render: function() {
        return (
            <div id="alerts">{this.state.text}</div>
        );
    }
});

var PassView = React.createClass({
    handleClick: function(e) {
        this.props.board.pass();
    },
    render: function() {
        return (
            <input id="pass-btn" type="button" value="Pass" onClick={this.handleClick} />
        );
    }
});

var board = new Board(19);

React.renderComponent(
    <div>
        <AlertView board={board} />
        <PassView board={board} />
        <BoardView board={board} />
    </div>,
    document.getElementById('main')
);
