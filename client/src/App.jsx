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

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />}>
        <Route element={<ProtectedRoutes />}>
          <Route index element={<Home />} />
          <Route path="start" element={<StartRepair />} />
        </Route>
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
