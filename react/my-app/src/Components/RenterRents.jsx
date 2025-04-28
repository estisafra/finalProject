import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Menubar } from "primereact/menubar";
import { Button } from "primereact/button";

const RenterRents = () => {
    const [rents, setRents] = useState([]);
    const [showProfileMenu, setShowProfileMenu] = useState(false); // שליטה על תפריט הפרופיל
    const id = useSelector((state) => state.user.id);
    const userName = useSelector((state) => state.user.name); // שם המשתמש
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            const token = localStorage.getItem("token"); // קבלת ה-token מה-localStorage
            console.log("Token:", token); // הדפסת ה-token לבדיקה

            axios
                .get(`http://localhost:8080/Rent/getRentsByRenter/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`, // הוספת ה-token בכותרות
                    },
                })
                .then((response) => {
                    console.log("Response data:", response.data);
                    setRents(response.data.rents); // גש למערך rents
                })
                .catch((error) => {
                    console.error("Error fetching rents:", error);
                });
        }
    }, [id]);

    // פריטי ה-Menubar
    const items = [
        {
            label: "Home",
            icon: "pi pi-home",
            command: () => navigate("/renterHome"),
        },
        {
            label: "Renter Accessories",
            icon: "pi pi-box",
            command: () => navigate("/renterAccessories"),
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
                        onClick={() => {
                            localStorage.removeItem("token");
                            navigate("/login");
                        }}
                    />
                </div>
            )}
        </div>
    );

    return (
        <div>
            <Menubar
                model={items}
                start={start}
                end={end}
                style={{
                    backgroundColor: "#008080",
                    color: "white",
                    borderBottom: "2px solid #005757",
                    height: "100px", // גובה מוגדל
                    width: "100%",
                }}
            />
            <div style={{ padding: "1rem" }}>
                <h1>Renter Rents</h1>
                <ul>
                    {rents.map((rent, index) => (
                        <li key={index}>
                            Rent User: {rent.rentUser?.userName || "Unknown User"} <br />
                            Rent Date: {new Date(rent.rentDate).toLocaleDateString()}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default RenterRents;