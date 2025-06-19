import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import RootLayout from "./layout/RootLayout";
import ProtectedRoutes from "./layout/ProtectedRoutes";
import TechHome from "./routes/home/TechHome";
import CleanerHome from "./routes/home/CleanerHome";
import SalesHome from "./routes/home/SalesHome";
import OfficeHome from "./routes/home/OfficeHome";
import DriverHome from "./routes/home/DriverHome";
import ServiceHome from "./routes/home/ServiceHome";
import AdminPanel from "./routes/admin/AdminPanel";
import Login from "./routes/auth/Login";
import Register from "./routes/auth/Register";
import AddMachine from "./routes/add/AddMachine";
import Card from "./routes/card/Card";
import QueueTable from "./routes/table/QueueTable";
import ExportTable from "./routes/table/ExportTable";
import InventoryTable from "./routes/table/InventoryTable";
import { useAuth } from "./context/UserContext";

const App = () => {
  const { user } = useAuth();
  const userPositions = {
    Technician: <TechHome />,
    Cleaner: <CleanerHome />,
    Sales: <SalesHome />,
    Office: <OfficeHome />,
    Driver: <DriverHome />,
    Service: <ServiceHome />,
  };
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />}>
        <Route element={<ProtectedRoutes />}>
          <Route index element={user ? userPositions[user.position] : null} />
          <Route path="add" element={<AddMachine />} />
          <Route path="queue" element={<QueueTable />} />
          <Route path="export" element={<ExportTable />} />
          <Route path="inventory" element={<InventoryTable />} />
          <Route path="admin-panel" element={<AdminPanel />} />
        </Route>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="card/:id" element={<Card />} />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
};

export default App;
