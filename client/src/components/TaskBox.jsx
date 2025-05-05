import styles from "../style/Home.module.css";

import React, { useEffect, useState } from "react";

const TaskBox = () => {
  const [tasks, setTasks] = useState([]);
  const [add, setAdd] = useState("");
  const [addTask, setAddTask] = useState(false);

  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleSubmit = () => {
    if (add.trim() === "") {
      setAddTask(false);
      return;
    }
    const newTask = { text: add.trim(), completed: false };
    setTasks((prev) => [...prev, newTask]);
    setAdd("");
    setAddTask(false);
  };

  const toggleComplete = (index) => {
    const updated = [...tasks];
    updated[index].completed = !updated[index].completed;
    setTasks(updated);
  };

  const deleteTask = (index) => {
    const updated = tasks.filter((_, i) => i !== index);
    setTasks(updated);
  };

  return (
    <div className={styles.taskBlock}>
      <h3>
        Tasks{" "}
        <button onClick={() => setAddTask(!addTask)}>
          {!addTask ? "+" : "-"}
        </button>
      </h3>
      <div className={styles.taskItems}>
        {tasks.length === 0 && !addTask ? (
          <p style={{ margin: "12px auto" }}>Click + to add tasks</p>
        ) : (
          tasks.map((task, index) => (
            <p key={index} className={styles.taskItem}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleComplete(index)}
              />
              <span
                style={{
                  textDecoration: task.completed ? "line-through" : "none",
                  flex: 1,
                }}
              >
                {task.text}
              </span>
              <button
                className={styles.deleteTaskButton}
                onClick={() => deleteTask(index)}
              >
                X
              </button>
            </p>
          ))
        )}
      </div>
      {addTask && (
        <div className={styles.submitTaskArea}>
          <textarea
            value={add}
            onChange={(e) => setAdd(e.target.value)}
          ></textarea>
          <button onClick={handleSubmit} className={styles.submitTaskButton}>
            Submit
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskBox;
