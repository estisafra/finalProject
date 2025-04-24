import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // ייבוא useNavigate
import axios from "axios";
import { useDispatch, useSelector } from "react-redux"; // ייבוא useDispatch
import { saveUser } from "../Store/UserSlice"; // עדכן את הנתיב לפי הצורך
import { Menubar } from "primereact/menubar";
import { Button } from "primereact/button";

const RegisterRenter = () => {
    const location = useLocation();
    const navigate = useNavigate(); // הגדרת navigate
    const dispatch = useDispatch();
    const userName = useSelector((state) => state.user.name); // שם המשתמש
    const { name, email, password } = location.state || {}; // קבלת הפרטים מה-props

    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [showProfileMenu, setShowProfileMenu] = useState(false); // שליטה על תפריט הפרופיל

    const handleSubmit = async (e) => {
        e.preventDefault();

        const registerData = {
            name,
            email,
            password,
            address,
            phone,
            userType: "Renter", // הוסף את סוג המשתמש
        };

        try {
            const response = await axios.post("http://localhost:8080/System/register", registerData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            console.log("Registration successful:", response.data);
            alert("Registration successful!");
            const token = response.data.token; // קבלת הטוקן מהתגובה
            localStorage.setItem("token", token);
            dispatch(
                saveUser({
                    name: name,
                    id: response.data.user._id, // הנח שיש id מהתגובה
                    role: registerData.userType, // הנח שיש role מהתגובה
                })
            );

            // ניתוב לקומפוננטת RenterHome
            navigate("/renterHome");
        } catch (error) {
            console.error("Error during registration:", error);
            alert("Registration failed. Please try again.");
        }
    };

    // פריטי ה-Menubar
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
        <div>
            <Menubar
                model={items}
                start={start}
                end={end}
                style={{
                    backgroundColor: "#008080",
                    color: "white",
                    borderBottom: "2px solid #005757",
                    height: "100px", // גובה מוגדל
                    width: "100%",
                }}
            />
            <div style={{ padding: "1rem" }}>
                <h1>Register as Renter</h1>
                <p>Name: {name}</p>
                <p>Email: {email}</p>
                <p>Password: {password}</p>

                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="address">Address:</label>
                        <input
                            type="text"
                            id="address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="phone">Phone:</label>
                        <input
                            type="tel"
                            id="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Register</button>
                </form>
            </div>
        </div>
    );
};

export default RegisterRenter;