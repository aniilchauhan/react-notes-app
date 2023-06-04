import React, { Component } from "react";
import { withStyles } from "@material-ui/styles";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import TextEditor from "./TextEditor";
import TodoList from "./TodoList";
import {
  Box,
  Button,
  CircularProgress,
  circularProgressClasses,
  FormGroup,
  Switch,
  TextField,
} from "@mui/material";
import Delete from "@mui/icons-material/Delete";
import Swal from "sweetalert2";

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  // target: "#dialog",
  showConfirmButton: false,
  timer: 3000,
});

const useStyles = (theme) => ({
  createButtonContainer: {
    display: "flex",
    justifyContent: "center",
  },
  todoContainer: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    padding: " 0 10px",
  },
  submitButton: {
    backgroundColor: "blue",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    fontWeight: "500",
    textTransform: "uppercase",
    color: "white",
    cursor: "pointer",
  },
  emptyList: {
    position: "absolute",
    top: "50%",
    left: "40%",
    color: "lightgray",
    fontSize: "35px",
  },
  mainContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "80vh",
  },
});

export class TodoHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isClicked: false,
      currentTitle: "",
      currentDescription: "",
      isDrawerOpen: false,
      TodosArray: [],
      showingCheckBox: false,
      checkBoxArray: [],
      createdTask: [],
      todoValue: "",
      completedTask: [],
      todoChecked: false,
      isLoading: false,
      error: [],
      completedTodo: [],
      updatingId:""
    };
  }
  componentDidMount = () => {
    console.log("mounted");
    let defaultTodos = JSON.parse(localStorage.getItem("defaultTodos"));
    // if(defaultTodos.length!==0){
    //   this.setState({
    //     TodosArray: [...defaultTodos, ...this.state.TodosArray],
    //   });
    // }
  };
  handleAlertMsg = (msg) => {
    Toast.fire({
      icon: "success",
      title: msg,
    });
  };
  handleSubmit = () => {
    let error = [];
    let todo = {
      id: this.state.TodosArray.length,
      description: this.state.currentDescription,
      title: this.state.currentTitle,
      showingCheckBox: this.state.showingCheckBox,
      createdTask: this.state.createdTask,
      completedTask: this.state.completedTask,
    };

    if (this.state.currentTitle === "") {
      error.push("currentTitle");
    }
    if (this.state.currentDescription === "") {
      error.push("currentDescription");
    }
    this.setState({
      error: error,
    });
    if (error.length === 0) {
      this.handleAlertMsg("Todo added succesfully");
      this.handleDrawerClose();
      this.setState(
        {
          TodosArray: [...this.state.TodosArray, todo],
          isLoading: true,
        },
        () => {
          localStorage.setItem(
            "defaultTodos",
            JSON.stringify(this.state.TodosArray)
          );
          setTimeout(() => {
            this.setState({
              isLoading: false,
            });
          }, 3000);
        }
      );
    }
  };
  handleChange = (event, editor, data, isData) => {
    if (!isData) {
      this.setState({
        currentTitle: event.target.value,
        error: this.state.error.filter((msg, i) => msg !== "currentTitle"),
      });
    } else {
      this.setState({
        currentDescription: data,
        error: this.state.error.filter(
          (msg, i) => msg !== "currentDescription"
        ),
      });
    }
  };

  handleUpdate = (updatingTodo) => {
    let error = [];
    let updatingArr = this.state.TodosArray;
    this.state.TodosArray.filter((obj,index) => {
      if (index === this.state.updatingId) {
        let editedTodo = {
          showingCheckBox: this.state.showingCheckBox,
          createdTask: this.state.createdTask,
          completedTask: this.state.completedTask,
          description: this.state.currentDescription,
          title: this.state.currentTitle,
          id: updatingTodo.id,
        };
        updatingArr[index] = editedTodo;
      }
    });
    this.handleAlertMsg("Todo updated succesfully");

    if (this.state.currentTitle === "") {
      error.push("currentTitle");
    }
    if (this.state.currentDescription === "") {
      error.push("currentDescription");
    }
    this.setState({
      error: error,
    });

    if (error.length === 0) {
      this.setState(
        {
          TodosArray: updatingArr,
          isLoading: true,
          isUpdate: false,
          currentDescription: "",
          currentTitle: "",
        },
        () => {
          this.handleDrawerClose();
          setTimeout(() => {
            localStorage.setItem(
              "defaultTodos",
              JSON.stringify(this.state.TodosArray)
            );
            this.setState({
              isLoading: false,
            });
          }, 3000);
        }
      );
    }
    console.log(updatingArr);
  };
  handleTodoDelete = (updatingTodo) => {
    this.setState(
      {
        TodosArray: this.state.TodosArray.filter(
          (todo) => todo.id !== updatingTodo.id
        ),
      },
      () => {
        localStorage.setItem(
          "defaultTodos",
          JSON.stringify(this.state.TodosArray)
        );
      }
    );
    this.handleAlertMsg("Todo deleted succesfully");
  };
  handleCheckBox = (currentTitle, currentDescription, editedObj) => {
    this.setState(
      {
        showingCheckBox: !this.state.showingCheckBox,
      },
      () => {
        if (this.state.showingCheckBox === false) {
          this.setState({
            createdTask: [],
          });
        }
      }
    );
    let div = document.querySelector(".ck-editor__editable_inline");
    let todoPtag = div.getElementsByTagName("p");
    // let todoH2tag = div.getElementsByTagName("h2")
    // let todoH3tag = div.getElementsByTagName("h3")
    // let todoH4tag = div.getElementsByTagName("h4")

    console.log(div.childNodes);

    let todoArray = [];
    if (
      this.state.createdTask.length === 0 ||
      todoPtag.length > this.state.createdTask.length
    ) {
      Array.from(div.childNodes).forEach((item, i) => {
        console.log("item", item.innerText);
        if (item.innerText !== "\n") {
          let obj = {
            id: Math.random(),
            value: item.innerText,
          };
          todoArray.push(obj);
          console.log("i", i);

          this.setState({
            createdTask: [...this.state.createdTask, ...todoArray],
            completedTask: [],
          });
        }
      });
    }
    console.log(currentTitle, currentDescription, editedObj);
  };
  handleDrawerOpen = () => {
    console.log("handleopen");
    this.setState({
      isDrawerOpen: !this.state.isDrawerOpen,
    });
  };
  handleDrawerClose = () => {
    this.setState(
      {
        isDrawerOpen: !this.state.isDrawerOpen,
        showingCheckBox: false,
      },
      () => {
        this.setState({
          currentTitle: "",
          currentDescription: "",
          isClicked: false,
          data: "",
          createdTask: [],
          completedTask: [],
          checkBoxArray: [],
        });
      }
    );
  };
  edit = (object,id,idx) => {
    this.setState({
      isUpdate: true,
      isDrawerOpen: true,
      updatingId:idx,
      editedObj: object,
      currentTitle: object.title,
      currentDescription: object.description,
    });
  };
  createMarkup = (todo) => {
    return { __html: todo };
  };
  createTask = () => {
    let id = Math.random();
    this.setState({
      createdTask: [...this.state.createdTask, { id: id, value: "" }],
    });
  };
  handleTaskChange = (e, item) => {
    this.setState(
      {
        todoValue: e.target.value,
      },
      () => {
        let newArr = this.state.createdTask;
        let stringArr = [];
        this.state.createdTask.map((obj, idx) => {
          if (item.id === obj.id) {
            let newObj = {
              id: item.id,
              value: this.state.todoValue,
            };
            newArr[idx] = newObj;
          }
        });
        this.setState(
          {
            createdTask: newArr,
          },
          () => {
            this.state.createdTask.map((todo, i) => {
              let pTag = `<p>${todo.value}</p>`;
              stringArr.push(pTag);
            });
            let newDescription = stringArr.join("");
            this.setState({
              currentDescription: newDescription,
            });
          }
        );
      }
    );
  };
  taskCompleted = (e, todo) => {
    console.log(todo);
    if (todo.value !== "") {
      let todoObj = this.state.createdTask.filter((item, idx) => {
        console.log(todo.id !== item.id);
        return todo.id !== item.id;
      });
      let todoObj1 = this.state.createdTask.filter((item, idx) => {
        console.log(todo.id === item.id);
        return todo.id === item.id;
      });
      this.setState({
        createdTask: todoObj,
        completedTask: [...this.state.completedTask, ...todoObj1],
      });
    } else {
      alert("enter some value");
    }
  };
  handleTaskDelete = (e, todo) => {
    console.log(e, todo);
    let stringArr = [];
    let todoObj = this.state.createdTask.filter((item, idx) => {
      console.log(todo.id !== item.id);
      if (todo.id !== item.id) {
        let pTag = `<p>${item.value}</p>`;
        stringArr.push(pTag);
      }
      return todo.id !== item.id;
    });
    console.log(stringArr);
    let newDescription = stringArr.join("");
    this.setState({
      createdTask: todoObj,
      currentDescription: newDescription,
    });
  };
  taskDeleteUndo = (e, todo) => {
    console.log(todo);
    let remaining = this.state.completedTask.filter((item, idx) => {
      console.log(todo.id === item.id);
      return todo.id === item.id;
    });
    let deleting = this.state.completedTask.filter((item, idx) => {
      console.log(todo.id !== item.id);
      return todo.id !== item.id;
    });
    console.log(deleting, "deleting");
    console.log(remaining, "remaining");

    this.setState({
      createdTask: [...this.state.createdTask, ...remaining],
      completedTask: deleting,
    });
  };
  todoCompleted = (e, todo) => {
    let newTodo = todo;
    newTodo.createdTask = [...todo.createdTask, ...todo.completedTask];
    newTodo.completedTask = [];

    this.setState(
      {
        completedTodo: [...this.state.completedTodo, newTodo],
        TodosArray: this.state.TodosArray.filter(
          (obj, i) => obj.id !== todo.id
        ),
      },
      () => {
        localStorage.setItem(
          "defaultTodos",
          JSON.stringify(this.state.TodosArray)
        );
      }
    );
  };
  UndoTodoCompleted = (e,todo) =>{
    // let updatingArr = this.state.TodosArray;
    // this.state.TodosArray.filter((obj,idx) => {
    //   if (idx === todo.id) {
    //     updatingArr[idx] = todo;
    //   }
    // });
     this.setState({
      TodosArray:[...this.state.TodosArray,todo],
      completedTodo : this.state.completedTodo.filter(
        (obj, i) => obj.id !== todo.id
      ),
     })
  }
  render() {
    const {
      isUpdate,
      error,
      TodosArray,
      completedTask,
      isLoading,
      createdTask,
      todoChecked,
      isDrawerOpen,
      currentTitle,
      currentDescription,
      editedObj,
      showingCheckBox,
    } = this.state;
    const { classes } = this.props;

    const FacebookCircularProgress = (props) => {
      return (
        <Box sx={{ position: "relative", width: "20px" }}>
          <CircularProgress
            variant="determinate"
            sx={{
              color: (theme) =>
                theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
            }}
            size={20}
            thickness={4}
            {...props}
            value={100}
          />
          <CircularProgress
            variant="indeterminate"
            disableShrink
            sx={{
              color: (theme) =>
                theme.palette.mode === "light" ? "#1a90ff" : "#308fe8",
              animationDuration: "550ms",
              position: "absolute",
              left: 0,
              [`& .${circularProgressClasses.circle}`]: {
                strokeLinecap: "round",
              },
            }}
            size={20}
            thickness={4}
            {...props}
          />
        </Box>
      );
    };

    return (
      <React.Fragment>
        <div
          style={{
            width: "100vw",
            height: "100vh",
            backgroundColor: "#f1f1f1",
          }}
        >
          <div className={classes.createButtonContainer}>
            <Button
              size="large"
              style={{ margin: "10px 200px" }}
              variant={"contained"}
              onClick={() => this.handleDrawerOpen()}
            >
              Create Todo
            </Button>
          </div>
          <Dialog
            id="dialog"
            open={isDrawerOpen}
            onClose={() => this.handleDrawerClose()}
          >
            <IconButton
              aria-label="close"
              onClick={() => this.handleDrawerClose()}
              sx={{
                position: "absolute",
                right: 0,
                top: -2,
                color: "black",
              }}
            >
              <CloseIcon />
            </IconButton>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                // padding: "5px 3px"
                marginTop: "15px",
              }}
            >
              <DialogTitle>
                {isUpdate ? "Update your todo" : "Write Your Todo"}
              </DialogTitle>
              {
                <Switch
                  checked={showingCheckBox}
                  onChange={() =>
                    this.handleCheckBox(
                      currentTitle,
                      currentDescription,
                      editedObj
                    )
                  }
                />
              }
            </div>
            {showingCheckBox ? (
              <div style={{ width: "450px" }}>
                <div
                  style={{
                    padding: "5px 10px",
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                  }}
                >
                  <input
                    type="text"
                    style={{
                      width: "97%",
                      padding: "6px",
                      border: "0.5px solid lightgray",
                    }}
                    name="title"
                    value={currentTitle}
                    placeholder="Title"
                    onChange={(event) => this.handleChange(event)}
                  />
                  {error.includes("currentTitle") && (
                    <span style={{ color: "red", fontSize: "13px" }}>
                      Title is required
                    </span>
                  )}
                  <FormGroup>
                    {createdTask?.map((item, i) => {
                      return (
                        <div
                          key={i}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          <label
                            style={{
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <input
                              type="checkbox"
                              style={{ marginRight: "10px" }}
                              checked={todoChecked}
                              onChange={(e) => this.taskCompleted(e, item)}
                            />
                            <TextField
                              id="standard-basic"
                              placeholder="enter value"
                              name={`todo-${i}`}
                              value={item.value}
                              variant="standard"
                              onChange={(e) => this.handleTaskChange(e, item)}
                            />
                          </label>
                          <Delete
                            color={"error"}
                            onClick={(e) => this.handleTaskDelete(e, item)}
                          />
                        </div>
                      );
                    })}
                  </FormGroup>
                  {completedTask.length > 0 && <div>Completed Task</div>}
                  {completedTask?.map((obj, i) => {
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
                          onChange={(e) => {
                            this.taskDeleteUndo(e, obj);
                          }}
                        />
                        <span style={{ textDecoration: "line-through" }}>
                          {obj.value}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ) : (
              <>
                <DialogContent>
                  <input
                    type="text"
                    style={{
                      width: "97%",
                      padding: "6px",
                      border: "0.5px solid lightgray",
                    }}
                    name="title"
                    value={currentTitle}
                    placeholder="Title"
                    onChange={(event) => this.handleChange(event)}
                  />
                  {error.includes("currentTitle") && (
                    <span style={{ color: "red", fontSize: "13px" }}>
                      Title is required
                    </span>
                  )}
                  <TextEditor
                    currentDescription={currentDescription}
                    handleUpdate={this.handleUpdate}
                    handleSubmit={this.handleSubmit}
                    handleChange={this.handleChange}
                    updatingTodo={this.updatingTodo}
                  />
                  {error.includes("currentDescription") && (
                    <span style={{ color: "red", fontSize: "13px" }}>
                      Description is required
                    </span>
                  )}
                </DialogContent>
              </>
            )}
            <DialogActions>
              {showingCheckBox && (
                <Button
                  onClick={() => this.createTask()}
                  variant="contained"
                  color="success"
                >
                  Add Task
                </Button>
              )}
              <button
                className={classes.submitButton}
                disabled={isLoading}
                onClick={
                  isUpdate
                    ? () => this.handleUpdate(editedObj)
                    : () => this.handleSubmit()
                }
                variant="contained"
              >
                {isLoading ? (
                  <FacebookCircularProgress />
                ) : isUpdate ? (
                  "Update"
                ) : (
                  "Submit"
                )}
              </button>
            </DialogActions>
          </Dialog>
          <div className={classes.mainContainer}>
            <div
              className={classes.todoContainer}
              style={{ position: "relative" }}
            >
              {TodosArray.length !== 0 ? (
                TodosArray?.map((todo, idx) => {
                  return (
                    <TodoList
                      isComplete={false}
                      key={idx}
                      idx={idx}
                      todoCompleted={this.todoCompleted}
                      taskDeleteUndo={this.taskDeleteUndo}
                      currentTitle={this.state.currentTitle}
                      taskCompleted={this.taskCompleted}
                      todo={todo}
                      edit={this.edit}
                      handleChange={this.handleChange}
                      handleUpdate={this.handleUpdate}
                      handleSubmit={this.handleSubmit}
                      handleDrawerOpen={() => this.handleDrawerOpen()}
                      handleTodoDelete={this.handleTodoDelete}
                      handleCheckBox={this.handleCheckBox}
                      handleDrawerClose={this.handleDrawerClose}
                    />
                  );
                })
              ) : (
                <div className={classes.emptyList}>
                  <h4>No Todos To Show</h4>
                </div>
              )}
            </div>
            <div className={classes.todoContainer}>
              {this.state?.completedTodo.length !== 0 && (
                <h4>Completed Todo</h4>
              )}
              {this.state?.completedTodo?.map((todo, idx) => {
                return <TodoList key={idx} isComplete={true} todo={todo} UndoTodoCompleted={this.UndoTodoCompleted} />;
              })}
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default withStyles(useStyles)(TodoHome);
