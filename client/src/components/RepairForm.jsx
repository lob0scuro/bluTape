import styles from "./RepairForm.module.css";
import Button from "../components/Button";
import { renderOptions } from "../utils/Tools";
import { brands, colors, vendors, conditions } from "../utils/Schemas";
import { submitForm } from "../utils/API";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

const RepairForm = ({ machineType, type_id }) => {
  const isEmpty = Object.keys(machineType).length === 0;
  const formRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (formRef.current) {
      formRef.current.reset();
    }
  }, [type_id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const inputs = Object.fromEntries(formData);
    inputs.type_id = type_id;
    try {
      const { success, message, item, error } = await submitForm({
        endpoint: "/create/add_machine",
        method: "POST",
        inputs,
      });
      if (!success) {
        throw new Error(error);
      }
      toast.success(message);
      navigate(`/card/${item.id}`);
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (isEmpty) {
    return null;
  }

  return (
    <form className={styles.repairForm} onSubmit={handleSubmit} ref={formRef}>
      <div>
        <label htmlFor="brand">Brand</label>
        <select name="brand" id="brand">
          <option value="">--select brand--</option>
          {renderOptions(brands)}
        </select>
      </div>
      <div>
        <label htmlFor="model">Model</label>
        <input type="text" name="model" id="model" />
      </div>
      <div>
        <label htmlFor="serial">Serial</label>
        <input type="text" name="serial" id="serial" />
      </div>
      <div>
        <label htmlFor="style">Style</label>
        <select name="style" id="style">
          <option value="">--select style--</option>
          {renderOptions(machineType)}
        </select>
      </div>
      <div>
        <label htmlFor="color">Color</label>
        <select name="color" id="color">
          <option value="">--select color--</option>
          {renderOptions(colors)}
        </select>
      </div>
      <div>
        <label htmlFor="condition">Condition</label>
        <select name="condition" id="condition">
          <option value="">--select condition--</option>
          {renderOptions(conditions)}
        </select>
      </div>
      <div>
        <label htmlFor="vendor">Vendor</label>
        <select name="vendor" id="vendor">
          <option value="">--select vendor--</option>
          {renderOptions(vendors)}
        </select>
      </div>
      <div>
        <label htmlFor="note">Notes</label>
        <textarea name="note" id="note"></textarea>
      </div>
      <Button title="Submit" type="submit" />
    </form>
  );
};

export default RepairForm;
