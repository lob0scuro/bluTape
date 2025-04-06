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

export const fetchAllMachines = async (table) => {
  try {
    const response = await fetch(`/read/get_all_machines/${table}`);
    const data = await response.json();
    if (!response.ok) {
      alert(`Error: ${data.error}`);
      return data.error;
    }
    return data;
  } catch (error) {
    alert("There was a server error");
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
