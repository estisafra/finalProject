import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import 'primereact/resources/themes/saga-blue/theme.css';  // תוכל לבחור את הנושא שאתה אוהב
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import SendEmails from './Components/SendEmails';

// טעינה דינמית של הקומפוננטות
const Home = lazy(() => import("./Components/Home"));
const Login = lazy(() => import("./Components/Login"));
const RegisterPhotography = lazy(() => import("./Components/RegisterPhotography"));
const RegisterRenter = lazy(() => import("./Components/RegisterRenter"));
const RegisterUser = lazy(() => import("./Components/RegisterUser"));
const RenterHome = lazy(() => import("./Components/RenterHome"));
const UserHome = lazy(() => import("./Components/UserHome"));
const PhotographyHome = lazy(() => import("./Components/PhotographyHome"));
const RenterAccessories = lazy(() => import("./Components/RenterAccessories"));
const RenterRents = lazy(() => import("./Components/RenterRents"));
const AddAccessory = lazy(() => import("./Components/AddAccessory"));
const UserAccessory = lazy(() => import("./Components/UserAccessory"));
const AccessoryDetails = lazy(() => import("./Components/AccessoryDetails"));

function App() {
  
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register-photography" element={<RegisterPhotography />} />
        <Route path="/register-renter" element={<RegisterRenter />} />
        <Route path="/register-user" element={<RegisterUser />} />
        <Route path="/renterHome" element={<RenterHome />} />
        <Route path="/userHome" element={<UserHome />} />
        <Route path="/photographyHome" element={<PhotographyHome />} />
        <Route path="/renterAccessories" element={<RenterAccessories />} />
        <Route path="/renterRents" element={<RenterRents />} />
        <Route path="/addAccessory" element={<AddAccessory />} />
        <Route path="/userAccessory" element={<UserAccessory />} />
        <Route path="/accessoryDetails" element={<AccessoryDetails />} />
      </Routes>
    </Suspense>
  
  );
}

export default App;