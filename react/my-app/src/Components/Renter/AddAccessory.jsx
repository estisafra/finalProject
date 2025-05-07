import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Button } from "primereact/button"; // ייבוא Button
import { InputText } from "primereact/inputtext"; // ייבוא InputText
import { InputNumber } from "primereact/inputnumber"; // ייבוא InputNumber
import { FileUpload } from "primereact/fileupload"; // ייבוא FileUpload
import { Dialog } from "primereact/dialog"; // ייבוא Dialog

const AddAccessory = ({ onClose }) => {
    const [name, setName] = useState("");
    const [image, setImage] = useState(null);
    const [price, setPrice] = useState("");
    const id = useSelector((state) => state.user.id);

const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("accessoryName", name);
    formData.append("image", image);
    formData.append("price", price);

    const token = localStorage.getItem("token");
    try {
        for (let pair of formData.entries()) {
            console.log(`${pair[0]}:`, pair[1]);
          }
          
        console.log(formData.get("image")); // הדפסת התמונה לקונסול
        const response = await axios.put(`http://localhost:8080/Renter/addAccessory/${id}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
            },
        });
        onClose(response.data); // שליחת האביזר החדש לסגירה
    } catch (error) {
        console.error("Error adding accessory:", error);
        alert("Failed to add accessory.");
    }
};


    return (
        <Dialog header="Add Accessory" visible={true} onHide={onClose}>
            <div style={{ padding: "2rem" }}> {/* הגדלת הרווח */}
                <form onSubmit={handleSubmit}>
                    <div className="p-field">
                        <label htmlFor="name">Name:</label>
                        <InputText
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
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
                    <div className="p-field">
                         <label htmlFor="image">Image:</label>
                        <FileUpload
                         id="image"
                         mode="basic"
                         accept="image/*"
                         maxFileSize={1000000} // 1MB
                         onSelect={(e) => setImage(e.originalEvent.files[0])}
                
                         chooseLabel="Choose"
                         required
                         />
                      </div>
                    <div className="p-field">
                        <label htmlFor="price">Price:</label>
                        <InputNumber
                            id="price"
                            value={price}
                            onValueChange={(e) => setPrice(e.value)}
                            required
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
                    <div className="p-d-flex p-jc-between">
                        <Button 
                            type="submit" 
                            label="Add" 
                            icon="pi pi-check" 
                            style={{ color: "black", fontWeight: "bold", marginTop: "0.5rem" }}
                            onFocus={(e) => (e.target.style.boxShadow = "0 0 5px #005757")}
                            onBlur={(e) => (e.target.style.boxShadow = "none")}
                        />
                        <Button 
                            type="button" 
                            label="Cancel" 
                            icon="pi pi-times" 
                            onClick={onClose} 
                            className="p-button-secondary" 
                            style={{ color: "black", fontWeight: "bold", marginTop: "0.5rem" }}
                            onFocus={(e) => (e.target.style.boxShadow = "0 0 5px #005757")}
                            onBlur={(e) => (e.target.style.boxShadow = "none")}
                        />
                    </div>
                </form>
            </div>
        </Dialog>
    );
};

export default AddAccessory;
