import styles from "./AdminPanel.module.css";
import React, { useEffect, useState } from "react";
import InProgress from "../helpers/InProgress";
import { fetchUsers } from "../../utils/API";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [chosenUser, setChosenUser] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const get = async () => {
      const got = await fetchUsers();
      if (!got.success) {
        toast.error(got.error);
        return;
      }
      setUsers(got.users);
    };
    get();
  }, []);

  useEffect(() => {
    if (chosenUser) {
      navigate(`/update-user/${chosenUser}`);
    }
  }, [chosenUser, navigate]);

  return (
    <>
      <InProgress page="Admin Panel" />
      <br />
      <div>
        <h1>Update User</h1>
        <div className={styles.updateUserSelect}>
          <select
            name="users"
            id="users"
            onChange={(e) => setChosenUser(e.target.value)}
          >
            <option value="">--select user--</option>
            {users?.map(({ id, full_name }) => (
              <option value={id} key={id}>
                {full_name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
};

export default AdminPanel;
