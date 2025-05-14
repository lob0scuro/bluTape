import styles from "../style/TaskBox.module.css";
import printStyles from "../style/PrintTasks.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faPlus,
  faMinus,
  faPrint,
} from "@fortawesome/free-solid-svg-icons";
import { currentDay, convertTime } from "../utils";
import React, { useEffect, useState } from "react";

const TaskBox = () => {
  const [tasks, setTasks] = useState([]);
  const [addTask, setAddTask] = useState(false);
  const [add, setAdd] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [printing, setPrinting] = useState(true);

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
    const newTask = {
      text: add.trim(),
      date: currentDay(),
      start: convertTime(startTime),
      end: convertTime(endTime),
      completed: false,
    };
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

  const printTaskList = () => {
    setPrinting(true);
    window.print();
  };

  return (
    <div className={styles.taskBlock}>
      <h3>
        <div>
          Tasks ~<span>{currentDay()}</span>
        </div>
        <div>
          <button>
            <FontAwesomeIcon icon={faPrint} onClick={printTaskList} />
          </button>
          <button onClick={() => setAddTask(!addTask)}>
            {!addTask ? (
              <FontAwesomeIcon icon={faPlus} />
            ) : (
              <FontAwesomeIcon icon={faMinus} />
            )}
          </button>
        </div>
      </h3>
      {addTask && (
        <div className={styles.submitTaskArea}>
          <div className={styles.timeInputs}>
            <p>Start</p>
            <input
              type="time"
              name="startTime"
              id="startTime"
              onChange={(e) => setStartTime(e.target.value)}
            />
            <p>End</p>
            <input
              type="time"
              name="endTime"
              id="endTime"
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
          <textarea
            value={add}
            onChange={(e) => setAdd(e.target.value)}
          ></textarea>
          <button onClick={handleSubmit} className={styles.submitTaskButton}>
            Submit
          </button>
        </div>
      )}
      <div className={styles.taskItems}>
        <ul className={printing && printStyles.taskItem}>
          {tasks.length === 0 && !addTask ? (
            <li style={{ margin: "12px auto 12px 12px" }}>
              -- Click + to add tasks --
            </li>
          ) : (
            tasks.map((task, index) => (
              <li key={index} className={styles.taskItem}>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleComplete(index)}
                />
                <div className={styles.taskItemText}>
                  <p>
                    [{task.start} - {task.end}]
                  </p>
                  <p>{task.text}</p>
                  <p>{task.date}</p>
                </div>
                {task.completed && (
                  <button
                    className={styles.deleteTaskButton}
                    onClick={() => deleteTask(index)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                )}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default TaskBox;
