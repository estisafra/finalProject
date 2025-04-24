import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useSelector } from 'react-redux';
import { Toast } from 'primereact/toast'; // ייבוא Toast מ-PrimeReact
import AddAccessory from "./AddAccessory";
import DeleteAccessory from "./DeleteAccessory";

const RenterAccessories = () => {
    const [accessories, setAccessories] = useState([]); // רשימת האביזרים
    const [showAddAccessory, setShowAddAccessory] = useState(false); // שליטה על הצגת קומפוננטת הוספה
    const [deletingAccessoryId, setDeletingAccessoryId] = useState(null); // ID של האביזר למחיקה
    const id = useSelector((state) => state.user.id); // ID של המשתמש המחובר
    const toast = useRef(null); // רפרנס ל-Toast

    // שליפת האביזרים מהשרת
    useEffect(() => {
        const fetchAccessories = async () => {
            const token = localStorage.getItem("token");
            if (id) {
                try {
                    const response = await axios.get(`http://localhost:8080/Accessory/getAccessoryByRenter/${id}`, {
                        headers: {
                            "Authorization": `Bearer ${token}`,
                        },
                    });
                    console.log("Response data:", response.data);
                    setAccessories(response.data);
                } catch (error) {
                    console.error("Error fetching accessories:", error);
                }
            }
        };

        fetchAccessories();
    }, [id]);

    if (showAddAccessory) {
        return <AddAccessory />;
    }

    // טיפול במחיקת אביזר
    const handleDelete = (accessoryid) => {
        setDeletingAccessoryId(accessoryid);
    };

    // עדכון הרשימה לאחר מחיקה
    const handleDeleteSuccess = async () => {
        setDeletingAccessoryId(null); // איפוס ה-ID של האביזר שנמחק
    
        // עדכון הרשימה על ידי סינון האביזר שנמחק
        setAccessories(prevAccessories => 
            prevAccessories.filter(accessory => accessory.accessoryId !== deletingAccessoryId)
        );
    
        // הצגת הודעת הצלחה
        toast.current.show({
            severity: 'success',
            summary: 'Success',
            detail: 'Accessory deleted successfully',
            life: 3000,
        });
    };
    return (
        <div>
            <Toast ref={toast} /> {/* רכיב Toast להצגת הודעות */}
            <button onClick={() => setShowAddAccessory(true)}>To add accessory</button>
            <h1>Renter Accessories</h1>
            <ul>
                {accessories.map((accessory) => (
                    <li key={accessory.accessoryId || accessory.accessoryName}>
                        <div>
                            Accessory Name: {accessory.accessoryName} <br />
                            Accessory Price: {accessory.price} <br />
                            <img src={`http://localhost:8080${accessory.image}`} alt="accessory" style={{ width: "100px", height: "auto" }} />
                        </div>
                        <button onClick={() => handleDelete(accessory.accessoryId)}>Delete</button>
                    </li>
                ))}
            </ul>

            {/* קריאה לקומפוננטת DeleteAccessory */}
            {deletingAccessoryId && (
                <DeleteAccessory
                    accessoryid={deletingAccessoryId}
                    onSuccess={handleDeleteSuccess}
                    onClose={() => setDeletingAccessoryId(null)}
                />
            )}
        </div>
    );
};

export default RenterAccessories;