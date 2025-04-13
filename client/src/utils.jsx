export const formatDate = (date) => {
  const formatter = new Date(date);
  const formattedDate = formatter.toLocaleDateString("en-us", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return formattedDate;
};

export const machineMap = {
  0: "Refrigerator",
  1: "Washer",
  2: "Dryer",
  3: "Range",
};

export const brands = {
  Admiral: "Admiral",
  Amana: "Amana",
  Avanti: "Avanti",
  Bosch: "Bosch",
  Crosley: "Crosley",
  Cuisinart: "Cuisinart",
  Danby: "Danby",
  Fridgidaire: "Fridgidaire",
  GE: "GE",
  Haier: "Haier",
  Hotpoint: "Hotpoint",
  Kenmore: "Kenmore",
  Kitchenaid: "Kitchenaid",
  LG: "LG",
  Maytag: "Maytag",
  Roper: "Roper",
  Samsung: "Samsung",
  Whirlpool: "Whirlpool",
};

export const colors = {
  Black: "Black",
  White: "White",
  Stainless: "Stainless",
  BlackStainless: "Black Stainless",
  Blue: "Blue",
  Cream: "Cream",
  Red: "Red",
};

export const machineStyles = [
  {
    TopAndBottom: "Top and Bottom",
    SideBySide: "Side by Side",
    FrenchDoor: "French Door",
    BottomTop: "Bottom Top",
    Freezer: "Freezer",
  },
  {
    TopLoad: "Top Load",
    FrontLoad: "Front Load",
  },
  {
    TopLoad: "Top Load",
    FrontLoad: "Front Load",
  },
  {
    GlassTop: "Glass Top",
    Coil: "Coil",
  },
];

export const renderOptions = (obj) => {
  return (
    Object.entries(obj).map(([key, value]) => (
      <option key={key} value={key}>
        {value}
      </option>
    )) || null
  );
};

export const fetchAllTechs = async () => {
  try {
    const response = await fetch("/auth/get_all_techs");
    const data = await response.json();
    if (!response.ok) {
      alert("There was an error");
      return;
    }
    return data;
  } catch (error) {
    alert("There was an error");
    console.error(error);
  }
};

export const fetchAllMachines = async (table, status) => {
  try {
    const response = await fetch(`/read/get_all_machines/${table}/${status}`);
    const data = await response.json();
    if (!response.ok) {
      return data.error;
    }
    return data;
  } catch (error) {
    alert("There was a server error");
    return error;
  }
};

export const fetchAllMachinesByType = async (table, status, typeOf) => {
  try {
    const response = await fetch(
      `/read/get_all_machines_by_type/${table}/${status}/${typeOf}`
    );
    const data = await response.json();
    if (!response.ok) {
      return data.error;
    }
    return data;
  } catch (error) {
    return error;
  }
};

export const fetchOneMachine = async (table, id) => {
  try {
    const response = await fetch(`/read/get_one_machine/${table}/${id}`);
    const data = await response.json();
    if (!response.ok) {
      alert(`Error: ${data.error}`);
      return data.error;
    }
    return data;
  } catch (error) {
    alert(`There was a server error`);
    return error;
  }
};

export const finishRepair = async (id) => {
  const assurance = confirm("Finish repair?");
  if (!assurance) {
    return;
  }
  try {
    const response = await fetch(`/update/add_to_inventory/${id}`, {
      method: "PATCH",
    });
    const data = await response.json();
    if (!response.ok) {
      alert("There was an error");
      return data.error;
    }
    alert(data.message);
    return data.message;
  } catch (error) {
    alert("There was an error");
    return error;
  }
};

export const deleteMachine = async (id) => {
  const assurance = confirm("Delete Machine?");
  if (!assurance) {
    return;
  }
  try {
    const response = await fetch(`/delete/delete/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (!response.ok) {
      return { success: false, error: data.error };
    }
    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const deleteNote = async (id, setter) => {
  try {
    const response = await fetch(`/delete/delete_note/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (!response.ok) {
      return data.error;
    }
    setter((prev) => prev - 1);
    return data.message;
  } catch (error) {
    return error;
  }
};
