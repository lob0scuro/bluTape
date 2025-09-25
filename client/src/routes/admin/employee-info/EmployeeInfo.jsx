import styles from "./EmployeeInfo.module.css";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Button from "../../../components/buttons/Button";

const roleMap = {
  0: "Office",
  1: "Fridge Tech",
  2: "Washer Tech",
  3: "Dryer/Range Tech",
  4: "range",
};

const EmployeeInfo = () => {
  const [users, setUsers] = useState([] || null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchEmployee = async () => {
      const response = await fetch(`/api/read/get_users`);
      if (!response.ok) {
        console.error(response.statusText);
        toast.error("There was an error when fetching employees from database");
        return;
      }
      const data = await response.json();
      if (!data.success) {
        console.error(data.message);
        toast.error(data.message);
        return;
      }

      setUsers(data.data);
      setFormData({
        first_name: data.data.first_name,
        last_name: data.data.last_name,
        email: data.data.email,
        role: data.data.role,
      });
    };
    fetchEmployee();
  }, []);

  const selectUser = (e) => {
    const uid = e.target.value;
    const user = users.find((u) => u.id === parseInt(uid));
    setSelectedUser(user);
  };

  if (!users) return <h1>Loading....</h1>;

  return (
    <div className={styles.empInfoContainer}>
      <select name="employee" id="employee" onChange={selectUser}>
        <option value="">-Select Employee--</option>
        {users.map(({ id, first_name, last_name }) => (
          <option key={id} value={id}>
            {first_name} {last_name}
          </option>
        ))}
      </select>
      {selectedUser && (
        <div className={styles.infoMainContainer}>
          <ul className={styles.infoBlock}>
            <li>
              <span>First Name</span>
              <span>{selectedUser.first_name}</span>
            </li>
            <li>
              <span>Last Name</span>
              <span>{selectedUser.last_name}</span>
            </li>
            <li>
              <span>Role</span>
              <span>{roleMap[selectedUser.role]}</span>
            </li>
            <li>
              <span>Email</span>
              <span style={{ fontSize: "1rem" }}>{selectedUser.email}</span>
            </li>
          </ul>
          {/* <Button
            label={"Edit Employee Info"}
            onClick={() => setEditing(!editing)}
          /> */}
        </div>
      )}
    </div>
  );
};

export default EmployeeInfo;
