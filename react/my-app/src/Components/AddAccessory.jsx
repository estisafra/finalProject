
import axios from "axios";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; 

const AddAccessory = () => {
    const [name, setName] = useState("");
    const [image, setImage] = useState(null);
    const [price, setPrice] = useState("");
    const [isReady, setIsReady] = useState(false);
    const id = useSelector((state) => state.user.id);
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            console.log("Renter ID loaded:", id);
            setIsReady(true);
        }
    }, [id]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!isReady) {
            alert("ID is not ready yet. Please try again.");
            return;
        }

        const formData = new FormData();
        formData.append("accessoryName", name);
        formData.append("image", image); 
        formData.append("price", price);

        const token = localStorage.getItem("token");
        console.log("Token:", token);
        axios.put(`http://localhost:8080/Renter/addAccessory/${id}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${token}`,
            },
        })
            .then((response) => {
                console.log("Accessory added:", response.data);
                alert("Accessory added successfully!");
               
                setName("");
                setImage(null);
                setPrice("");
                // <RenterAccessories/>

            })
            .catch((error) => {
                console.error("Error adding accessory:", error);
                alert("Failed to add accessory.");
            });
    };

    return (
        <div>
            <h1>Add Accessory</h1>
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
                    <label htmlFor="image">Image:</label>
                    <input
                        type="file"
                        id="image"
                        accept="image/*"
                        onChange={(e) => setImage(e.target.files[0])}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="price">Price:</label>
                    <input
                        type="number"
                        id="price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" disabled={!isReady}>Add Accessory</button>
            </form>
        </div>
    );
};

export default AddAccessory;