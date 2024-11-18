import React, { useState } from "react";
import style from '../styles/auth.module.css';
import useCreateTour from "@/hook/useCreateTour";  // Import the custom hook
import Image from "next/image";

function CreateTour({ title, url }) {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        category: '',
        description: '',
        img: null,
    });
    const [imgPreview, setImgPreview] = useState('');
    const { createTour, isUploading, error, success } = useCreateTour(url); // Use the custom hook

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prevData) => ({ ...prevData, img: file }));
            setImgPreview(URL.createObjectURL(file)); // Preview the image
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.img) return alert("Please upload an image.");  // Image check
        await createTour(formData);  // Call the custom hook to create the tour
        resetForm(); // Reset the form after submission
    };

    const resetForm = () => {
        setFormData({
            name: '',
            price: '',
            category: '',
            description: '',
            img: null,
        });
        setImgPreview('');
    };

    return (
        <form onSubmit={handleSubmit}>
            {['name', 'price', 'category', 'description'].map((field) => (
                <div key={field} className={style.formgroup}>
                    <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                    <input
                        type={field === 'price' ? 'number' : 'text'}
                        name={field}
                        value={formData[field]}
                        onChange={handleChange}
                        required
                        className={style.authinput}
                    />
                </div>
            ))}
            <div className={style.formgroup}>
                <label>Upload Image</label>
                <input type="file" accept="image/*" onChange={handleImageChange} required />
                {imgPreview && <Image src={imgPreview} alt="Preview" width={200} height={200} />}
            </div>
            <button type="submit" disabled={isUploading} className={style.loginbutton}>
                {isUploading ? 'Uploading...' : `Create ${title}`}
            </button>

            {error && <p style={{ color: "red" }}>{error}</p>}  {/* Display error if any */}
            {success && <p style={{ color: "green" }}>{success}</p>}  {/* Display success message */}
        </form>
    );
}

export default CreateTour;
