export const renderOptions = (obj) => {
  if (!obj || typeof obj !== "object") return null;
  return (
    Object.entries(obj).map(([key, value]) => (
      <option key={key} value={key}>
        {value}
      </option>
    )) || null
  );
};

export const formatDate = (date) => {
  if (!date) return "";
  const formatter = new Date(`${date}`);
  if (isNaN(formatter.getTime())) return "";
  const formattedDate = formatter.toLocaleDateString("en-us", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return formattedDate;
};

export const convertTime = (time) => {
  const [hourStr, minute] = time.split(":");
  let hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? "PM" : "AM";

  hour = hour % 12;
  if (hour === 0) hour = 12;

  return `${hour}:${minute} ${ampm}`;
};

export const currentDay = () => {
  const date = new Date();

  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayOfWeek = weekdays[date.getDay()];
  const month = months[date.getMonth()];
  const day = date.getDate();

  const getOrdinal = (n) => {
    if (n >= 11 && n <= 13) return n + "th";
    switch (n % 10) {
      case 1:
        return n + "st";
      case 2:
        return n + "nd";
      case 3:
        return n + "rd";
      default:
        return n + "th";
    }
  };

  return `${dayOfWeek}, ${month} ${getOrdinal(day)}`;
};
