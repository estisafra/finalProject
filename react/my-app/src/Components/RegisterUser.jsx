import { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useDispatch,useSelector } from "react-redux"; // ייבוא useDispatch
import { saveUser } from "../Store/UserSlice"; // עדכן את הנתיב לפי הצורך


const RegisterUser = () => {
    const location = useLocation();
    const dispatch = useDispatch(); 
    const userSlice = useSelector((state) => state.user);
    const { name, email, password } = location.state || {}; // קבלת הפרטים מה-props

    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const handleSubmit = async (e) => {
        e.preventDefault();

        const registerData = {
            name,
            email,
            password,
            address,
            phone,
            userType: "User", // הוסף את סוג המשתמש
        };

        try {
            const response = await axios.post("http://localhost:8080/System/register", registerData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            console.log("Registration successful:", response.data);
            alert("Registration successful!");

            dispatch(saveUser({
                name: name , // אם יש שם מהתגובה, השתמש בו, אחרת השתמש בשם מהקלט
                id: response.data.user._id, // הנח שיש id מהתגובה
                role:registerData.userType // הנח שיש role מהתגובה
            }));

        } catch (error) {
            console.error("Error during registration:", error);
            alert("Registration failed. Please try again.");
        }
    };
    
    return (
        <div>
            <h1>Register as User</h1>
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
    );
};

export default RegisterUser;