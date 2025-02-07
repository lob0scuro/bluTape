import { useState, useEffect, useContext } from "react";
import "./App.css";
import {
  Navigate,
  Route,
  Routes,
  createRoutesFromElements,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Home from "./routes/Home";
import LoginPage from "./routes/LoginPage";
import StartRepair from "./routes/StartRepair";
import ActiveRepairs from "./routes/ActiveRepairs";
import InventoryList from "./routes/InventoryList";
import EditMachine from "./routes/EditMachine";
import RepairCard from "./routes/RepairCard";
import Archives from "./routes/Archives";
import RootLayout from "./layout/RootLayout";
import ProtectedRoutes from "./layout/ProtectedRoutes";

function App() {
  // const navigate = useNavigate();

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />}>
        <Route element={<ProtectedRoutes />}>
          <Route index element={<Home />} />
          <Route path="start-repair" element={<StartRepair />} />
          <Route path="active-repairs" element={<ActiveRepairs />} />
          <Route path="edit-machine/:id" element={<EditMachine />} />
          <Route path="inventory-list" element={<InventoryList />} />
          <Route path="archives" element={<Archives />} />
        </Route>
        <Route path="login-page" element={<LoginPage />} />
        <Route path="repair-card/:id" element={<RepairCard />} />
      </Route>
    )
  );

  return (
    <>
      <RouterProvider router={router} />
    </>
  );

  // return (
  //   <div id="app-container">
  //     <Navbar />
  //     <Routes>
  //       <Route
  //         path="/"
  //         element={user ? <Home /> : <Navigate to="/login-page" />}
  //       />
  //       <Route path="/login-page" element={<LoginPage />} />
  //       <Route
  //         path="/start-repair"
  //         element={<ProtectedRoute element={<StartRepair />} />}
  //       />
  //       <Route
  //         path="/active-repairs"
  //         element={<ProtectedRoute element={<ActiveRepairs />} />}
  //       />
  //       <Route
  //         path="/edit-machine/:id"
  //         element={<ProtectedRoute element={<EditMachine />} />}
  //       />
  //       <Route
  //         path="/inventory-list"
  //         element={<ProtectedRoute element={<InventoryList />} />}
  //       />
  //       <Route
  //         path="/archives"
  //         element={<ProtectedRoute element={<Archives />} />}
  //       />
  //       <Route
  //         path="/repair-card/:id"
  //         element={
  //           <ProtectedRoute
  //             element={<RepairCard />}
  //             exemptRoutes={["/repair-card"]}
  //           />
  //         }
  //       />
  //     </Routes>
  //     <Footer />
  //   </div>
  // );
}

export default App;
