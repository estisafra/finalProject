import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Menubar } from "primereact/menubar";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserRents = () => {
    const [rents, setRents] = useState([]);
    const id = useSelector((state) => state.user.id);
    const userName = useSelector((state) => state.user.name);
    const [showProfileMenu, setShowProfileMenu] = useState(false); // שליטה על תפריט הפרופיל
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            const token = localStorage.getItem("token");
            console.log("Token:", token);

            axios.get(`http://localhost:8080/Rent/getRentsByUser/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                console.log("Response data:", response.data);
                setRents(response.data.rents);
            })
            .catch((error) => {
                console.error("Error fetching rents:", error);
            });
        }
    }, [id]);

    // פריטי ה-Menubar
    const items = [
        {
            label: "Photographers",
            icon: "pi pi-camera",
            command: () => navigate("/photographers"),
        },
        {
            label: "Orders",
            icon: "pi pi-file",
            command: () => navigate("/userOrders"),
        },
        {
            label: "Accessories",
            icon: "pi pi-box",
            command: () => navigate("/userAccessory"),
        },
        {
            label: "Home",
            icon: "pi pi-home",
            command: () => navigate("/userHome"),
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
                {userName?.charAt(0).toUpperCase() || "?"}
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
                    <p style={{ margin: 0, fontWeight: "bold" }}>{userName || "Guest"}</p>
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
                    height: "100px",
                    width: "100%",
                }}
            />
            <div style={{ padding: "1rem", textAlign: "center" }}>
                <h1>User Rents</h1>
                {rents.map((rent) => (
                    <div key={rent._id} className="rent-card">
                        <h3>Rent ID: {rent._id}</h3>
                        <p>Renter ID: {rent.rentRenter ? rent.rentRenter._id : 'N/A'}</p>
                        <p>User ID: {rent.rentUser ? rent.rentUser._id : 'N/A'}</p>
                        <p>Start Date: {new Date(rent.rentDate).toLocaleDateString()}</p>
                        <p>End Date: {rent.rentReturnDate ? new Date(rent.rentReturnDate).toLocaleDateString() : 'N/A'}</p>
                        <p>Price: {rent.rentPrice ? rent.rentPrice : 0}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserRents;
