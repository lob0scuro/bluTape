import React from "react";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import RootLayout from "./layout/RootLayout";
import ProtectedRoutes from "./layout/ProtectedLayout";
import AdminRoutes from "./layout/AdminRoutes";
import Home from "./routes/home/Home";
import Login from "./routes/auth/login/Login";
import Register from "./routes/admin/register/Register";
import Card from "./routes/card/Card";
import QRScannerPage from "./routes/find-machine/QRScannerPage";
import MachineTable from "./routes/tables/MachineTable";
import AdminPanel from "./routes/admin/home/AdminPanel";
import EmployeeInfo from "./routes/admin/employee-info/EmployeeInfo";
import ExportMachines from "./routes/admin/export/ExportMachines";
const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />}>
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
        <Route element={<ProtectedRoutes />}>
          <Route index element={<Home />} />
          <Route path="card/:id" element={<Card />} />
          <Route path="find" element={<QRScannerPage />} />
          <Route path="table" element={<MachineTable />} />
          <Route element={<AdminRoutes />}>
            <Route path="admin-panel" element={<AdminPanel />} />
            <Route path="employee-info" element={<EmployeeInfo />} />
            <Route path="export" element={<ExportMachines />} />
          </Route>
        </Route>
        <Route path="*" element={<h1>Page not found</h1>} />
      </Route>
    )
  );
  return <RouterProvider router={router} />;
};

export default App;
