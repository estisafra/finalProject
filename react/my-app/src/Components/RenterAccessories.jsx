import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Menubar } from "primereact/menubar";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import DeleteAccessory from "./DeleteAccessory";


const RenterAccessories = () => {
    const [accessories, setAccessories] = useState([]);
    const [showAddAccessory, setShowAddAccessory] = useState(false);
    const [deletingAccessoryId, setDeletingAccessoryId] = useState(null);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const id = useSelector((state) => state.user.id);
    const userName = useSelector((state) => state.user.name);
    const toast = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAccessories = async () => {
            const token = localStorage.getItem("token");
            if (id) {
                try {
                    const response = await axios.get(`http://localhost:8080/Accessory/getAccessoryByRenter/${id}`, {
                        headers: {
                            "Authorization": `Bearer ${token}`,
                        },
                    });
                    setAccessories(response.data);
                } catch (error) {
                    console.error("Error fetching accessories:", error);
                }
            }
        };

        fetchAccessories();
    }, [id]);

    if (showAddAccessory) {
        navigate("/addAccessory");
    }

    const handleDelete = (accessoryid) => {
        setDeletingAccessoryId(accessoryid);
    };

<<<<<<< HEAD
    // עדכון הרשימה לאחר מחיקה
    const handleDeleteSuccess = async () => {
        setDeletingAccessoryId(null); // איפוס ה-ID של האביזר שנמחק
    
        // עדכון הרשימה על ידי סינון האביזר שנמחק
        setAccessories(prevAccessories => 
            prevAccessories.filter(accessory => accessory.accessoryId !== deletingAccessoryId)
        );
    
        // הצגת הודעת הצלחה
        toast.current.show({
            severity: 'success',
            summary: 'Success',
            detail: 'Accessory deleted successfully',
            life: 3000,
        });
    };
=======
    const handleDeleteSuccess = () => {
        setAccessories((prevAccessories) =>
            prevAccessories.filter((accessory) => accessory.accessoryId !== deletingAccessoryId)
        );
        setDeletingAccessoryId(null);
    };

    const handleMessage = (message) => {
        toast.current.show({
            severity: message.severity,
            summary: message.summary,
            detail: message.detail,
            life: 3000,
        });
    };

    const items = [
        {
            label: "Home",
            icon: "pi pi-home",
            command: () => navigate("/renterHome"),
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

>>>>>>> userComponents
    return (
        <div>
            <Toast ref={toast} />
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
                <button onClick={() => setShowAddAccessory(true)}>To add accessory</button>
                <h1>Renter Accessories</h1>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "center" }}>
                    {accessories.map((accessory) => (
                        <div
                            key={accessory.accessoryId || accessory.accessoryName}
                            style={{
                                border: "1px solid #ccc",
                                borderRadius: "8px",
                                padding: "1rem",
                                width: "250px",
                                textAlign: "center",
                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                                backgroundColor: "white",
                                position: "relative",
                            }}
                        >
                            <h3>{accessory.accessoryName}</h3>
                            <p>
                                <strong>Price:</strong> {accessory.price || "N/A"}
                            </p>
                            <img
                                src={`http://localhost:8080${accessory.image}`}
                                alt={accessory.accessoryName}
                                style={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: "8px" }}
                            />
                            <Button
                                icon="pi pi-trash"
                                className="p-button-rounded p-button-danger"
                                style={{
                                    position: "absolute",
                                    bottom: "10px",
                                    right: "10px",
                                }}
                                onClick={() => handleDelete(accessory.accessoryId)}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {deletingAccessoryId && (
                <DeleteAccessory
                    accessoryid={deletingAccessoryId}
                    onSuccess={handleDeleteSuccess}
                    onClose={() => setDeletingAccessoryId(null)}
                    onMessage={handleMessage}
                />
            )}
        </div>
    );
};

export default RenterAccessories;