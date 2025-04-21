import { Routes, Route } from "react-router-dom";
import Login from "./Components/Login";
import RegisterPhotography from "./Components/RegisterPhotography";
import RegisterRenter from "./Components/RegisterRenter";
import RegisterUser from "./Components/RegisterUser";
import RenterAccessories from "./Components/RenterAccessories";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register-photography" element={<RegisterPhotography />} />
      <Route path="/register-renter" element={<RegisterRenter />} />
      <Route path="/register-user" element={<RegisterUser />} />
    </Routes>
    // <RenterAccessories/>
  );
}

export default App;