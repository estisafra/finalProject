import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Menubar } from "primereact/menubar";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

const RenterHome = () => {
    const navigate = useNavigate();
    const userName = useSelector((state) => state.user.name);
    const renterId = useSelector((state) => state.user.id);
    const updatedEmail = useSelector((state) => state.user.email);
    const updatedPhone = useSelector((state) => state.user.phone);
    const updatedAddress = useSelector((state) => state.user.address);
    
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showUpdateDialog, setShowUpdateDialog] = useState(false);
    const [updatedName, setUpdatedName] = useState(userName);
    const [email, setEmail] = useState(updatedEmail);
    const [phone, setPhone] = useState(updatedPhone);
    const [address, setAddress] = useState(updatedAddress);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const handleUpdateProfile = async () => {
        try {
            const response = await fetch(`http://localhost:8080/Renter/UpdatePersonalDetails/${renterId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    id: renterId,
                    name: updatedName,
                    email: email,
                    phone: phone,
                    address: address
                }),
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();
            console.log("Profile updated successfully:", data);
            setShowUpdateDialog(false);
        } catch (error) {
            console.error("There was a problem with the fetch operation:", error);
        }
    };

    const items = [
        {
            label: "Renter Accessories",
            icon: "pi pi-box",
            command: () => navigate("/renterAccessories"),
        },
        {
            label: "Renter Rents",
            icon: "pi pi-shopping-cart",
            command: () => navigate("/renterRents"),
        },
    ];

    const start = (
        <img
            alt="logo"
            src="https://sheviphoto.co.il/wp-content/uploads/2020/12/logo.png"
            style={{ height: "50px", borderRadius: "50%" }}
        />
    );

    const end = (
        <div style={{ position: "relative" }}>
            <div
                style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    backgroundColor: "#008080",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    fontSize: "1.2rem",
                    cursor: "pointer",
                }}
                onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
                {userName?.charAt(0).toUpperCase()}
            </div>
            {showProfileMenu && (
                <div
                    style={{
                        position: "absolute",
                        top: "60px",
                        right: "0",
                        backgroundColor: "#008080",
                        color: "white",
                        padding: "1rem",
                        borderRadius: "8px",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                        zIndex: 1000,
                    }}
                >
                    <p style={{ margin: 0, fontWeight: "bold" }}>{userName}</p>
                    <Button
                        label="Update Profile"
                        icon="pi pi-user-edit"
                        className="p-button-text"
                        style={{ color: "black", fontWeight: "bold", marginTop: "0.5rem" }}
                        onClick={() => {
                            setUpdatedName(userName);
                            setEmail(updatedEmail);
                            setPhone(updatedPhone);
                            setAddress(updatedAddress);
                            setShowUpdateDialog(true);
                        }}
                    />
                    <Button
                        label="Logout"
                        icon="pi pi-sign-out"
                        className="p-button-text"
                        style={{ color: "black", fontWeight: "bold", marginTop: "0.5rem" }}
                        onClick={handleLogout}
                    />
                </div>
            )}
            <Dialog header="Update Profile" visible={showUpdateDialog} onHide={() => setShowUpdateDialog(false)}>
                <div>
                    <label htmlFor="name">Name:</label><br />
                    <InputText
                        id="name"
                        value={updatedName}
                        onChange={(e) => setUpdatedName(e.target.value)}
                    /><br />
                    <label htmlFor="email">Email:</label><br />
                    <InputText
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    /><br />
                    <label htmlFor="phone">Phone:</label><br />
                    <InputText
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    /><br />
                    <label htmlFor="address">Address:</label><br />
                    <InputText
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                </div>
                <div style={{ marginTop: "1rem" }}>
                    <Button 
                    style={{ color: "black", fontWeight: "bold", marginTop: "0.5rem" }}
                    label="Save" onClick={handleUpdateProfile} />
                </div>
            </Dialog>
        </div>
    );

    return (
        <div
            style={{
                height: "100vh",
                backgroundImage: "url('https://sheviphoto.co.il/wp-content/uploads/2020/12/IMG_20201215_134159-scaled.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <Menubar
                model={items}
                start={start}
                end={end}
                style={{
                    backgroundColor: "#008080",
                    color: "white",
                    borderBottom: "2px solid #005757",
                    height: "100px",
                    width: "100%",
                }}
            />
            <div
                style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#008080",
                    textAlign: "center",
                }}
            >
                <h1 style={{ fontSize: "3rem", fontWeight: "bold", textShadow: "2px 2px 5px rgba(0,0,0,0.3)" }}>
                    Renter Home
                </h1>
                <p style={{ fontSize: "1.5rem", maxWidth: "600px" }}>
                    Welcome to the Renter Home page! Use the menu above to navigate to your accessories or rents.
                </p>
            </div>
        </div>
    );
};

export default RenterHome;
