import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux"; 
import { saveUser } from "../Store/UserSlice"; 
import { Menubar } from "primereact/menubar";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { FileUpload } from 'primereact/fileupload';
import { useForm } from 'react-hook-form';

const RegisterPhotography = () => {
    const location = useLocation();
    const dispatch = useDispatch(); 
    const { name, email, password } = location.state || {};
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();

    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [photographyLink, setPhotographyLink] = useState("");
    const [photographyGaleries, setPhotographyGaleries] = useState([{ name: 'new born', minPrice: 0, maxPrice: 0, images: [] }]);
    const [images, setImages] = useState([]);
    const [selectedGalleryIndex, setSelectedGalleryIndex] = useState(0);
    const [profil, setProfile] = useState("");

    const handleAddGallery = () => {
        setPhotographyGaleries((prev) => [
            ...prev,
            { name: `Gallery ${prev.length + 1}`, minPrice: 0, maxPrice: 0, images: [] },
        ]);
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

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append("password", password);
        formData.append("name", name);
        formData.append("email", email);
        formData.append("photographyAddress", data.address);
        formData.append("photographyPhone", data.phone);
        formData.append("photographyLink", data.photographyLink);
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

    const items = [
        {
            label: "Home",
            icon: "pi pi-home",
            command: () => navigate("/"),
        },
    ];

    const start = (
        <img
            alt="logo"
            src="https://sheviphoto.co.il/wp-content/uploads/2020/12/logo.png"
            style={{ height: "50px", borderRadius: "50%" }}
        />
    );

    return (
        <div
            style={{
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                backgroundImage: "url('https://via.placeholder.com/1920x1080')",
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <Menubar
                model={items}
                start={start}
                style={{
                    backgroundColor: "#008080",
                    color: "white",
                    borderBottom: "2px solid #005757",
                    height: "100px",
                }}
            />
            <div
                style={{
                    flex: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <div
                    style={{
                        width: "400px",
                        padding: "2rem",
                        background: "white",
                        borderRadius: "8px",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                    }}
                >
                    <h1 style={{ textAlign: "center", marginBottom: "1.5rem", color: "#008080" }}>
                        Register as Photography
                    </h1>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div style={{ marginTop: "2rem", color: "#008080" }}>
                            <p><strong>Name:</strong> {name}</p>
                            <p><strong>Email:</strong> {email}</p>
                            <p><strong>Password:</strong> {password}</p>
                        </div>
                        <div className="p-field" style={{ marginBottom: "1.5rem" }}>
                            <label htmlFor="address" style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold", color: "#008080" }}>
                                Address:
                            </label>
                            <InputText
                                id="address"
                                {...register('address', { required: 'Address is required' })}
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="p-inputtext-lg"
                                style={{
                                    width: "100%",
                                    borderColor: "#008080",
                                    outline: "none",
                                    transition: "box-shadow 0.3s ease",
                                }}
                            />
                            {errors.address && <p style={{ color: 'red' }}>{errors.address.message}</p>}
                        </div>
                        <div className="p-field" style={{ marginBottom: "1.5rem" }}>
                            <label htmlFor="phone" style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold", color: "#008080" }}>
                                Phone:
                            </label>
                            <InputText
                                id="phone"
                                {...register('phone', { 
                                    required: 'Phone number is required', 
                                    pattern: {
                                        value: /^\+?[0-9]{10,15}$/,
                                        message: 'Invalid phone number'
                                    }
                                })}
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="p-inputtext-lg"
                                style={{
                                    width: "100%",
                                    borderColor: "#008080",
                                    outline: "none",
                                    transition: "box-shadow 0.3s ease",
                                }}
                            />
                            {errors.phone && <p style={{ color: 'red' }}>{errors.phone.message}</p>}
                        </div>
                        <div className="p-field" style={{ marginBottom: "1.5rem" }}>
                            <label htmlFor="photographyLink" style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold", color: "#008080" }}>
                                Photography Link:
                            </label>
                            <InputText
                                id="photographyLink"
                                {...register('photographyLink', { 
                                    required: 'Photography link is required',
                                    validate: {
                                        isValidUrl: value => /^(ftp|http|https):\/\/[^ "]+$/.test(value) || 'Invalid link'
                                    }
                                })}
                                value={photographyLink}
                                onChange={(e) => setPhotographyLink(e.target.value)}
                                className="p-inputtext-lg"
                                style={{
                                    width: "100%",
                                    borderColor: "#008080",
                                    outline: "none",
                                    transition: "box-shadow 0.3s ease",
                                }}
                            />
                            {errors.photographyLink && <p style={{ color: 'red' }}>{errors.photographyLink.message}</p>}
                        </div>
                        <div className="p-field" style={{ marginBottom: "1.5rem" }}>
                            <label htmlFor="profil" style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold", color: "#008080" }}>
                                Profile Description:
                            </label>
                            <InputText
                                id="profil"
                                value={profil}
                                onChange={(e) => setProfile(e.target.value)}
                                required
                                className="p-inputtext-lg"
                                style={{
                                    width: "100%",
                                    borderColor: "#008080",
                                    outline: "none",
                                    transition: "box-shadow 0.3s ease",
                                }}
                            />
                        </div>

                        <h3 style={{ color: "#008080" }}>Photography Galeries</h3>
                        {photographyGaleries.map((gallery, index) => (
                            <div key={index} style={{ marginBottom: "1rem" }}>
                                <InputText
                                    type="text"
                                    placeholder="Gallery Name"
                                    value={gallery.name}
                                    onChange={(e) => {
                                        const updatedGaleries = [...photographyGaleries];
                                        updatedGaleries[index].name = e.target.value;
                                        setPhotographyGaleries(updatedGaleries);
                                    }}
                                    style={{ marginBottom: "0.5rem" }}
                                    {...register(`photographyGaleries.${index}.name`, { required: 'Gallery name is required' })}
                                />
                                {errors.photographyGaleries?.[index]?.name && <p style={{ color: 'red' }}>{errors.photographyGaleries[index].name.message}</p>}
                                <InputText
                                    type="number"
                                    placeholder="Minimum Price"
                                    value={gallery.minPrice}
                                    onChange={(e) => handlePriceChange(e, "minPrice")}
                                    style={{ marginBottom: "0.5rem" }}
                                    {...register(`photographyGaleries.${index}.minPrice`, { required: 'Minimum price is required' })}
                                />
                                {errors.photographyGaleries?.[index]?.minPrice && <p style={{ color: 'red' }}>{errors.photographyGaleries[index].minPrice.message}</p>}
                                <InputText
                                    type="number"
                                    placeholder="Maximum Price"
                                    value={gallery.maxPrice}
                                    onChange={(e) => handlePriceChange(e, "maxPrice")}
                                    style={{ marginBottom: "0.5rem" }}
                                    {...register(`photographyGaleries.${index}.maxPrice`, { required: 'Maximum price is required' })}
                                />
                                {errors.photographyGaleries?.[index]?.maxPrice && <p style={{ color: 'red' }}>{errors.photographyGaleries[index].maxPrice.message}</p>}
                            </div>
                        ))}
                          <div className="p-field" style={{ marginBottom: "1.5rem" }}>
    
                          <FileUpload
                           id="image"
                           mode="basic"
                           accept="image/*"
                           maxFileSize={100000000} // 1MB
                           onSelect={(e) => {
                           const files = Array.from(e.files);
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
        }} 
        chooseLabel="Upload Images"
        required
        multiple
        buttonStyle={{ backgroundColor: "#005757", color: "white" }} 
    />
</div>
                        <Button type="button" label="Add Gallery" onClick={handleAddGallery} className="p-button-secondary" />
                        <Button type="submit" label="Register" icon="pi pi-user-plus" iconPos="left" className="p-button-lg p-button-rounded" style={{ marginTop: "1rem", backgroundColor: "#008080", borderColor: "#008080", color: "white", fontWeight: "bold" }} />
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegisterPhotography;
