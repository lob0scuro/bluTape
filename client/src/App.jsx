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
import MachineTable from "./routes/table/MachineTable";
import RequestPasswordReset from "./routes/auth/RequestPasswordReset";
import ResetPassword from "./routes/auth/ResetPassword";
import UpdateUserInfo from "./routes/admin/UpdateUserInfo";
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
          <Route path="table/:status" element={<MachineTable />} />
          <Route path="admin-panel" element={<AdminPanel />} />
          <Route path="update-user/:user_id" element={<UpdateUserInfo />} />
        </Route>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route
          path="/request-password-reset"
          element={<RequestPasswordReset />}
        />
        <Route path="reset-password/:token" element={<ResetPassword />} />
        <Route path="card/:id" element={<Card />} />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
};

export default App;
