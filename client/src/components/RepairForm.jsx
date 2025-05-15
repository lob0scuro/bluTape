import styles from "../style/RepairForm.module.css";
import {
  brands,
  colors,
  machineStyles,
  renderOptions,
  vendors,
  conditions,
} from "../utils.jsx";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const RepairForm = ({ title, machineType }) => {
  const navigate = useNavigate();

  const submitForm = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const inputs = Object.fromEntries(formData.entries());
    inputs.machine_type = machineType;
    try {
      const response = await fetch("/create/create_repair", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputs),
      });
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.error);
        return {
          error: data.error || `There was an error: ${response.statusText}`,
        };
      }
      toast.success(data.message);
      navigate(`/card/${data.machine.id}/${0}`);
      return { message: data.message };
    } catch (error) {
      toast.error(`There was an unexpected error: ${error.message}`);
      return { error: "There was an unexpected error." };
    }
  };

  return (
    <>
      {/* <h1 className={styles.repairHeader}>{title}</h1> */}
      <form className={styles.repairForm} onSubmit={submitForm}>
        <div>
          <label htmlFor="brand">Brand: </label>
          <select name="brand" id="brand" required>
            <option value="">--Select Brand--</option>
            {renderOptions(brands)}
          </select>
        </div>
        <div>
          <label htmlFor="model">Model: </label>
          <input type="text" name="model" id="model" required />
        </div>
        <div>
          <label htmlFor="serial">Serial: </label>
          <input type="text" name="serial" id="serial" required />
        </div>
        <div>
          <label htmlFor="color">Color: </label>
          <select name="color" id="color">
            <option value="">--Select Color--</option>
            {renderOptions(colors)}
          </select>
        </div>
        <div>
          <label htmlFor="style">Style: </label>
          <select name="style" id="style">
            <option value="">--Select Style--</option>
            {renderOptions(machineStyles[machineType])}
          </select>
        </div>
        <div>
          <label htmlFor="condition">Condition: </label>
          <select name="condition" id="condition">
            <option value="">--Select Condition--</option>
            {renderOptions(conditions)}
          </select>
        </div>

        <div>
          <label htmlFor="vendor">Vendor: </label>
          <select name="vendor" id="vendor">
            <option value="vendor">--Select Vendor--</option>
            {renderOptions(vendors)}
          </select>
        </div>
        <div className={styles.noteBlock}>
          <label htmlFor="note">Note</label>
          <textarea name="note" id="note"></textarea>
        </div>
        <button type="submit">Submit</button>
      </form>
    </>
  );
};

export default RepairForm;
