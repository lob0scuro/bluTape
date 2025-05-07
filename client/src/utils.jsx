import * as XLSX from "xlsx";

export const exportToExcel = async ({ data, filename }) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  XLSX.writeFile(workbook, filename);

  // try {
  //   const response = await fetch("/delete/delete_on_export", {
  //     method: "DELETE",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   });
  //   const data = await response.json();
  //   if (!response.ok) {
  //     return data.error || "There was an error";
  //   }
  //   return data.message || "Success!";
  // } catch (error) {
  //   return error;
  // }
};

export const formatDate = (date) => {
  const formatter = new Date(date);
  const formattedDate = formatter.toLocaleDateString("en-us", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return formattedDate;
};

export const roleMap = {
  0: "Refrigerator",
  1: "Washer",
  2: "Dryer/Range",
  3: "Sales",
  4: "Office",
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
  "Arctic King": "Arctic King",
  "Ascoli America": "Ascoli America",
  Avanti: "Avanti",
  Bosch: "Bosch",
  Cafe: "Cafe",
  "Comfort Aire": "Comfort Aire",
  Conservator: "Conservator",
  Crosley: "Crosley",
  Cuisinart: "Cuisinart",
  Danby: "Danby",
  Electrolux: "Electrolux",
  Estate: "Estate",
  "Fisher & Paykel": "Fisher & Paykel",
  Fridgidaire: "Fridgidaire",
  "Fridgidaire Gallery": "Fridgidaire Gallery",
  "Fridgidaire Professional": "Fridgidaire Professional",
  GE: "GE",
  "GE Profile": "GE Profile",
  Haier: "Haier",
  Hisense: "Hisense",
  Hotpoint: "Hotpoint",
  "Jenn-Air": "Jenn-Air",
  Kenmore: "Kenmore",
  Kitchenaid: "Kitchenaid",
  LG: "LG",
  "LG Signature": "LG Signature",
  "Magic Chef": "Magic Chef",
  Maytag: "Maytag",
  Midea: "Midea",
  Richmond: "Richmond",
  Roper: "Roper",
  Samsung: "Samsung",
  "Speed Queen": "Speed Queen",
  Tappan: "Tappan",
  Whirlpool: "Whirlpool",
  "White-Westinghouse": "White-Westinghouse",
};

export const colors = {
  Almond: "Almond",
  Aluminum: "Aluminum",
  Bisque: "Bisque",
  Black: "Black",
  "Black Stainless": "Black Stainless",
  Blue: "Blue",
  Bronze: "Bronze",
  Brown: "Brown",
  Champagne: "Champagne",
  Chrome: "Chrome",
  Copper: "Copper",
  Cream: "Cream",
  Gold: "Gold",
  Green: "Green",
  Grey: "Grey",
  Mirror: "Mirror",
  Nickel: "Nickel",
  Orange: "Orange",
  Other: "Other",
  "Panel Ready": "Panel Ready",
  Pink: "Pink",
  Platinum: "Platinum",
  Purple: "Purple",
  Red: "Red",
  Silver: "Silver",
  Stainless: "Stainless",
  Teal: "Teal",
  White: "White",
  "White Stainless": "White Stainless",
  Wood: "Wood",
  Yellow: "Yellow",
};

export const machineStyles = [
  {
    "Top & Bottom": "Top and Bottom",
    "Side by Side": "Side by Side",
    "French Door": "French Door",
    "Bottom Mount": "Bottom Mount",
    Upright: "Upright",
    Chest: "Chest",
  },
  {
    "Top Load": "Top Load",
    "Front Load": "Front Load",
    "All in One": "All in One",
  },
  {
    "Top Load": "Top Load",
    "Front Load": "Front Load",
    "All in One": "All in One",
  },
  {
    "Glass Top": "Glass Top",
    Coil: "Coil",
  },
];

export const vendors = {
  Pasadena: "Pasadena",
  "Baton Rouge": "Baton Rouge",
  Alexandria: "Alexandria",
  Viking: "Viking",
  "Stines LC": "Stines LC",
  "Stines Jenings": "Stines Jennings",
  Scrappers: "Scrappers",
};

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
    if (!response.ok) {
      alert("There was an error");
      throw new Error("There was an error.");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const fetchOneTech = async (id) => {
  try {
    const response = await fetch(`/auth/get_one_tech/${id}`);
    if (!response.ok) {
      throw new Error("There was an error");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    return error;
  }
};

export const fetchAllMachines = async (table, status) => {
  try {
    const response = await fetch(`/read/get_all_machines/${table}/${status}`);
    if (!response.ok) {
      throw new Error("There was an error.");
    }
    const data = await response.json();
    return { success: true, data: data };
  } catch (error) {
    return { success: false, error: error };
  }
};

export const fetchAllMachinesByType = async (table, status, typeOf) => {
  try {
    const response = await fetch(
      `/read/get_all_machines_by_type/${table}/${status}/${typeOf}`
    );
    if (!response.ok) {
      // alert("There was an error");
      throw new Error("There was an error.");
    }
    const data = await response.json();
    return { success: true, data: data };
  } catch (error) {
    return { success: false, error: error };
  }
};

export const fetchOneMachine = async (table, id) => {
  try {
    const response = await fetch(`/read/get_one_machine/${table}/${id}`);
    if (!response.ok) {
      alert("There was an error");
      throw new Error("There was an error");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    return error;
  }
};

export const finishRepair = async (id) => {
  try {
    const response = await fetch(`/update/add_to_inventory/${id}`, {
      method: "PATCH",
    });
    if (!response.ok) {
      alert("There was an error");
      throw new Error("There was an error.");
    }
    const data = await response.json();
    return data.message;
  } catch (error) {
    return error;
  }
};

export const deleteMachine = async (id) => {
  try {
    const response = await fetch(`/delete/delete/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("There was an error.");
    }
    const data = await response.json();
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
    if (!response.ok) {
      throw new Error("There was an error.");
    }
    const data = await response.json();
    setter((prev) => prev - 1);
    return data.message;
  } catch (error) {
    return error;
  }
};

export const zebra = async (machine) => {
  const zpl = `^XA
^FO25,25^GB750,375,6^FS
^FO200, 60^A0,35^FDbluTape/ Matt's Appliances^FS
^FO90,105^BQN,2,8^FDLA,https://blutape.net/repair-card/${machine.id}^FS
^FO350,130^A0,35^FDID: ${machine.id}^FS
^FO350,175^A0,35^FDBrand: ${machine.make}^FS
^FO350,220^A0,35^FDModel: ${machine.model}^FS
^FO350,265^A0,35^FDSerial: ${machine.serial}^FS
^FO350,310^A0,35^FDStyle: ${machine.style}^FS
^XZ`;

  try {
    const response = await fetch("/utils/zebra", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(zpl),
    });
    if (!response.ok) {
      throw new Error("There was an error.");
    }
    const data = await response.json();
    return data.message;
  } catch (error) {
    return error;
  }
};
