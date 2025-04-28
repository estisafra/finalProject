import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Menubar } from "primereact/menubar";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import axios from "axios";

const AccessoryDetails = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { accessory, renter, renterId } = location.state || {}; // קבלת הנתונים מ-state
    const [selectedDate, setSelectedDate] = useState(null); // תאריך שנבחר
    const [occupiedDates, setOccupiedDates] = useState([]); // תאריכים תפוסים

    // פונקציה לשליפת תאריכים תפוסים מהשרת
    const fetchOccupiedDates = async (year, month) => {
        try {
            const response = await axios.get(
                "http://localhost:8080/Accessory/getOccupiedDates",
                {
                    renterId,
                    accessoryId: accessory._id,
                    year,
                    month,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            setOccupiedDates(response.data.map((date) => new Date(date))); // שמירת התאריכים התפוסים
        } catch (error) {
            console.error("Error fetching occupied dates:", error);
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
            command: () => navigate("/photographers"),
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
            command: () => navigate("/rents"),
        },
    ];

    const start = (
        <img
            alt="logo"
            src="https://sheviphoto.co.il/wp-content/uploads/2020/12/logo.png" // לוגו מהאתר
            style={{ height: "50px", borderRadius: "50%" }}
        />
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
                        onChange={(e) => setSelectedDate(e.value)}
                        inline
                        style={{ width: "100%" }}
                        disabledDates={occupiedDates} // סימון תאריכים תפוסים
                        onMonthChange={(e) => fetchOccupiedDates(e.year, e.month)} // קריאה לפונקציה בעת שינוי חודש
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