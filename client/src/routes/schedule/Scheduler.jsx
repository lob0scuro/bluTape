import styles from "./Scheduler.module.css";
import { useEffect, useState } from "react";
import { fetchUsers } from "../../utils/API";
import toast from "react-hot-toast";

const HOURS = (() => {
  const result = [];
  const today = new Date();
  today.setHours(6, 0, 0, 0); // Start at 6:00 AM

  for (let i = 0; i <= 24; i++) {
    const slot = new Date(today.getTime() + i * 30 * 60000);
    const label = slot.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });

    result.push({
      time: slot, // Actual Date object
      label: label, // Formatted time string, e.g. "6:30 AM"
    });
  }

  return result;
})();

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const Scheduler = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState();
  const [schedule, setSchedule] = useState({});

  useEffect(() => {
    const get = async () => {
      const got = await fetchUsers();
      if (!got.success) {
        toast.error(got.error);
        setUsers([]);
      }
      setUsers(got.users);
    };
    get();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "week_date") {
      const selectedDate = new Date(value);
      const day = selectedDate.getDay();

      if (day !== 1) {
        toast.error("Please select a Monday");
        return;
      }
    }
    setSchedule((prev) => ({ ...prev, [name]: value }));
  };

  const timeSelects = (day) => (
    <div key={day} className={styles.day}>
      <span>{day}</span>
      <div className={styles.timeSelectField}>
        <select
          name={`${day.toLowerCase()}_start`}
          value={schedule[`${day.toLowerCase()}_start`] || ""}
          onChange={handleChange}
        >
          <option value="">--start time--</option>
          {HOURS.map(({ time, label }, idx) => (
            <option value={time.toISOString()} key={`start-${idx}`}>
              {label}
            </option>
          ))}
        </select>
        <select
          name={`${day.toLowerCase()}_end`}
          value={schedule[`${day.toLowerCase()}_end`] || ""}
          onChange={handleChange}
        >
          <option value="">--end time--</option>
          {HOURS.map(({ time, label }, idx) => (
            <option value={time.toISOString()} key={`end-${idx}`}>
              {label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser) {
      toast.error("Please select an employee");
      return;
    }

    const payload = {
      ...schedule,
      user_id: selectedUser,
      week_date: schedule.week_date,
    };

    try {
      const response = await fetch("/schedule/input_week", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      } else {
        toast.success("Schedule has been submitted!");
      }
    } catch (error) {
      toast.error(error.message);
      console.error(error);
    }
  };

  return (
    <div className={styles.scheduler}>
      <input
        type="date"
        name="week_date"
        value={schedule.week_date || ""}
        onChange={handleChange}
        required
      />
      <select
        name="employee"
        id="employee"
        onChange={(e) => setSelectedUser(e.target.value)}
        className={styles.employeePicker}
      >
        <option value="">--Select Employee--</option>
        {users?.map(({ id, first_name }) => (
          <option key={id} value={id}>
            {first_name}
          </option>
        ))}
      </select>
      <div className={styles.week}>{DAYS.map(timeSelects)}</div>
    </div>
  );
};

export default Scheduler;
