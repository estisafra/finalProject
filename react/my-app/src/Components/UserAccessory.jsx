import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Menubar } from "primereact/menubar";
import { Button } from "primereact/button";
import axios from "axios";
import { useLocation } from "react-router-dom";

const UserAccessory = () => { 
    const location = useLocation();
    const { renterId } = location.state || {}; // קבלת renterId מ-location.state
    console.log("Renter ID:", renterId); // הדפסת ה-renterId לקונסול
    const navigate = useNavigate();
    const userName = useSelector((state) => state.user.name); // שם המשתמש
    const [showProfileMenu, setShowProfileMenu] = useState(false); // שליטה על תפריט הפרופיל
    const [accessories, setAccessories] = useState([]); // רשימת האביזרים

    // קריאת fetch לנתיב /Accessory/getAllAccessory עם token
    useEffect(() => {
        const fetchAccessories = async () => {
            const token = localStorage.getItem("token"); 
            console.log("Token:", token); // הדפסת ה-token לקונסול
            if (!token) {
                console.error("No token found. Redirecting to login.");
                navigate("/login");
                return;
            }

            try {
                const endpoint = `http://localhost:8080/Accessory/getAllAccessory`;

                const response = await axios.get(endpoint, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                console.log("Accessories fetched:", response.data);

                if (renterId) {
                    const filteredAccessories = response.data
                        .map(accessory => {
                            const matchingRenter = accessory.accessoryRenter.find(renter => renter.renter === renterId);
                            if (matchingRenter) {
                                return {
                                    ...accessory,
                                    accessoryRenter: [matchingRenter], // שמירת רק המשכיר המתאים
                                };
                            }
                            return null;
                        })
                        .filter(accessory => accessory !== null); // סינון אביזרים ללא משכיר מתאים
                    setAccessories(filteredAccessories); // שמירת האביזרים המסוננים ב-state
                } else {
                    setAccessories(response.data); // שמירת כל האביזרים ב-state
                }
            } catch (error) {
                console.error("Error fetching accessories:", error);
            }
        };

        fetchAccessories();
    }, [renterId]);

    const fixImagePath = (path) => {
        if (!path) return "";
        return path.replace(/\\/g, "/"); // החלפת backslashes ב-slashes
    };

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
            label: "Home",
            icon: "pi pi-home",
            command: () => navigate("/userHome"),
        },
        {
            label: "Rents",
            icon: "pi pi-shopping-cart",
            command: () => navigate("/userRents"),
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
        <div
            style={{
                height: "100vh",
                backgroundImage: "url('https://sheviphoto.co.il/wp-content/uploads/2020/12/IMG_20201215_134159-scaled.jpg')", // תמונה מהרקע באתר
                backgroundSize: "cover",
                backgroundPosition: "center",
                display: "flex",
                flexDirection: "column",
                color: "black", // צבע טקסט לבן כדי להתאים לרקע
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
                    height: "100px", // גובה מוגדל
                    width: "100%",
                }}
            />
            <div style={{ padding: "1rem", textAlign: "center", flex: 1 }}>
                <h1>User Accessories</h1>
                <p>Welcome to the User Accessories page! Use the menu above to navigate.</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "center" }}>
                    {accessories.map((accessory) =>
                        accessory.accessoryRenter.map((renter, index) => (
                            <div
                                key={`${accessory._id}-${index}`}
                                style={{
                                    border: "1px solid #ccc",
                                    borderRadius: "8px",
                                    padding: "1rem",
                                    width: "250px",
                                    textAlign: "center",
                                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                                    backgroundColor: "white", // רקע לבן עבור כל משכיר
                                    color: "black", // צבע טקסט שחור עבור כל משכיר
                                    position: "relative", // מאפשר מיקום יחסי לאייקון
                                }}
                            >
                                <h3>{accessory.accessoryName}</h3>
                                <p><strong>Price:</strong> {renter.price || "N/A"}</p>
                                <img
                                    src={`http://localhost:8080/${fixImagePath(renter.image)}`}
                                    alt={`${accessory.accessoryName} - Renter ${index + 1}`}
                                    style={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: "8px" }}
                                />
<<<<<<< HEAD
=======

>>>>>>> 1ec8672908b745c0bb6a68f9582add5242258011
                          <Button
    icon="pi pi-shopping-cart"
    className="p-button-rounded p-button-success"
    style={{
        position: "absolute",
        bottom: "10px",
        right: "10px",
        backgroundColor: "#008080", // צבע רקע תואם לסרגל
        color: "white", // צבע טקסט לבן
    }}
    onClick={() =>
        navigate("/AccessoryDetails", {
            state: { accessory, renter, renterId: renter.renter }, // הוספת ה-renterId ל-state
        })
    }
/>
<<<<<<< HEAD
=======


>>>>>>> 1ec8672908b745c0bb6a68f9582add5242258011
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserAccessory;