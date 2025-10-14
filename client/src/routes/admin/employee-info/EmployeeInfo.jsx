import styles from "./EmployeeInfo.module.css";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Button from "../../../components/buttons/Button";
import { useNavigate } from "react-router-dom";

const roleMap = {
  0: "Office",
  1: "Fridge Tech",
  2: "Washer Tech",
  3: "Dryer/Range Tech",
};

const EmployeeInfo = () => {
  const [users, setUsers] = useState([] || null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState();
  const navigate = useNavigate();

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
    };
    fetchEmployee();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const selectUser = (e) => {
    const uid = e.target.value;
    const user = users.find((u) => u.id === parseInt(uid));
    setSelectedUser(user);
    setFormData({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`/api/update/update_user/${selectedUser.id}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    if (!data.success) {
      toast.error(data.message);
      return;
    }
    toast.success(data.message);
    setSelectedUser(data.user);
    setEditing(false);
  };

  if (!users) return <h1>Loading....</h1>;

  return (
    <div className={styles.empInfoContainer}>
      <Button
        label={"Back to Admin Panel"}
        onClick={() => navigate("/admin-panel")}
      />
      <select
        name="employee"
        id="employee"
        onChange={selectUser}
        className={styles.employeeSelect}
      >
        <option value="">-Select Employee--</option>
        {users.map(({ id, first_name, last_name }) => (
          <option key={id} value={id}>
            {first_name} {last_name}
          </option>
        ))}
      </select>
      {selectedUser && (
        <div className={styles.infoMainContainer}>
          <form className={styles.employeeForm} onSubmit={handleSubmit}>
            <ul className={styles.infoBlock}>
              <li>
                {editing ? (
                  <>
                    <label htmlFor="first_name">First Name</label>
                    <input
                      type="text"
                      value={formData.first_name}
                      onChange={handleChange}
                      name="first_name"
                    />
                  </>
                ) : (
                  <>
                    <span>First Name</span>
                    <span>{selectedUser.first_name}</span>
                  </>
                )}
              </li>
              <li>
                {editing ? (
                  <>
                    <label htmlFor="last_name">Last Name</label>
                    <input
                      type="text"
                      value={formData.last_name}
                      onChange={handleChange}
                      name="last_name"
                    />
                  </>
                ) : (
                  <>
                    <span>Last Name</span>
                    <span>{selectedUser.last_name}</span>
                  </>
                )}
              </li>
              <li>
                {editing ? (
                  <>
                    <label htmlFor="role">Role</label>
                    <select name="role" id="role" value={formData.role}>
                      <option value="">--Select Role--</option>
                      {Object.entries(roleMap).map(([num, text]) => (
                        <option key={num} value={num}>
                          {text}
                        </option>
                      ))}
                    </select>
                  </>
                ) : (
                  <>
                    <span>Role</span>
                    <span>{roleMap[selectedUser.role]}</span>
                  </>
                )}
              </li>
              <li>
                {editing ? (
                  <>
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      name="email"
                    />
                  </>
                ) : (
                  <>
                    <span>Email</span>
                    <span>{selectedUser.email}</span>
                  </>
                )}
              </li>
            </ul>
            {editing && (
              <Button
                label={"Submit"}
                type="submit"
                className={styles.employeeSubmit}
              />
            )}
          </form>
          <Button
            label={"Edit Employee Info"}
            onClick={() => setEditing(!editing)}
          />
        </div>
      )}
    </div>
  );
};

export default EmployeeInfo;
