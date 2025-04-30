import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Menubar } from "primereact/menubar";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import axios from "axios";

const UserRents = () => {
    const [rents, setRents] = useState([]);
    const [viewType, setViewType] = useState("current");
    const id = useSelector((state) => state.user.id);
    const userName = useSelector((state) => state.user.name);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!id) return;

        const token = localStorage.getItem("token");
        const endpoint =
            viewType === "old"
                ? `http://localhost:8080/Rent/getOldRentsByUser/${id}`
                : `http://localhost:8080/Rent/getRentsByUser/${id}`;

        axios
            .get(endpoint, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                setRents(response.data.rents);
            })
            .catch((error) => {
                console.error("Error fetching rents:", error);
            });
    }, [id, viewType]);

    const items = [
        { label: "Photographers", icon: "pi pi-camera", command: () => navigate("/photographers") },
        { label: "Orders", icon: "pi pi-file", command: () => navigate("/userOrders") },
        { label: "Accessories", icon: "pi pi-box", command: () => navigate("/userAccessory") },
        { label: "Home", icon: "pi pi-home", command: () => navigate("/userHome") },
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
            <Menubar model={items} start={start} end={end} style={{
                backgroundColor: "#008080",
                color: "white",
                borderBottom: "2px solid #005757",
                height: "100px",
                width: "100%",
            }} />

            <div style={{ padding: "1rem", textAlign: "center" }}>
                <h1>User Rents</h1>

                <div style={{ marginBottom: "1rem" }}>
                    <Button
                        label="השכרות פעילות"
                        onClick={() => setViewType("current")}
                        className={`p-button-sm ${viewType === "current" ? "" : "p-button-outlined"}`}
                        style={{ marginRight: "10px" }}
                    />
                    <Button
                        label="השכרות ישנות"
                        onClick={() => setViewType("old")}
                        className={`p-button-sm ${viewType === "old" ? "" : "p-button-outlined"}`}
                    />
                </div>

                {rents.map((rent) => (
                    <div key={rent._id} className="rent-card" style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem" }}>
                        <h3>Rent ID: {rent._id}</h3>
                        <p>Renter ID: {rent.rentRenter ? rent.rentRenter._id : 'N/A'}</p>
                        <p>User ID: {rent.rentUser ? rent.rentUser._id : 'N/A'}</p>
                        <p>Start Date: {new Date(rent.rentDate).toLocaleDateString()}</p>
                        <p>End Date: {rent.rentReturnDate ? new Date(rent.rentReturnDate).toLocaleDateString() : 'N/A'}</p>
                        <p>Price: {rent.rentPrice ?? 0}</p>
                        <p>סטטוס: {rent.status != null ? (rent.status ? "מאושר" : "ממתין") : "לא ידוע"}</p>

                        {rent.rentAccessories?.length > 0 && (
                            <div style={{ display: "flex", gap: "10px", marginTop: "10px", flexWrap: "wrap" }}>
                                {rent.rentAccessories.map((acc) => (
                                    <div key={acc._id} style={{ textAlign: "center" }}>
                                        <img
                                            src={acc.matchedImage || "https://via.placeholder.com/80"}
                                            alt={acc.accessoryName || "Accessory"}
                                            style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "8px" }}
                                        />
                                        <p style={{ fontSize: "0.8rem" }}>{acc.accessoryName || "ללא שם"}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {viewType === "current" && (
                            <div style={{ marginTop: "10px" }}>
                                <Button
                                    label="בטל"
                                    icon="pi pi-times"
                                    className="p-button-danger p-button-sm"
                                    onClick={() => {
                                        console.log("Cancel rent:", rent._id);
                                        // פה אפשר להוסיף קריאה לשרת לביטול
                                    }}
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserRents;
