import { Link } from "react-router-dom";

export const renderData = (machines) => {
  const data = machines.map((machine) => (
    <tr key={machine.id}>
      <td>
        <Link to={`/repair-card/${machine.id}`}>{machine.make}</Link>
      </td>
      <td>{machine.model}</td>
      <td className={machine.color}>{machine.style}</td>
    </tr>
  ));
  return data;
};
