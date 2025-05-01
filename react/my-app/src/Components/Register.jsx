import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { saveUser } from "../Store/UserSlice";
import { Menubar } from "primereact/menubar";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";

const Register = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const userName = useSelector((state) => state.user.name);
    const { name, email, password, userType } = location.state || {}; // קבלת הפרטים מה-state

    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const registerData = {
            name,
            email,
            password,
            address,
            phone,
            userType: userType || "User", // ברירת מחדל ל-User אם לא הוגדר userType
        };

        try {
            const response = await axios.post("http://localhost:8080/System/register", registerData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.data.token) {
                localStorage.setItem("token", response.data.token);
                console.log("Token saved:", response.data.token);
            }

            console.log("Registration successful:", response.data);

            dispatch(
                saveUser({
                    name: name,
                    id: response.data.user._id,
                    role: registerData.userType,
                })
            );

            navigate(userType === "Renter" ? "/renterHome" : "/userHome");
        } catch (error) {
            console.error("Error during registration:", error);
            alert("Registration failed. Please try again.");
        }
    };

    const items = [
        {
            label: "Home",
            icon: "pi pi-home",
            command: () => navigate("/"),
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
                display: "flex",
                flexDirection: "column",
                backgroundImage: "url('https://via.placeholder.com/1920x1080')",
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <Menubar
                model={items}
                start={start}
                end={end}
                style={{
                    backgroundColor: "#008080",
                    color: "white",
                    borderBottom: "2px solid #005757",
                    height: "100px",
                }}
            />
            <div
                style={{
                    flex: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <div
                    style={{
                        width: "400px",
                        padding: "2rem",
                        background: "white",
                        borderRadius: "8px",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                    }}
                >
                    <h1 style={{ textAlign: "center", marginBottom: "1.5rem", color: "#008080" }}>
                        Register as {userType === "Renter" ? "Renter" : "User"}
                    </h1>
                    <form onSubmit={handleSubmit}>
                    <div style={{ marginTop: "2rem", color: "#008080" }}>
                       
                       <p><strong>Name:</strong> {name}</p>
                       <p><strong>Email:</strong> {email}</p>
                       <p><strong>Password:</strong> {password}</p>
                      
                   </div>
                        <div className="p-field" style={{ marginBottom: "1.5rem" }}>
                            <label htmlFor="address" style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold", color: "#008080" }}>
                                Address:
                            </label>
                            <InputText
                                id="address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                required
                                className="p-inputtext-lg"
                                style={{
                                    width: "100%",
                                    borderColor: "#008080",
                                    outline: "none",
                                    transition: "box-shadow 0.3s ease",
                                }}
                                onFocus={(e) => (e.target.style.boxShadow = "0 0 5px #005757")}
                                onBlur={(e) => (e.target.style.boxShadow = "none")}
                            />
                        </div>
                        <div className="p-field" style={{ marginBottom: "1.5rem" }}>
                            <label htmlFor="phone" style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold", color: "#008080" }}>
                                Phone:
                            </label>
                            <InputText
                                id="phone"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                                className="p-inputtext-lg"
                                style={{
                                    width: "100%",
                                    borderColor: "#008080",
                                    outline: "none",
                                    transition: "box-shadow 0.3s ease",
                                }}
                                onFocus={(e) => (e.target.style.boxShadow = "0 0 5px #005757")}
                                onBlur={(e) => (e.target.style.boxShadow = "none")}
                            />
                        </div>
                        <Button
                            type="submit"
                            label="Register"
                            icon="pi pi-user-plus"
                            iconPos="left"
                            className="p-button-lg p-button-rounded"
                            style={{
                                width: "100%",
                                backgroundColor: "#008080",
                                borderColor: "#008080",
                                color: "white",
                                fontWeight: "bold",
                            }}
                        />
                    </form>
               
                </div>
            </div>
        </div>
    );
};

export default Register;