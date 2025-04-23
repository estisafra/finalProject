import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Menubar } from "primereact/menubar";
import { Button } from "primereact/button";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

const RenterHome = () => {
    const navigate = useNavigate();
    const userName = useSelector((state) => state.user.name); // Get the name from the slice
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
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
            src="https://sheviphoto.co.il/wp-content/uploads/2020/12/logo.png" // לוגו מהאתר
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
                        label="Logout"
                        icon="pi pi-sign-out"
                        className="p-button-text"
                        style={{ color: "#fff", fontWeight: "bold", marginTop: "0.5rem" }}
                        onClick={handleLogout}
                    />
                </div>
            )}
        </div>
    );

    return (
        <div
            style={{
                height: "100vh",
                backgroundImage: "url('https://sheviphoto.co.il/wp-content/uploads/2020/12/IMG_20201215_134159-scaled.jpg')", // תמונה מהרקע באתר
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
                    height: "70px", // גובה מוגדל
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