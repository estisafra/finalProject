import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Card } from "primereact/card";
import { Menubar } from "primereact/menubar";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

const PhotographerDetails = () => {
    const location = useLocation();
    const { name } = location.state || {};
    const navigate = useNavigate();
    const [photographer, setPhotographer] = useState();
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
</Card>

                ) : (
                    <p>Loading photographer details...</p> 
                )}
            </div>
        </div>
    );
};


export default PhotographerDetails;