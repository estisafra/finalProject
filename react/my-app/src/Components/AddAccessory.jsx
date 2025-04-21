import axios from "axios";
import { useState } from "react";

const AddAccessory = () => {
    const [name, setName] = useState("");
    const [image, setImage] = useState(null);
    const [price, setPrice] = useState("");
    const id = "67ea7200d3d21caf4dd0f6a2"; // מזהה המשכיר

    const handleSubmit = (e) => {
        e.preventDefault();
    
        const formData = new FormData();
        formData.append("accessoryName", name);
        formData.append("image", image); 
        formData.append("price", price);
    
        axios.put(`http://localhost:8080/Renter/addAccessory/${id}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
            .then((response) => {
                console.log("Accessory added:", response.data);
                alert("Accessory added successfully!");
                setName("");
                setImage(null);
                setPrice("");
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
                <button type="submit">Add Accessory</button>
            </form>
        </div>
    );
};

export default AddAccessory;