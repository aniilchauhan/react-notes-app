import React, { Component } from "react";
import Button from "@mui/material/Button";
import { withStyles } from "@material-ui/styles";
import DeleteIcon from "@mui/icons-material/Delete";

const useStyles = (theme) => ({
  inputForm: {
    display: "flex",
    flexDirection: "column",
    width: "70%",
    border: "0.5px solid lightgray",
    padding: "5px",
    borderRadius: "5px",
    boxShadow: " 0 3px 5px rgb(0 0 0 / 20%)",
  },
  inputContainer: {
    padding: "5px",
    display: "flex",
    justifyContent: "center",
  },
  todoBox: {
    border: "0.5px solid lightgray",
    margin: "5px",
    borderRadius: "5px",
    padding: "12px 16px 12px 16px",
    position: "relative",
    minWidth: "200px",
    minHeight: "100px",

    "&:hover": {
      "& $editContainer": {
        opacity: "1",
        transition: "0.5sec",
      },
    },
  },
  editContainer: {
    display: "flex",
    alignItems: "center",
    position: "absolute",
    bottom: "5px",
    justifyContent: "space-between",
    width: "90%",
    opacity: "0",
  },
  editor: {
    paddingBottom: "25px",
  },
  todoTitle: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "5px 0",
  },
});

export class TodoList extends Component {
  constructor(props) {
    super(props);
    this.createMarkup = this.createMarkup.bind(this);
  }
  componentDidMount = () => {
    console.log("todolist");
  };
  createMarkup = (todo) => {
    return { __html: todo.description };
  };
  render() {
    const { classes, todo, isComplete,idx } = this.props;
    console.log("render");
    return (
      <div className={classes.todoBox}>
        <div className={classes.todoTitle}>
          <h4>{todo.title}</h4>
          <input
            checked={isComplete}
            // disabled={isComplete}
            type="checkbox"
            onChange={isComplete
            ?  (e) => this.props.UndoTodoCompleted(e, todo)
            : (e) => this.props.todoCompleted(e, todo)}
          />
        </div>
        {todo.showingCheckBox ? (
          <div style={{ paddingBottom: "25px" }}>
            {todo?.createdTask?.map((item, i) => {
              return (
                <label
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={isComplete}
                    disabled={isComplete}
                    onChange={(e) => this.props.taskCompleted(e, item)}
                  />
                  <span style={{ padding: "0 5px" }}> {item.value}</span>
                </label>
              );
            })}
            {todo?.completedTask?.length > 0 && <div>Completed Todo</div>}
            {todo?.completedTask?.map((item, i) => {
              return (
                <label
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <input
                    type="checkbox"
                    defaultChecked
                    disabled
                    onChange={
                      !isComplete &&
                      ((e) => {
                        this.props.taskDeleteUndo(e, item);
                      })
                    }
                  />
                  <span style={{ textDecoration: "line-through" }}>
                    {item.value}
                  </span>
                </label>
              );
            })}
          </div>
        ) : (
          <div>
            <div
              dangerouslySetInnerHTML={this.createMarkup(todo)}
              className={classes.editor}
            />
          </div>
        )}
        {!isComplete && (
          <div className={classes.editContainer}>
            <DeleteIcon
              style={{ cursor: "pointer", color: "red" }}
              onClick={() => this.props.handleTodoDelete(todo)}
            />
            <Button
              className={classes.editButton}
              onClick={() => this.props.edit(todo, todo.id,idx)}
            >
              Edit{" "}
            </Button>
          </div>
        )}
      </div>
    );
  }
}

export default withStyles(useStyles)(TodoList);
