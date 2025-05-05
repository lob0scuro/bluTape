import styles from "../style/Home.module.css";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/UserContext";
import { roleMap, fetchAllTechs, renderOptions } from "../utils";
import TaskBox from "../components/TaskBox";

const Home = () => {
  const { user } = useAuth();
  const [techs, setTechs] = useState([]);
  const [selected, setSelected] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const getIt = async () => {
      const gotIt = await fetchAllTechs();
      setTechs(gotIt);
    };
    getIt();
  }, []);

  const edit = (e) => {
    e.preventDefault();
    if (selected) {
      navigate(`/edit_tech/${selected}`);
    } else {
      alert("Please select a tech to edit.");
    }
  };

  return (
    <div className={styles.homeBlock}>
      <div className={styles.userBlock}>
        <img src={user.profile_pic} alt={user.first_name} />
        <div className={styles.userBlockInfo}>
          <p className={styles.userBlockRole}>
            {roleMap[user.role]} Tech {user.is_admin && <span>Admin</span>}
          </p>
          <p className={styles.userBlockName}>{user.full_name}</p>
          <p style={{ fontStyle: "italic" }}>{user.email}</p>
        </div>
      </div>
      {user.is_admin && (
        <div className={styles.editBlock}>
          <form onSubmit={edit}>
            <select
              name="techs"
              id="techs"
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
            >
              <option value="">--Select Tech--</option>
              {techs.map((tech) => (
                <option value={tech.id} key={tech.id}>
                  {tech.first_name}
                </option>
              ))}
            </select>
            <br />
            <br />

            <button className={styles.editTech} type="submit">
              Edit Tech Info
            </button>
          </form>
        </div>
      )}
      <TaskBox />
    </div>
  );
};

export default Home;
