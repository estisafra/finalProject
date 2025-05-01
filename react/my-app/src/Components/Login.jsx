import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { saveUser } from "../Store/UserSlice";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Menubar } from "primereact/menubar";
import axios from "axios";
import "primeflex/primeflex.css";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showRoleSelection, setShowRoleSelection] = useState(false);

    // שליפת שם המשתמש מה-slice
    const userName = useSelector((state) => state.user.name) ;

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const handleRoleSelection = (selectedRole) => {
        if (selectedRole === "Photographer") {
            navigate("/register-photography", { state: { name, email, password, userType: selectedRole } });
        } else {
            navigate("/register", { state: { name, email, password, userType: selectedRole } });
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
                    width: "40px",
                    height: "40px",
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
                {userName?.charAt(0).toUpperCase()}
            </div>
            {showProfileMenu && (
                <div
                    style={{
                        position: "absolute",
                        top: "50px",
                        right: "0",
                        backgroundColor: "#005757",
                        color: "white",
                        padding: "0.5rem",
                        borderRadius: "8px",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                        zIndex: 1000,
                    }}
                >
                    <p style={{ margin: 0, fontWeight: "bold", fontSize: "0.9rem" }}>{userName}</p>
                    <Button
                        label="Logout"
                        icon="pi pi-sign-out"
                        className="p-button-text"
                        style={{
                            color: "#fff",
                            fontWeight: "bold",
                            fontSize: "0.8rem",
                            marginTop: "0.5rem",
                        }}
                        onClick={handleLogout}
                    />
                </div>
            )}
        </div>
    );

    const handleSubmit = async (e) => {
        e.preventDefault();

        const loginData = { name, email, password };

        try {
            const response = await axios.post("http://localhost:8080/System/login", loginData, {
                headers: { "Content-Type": "application/json" },
            });

            let myName = "";
            switch (response.data.role) {
                case "User":
                    myName = response.data.user.userName;
                    break;
                case "Renter":
                    myName = response.data.user.renterName;
                    break;
                case "Photography":
                    myName = response.data.user.photographyName;
                    break;
            }

            dispatch(
                saveUser({
                    name: myName || name,
                    id: response.data.user._id,
                    role: response.data.role,
                })
            );

            localStorage.setItem("token", response.data.token);

            if (response.data.role === "Renter") navigate("/renterHome");
            else if (response.data.role === "User") navigate("/userHome");
            else navigate("/photographyHome");

            setShowRoleSelection(false);
        } catch (error) {
            if (error.response) {
                if (error.response.status === 400 || error.response.status === 404) {
                    setShowRoleSelection(true);
                } else if (error.response.status === 300) {
                    alert("Incorrect password. Please try again.");
                    setPassword("");
                }
            } else {
                alert("An unexpected error occurred. Please try again.");
            }
        }
    };

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
                    <h1 style={{ textAlign: "center", marginBottom: "1.5rem", color: "#008080" }}>Login</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="p-field" style={{ marginBottom: "1.5rem", display: "flex", alignItems: "center" }}>
                            <i className="pi pi-user" style={{ color: "#008080", marginRight: "1rem", fontSize: "1.5rem" }} />
                            <div style={{ flex: 1 }}>
                                <label htmlFor="name" style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold", color: "#008080" }}>Name:</label>
                                <InputText
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
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
                        </div>
                        <div className="p-field" style={{ marginBottom: "1.5rem", display: "flex", alignItems: "center" }}>
                            <i className="pi pi-envelope" style={{ color: "#008080", marginRight: "1rem", fontSize: "1.5rem" }} />
                            <div style={{ flex: 1 }}>
                                <label htmlFor="email" style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold", color: "#008080" }}>Email:</label>
                                <InputText
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
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
                        </div>
                        <div className="p-field" style={{ marginBottom: "1.5rem", display: "flex", alignItems: "center" }}>
                            <i className="pi pi-lock" style={{ color: "#008080", marginRight: "1rem", fontSize: "1.5rem" }} />
                            <div style={{ flex: 1 }}>
                                <label htmlFor="password" style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold", color: "#008080" }}>Password:</label>
                                <Password
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    feedback={false}
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
                        </div>
                        <Button
                            type="submit"
                            label="Login"
                            icon="pi pi-sign-in"
                            iconPos="left"
                            className="p-button-lg p-button-rounded"
                            style={{
                                width: "100%",
                                marginBottom: "1rem",
                                backgroundColor: "#008080",
                                borderColor: "#008080",
                                color: "white",
                                fontWeight: "bold",
                            }}
                        />
                    </form>

                    {showRoleSelection && (
                        <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
                            <h2 style={{ color: "#008080" }}>Select your role:</h2>
                            <Button
                                label="Register as Photographer"
                                className="p-button-outlined"
                                style={{
                                    margin: "0.5rem",
                                    borderColor: "#008080",
                                    color: "#008080",
                                    fontWeight: "bold",
                                    padding: "0.75rem 1.5rem",
                                    fontSize: "1rem",
                                }}
                                onClick={() => handleRoleSelection("Photographer")}
                            />
                            <Button
                                label="Register as Renter"
                                className="p-button-outlined"
                                style={{
                                    margin: "0.5rem",
                                    borderColor: "#008080",
                                    color: "#008080",
                                    fontWeight: "bold",
                                    padding: "0.75rem 1.5rem",
                                    fontSize: "1rem",
                                }}
                                onClick={() => handleRoleSelection("Renter")}
                            />
                            <Button
                                label="Register as User"
                                className="p-button-outlined"
                                style={{
                                    margin: "0.5rem",
                                    borderColor: "#008080",
                                    color: "#008080",
                                    fontWeight: "bold",
                                    padding: "0.75rem 1.5rem",
                                    fontSize: "1rem",
                                }}
                                onClick={() => handleRoleSelection("User")}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;