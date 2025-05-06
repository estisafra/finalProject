import { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux"; 
import { saveUser } from "../Store/UserSlice"; 
import { useNavigate } from "react-router-dom";

const RegisterPhotography = () => {
    const location = useLocation();
    const dispatch = useDispatch(); 
    const { name, email, password } = location.state || {};
    const navigate=useNavigate()

    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [photographyLink, setPhotographyLink] = useState("");
    const [photographyGaleries, setPhotographyGaleries] = useState([{ name: 'new born', minPrice: 0, maxPrice: 0,images: [] }]); // מערך הגלריות עם שם, מחיר מינימלי ומחיר מקסימלי
    const [images, setImages] = useState([]);
    const [selectedGalleryIndex, setSelectedGalleryIndex] = useState(0);


    const handleAddGallery = () => {
        const newGalleryName = `Gallery ${photographyGaleries.length + 1}`;

        // הוספת גלריה חדשה למערך photographyGaleries
        setPhotographyGaleries((prev) => [
            ...prev,
            { name: newGalleryName, minPrice: 0, maxPrice: 0, images: [] },
        ]);

        // עדכון שם הגלריה לכל התמונות שאין להן שם גלריה
       
    };
    const handleImageChange = (event) => {
        const files = Array.from(event.target.files);
        setImages(prev => [...prev, ...files]);

        const galleryImages = files.map(file => ({
            link: URL.createObjectURL(file)
        }));

        setPhotographyGaleries(prev => {
            const updated = [...prev];
            updated[selectedGalleryIndex].images = [
                ...updated[selectedGalleryIndex].images,
                ...galleryImages
            ];
            return updated;
        });
    };

     // עדכון מחירים בגלריה נבחרת
     const handlePriceChange = (e, field) => {
        const value = e.target.value;
        setPhotographyGaleries((prevGaleries) =>
            prevGaleries.map((gallery, index) =>
                index === selectedGalleryIndex
                    ? { ...gallery, [field]: value }
                    : gallery
            )
        );
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();

        formData.append("password", password);
        formData.append("name", name);
        formData.append("email", email);
        formData.append("photographyAddress", address);
        formData.append("photographyPhone", phone);
        formData.append("photographyLink", photographyLink);
        formData.append("userType", "Photography");

        formData.append("metadata", JSON.stringify(photographyGaleries));

        images.forEach((file) => {
            formData.append("images", file);
        });

        try {
            const response = await axios.post("http://localhost:8080/System/register", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            dispatch(
                saveUser({
                    name: response.data.user.photographyName,
                    id: response.data.user._id,
                    role: "Photography",
                    phone: response.data.user.photographyPhone,
                    address: response.data.user.photographyAddress,
                    email: response.data.user.photographyMail,
                })
            );

            navigate("/photographyHome");
        } catch (error) {
            console.error("Error during registration:", error);
            alert("Registration failed.");
        }
    };


    return (
        <div>
            <h1>Register as Photography</h1>
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
                <div>
                    <label htmlFor="photographyLink">Photography Link:</label>
                    <input
                        type="text"
                        id="photographyLink"
                        value={photographyLink}
                        onChange={(e) => setPhotographyLink(e.target.value)}
                        required
                    />
                </div>

                <h3>Photography Galeries</h3>
                {photographyGaleries.map((gallery, index) => (
                    <div key={index}>
                        <input
                            type="text"
                            placeholder="Gallery Name"
                            value={gallery.name}
                            onChange={(e) => {
                                const updatedGaleries = [...photographyGaleries];
                                updatedGaleries[index].name = e.target.value;
                                setPhotographyGaleries(updatedGaleries);
                            }}
                        />
                        <input
                            type="number"
                            placeholder="Minimum Price"
                            value={gallery.minPrice}
                            onChange={(e) => handlePriceChange(e, "minPrice")}
                        />
                        <input
                            type="number"
                            placeholder="Maximum Price"
                            value={gallery.maxPrice}
                            onChange={(e) => handlePriceChange(e, "maxPrice")}
                        />
                    </div>
                ))}
                <div>
                    <label htmlFor="images">Upload Images:</label>
                    <input type="file" id="images" multiple onChange={handleImageChange} />
                </div>
                <button type="button" onClick={handleAddGallery}>
                    Add Gallery
                </button>
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default RegisterPhotography;