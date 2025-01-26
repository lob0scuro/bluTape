export const getTechs = async () => {
  try {
    const response = await fetch("/api/get_techs");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data.techs;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getTech = async (id) => {
  try {
    const response = await fetch(`/api/get_tech/${id}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    console.log(data.tech);
    return data.tech;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteMachine = (id) => {
  let result = confirm("Delete Machine?");
  if (result) {
    fetch(`/api/delete/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data.message);
      })
      .catch((error) => {
        console.error(error);
      });
  } else {
    return;
  }
};

export const addToInventory = (id) => {
  let result = confirm("Add to Inventory");
  if (result) {
    fetch(`/api/add_to_inventory/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }
};
