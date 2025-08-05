import styles from "./Scheduler.module.css";
import React, { useEffect, useState } from "react";
import { renderOptions } from "../../utils/Tools";
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

const Scheduler = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");

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

  return (
    <div className={styles.scheduler}>
      <select
        name="employee"
        id="employee"
        onChange={(e) => setSelectedUser(e.target.value)}
      >
        <option value="">--Select Employee--</option>
        {users?.map(({ id, first_name }) => (
          <option key={id} value={id}>
            {first_name}
          </option>
        ))}
      </select>
      <div className={styles.week}>
        <div className={styles.day}>
          <span>Mon</span>
          <div>
            <select name="start" id="start">
              <option value="">--start time--</option>
              {HOURS.map(({ time, label }, idx) => (
                <option key={idx} value={time.toISOString()}>
                  {label}
                </option>
              ))}
            </select>

            <select name="end" id="end">
              <option value="">--end time--</option>
              {HOURS.map(({ time, label }, idx) => (
                <option key={idx} value={time.toISOString()}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className={styles.day}>Tue</div>
        <div className={styles.day}>Wed</div>
        <div className={styles.day}>Thu</div>
        <div className={styles.day}>Fri</div>
        <div className={styles.day}>Sat</div>
      </div>
    </div>
  );
};

export default Scheduler;
