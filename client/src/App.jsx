import React from "react";
import {
  Route,
  createRoutesFromElements,
  createBrowserRouter,
  RouterProvider,
  Routes,
} from "react-router-dom";
import RootLayout from "./layout/RootLayout";
import ProtectedRoutes from "./layout/ProtectedRoutes";
import Home from "./routes/Home";
import Register from "./routes/Register";
import Login from "./routes/Login";
import StartRepair from "./routes/StartRepair";
import ActiveRepairs from "./routes/ActiveRepairs";
import RepairCard from "./routes/RepairCard";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />}>
        <Route element={<ProtectedRoutes />}>
          <Route index element={<Home />} />
          <Route path="start" element={<StartRepair />} />
          <Route path="active" element={<ActiveRepairs />} />
        </Route>
        <Route path="card/:id/:typeOf" element={<RepairCard />} />
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
      </Route>
    )
  );

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
