import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from 'react-redux';

const DeleteAccessory = ({ accessoryid }) => {
    const [message, setMessage] = useState("");
    const renterId = useSelector((state) => state.user.id); 

    useEffect(() => {
        if (accessoryid && renterId) {
            const token = localStorage.getItem("token"); // קבלת ה-token מה-storage
            console.log("Token:", token); // הדפסת ה-token לבדיקה

            axios.put(`http://localhost:8080/Accessory/deleteAccessoryFromRenter/${renterId}`, {
                accessoryid // שליחת ה-ID של האביזר בגוף הבקשה
            })
            .then(response => {
                console.log("Response data:", response.data);
                setMessage("Delete successful");
            })
            .catch(error => {
                console.error("Error deleting accessory:", error);
                setMessage("Delete failed");
            });
        }
    }, [accessoryid, renterId]);

    return (
        <>
            <h1>Delete Accessory</h1>
            {message && <p>{message}</p>} {/* הצגת הודעת הצלחה או כישלון */}
        </>
    );
}

export default DeleteAccessory;