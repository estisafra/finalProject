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
const RenterHome = lazy(() => import("./Components/Renter/RenterHome"));
const UserHome = lazy(() => import("./Components/User/UserHome"));
const PhotographyHome = lazy(() => import("./Components/Photography/PhotographyHome"));
const RenterAccessories = lazy(() => import("./Components/Renter/RenterAccessories"));
const RenterRents = lazy(() => import("./Components/Renter/RenterRents"));
const AddAccessory = lazy(() => import("./Components/Renter/AddAccessory"));
const UserAccessory = lazy(() => import("./Components/User/UserAccessory"));
const AccessoryDetails = lazy(() => import("./Components/User/AccessoryDetails"));
const UserRents = lazy(() => import("./Components/User/UserRents"));
const UserOrders = lazy(() => import("./Components/User/UserOrders"));
const Register = lazy(() => import("./Components/Register"));
const AllPhotography = lazy(() => import("./Components/User/AllPhotography"));
const PhotographerDetails = lazy(() => import("./Components/User/PhotographerDetails"));
const Gallery = lazy(() => import("./Components/User/gallery"));


function App() {
  
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register-photography" element={<RegisterPhotography />} />
        <Route path="/renterHome" element={<RenterHome />} />
        <Route path="/userHome" element={<UserHome />} />
        <Route path="/photographyHome" element={<PhotographyHome />} />
        <Route path="/renterAccessories" element={<RenterAccessories />} />
        <Route path="/renterRents" element={<RenterRents />} />
        <Route path="/addAccessory" element={<AddAccessory />} />
        <Route path="/userAccessory" element={<UserAccessory />} />
        <Route path="/accessoryDetails" element={<AccessoryDetails />} />
        <Route path="/userRents" element={<UserRents />} />
        <Route path="/sendEmails" element={<SendEmails />} />
        <Route path="/userOrders" element={<UserOrders/>}/>
        <Route path="/register" element={<Register />} />
        <Route path="/allPhotography" element={<AllPhotography />} />
        <Route path="/photographerDetails" element={<PhotographerDetails />} />
        <Route path="/gallery" element={<Gallery />} />

      </Routes>
      <SendEmails/>
    </Suspense>

  );
}

export default App;