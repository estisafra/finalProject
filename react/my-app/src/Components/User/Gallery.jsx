
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "primereact/card";
import { Menubar } from "primereact/menubar";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

const Gallery = () => {
    const location = useLocation();
    const { gallery } = location.state || {};
    const navigate = useNavigate();
    const userName = useSelector((state) => state.user.name); 
    const [showProfileMenu, setShowProfileMenu] = useState(false); 

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
    console.log(gallery)

    return (
        <div>
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
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", padding: "20px" }}>
                {gallery && gallery.images && gallery.images.map((image, index) => (
                    <Card key={index} style={{ width: "200px" }}>
                        <img 
                            src={`http://localhost:8080${image}`} 
                            alt={`Gallery Image ${index + 1}`} 
                            style={{ width: "100%",height:"100%", borderRadius: "4px" }} 
                        />
                {console.log(image)}
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Gallery;
