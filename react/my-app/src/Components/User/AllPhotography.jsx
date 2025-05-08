import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Card } from "primereact/card";

const AllPhotography = () => {
    const navigate = useNavigate();
    const [photographers, setPhotographers] = useState([]);

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

    return (
        <div style={{ padding: "2rem", display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "center" }}>
            {photographers.map((photographer) => (
                <Card
                    key={photographer.id}
                    title={photographer.name}
                    subTitle={photographer.address}
                    style={{ width: "300px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", borderRadius: "8px" }}
                    header={<img alt="Photographer" src="/public/img/p1.jpg" style={{ width: "100%", borderRadius: "8px 8px 0 0" }} />}
                >
                    <p style={{ margin: 0, color: "#555" }}>{photographer.profileDescription}</p>
                </Card>
            ))}
        </div>
    );
};

export default AllPhotography;