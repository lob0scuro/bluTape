export const fetchUser = async (id) => {
  try {
    const response = await fetch(`/read/get_user/${id}`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error);
    }
    return { success: true, user: data.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const fetchUsers = async () => {
  try {
    const response = await fetch("/read/get_users");
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error);
    }
    return { success: true, users: data.users };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const fetchUserTasks = async (id, status) => {
  try {
    const response = await fetch(`/read/get_user_tasks/${id}/${status}`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error);
    }
    return { success: true, tasks: data.tasks };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const fetchUserWrapUps = async (id) => {
  try {
    const response = await fetch(`/read/get_user_wrap_ups/${id}`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error);
    }
    return { success: true, machines: data.wrap_ups };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const fetchMachine = async (id) => {
  try {
    const response = await fetch(`/read/get_machine/${id}`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error);
    }
    return { success: true, machine: data.machine };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const fetchMachines = async (endpoint, type_id) => {
  try {
    const response = await fetch(`/read/${endpoint}/${type_id}`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error);
    }
    return { success: true, machines: data.machines };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const fetchExportedMachines = async (type_id) => {
  try {
    const response = await fetch(
      `/read/get_exported_machines_by_type/${type_id}`
    );
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error);
    }
    return { success: true, machines: data.machines };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const fetchMachineNotes = async (id) => {
  try {
    const response = await fetch(`/read/get_machine_notes/${id}`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error);
    }
    return { success: true, notes: data.notes };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const changeMachineStatus = async (endpoint, id) => {
  try {
    const response = await fetch(`/update/${endpoint}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error);
    }
    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const submitForm = async ({ endpoint, method, inputs }) => {
  try {
    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    };
    if (inputs && method.toUpperCase() !== "GET") {
      options.body = JSON.stringify(inputs);
    }
    const response = await fetch(endpoint, options);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Something went wrong");
    }
    const result = {
      success: true,
    };
    if (data.message) result.message = data.message;

    const returnKeys = [
      "machine",
      "machines",
      "note",
      "notes",
      "user",
      "users",
      "task",
      "tasks",
    ];

    const item = returnKeys.reduce((acc, key) => acc || data[key], null);

    if (item) result.item = item;

    return result;
  } catch (error) {
    return { success: false, error: error.message };
  }
};
