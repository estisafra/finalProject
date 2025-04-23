import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from 'react-redux';
import AddAccessory from "./AddAccessory";
import DeleteAccessory from "./DeleteAccessory"; // Import DeleteAccessory component

const RenterAccessories = () => {
    const [accessories, setAccessories] = useState([]);
    const [showAddAccessory, setShowAddAccessory] = useState(false);
    const [showDeleteAccessory, setShowDeleteAccessory] = useState(false);
    const [deletingAccessoryId, setDeletingAccessoryId] = useState(null);
    const id = useSelector((state) => state.user.id); 
     
    useEffect(() => {
        if (id) {
            axios.get(`http://localhost:8080/Accessory/getAccessoryByRenter/${id}`)
                .then(response => {
                    console.log("Response data:", response.data);
                    setAccessories(response.data); 
                })
                .catch(error => {
                    console.error("Error fetching rents:", error);
                });
        }
    }, [id]);

    if (showAddAccessory) {
        return <AddAccessory />;
    }

    if (showDeleteAccessory && deletingAccessoryId) {
        return <DeleteAccessory accessoryid={deletingAccessoryId} onClose={() => setShowDeleteAccessory(false)} />;
    }

    const handleDelete = (accessoryid) => {
        console.log("Deleting accessory with ID:", accessoryid); // הוסף שורה זו כדי לבדוק
        setDeletingAccessoryId(accessoryid);
        setShowDeleteAccessory(true);
    };

    return (
        <div>
            <button onClick={() => setShowAddAccessory(true)}>To add accessory</button>
            <h1>Renter Accessories</h1>
            <ul>
                {accessories.map((accessory) => (
                    <li key={accessory.accessoryId|| accessory.accessoryName}>
                        <div>
                            Accessory Name: {accessory.accessoryName} <br />
                            Accessory Price: {accessory.price} <br />
                            <img src={`http://localhost:8080${accessory.image}`} alt="accessory" style={{ width: "100px", height: "auto" }} />
                        </div>
                        <button onClick={() => {
                            console.log("Button clicked for accessory ID:", accessory.accessoryId); // הוסף שורה זו כדי לבדוק
                            handleDelete( accessory.accessoryId);
                        }}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default RenterAccessories;
