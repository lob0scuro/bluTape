import { useState, createContext, useEffect } from "react";
import { getTechs } from "./api/Calls";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./routes/Home";
import LoginPage from "./routes/LoginPage";
import StartRepair from "./routes/StartRepair";
import ActiveRepairs from "./routes/ActiveRepairs";
import InventoryList from "./routes/InventoryList";
import EditMachine from "./routes/EditMachine";
import RepairCard from "./routes/RepairCard";
import Footer from "./components/Footer";

export const LoginContext = createContext();

function App() {
  const [user, setUser] = useState({});
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loggedIn) {
      navigate("/login-page");
    }
  }, [loggedIn, navigate]);

  return (
    <div id="app-container">
      <LoginContext.Provider value={[loggedIn, setLoggedIn, user, setUser]}>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login-page" element={<LoginPage />} />
          <Route path="/start-repair" element={<StartRepair />} />
          <Route path="/active-repairs" element={<ActiveRepairs />} />
          <Route path="/edit-machine/:id" element={<EditMachine />} />
          <Route path="/inventory-list" element={<InventoryList />} />
          <Route path="/repair-card/:id" element={<RepairCard />} />
        </Routes>
        <Footer />
      </LoginContext.Provider>
    </div>
  );
}

export default App;
