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
