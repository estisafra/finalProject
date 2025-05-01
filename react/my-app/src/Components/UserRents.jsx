import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Menubar } from "primereact/menubar";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
        

const UserRents = () => {
    const [rents, setRents] = useState([]);
    const [viewType, setViewType] = useState("current");
    const id = useSelector((state) => state.user.id);
    const userName = useSelector((state) => state.user.name);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showAccessoriesDialog, setShowAccessoriesDialog] = useState(false);
    const [accessories, setAccessories] = useState([]);
    const [currentRent, setCurrentRent] = useState(null); // Track the current rent
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

    const fetchAccessories = (renterId, rent) => {
        setCurrentRent(rent); // Set the current rent
        const token = localStorage.getItem("token");
        axios.get(`http://localhost:8080/Accessory/getAccessoryByRenter/${renterId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then((response) => {
            console.log("Accessories fetched successfully:", response.data);
            setAccessories(response.data);
            setShowAccessoriesDialog(true);
        })
        .catch((error) => {
            console.error("Error fetching accessories:", error);
            alert("שגיאה בטעינת האביזרים.");
        });
    };

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

                <DataTable value={rents} tableStyle={{ minWidth: '60rem' }}>
                    <Column
                        header="Images"
                        body={(rowData) => (
                            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                                {rowData.rentAccessories?.map((accessory, index) => (
                                    <div key={index} style={{ position: "relative" }}>
                                        <img
                                            src={accessory.matchedImage ? `http://localhost:8080/${accessory.matchedImage}` : "https://via.placeholder.com/80"}
                                            alt="Accessory"
                                            style={{ width: "70px", height: "70px", objectFit: "cover", borderRadius: "8px", cursor: "pointer" }}
                                            title="Click to delete"
                                            onClick={() => {
                                                const token = localStorage.getItem("token");
                                                axios.delete(`http://localhost:8080/Accessory/deleteAccessory/${accessory.accessoryId}`, {
                                                    headers: {
                                                        Authorization: `Bearer ${token}`
                                                    }
                                                })
                                                .then((response) => {
                                                    alert("Accessory deleted successfully.");
                                                    setRents((prevRents) => prevRents.map(rent => {
                                                        if (rent._id === rowData._id) {
                                                            return {
                                                                ...rent,
                                                                rentAccessories: rent.rentAccessories.filter((_, i) => i !== index)
                                                            };
                                                        }
                                                        return rent;
                                                    }));
                                                })
                                                .catch((error) => {
                                                    console.error("Error deleting accessory:", error);
                                                    alert("Error deleting accessory.");
                                                });
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    ></Column>
                    <Column field="_id" header="Order Code"></Column>
                    <Column
                        header="Date"
                        body={(rowData) => new Date(rowData.rentDate).toLocaleDateString()}
                    ></Column>
                    <Column
                        header="Status"
                        body={(rowData) => rowData.status != null ? (rowData.status ? "Approved" : "Pending") : "Unknown"}
                    ></Column>
                    <Column
                        header="Total Price"
                        body={(rowData) => rowData.rentAccessories?.reduce((total, accessory) => total + (accessory.price || 0), 0) + (rowData.rentPrice || 0)}
                    ></Column>
                    <Column
                        header="Actions"
                        body={(rowData) => (
                            <div style={{ display: "flex", gap: "10px" }}>
                                <Button
                                    icon="pi pi-plus"
                                    className="p-button-success p-button-sm"
                                    onClick={() => fetchAccessories(rowData.rentRenter._id, rowData)}
                                />
                                <Button
                                    icon="pi pi-trash"
                                    className="p-button-danger p-button-sm"
                                    onClick={() => {
                                        const token = localStorage.getItem("token");
                                        axios.delete(`http://localhost:8080/Rent/deleteRent/${rowData._id}`, {
                                            headers: {
                                                Authorization: `Bearer ${token}`
                                            }
                                        })
                                        .then((response) => {
                                            if (response.data === "השכרה נמחקה בהצלחה.") {
                                                alert("השכרה נמחקה בהצלחה.");
                                                setRents((prevRents) => prevRents.filter(r => r._id !== rowData._id));
                                            } else {
                                                alert("שגיאה במחיקת ההשכרה.");
                                            }
                                        })
                                        .catch((error) => {
                                            console.error("Error deleting rent:", error);
                                            alert("שגיאה במחיקת ההשכרה.");
                                        });
                                    }}
                                />
                            </div>
                        )}
                    ></Column>
                </DataTable>
            </div>

            <Dialog
                header="אביזרים"
                visible={showAccessoriesDialog}
                style={{ width: "50vw" }}
                onHide={() => setShowAccessoriesDialog(false)}
            >
                {accessories.length > 0 ? (
                    <ul>
                        {accessories.map((accessory) => (
                                <li key={accessory.accessoryId} style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                                    <img
                                        src={accessory.image ? `http://localhost:8080${accessory.image}` : "https://via.placeholder.com/80"}
                                        alt={accessory.accessoryName}
                                        style={{ width: "50px", height: "50px", marginRight: "10px", objectFit: "cover", borderRadius: "8px" }}
                                    />
                                    <span style={{ flex: 1 }}>{accessory.accessoryName} - {accessory.price ? `${accessory.price} ₪` : "לא זמין"}</span>
                                    <Button
                                        icon="pi pi-check"
                                        className="p-button-success p-button-sm"
                                        style={{ marginLeft: "10px" }}
                                        onClick={() => {
                                            const token = localStorage.getItem("token");
                                            axios.put(`http://localhost:8080/Rent/addAccessory/${id}/${currentRent.rentRenter._id}`, {
                                                accessoryId: accessory.accessoryId,
                                                rentDate: currentRent.rentDate
                                            }, {
                                                headers: {
                                                    Authorization: `Bearer ${token}`
                                                }
                                            })
                                            .then((response) => {
                                                alert("אביזר נוסף בהצלחה להשכרה.");
                                                setRents((prevRents) => prevRents.map(r => {
                                                    if (r._id === currentRent._id) {
                                                        return {
                                                            ...r,
                                                            rentAccessories: [...r.rentAccessories, {
                                                                ...accessory,
                                                                matchedImage: response.data.accessory.matchedImage // הוספת matchedImage מהתגובה
                                                            }]
                                                        };
                                                    }
                                                    return r;
                                                }));
                                            })
                                            .catch((error) => {
                                                console.error("Error adding accessory:", error);
                                                alert("שגיאה בהוספת האביזר להשכרה.");
                                            });
                                        }}
                                    />
                                </li>
                        ))}
                    </ul>
                ) : (
                    <p>לא נמצאו אביזרים.</p>
                )}
            </Dialog>
        </div>
    );
};

export default UserRents;
