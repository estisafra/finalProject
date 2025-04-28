import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from 'react-redux';

const DeleteAccessory = ({ accessoryid, onSuccess, onClose }) => {
    const [message, setMessage] = useState("");
    const renterId = useSelector((state) => state.user.id); 

    useEffect(() => {
        const deleteAccessory = async () => {
            if (accessoryid && renterId) {
                const token = localStorage.getItem("token"); // קבלת ה-token מה-storage
                console.log("Token:", token); // הדפסת ה-token לבדיקה

                try {
                    const response = await axios.put(
                        `http://localhost:8080/Accessory/deleteAccessoryFromRenter/${renterId}`,
                        { accessoryid }, // שליחת ה-ID של האביזר בגוף הבקשה
                        {
                            headers: {
                                "Authorization": `Bearer ${token}`, // הוספת ה-token בכותרות
                            },
                        }
                    );
                    console.log("Response data:", response.data);
                    setMessage("Delete successful");
                    console.log("Accessory deleted successfully:", response.data);

                    // קריאה לפונקציה לעדכון הרשימה
                    if (onSuccess) {
                        onSuccess(accessoryid);
                    }
                } catch (error) {
                    console.error("Error deleting accessory:", error);
                    setMessage("Delete failed");
                } finally {
                    // סגירת הקומפוננטה
                    if (onClose) {
                        onClose();
                    }
                }
            }
        };

        deleteAccessory();
    }, [accessoryid, renterId, onSuccess, onClose]); 

    return null; // הקומפוננטה לא מציגה שום דבר
};

export default DeleteAccessory;