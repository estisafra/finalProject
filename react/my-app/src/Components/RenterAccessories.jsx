import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Menubar } from "primereact/menubar";
import { Toast } from "primereact/toast"; // ייבוא Toast מ-PrimeReact
import { Button } from "primereact/button"; // ייבוא Button מ-PrimeReact
import DeleteAccessory from "./DeleteAccessory";

const RenterAccessories = () => {
    const [accessories, setAccessories] = useState([]); // רשימת האביזרים
    const [showAddAccessory, setShowAddAccessory] = useState(false); // שליטה על תצוגת הוספת אביזר
    const [deletingAccessoryId, setDeletingAccessoryId] = useState(null); // ID של האביזר למחיקה
    const [showProfileMenu, setShowProfileMenu] = useState(false); // שליטה על תפריט הפרופיל
    const id = useSelector((state) => state.user.id); // ID של המשתמש המחובר
    const userName = useSelector((state) => state.user.name); // שם המשתמש
    const toast = useRef(null); // רפרנס ל-Toast
    const navigate = useNavigate(); // לשימוש בניווט

    // שליפת האביזרים מהשרת
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
        navigate("/addAccessory"); // ניווט לדף הוספת אביזר
    }

    // טיפול במחיקת אביזר
    const handleDelete = (accessoryid) => {
        setDeletingAccessoryId(accessoryid);
    };

    // עדכון הרשימה לאחר מחיקה
    const handleDeleteSuccess = () => {
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

        setDeletingAccessoryId(null); // איפוס ה-ID של האביזר שנמחק
    };

    // פריטי ה-Menubar
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
            <Toast ref={toast} /> {/* רכיב Toast להצגת הודעות */}
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
            <button onClick={() => setShowAddAccessory(true)}>To add accessory</button>
                <h1>Renter Accessories</h1>
                <ul>
                    {accessories.map((accessory) => (
                        <li key={accessory.accessoryId || accessory.accessoryName}>
                            <div>
                                Accessory Name: {accessory.accessoryName} <br />
                                Accessory Price: {accessory.price} <br />
                                <img
                                    src={`http://localhost:8080${accessory.image}`}
                                    alt="accessory"
                                    style={{ width: "100px", height: "auto" }}
                                />
                            </div>
                            <button onClick={() => handleDelete(accessory.accessoryId)}>Delete</button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* קריאה לקומפוננטת DeleteAccessory */}
            {deletingAccessoryId && (
                <DeleteAccessory
                    accessoryid={deletingAccessoryId}
                    onSuccess={handleDeleteSuccess}
                    onClose={() => setDeletingAccessoryId(null)}
                />
            )}
        </div>
    );
};

export default RenterAccessories;
