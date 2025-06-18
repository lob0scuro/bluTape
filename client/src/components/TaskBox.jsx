import styles from "./TaskBox.module.css";
import React, { useEffect, useState } from "react";
import { fetchUserTasks, submitForm } from "../utils/API";
import toast from "react-hot-toast";
import clsx from "clsx";
import Button from "./Button";
import { formatDate } from "../utils/Tools";

const TaskBox = ({ id }) => {
  const [tasks, setTasks] = useState([]);
  const [editing, setEditing] = useState(false);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [newTask, setNewTask] = useState({
    content: "",
  });
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const getTasks = async () => {
      const gotTasks = await fetchUserTasks(id, completedTasks);
      if (!gotTasks.success) {
        setTasks([]);
        return;
      }
      setTasks(gotTasks.tasks);
    };
    getTasks();
  }, [refreshTrigger, completedTasks]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleTaskForm = async (e) => {
    e.preventDefault();
    if (newTask.content.trim() === "") {
      toast.error("Enter value to submit form");
      return;
    }
    const { success, message, error } = await submitForm({
      endpoint: "/create/create_task",
      method: "POST",
      inputs: newTask,
    });
    if (!success) {
      toast.error(error);
      return;
    }
    toast.success(message);
    setNewTask({ content: "" });
    setCompletedTasks(0);
    setEditing(false);
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleUpdateTask = async (id) => {
    const { success, message, error } = await submitForm({
      endpoint: `/update/change_task_status/${id}`,
      method: "PATCH",
    });
    if (!success) {
      toast.error(error);
      return;
    }
    toast.success(message);
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleDeleteTask = async (id) => {
    const { success, message, error } = await submitForm({
      endpoint: `/delete/delete_task/${id}`,
      method: "DELETE",
    });
    if (!success) {
      toast.error(error);
      return;
    }
    toast.success(message);
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <form className={styles.taskForm} onSubmit={handleTaskForm}>
      <h3>
        <p>Tasks</p>
        <div className={styles.toggleGroup}>
          {Object.entries({ "-1": "all", 0: "active", 1: "completed" }).map(
            ([value, label]) => (
              <React.Fragment key={value}>
                <input
                  type="radio"
                  name="taskFilter"
                  id={label}
                  value={value}
                  checked={completedTasks === Number(value)}
                  onChange={(e) => setCompletedTasks(Number(e.target.value))}
                />
                <label htmlFor={label}>
                  {label.charAt(0).toUpperCase() + label.slice(1)}
                </label>
              </React.Fragment>
            )
          )}
        </div>
        <button type="button" onClick={() => setEditing(!editing)}>
          {editing ? "-" : "+"}
        </button>
      </h3>
      <ul className={styles.taskList}>
        {tasks?.length > 0 ? (
          tasks.map(({ id, content, created_on, is_complete }) => (
            <li key={id}>
              <p>
                {content}{" "}
                <button
                  onClick={
                    is_complete
                      ? () => handleDeleteTask(id)
                      : () => handleUpdateTask(id)
                  }
                  type="button"
                  className={clsx(
                    is_complete ? styles.deleteTaskBtn : styles.completeTaskBtn
                  )}
                >
                  {is_complete ? "delete" : "complete"}
                </button>
              </p>
              <p className={styles.taskDate}>[{formatDate(created_on)}] </p>
            </li>
          ))
        ) : (
          <p style={{ textAlign: "center" }}>
            --click&nbsp; "+"&nbsp; to add tasks--
          </p>
        )}
      </ul>
      {editing && (
        <div className={styles.formPoint}>
          <textarea
            name="content"
            id="content"
            value={newTask.content}
            onChange={handleChange}
            autoFocus
          ></textarea>
          <button type="submit">Submit</button>
        </div>
      )}
    </form>
  );
};

export default TaskBox;
