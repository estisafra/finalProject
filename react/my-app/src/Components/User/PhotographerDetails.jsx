import { use, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Card } from "primereact/card";
import { Menubar } from "primereact/menubar";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { Dialog } from "primereact/dialog";
import { Calendar } from "primereact/calendar";
import { Toast } from "primereact/toast";
import React, { useRef } from "react";

const PhotographerDetails = () => {
    const location = useLocation();
    const { name } = location.state || {};
    const navigate = useNavigate();
    const [photographer, setPhotographer] = useState();
    const userName = useSelector((state) => state.user.name); 
    const userId = useSelector((state) => state.user.id);
    const [showProfileMenu, setShowProfileMenu] = useState(false); 
    const [orderDialogVisible, setOrderDialogVisible] = useState(false);
    const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [loadingDates, setLoadingDates] = useState(false);
    const [availableDates, setAvailableDates] = useState([]);
    const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
    const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
    const toast = useRef(null);

    useEffect(() => {
        const fetchPhotographers = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("No token found. Redirecting to login.");
                navigate("/login");
                return;
            }
            try {
                console.log(name)
                const response = await axios.get(`http://localhost:8080/Photography/getPhotographyByName/${name}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setPhotographer(response.data);
            } catch (error) {
                console.error("Error fetching photography data:", error);
            }
        };

        fetchPhotographers();
    }, [navigate]);

    // קריאה לימים פנויים רק בפתיחת הדיאלוג או החלפת חודש/שנה
    const fetchAvailableDates = async (month, year) => {
        if (!photographer?._id) return;
        setLoadingDates(true);
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(
                `http://localhost:8080/Photography/getAvailableDates/${photographer._id}`,
                {
                    params: { month: String(month + 1).padStart(2, '0'), year },
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            setAvailableDates(res.data);
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'שגיאה', detail: 'שגיאה בטעינת תאריכים פנויים', life: 4000 });
        } finally {
            setLoadingDates(false);
        }
    };

    // כשפותחים דיאלוג או מחליפים חודש/שנה
    const handleCalendarShow = () => {
        const now = new Date();
        setCalendarMonth(now.getMonth());
        setCalendarYear(now.getFullYear());
        fetchAvailableDates(now.getMonth(), now.getFullYear());
        setOrderDialogVisible(true);
    };

    const onMonthChange = (e) => {
        setCalendarMonth(e.month);
        setCalendarYear(e.year);
        fetchAvailableDates(e.month, e.year);
    };

    // ימים פנויים/תפוסים
    const getDayStatus = (date) => {
        const iso = date.toISOString().split('T')[0];
        const availableISO = availableDates.map(dateStr => new Date(dateStr).toISOString().split('T')[0]);
        return availableISO.includes(iso) ? 'free' : 'busy';
    };

    const dateTemplate = (date) => {
        const jsDate = new Date(date.year, date.month, date.day);
        const status = getDayStatus(jsDate);
        if (status === 'free') {
            return <div style={{ background: '#e0e0e0', color: '#333', borderRadius: '50%', width: 32, height: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 14 }}>
                {date.day}
            </div>;
        } else {
            // Use the button color for busy days
            return <div style={{ background: '#008080', color: 'white', borderRadius: '50%', width: 32, height: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.85, fontSize: 14, border: '2px solid #008080' }}>
                {date.day}
                <span style={{ fontSize: 9, color: 'white', marginTop: 1 }}>busy</span>
            </div>;
        }
    };

    const isDateSelectable = (date) => {
        const iso = date.toISOString().split('T')[0];
        const availableISO = availableDates.map(dateStr => new Date(dateStr).toISOString().split('T')[0]);
        return availableISO.includes(iso);
    };

    const handleCreateOrder = async () => {
        setLoadingDates(true);
        console.log("Creating order for date:", selectedDate);
        try {
            const token = localStorage.getItem("token");
            console.log(userId)
            const res = await axios.post(
                'http://localhost:8080/Order/createOrder',
                {
                    orderDate: selectedDate,
                    orderUser: userId,
                    orderPhotography: photographer._id
                },
               
            );
            toast.current.show({ severity: 'success', summary: 'הזמנה בוצעה', detail: 'ההזמנה נשמרה בהצלחה!', life: 4000 });
            setConfirmDialogVisible(false);
            setOrderDialogVisible(false);
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'שגיאה', detail: error.response?.data || 'שגיאה בביצוע ההזמנה', life: 4000 });
        } finally {
            setLoadingDates(false);
        }
    };

    const items = [
        {
            label: "Home",
            icon: "pi pi-home",
            command: () => navigate("/userHome"),
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
            label: "Rents",
            icon: "pi pi-shopping-cart",
            command: () => navigate("/userRents"),
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
                </div>
            )}
        </div>
    );
    const calendarCustomStyles = {
        // Calendar input border and icon color
        borderColor: '#008080',
    };
    const calendarPanelStyles = {
        borderColor: '#008080',
    };
    const calendarIconStyle = {
        color: '#008080',
    };
    return (
        <div>
            <Toast ref={toast} />
            <Menubar
                model={items}
                start={start}
                style={{
                    backgroundColor: "#008080",
                    color: "white",
                    borderBottom: "2px solid #005757",
                    height: "100px",
                }}
            />
            <div style={{ padding: "2rem", display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "center" }}>
                {photographer ? (
                    <Card
                        key={photographer._id}
                        title={photographer.photographyName}
                        subTitle={photographer.photographyAddress}
                        style={{ width: "500px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", borderRadius: "8px" }}
                        header={<img alt="Photographer" src="/public/img/p1.jpg" style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "8px 8px 0 0" }} />}
                    >
                        <p style={{ margin: 0, color: "#555" }}>{photographer.profileDescription}</p>
                        <p style={{ margin: 0, color: "#555" }}>Email: {photographer.photographyMail}</p>
                        <p style={{ margin: 0, color: "#555" }}>Phone: {photographer.photographyPhone}</p>
                        <p style={{ margin: 0, color: "#555" }}>Rank: {photographer.photographyRank}</p>
    
   
{photographer.photographyGaleries && photographer.photographyGaleries.length > 0 && (
    <div>
        <h4>Galeries:</h4>
        {photographer.photographyGaleries.map((galery, index) => (
            <div key={index} style={{ marginBottom: "1rem", cursor: "pointer" }} onClick={() => navigate(`/gallery`, { state: { gallery: galery} })}>
                {galery.images.length > 0 && (
                    <img 
                        src={`http://localhost:8080${galery.images[0]}`} 
                        alt={`Gallery: ${galery.name}`} 
                        style={{ width: "100px", borderRadius: "4px", marginBottom: "5px" }} 
                    />
                )}
                <p>Name: {galery.name}</p>
                <p>Price Range: {galery.minPrice} - {galery.maxPrice}</p>              
            </div>
        ))}
    </div>
)}


    <p style={{ margin: 0, color: "#555" }}>Profile Link: <a href={photographer.photographyLink}>{photographer.photographyLink}</a></p>
                        <button
                            style={{ marginTop: "1rem", background: "#008080", color: "white", border: "none", borderRadius: "6px", padding: "0.5rem 1.5rem", fontWeight: "bold", cursor: "pointer", fontSize: "1.1rem" }}
                            onClick={handleCalendarShow}
                        >
                            הזמן צלמת
                        </button>
                        <Dialog
                            header="בחר תאריך להזמנה"
                            visible={orderDialogVisible}
                            style={{ width: '350px' }}
                            onHide={() => setOrderDialogVisible(false)}
                        >
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
                                <Calendar
                                    value={selectedDate}
                                    onChange={e => isDateSelectable(e.value) && setSelectedDate(e.value)}
                                    dateFormat="dd/mm/yy"
                                    showIcon
                                    minDate={new Date()}
                                    placeholder="בחר תאריך"
                                    style={{ width: '100%' }}
                                    viewDate={new Date(calendarYear, calendarMonth, 1)}
                                    onMonthChange={onMonthChange}
                                    dateTemplate={dateTemplate}
                                    disabledDates={[]}
                                    selectOtherMonths={false}
                                    manualInput={false}
                                    inputStyle={calendarCustomStyles}
                                    panelStyle={calendarPanelStyles}
                                    className="custom-calendar"
                                    iconPos="right"
                                    // שינוי צבע האייקון בלוח שנה
                                    pt={{
                                        inputIcon: { style: calendarIconStyle },
                                        dropdownButton: { style: calendarIconStyle },
                                        button: { style: calendarIconStyle },
                                    }}
                                />
                                <button
                                    onClick={() => setConfirmDialogVisible(true)}
                                    disabled={!selectedDate}
                                    style={{ background: '#008080', color: 'white', border: 'none', borderRadius: '6px', padding: '0.5rem 1.2rem', fontWeight: 'bold', cursor: selectedDate ? 'pointer' : 'not-allowed' }}
                                >
                                    אשר הזמנה
                                </button>
                            </div>
                        </Dialog>
                        <Dialog
                            header="אישור הזמנת צלמת"
                            visible={confirmDialogVisible}
                            style={{ width: '350px' }}
                            onHide={() => setConfirmDialogVisible(false)}
                            footer={<div style={{ textAlign: 'left' }}>
                                <button
                                    onClick={handleCreateOrder}
                                    style={{ background: '#008080', color: 'white', border: 'none', borderRadius: '6px', padding: '0.5rem 1.2rem', fontWeight: 'bold', cursor: 'pointer', marginLeft: '1rem' }}
                                    disabled={loadingDates}
                                >
                                    אשר הזמנה
                                </button>
                                <button
                                    onClick={() => setConfirmDialogVisible(false)}
                                    style={{ background: '#ccc', color: '#333', border: 'none', borderRadius: '6px', padding: '0.5rem 1.2rem', fontWeight: 'bold', cursor: 'pointer' }}
                                >
                                    ביטול
                                </button>
                            </div>}
                        >
                            <div style={{ textAlign: 'center' }}>
                                <p>האם לאשר הזמנת צלמת לתאריך:</p>
                                <b>{selectedDate && selectedDate.toLocaleDateString()}</b>
                            </div>
                        </Dialog>
                    </Card>
                ) : (
                    <p>Loading photographer details...</p>
                )}
            </div>
        </div>
    );
};


export default PhotographerDetails;

