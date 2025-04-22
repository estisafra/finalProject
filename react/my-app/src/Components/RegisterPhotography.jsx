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
    const [photographyGaleries, setPhotographyGaleries] = useState([{ name: 'new born', minPrice: 0, maxPrice: 0 }]);
    const [Images, setImages] = useState([]); // מערך התמונות עם שם גלריה
    const [allImages, setAllImages] = useState([]); // מערך הקבצים עצמ
    const [selectedGalleryIndex, setSelectedGalleryIndex] = useState(0);

    // הוספת תמונות למערך Images עם שם הגלריה הנוכחית ולמערך allImages
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);

        // יצירת אובייקטים עם שם גלריה
        const newImages = files.map((file) => ({
            url: file, // שמירת הקובץ עצמו
            gallery: photographyGaleries[selectedGalleryIndex].name, // שם הגלריה הנוכחית
        }));

        // עדכון מערך התמונות עם שם גלריה
        setImages((prevImages) => [...prevImages, ...newImages]);

        // עדכון מערך allImages עם הקבצים עצמם בלבד
        setAllImages((prevAllImages) => [...prevAllImages, ...files]);
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

    // הוספת גלריה חדשה
    const handleAddGallery = () => {
        const newGalleryName = `Gallery ${photographyGaleries.length + 1}`;

        // הוספת גלריה חדשה למערך photographyGaleries
        setPhotographyGaleries((prev) => [
            ...prev,
            { name: newGalleryName, minPrice: 0, maxPrice: 0 },
        ]);

        // עדכון שם הגלריה לכל התמונות שאין להן שם גלריה
        setImages((prevImages) =>
            prevImages.map((image) =>
                image.gallery === "" ? { ...image, gallery: newGalleryName } : image
            )
        );
    };

    // שליחת הנתונים לשרת
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("password", password);
        formData.append("name", name);
        formData.append("email", email);
        formData.append("address", address);
        formData.append("phone", phone);
        formData.append("link", photographyLink);
        formData.append("userType", "Photography");

        // הוספת כל הגלריות ל-FormData
        photographyGaleries.forEach((gallery, index) => {
            formData.append(`galeries[${index}][name]`, gallery.name);
            formData.append(`galeries[${index}][minPrice]`, gallery.minPrice);
            formData.append(`galeries[${index}][maxPrice]`, gallery.maxPrice);
        });

        // הוספת כל התמונות ל-FormData
        Images.forEach((image, index) => {
            formData.append(`images[${index}][url]`, image.url);
            formData.append(`images[${index}][gallery]`, image.gallery);
        });

        // הוספת כל הקבצים עצמם ממערך allImages ל-FormData
        allImages.forEach((file, index) => {
            formData.append(`allImages[${index}]`, file);
        });

        formData.forEach((value, key) => {
            console.log(key, value);
        });

        try {
            const response = await axios.post("http://localhost:8080/System/register", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            console.log("Registration successful:", response.data);
            alert("Registration successful!");

            dispatch(
                saveUser({
                    name: name,
                    id: response.data.user._id,
                    role: "User",
                })
            );

            navigate("/photographyHome");
        } catch (error) {
            console.error("Error during registration:", error);
            alert("Registration failed. Please try again.");
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