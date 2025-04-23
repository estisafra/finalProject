import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menubar } from "primereact/menubar";
import { Button } from "primereact/button";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { useSelector } from "react-redux"; // שליפת שם המשתמש מה-slic

const Home = () => {
    const navigate = useNavigate();
    const [showProfileMenu, setShowProfileMenu] = useState(false);// ניתן לשנות בהתאם למשתמש המחובר
    const userName = useSelector((state) => state.user.name);// שליפת שם המשתמש מה-slice
    const handleLogin = () => {
        navigate("/login");
    };

    const items = [
        {
            label: "Login",
            icon: "pi pi-sign-in",
            command: handleLogin,
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
                position: "absolute",
                top: "50px",
                right: "0",
                backgroundColor: "#005757",
                color: "white",
                padding: "0.5rem",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                zIndex: 1000,
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
                        label="Login"
                        icon="pi pi-sign-in"
                        className="p-button-text"
                        style={{ color: "#fff", fontWeight: "bold", marginTop: "0.5rem" }}
                        onClick={handleLogin}
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
                    Welcome to the Home Page
                </h1>
                <Button
                    label="Go to Login"
                    icon="pi pi-sign-in"
                    className="p-button-rounded p-button-lg"
                    style={{
                        backgroundColor: "#008080",
                        borderColor: "#005757",
                        color: "white",
                        fontWeight: "bold",
                        marginTop: "1rem",
                    }}
                    onClick={handleLogin}
                />
            </div>
        </div>
    );
};

export default Home;