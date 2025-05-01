import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Menubar } from "primereact/menubar";
import { Button } from "primereact/button";

const RenterRents = () => {
    const [rents, setRents] = useState([]);
    const [viewType, setViewType] = useState("current"); // current או old
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const id = useSelector((state) => state.user.id);
    const userName = useSelector((state) => state.user.name);
    const navigate = useNavigate();

    useEffect(() => {
        if (!id) return;

        const token = localStorage.getItem("token");
        const endpoint =
            viewType === "old"
                ? `http://localhost:8080/Rent/getOldRentsByRenter/${id}`
                : `http://localhost:8080/Rent/getRentsByRenter/${id}`;

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

    const handleUpdateStatus = async (rentId) => {
        try {
            const token = localStorage.getItem("token");
            await axios.put(
                `http://localhost:8080/Renter/updateRentStatusToTrue/${rentId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            // עדכון מצב מקומי
            setRents((prev) =>
                prev.map((r) => (r._id === rentId ? { ...r, status: true } : r))
            );
        } catch (err) {
            console.error("Failed to update rent status", err);
        }
    };

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
            <div style={{ padding: "1rem" }}>
                <h1>Renter Rents</h1>

                {/* כפתורים להחלפת תצוגה */}
                <div style={{ marginBottom: "1rem" }}>
                    <Button
                        label="השכרות פעילות"
                        onClick={() => setViewType("current")}
                        className={`p-button-sm ${viewType === "current" ? "" : "p-button-outlined"}`}
                        style={{ marginRight: "10px" }}
                    />
                    <Button
                        label="השכרות עבר"
                        onClick={() => setViewType("old")}
                        className={`p-button-sm ${viewType === "old" ? "" : "p-button-outlined"}`}
                    />
                </div>

                <ul>
                    {rents.map((rent, index) => (
                        <li key={index} style={{ marginBottom: '1rem' }}>
                            Rent User: {rent.rentUser?.userName || "Unknown User"} <br />
                            Rent Date: {rent.rentDate ? new Date(rent.rentDate).toLocaleDateString() : "Unknown Date"} <br />
                            Rent Accessories:{" "}
                            {Array.isArray(rent.rentAccessories) ? (
                                rent.rentAccessories.map((accessory, idx) => (
                                    <span key={idx} style={{ marginLeft: "10px" }}>
                                        {accessory.accessoryName || "Unknown Accessory"}
                                    </span>
                                ))
                            ) : (
                                "No Accessories"
                            )}
                            {/* כפתור עדכון סטטוס - רק אם viewType === old */}
                            {viewType === "old" && !rent.status && (
                                <div style={{ marginTop: "10px" }}>
                                    <Button
                                        label="עדכן סטטוס ל-TRUE"
                                        icon="pi pi-check"
                                        className="p-button-success p-button-sm"
                                        onClick={() => handleUpdateStatus(rent._id)}
                                    />
                                </div>
                            )}
                            {viewType === "old" && rent.status && (
                                <div style={{ marginTop: "10px", color: "green", fontWeight: "bold" }}>
                                    סטטוס: עודכן
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default RenterRents;
