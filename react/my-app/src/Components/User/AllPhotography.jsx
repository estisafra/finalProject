import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Card } from "primereact/card";
import { Menubar } from "primereact/menubar";
import { useSelector } from "react-redux";

const AllPhotography = () => {
    const navigate = useNavigate();
    const [photographers, setPhotographers] = useState([]);
    const userName = useSelector((state) => state.user.name);
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    useEffect(() => {
        const fetchPhotographers = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("No token found. Redirecting to login.");
                navigate("/login");
                return;
            }
            try {
                const response = await axios.get("http://localhost:8080/Photography/getAllPhotography", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setPhotographers(response.data);
            } catch (error) {
                console.error("Error fetching photography data:", error);
            }
        };

        fetchPhotographers();
    }, [navigate]);
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
            <div style={{ padding: "2rem", display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "center" }}>
                {photographers.map((photographer) => (
                    <Card
                    key={photographer._id}
                    title={photographer.photographyName}
                    subTitle={photographer.photographyAddress}
                    style={{ width: "300px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", borderRadius: "8px" }}
                    header={<img alt="Photographer" src="/public/img/p1.jpg" style={{ width: "100%", borderRadius: "8px 8px 0 0" }} />}
                    onClick={() => navigate(`/photographerDetails`, { state: { name:photographer.photographyName } })}
                >
                    <p style={{ margin: 0,color: "#555"}}>profil{photographer.profile}</p>
                </Card>
                ))}
            </div>
        </div>
    );
};

export default AllPhotography;