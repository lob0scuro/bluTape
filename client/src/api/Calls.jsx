import * as XLSX from "xlsx";

export const fetchMachines = (route, setMachines) => {
  fetch(`/api/${route}`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      setMachines([...data.data]);
    })
    .catch((error) => {
      console.error(error);
    });
};

export const fetchMachine = (id, setMachine) => {
  fetch(`/api/get_machine/${id}`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      setMachine(data.machine);
      return data.machine;
    })
    .catch((error) => {
      console.error(error);
    });
};

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
        alert(data.message);
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
        alert(data.message);
      })
      .catch((error) => {
        console.error(error);
      });
  }
};

export const exportTable = (machines, fetchMachines) => {
  let conf = confirm("Export data and archive machines?");
  if (!conf) {
    return;
  } else {
    const data = machines.map((machine) => [
      machine.model,
      1,
      machine.serial,
      machine.make,
      machine.style,
      machine.color + " " + machine.style,
      0,
      0,
      machine.condition,
    ]);

    const headers = [
      // ["Date", "ID", "Make", "Model No.", "Serial No.", "Style", "Color"],
      [
        "Model",
        "QTY",
        "Serial",
        "Brand",
        "Type",
        "Descr.",
        "Cost",
        "Price",
        "Cond.",
      ],
    ];
    const ws = XLSX.utils.aoa_to_sheet([...headers, ...data]);
    ws["!cols"] = [
      { wpx: 100 }, //mod
      { wpx: 25 }, //quan
      { wpx: 100 }, // ser
      { wpx: 80 }, // brand
      { wpx: 60 }, //type
      { wpx: 120 }, //descr
      { wpx: 60 }, // cost
      { wpx: 60 }, //price
      { wpx: 80 }, //cond
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Inventory Log");

    const wbBlob = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([wbBlob], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const formData = new FormData();
    formData.append("file", blob, "InventoryLog.xlsx");

    try {
      fetch("/api/send_email", {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          alert(data.message);
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (error) {
      console.error(error);
    }

    const archiveData = machines.map((machine) => ({ id: machine.id }));

    try {
      fetch("/api/archive_machines", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(archiveData),
      })
        .then((response) => {
          return response.json;
        })
        .then((data) => {
          console.log(data.message);
          fetchMachines();
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (error) {
      console.error(error);
      throw error;
    }

    XLSX.writeFile(wb, "InventorySheet.xlsx");
  }
};
