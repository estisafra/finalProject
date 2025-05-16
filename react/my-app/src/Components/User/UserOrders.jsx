import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toolbar } from 'primereact/toolbar';
import { Menubar } from 'primereact/menubar';
import { useNavigate } from "react-router-dom";
import { Calendar } from 'primereact/calendar';
import { Dialog } from 'primereact/dialog';

const UserOrders=()=>{
    const navigate = useNavigate();
    const id = useSelector((state) => state.user.id);
    const userName = useSelector((state) => state.user.name);
    const [Orders,setOrders] = useState([]);

    useEffect(() => {
        if (id) {
            const token = localStorage.getItem("token");
            axios.get(`http://localhost:8080/Order/getOrdersByUser/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((response) => {
                    setOrders(response.data);
                })
                .catch((error) => {
                    console.error("Error fetching orders:", error);
                });
        }
    }, [id]);

    // Update order date dialog state
    const [updateDialogVisible, setUpdateDialogVisible] = useState(false);
    const [orderToUpdate, setOrderToUpdate] = useState(null);
    const [newDate, setNewDate] = useState(null);
    const [loadingUpdate, setLoadingUpdate] = useState(false);
    const [availableDates, setAvailableDates] = useState([]);
    const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
    const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());

    const fetchAvailableDates = async (photographyId, month, year) => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(
                `http://localhost:8080/Photography/getAvailableDates/${photographyId}`,
                {
                    params: { month: String(month + 1).padStart(2, '0'), year },
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            setAvailableDates(res.data);
        } catch (error) {
            setAvailableDates([]);
        }
    };

    const handleOpenUpdateDialog = (order) => {
        setOrderToUpdate(order);
        setNewDate(null);
        setUpdateDialogVisible(true);
        // fetch available dates for this photographer and month
        const date = new Date(order.orderDate);
        setCalendarMonth(date.getMonth());
        setCalendarYear(date.getFullYear());
        fetchAvailableDates(order.orderPhotography, date.getMonth(), date.getFullYear());
    };

    const handleUpdateOrderDate = async () => {
        if (!orderToUpdate || !newDate) return;
        setLoadingUpdate(true);
        try {
            const token = localStorage.getItem("token");
            const res = await axios.put(
                `http://localhost:8080/Order/updateDate/${orderToUpdate._id}`,
                { orderDate: newDate },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setOrders(Orders.map(o => o._id === res.data._id ? res.data : o));
            setUpdateDialogVisible(false);
        } catch (error) {
            alert(error.response?.data || 'Error updating order date');
        } finally {
            setLoadingUpdate(false);
        }
    };

    const handleCancelOrder = async (order) => {
        if (!window.confirm('Are you sure you want to cancel this order?')) return;
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`http://localhost:8080/Order/deleteOrder/${order._id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrders(Orders.filter(o => o._id !== order._id));
        } catch (error) {
            alert(error.response?.data || 'Error cancelling order');
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
            >
                {userName?.charAt(0).toUpperCase() || "?"}
            </div>
        </div>
    );

    const onMonthChange = (e) => {
        setCalendarMonth(e.month);
        setCalendarYear(e.year);
        if (orderToUpdate) {
            fetchAvailableDates(orderToUpdate.orderPhotography, e.month, e.year);
        }
    };

    const getDayStatus = (date) => {
        const iso = date.toISOString().split('T')[0];
        const availableISO = availableDates.map(dateStr => new Date(dateStr).toISOString().split('T')[0]);
        return availableISO.includes(iso) ? 'free' : 'busy';
    };

    const dateTemplate = (date) => {
        const jsDate = new Date(date.year, date.month, date.day);
        const status = getDayStatus(jsDate);
        if (status === 'free') {
            return <div style={{ background: '#e0e0e0', color: '#333', borderRadius: '50%', width: 32, height: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 14 }}>{date.day}</div>;
        } else {
            return <div style={{ background: '#008080', color: 'white', borderRadius: '50%', width: 32, height: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.85, fontSize: 14, border: '2px solid #008080' }}>{date.day}<span style={{ fontSize: 9, color: 'white', marginTop: 1 }}>busy</span></div>;
        }
    };

    const isDateSelectable = (date) => {
        const iso = date.toISOString().split('T')[0];
        const availableISO = availableDates.map(dateStr => new Date(dateStr).toISOString().split('T')[0]);
        return availableISO.includes(iso);
    };

    return(
        <>
            <Menubar
                model={items}
                start={start}
                end={end}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    zIndex: 2000,
                    backgroundColor: "#008080",
                    color: "white",
                    borderBottom: "2px solid #005757",
                    height: "100px",
                    marginBottom: 0,
                    borderRadius: 0,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                }}
            />
            <div style={{ background: '#f6f6f6', minHeight: '100vh', paddingTop: '110px' }}>
                <Toolbar
                    left={<span style={{ fontWeight: 'bold', fontSize: '1.5rem', color: '#008080' }}>My Orders</span>}
                    right={<span style={{ fontWeight: 'bold', color: '#008080' }}>{userName && `Hello, ${userName}`}</span>}
                    style={{
                        marginBottom: '1.5rem',
                        background: 'rgba(255,255,255,0.10)',
                        border: 'none',
                        borderRadius: 8,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                        maxWidth: 800,
                        marginLeft: 'auto',
                        marginRight: 'auto',
                    }}
                />
                <div style={{ maxWidth: 800, margin: '2rem auto' }}>
                    <DataTable value={Orders} paginator rows={5} emptyMessage="No orders found" scrollable scrollHeight="flex" style={{ borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.08)', minWidth: 900 }}>
                        <Column field="_id" header="Order ID" style={{ minWidth: 140 }}/>
                        <Column field="orderUser" header="User" style={{ minWidth: 140 }}/>
                        <Column field="orderPhotography" header="Photographer" style={{ minWidth: 140 }}/>
                        <Column field="orderDate" header="Date" body={rowData => new Date(rowData.orderDate).toLocaleDateString()} style={{ minWidth: 140 }}/>
                        <Column header="Update Date" body={rowData => {
                            const orderDate = new Date(rowData.orderDate);
                            const now = new Date();
                            if (orderDate >= now) {
                                return (
                                    <button
                                        style={{ background: '#008080', color: 'white', border: 'none', borderRadius: 6, padding: '0.3rem 0.8rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                                        onClick={() => handleOpenUpdateDialog(rowData)}
                                    >
                                        <span className="pi pi-calendar" style={{ fontSize: 18, marginLeft: 4 }}></span>
                                        Update
                                    </button>
                                );
                            }
                            return null;
                        }} style={{ minWidth: 140 }}/>
                        <Column header="Cancel" body={rowData => {
                            const orderDate = new Date(rowData.orderDate);
                            const now = new Date();
                            if (orderDate >= now) {
                                return (
                                    <button
                                        style={{ background: '#e53935', color: 'white', border: 'none', borderRadius: 6, padding: '0.3rem 0.8rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                                        onClick={() => handleCancelOrder(rowData)}
                                    >
                                        <span className="pi pi-trash" style={{ fontSize: 18, marginLeft: 4 }}></span>
                                        Cancel
                                    </button>
                                );
                            }
                            return null;
                        }} style={{ minWidth: 120 }}/>
                    </DataTable>
                </div>
                <Dialog
                    header="Update Order Date"
                    visible={updateDialogVisible}
                    style={{ width: '350px' }}
                    onHide={() => setUpdateDialogVisible(false)}
                    footer={<div style={{ textAlign: 'left' }}>
                        <button
                            onClick={handleUpdateOrderDate}
                            style={{ background: '#008080', color: 'white', border: 'none', borderRadius: '6px', padding: '0.5rem 1.2rem', fontWeight: 'bold', cursor: newDate ? 'pointer' : 'not-allowed' }}
                            disabled={!newDate || loadingUpdate}
                        >
                            Update
                        </button>
                        <button
                            onClick={() => setUpdateDialogVisible(false)}
                            style={{ background: '#ccc', color: '#333', border: 'none', borderRadius: '6px', padding: '0.5rem 1.2rem', fontWeight: 'bold', cursor: 'pointer' }}
                        >
                            Cancel
                        </button>
                    </div>}
                >
                    <div style={{ textAlign: 'center' }}>
                        <p>Select a new date for the order:</p>
                        <Calendar
                            value={newDate}
                            onChange={e => isDateSelectable(e.value) && setNewDate(e.value)}
                            minDate={new Date()}
                            dateFormat="dd/mm/yy"
                            showIcon
                            style={{ width: '100%' }}
                            viewDate={new Date(calendarYear, calendarMonth, 1)}
                            onMonthChange={onMonthChange}
                            dateTemplate={dateTemplate}
                            selectOtherMonths={false}
                            manualInput={false}
                        />
                    </div>
                </Dialog>
            </div>
        </>
    )
}
export default UserOrders;