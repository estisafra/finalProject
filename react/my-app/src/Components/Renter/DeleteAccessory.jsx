import { useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const DeleteAccessory = ({ accessoryid, onSuccess, onClose, onMessage }) => {
    const renterId = useSelector((state) => state.user.id);

    useEffect(() => {
        const deleteAccessory = async () => {
            if (accessoryid && renterId) {
                const token = localStorage.getItem("token");

                try {
                    const response = await axios.put(
                        `http://localhost:8080/Accessory/deleteAccessoryFromRenter/${renterId}`,
                        { accessoryid },
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );

                    if (response.data && response.data.success === false) {
                        // שליחת הודעה על מוצר מושכר
                        onMessage({
                            severity: "warn",
                            summary: "Warning",
                            detail: response.data.message || "Accessory is rented",
                        });
                    } else {
                        // שליחת הודעה על מחיקה מוצלחת
                        onMessage({
                            severity: "success",
                            summary: "Success",
                            detail: "Accessory deleted successfully",
                        });

                        if (onSuccess) {
                            onSuccess(accessoryid);
                        }
                    }
                } catch (error) {
                    console.error("Error deleting accessory:", error);
                    // שליחת הודעה על שגיאה
                    onMessage({
                        severity: "error",
                        summary: "Error",
                        detail: "Failed to delete accessory",
                    });
                } finally {
                    if (onClose) {
                        onClose();
                    }
                }
            }
        };

        deleteAccessory();
    }, [accessoryid, renterId, onSuccess, onClose, onMessage]);

    return null; // הקומפוננטה לא מציגה שום דבר
};

export default DeleteAccessory;