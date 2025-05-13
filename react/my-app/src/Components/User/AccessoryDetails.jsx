import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux"; // ייבוא useSelector
import { Menubar } from "primereact/menubar";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dialog } from "primereact/dialog";
import axios from "axios";

const AccessoryDetails = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { accessory, renter, renterId } = location.state || {}; // קבלת הנתונים מ-state
    const [selectedDate, setSelectedDate] = useState(null); // תאריך שנבחר
    const [occupiedDates, setOccupiedDates] = useState([]); // תאריכים תפוסים
    const [showProfileMenu, setShowProfileMenu] = useState(false); // שליטה על תפריט הפרופיל
    const [accessories, setAccessories] = useState([]); // אביזרים נוספים
    const [showAccessoriesDialog, setShowAccessoriesDialog] = useState(false); // הצגת דיאלוג אביזרים נוספים

    // שליפת שם המשתמש מה-Redux Store
    const userName = useSelector((state) => state.user.name); // שימוש ב-useSelector

    // פונקציה לשליפת תאריכים תפוסים מהשרת
    const fetchOccupiedDates = async (year, month) => {
        try {
            console.log({ month });
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("No token found. Redirecting to login.");
                navigate("/login");
                return;
            }

            const response = await axios.get(
                "http://localhost:8080/Accessory/getOccupiedDates",
                {
                    params: {
                        renterId,
                        accessoryId: accessory._id,
                        year,
                        month,
                    },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setOccupiedDates(response.data.map((date) => new Date(date)));
            console.log("Occupied dates fetched:", response.data);
        } catch (error) {
            console.error("Error fetching occupied dates:", error);
        }
    };

    // פונקציה לטיפול בבחירת תאריך
    const userId = useSelector((state) => state.user.id); // העבר את השורה הזאת לכאן

    // פונקציה לטיפול בבחירת תאריך
    const handleDateSelection = async (date) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("No token found. Redirecting to login.");
                navigate("/login");
                return;
            }

            const response = await axios.post(
                "http://localhost:8080/Rent/checkOrCreateRent",
                {
                    rentDate: date,
                    renterId,
                    accessoryId: accessory._id,
                    userId, // השתמש ב-userId שנשמר במצב
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log("Rent check/create response:", response.data);
            if (response.data.message === "New rent created") {
                alert("השכרה חדשה נפתחה בהצלחה!");
                setOccupiedDates((prevDates) => [...prevDates, new Date(date)]); // עדכון התאריכים התפוסים
                if (window.confirm("האם תרצה לראות אביזרים נוספים ממשכיר זה?")) {
                    navigate("/userAccessory", { state: { renterId } });
                }
            } else if (response.data.message === "Accessory added to existing rent") {
                alert("אביזר נוסף להשכרה קיימת!");
                setOccupiedDates((prevDates) => [...prevDates, new Date(date)]); // עדכון התאריכים התפוסים
            } else if (response.data.message === "Accessory already exists in the rent") {
                alert("אביזר זה כבר קיים בהשכרה!");
            }
        } catch (error) {
            console.error("Error handling date selection:", error);
            alert("אירעה שגיאה בעת טיפול בבחירת התאריך.");
        }
    };

    // קריאה ראשונית לפונקציה בעת טעינת הקומפוננטה
    useEffect(() => {
        const currentDate = new Date();
        fetchOccupiedDates(currentDate.getFullYear(), currentDate.getMonth());
    }, [renterId, accessory._id]);

    // פריטי ה-Menubar
    const items = [
        {
            label: "Photographers",
            icon: "pi pi-camera",
            command: () => navigate("/AllPhotography"),
        },
        {
            label: "Orders",
            icon: "pi pi-file",
            command: () => navigate("/orders"),
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
                color: "white", // צבע טקסט לבן כדי להתאים לרקע
            }}
        >
            <Menubar
                model={items}
                start={start}
                end={end} // הוספת תפריט פרופיל
                style={{
                    backgroundColor: "#008080",
                    color: "white",
                    borderBottom: "2px solid #005757",
                    height: "100px", // גובה מוגדל
                    width: "100%",
                }}
            />
            <div
                style={{
                    padding: "2rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    height: "calc(100% - 100px)", // גובה מלא מתחת לסרגל
                }}
            >
                {/* לוח שנה בצד השמאלי */}
                <div
                    style={{
                        width: "48%",
                        backgroundColor: "white",
                        padding: "1rem",
                        borderRadius: "8px",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                    }}
                >
                    <h3 style={{ textAlign: "center", color: "black" }}>Select a Date</h3>
                    <Calendar
                value={selectedDate}
                onChange={(e) => {
                    setSelectedDate(e.value);
                    handleDateSelection(e.value);
                }}
                inline
                style={{ width: "100%" }}
                disabledDates={occupiedDates} // סימון תאריכים תפוסים
                onMonthChange={(e) => fetchOccupiedDates(e.year, e.month)} // קריאה לפונקציה בעת שינוי חודש
                dateTemplate={(date) => {
                    const isOccupied = occupiedDates.some(
                        (occupiedDate) =>
                            date.day === new Date(occupiedDate).getDate() &&
                            date.month === new Date(occupiedDate).getMonth() &&
                            date.year === new Date(occupiedDate).getFullYear()
                    );

                    return (
                        <div
                            style={{
                                backgroundColor: isOccupied ? "#f44336" : "transparent", // רקע אדום לימים תפוסים
                                color: isOccupied ? "white" : "black", // צבע טקסט
                                borderRadius: "50%",
                                width: "2rem",
                                height: "2rem",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            {date.day}
                            {isOccupied && <span style={{ fontSize: "0.6rem", marginTop: "0.2rem" }}>תפוס</span>}
                        </div>
                    );
                }}
            />
            {selectedDate && (
                <p style={{ textAlign: "center", marginTop: "1rem", color: "black" }}>
                    Selected Date: {selectedDate.toLocaleDateString()}
                </p>
            )}
        </div>

                {/* כרטיס בצד הימני */}
                <Card
                    title={accessory?.accessoryName || "Accessory Name"}
                    subTitle={`Price: ${renter?.price || "N/A"}`}
                    style={{
                        width: "48%",
                        textAlign: "center",
                        backgroundColor: "white",
                        color: "black",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                        borderRadius: "8px",
                    }}
                    header={
                        <img
                            alt={accessory?.accessoryName}
                            src={`http://localhost:8080/${renter?.image}`}
                            style={{
                                width: "100%",
                                height: "300px",
                                objectFit: "cover",
                                borderRadius: "8px 8px 0 0",
                            }}
                        />
                    }
                >
                    <p style={{ margin: "0.5rem 0" }}>
                        <strong>Renter Details:</strong> {renter?.details || "No details available"}
                    </p>
                    <p style={{ margin: "0.5rem 0" }}>
                        <strong>Renter ID:</strong> {renterId || "No ID available"}
                    </p>
                    <Button
                        label="Back"
                        icon="pi pi-arrow-left"
                        className="p-button-text"
                        onClick={() => navigate(-1)} // חזרה לעמוד הקודם
                    />
                </Card>
            </div>
        </div>
    );
};

export default AccessoryDetails;
