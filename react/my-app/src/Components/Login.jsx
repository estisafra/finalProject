import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // ייבוא useNavigate

const Login = () => {
    const navigate = useNavigate(); // הגדרת navigate

    const handleRoleSelection = (selectedRole) => {
        if (selectedRole === "Photographer") {
            navigate("/register-photography", { state: { name, email, password } });
        } else if (selectedRole === "Renter") {
            navigate("/register-renter", { state: { name, email, password } });
        } else if (selectedRole === "User") {
            navigate("/register-user", { state: { name, email, password } });
        }
    };

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showRoleSelection, setShowRoleSelection] = useState(false); // מצב להצגת כפתורי התפקיד

    const handleSubmit = async (e) => {
        e.preventDefault();

        const loginData = {
            name,
            email,
            password,
        };

        try {
            const response = await axios.post("http://localhost:8080/System/login", loginData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            console.log("Login successful:", response.data);
            alert("Login successful!");
            setShowRoleSelection(false); // הסתרת כפתורי התפקיד במקרה של הצלחה
        } catch (error) {
            if (error.response && (error.response.status === 400 || error.response.status === 404)) {
                console.error("Error during login:", error.response.data);
                alert("Login failed. Please select your role.");
                setShowRoleSelection(true); // הצגת כפתורי התפקיד במקרה של שגיאה
            } else {
                console.error("Error during login:", error.message);
                alert("An unexpected error occurred. Please try again.");
            }
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>

            {/* הצגת כפתורי התפקיד רק אם הסטטוס הוא 400 או 404 */}
            {showRoleSelection && (
                <div>
                    <h2>Select your role:</h2>
                    <button onClick={() => handleRoleSelection("Photographer")}>Register as Photographer</button>
                    <button onClick={() => handleRoleSelection("Renter")}>Register as Renter</button>
                    <button onClick={() => handleRoleSelection("User")}>Register as User</button>
                </div>
            )}
        </div>
    );
};

export default Login;