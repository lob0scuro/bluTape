import styles from "./UpdateUserInfo.module.css";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/UserContext";
import { useNavigate, useParams } from "react-router-dom";
import { fetchUser } from "../../utils/API";
import toast from "react-hot-toast";
import Button from "../../components/Button";

const UpdateUserInfo = () => {
  const navigate = useNavigate();
  const { user_id } = useParams();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    position: "",
  });

  useEffect(() => {
    const get = async () => {
      const got = await fetchUser(user_id);
      if (!got.success) {
        toast.error(got.error);
        return;
      }
      const user = got.user;
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        position: user.position || "",
      });
    };
    get();
  }, [user_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitForm = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/update/update_user/${user_id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error);
      }
      toast.success(data.message);
      navigate("/");
    } catch (error) {
      toast.error(error.message);
      return;
    }
  };
  return (
    <>
      <h1>Update User</h1>
      <form onSubmit={submitForm} className={styles.updateUserForm}>
        <div>
          <label htmlFor="first_name">First Name</label>
          <input
            type="text"
            name="first_name"
            id="first_name"
            value={formData.first_name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="last_name">Last Name</label>
          <input
            type="text"
            name="last_name"
            id="last_name"
            value={formData.last_name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="position">Position</label>
          <select
            name="position"
            id="position"
            value={formData.position}
            onChange={handleChange}
          >
            <option value="">--select position--</option>
            {Object.entries({
              Technician: "Technician",
              Cleaner: "Cleaner",
              Sales: "Sales",
              Driver: "Driver",
              Office: "Office",
              Service: "Service",
            }).map(([val, label]) => (
              <option value={val} key={val}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <Button title="Submit" type="submit" />
      </form>
    </>
  );
};

export default UpdateUserInfo;
