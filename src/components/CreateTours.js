import React, { useState, useEffect } from "react";
import style from '../styles/auth.module.css';
import useCreateTour from "@/hook/useCreateTour";
import useAuth from "@/hook/useAuth";
import useEditData from "@/hook/useEditData";
import Image from "next/image";

function CreateTour({ title, url, tourData, onSuccess }) {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        category: '',
        description: '',
        img: '',
    });
    const [imgPreview, setImgPreview] = useState('');
    const { token } = useAuth();
    const { createTour, isUploading, error: createError, success: createSuccess } = useCreateTour(url); // For adding data
    const { editData, loading: isEditing, error: editError, success: editSuccess } = useEditData(`${url}`, tourData.id, token); // For editing data

    // Initialize the form with data for edit mode
    useEffect(() => {
        if (tourData) {
            setFormData({
                name: tourData.name || '',
                price: tourData.price || '',
                category: tourData.category || '',
                description: tourData.description || '',
                img: tourData.imageUrl || '',
            });
            if (tourData.imageUrl) {
                setImgPreview(`https://tripwayholidays.in//tour-image/${tourData.imageUrl}`); // Adjust the path for your project
            }
        }
    }, [tourData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Store only the image name, not the file object
            setFormData((prevData) => ({ ...prevData, img: file.name }));
            setImgPreview(URL.createObjectURL(file)); // Preview the image
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.img) return alert("Please upload an image.");

        if (tourData) {
            await editData(formData);
        } else {
            await createTour(formData);
        }

        if ((tourData && editSuccess) || (!tourData && createSuccess)) {
            resetForm();
            if (onSuccess) onSuccess();
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            price: '',
            category: '',
            description: '',
            img: '',
        });
        setImgPreview('');
    };

    return (
        <form onSubmit={handleSubmit}>
            {['name', 'price', 'category'].map((field) => (
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
                <label>Description</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    className={style.authinput}
                    rows="4"
                ></textarea>
            </div>
            <div className={style.formgroup}>
                <label>Upload Image</label>
                <input type="file" accept="image/*" onChange={handleImageChange} />
                {imgPreview && <Image src={imgPreview} alt="Preview" width={200} height={200} />}
            </div>
            <button
                type="submit"
                disabled={isUploading || isEditing}
                className={style.loginbutton}
            >
                {isUploading || isEditing
                    ? 'Processing...'
                    : tourData
                    ? `Update ${title}`
                    : `Create ${title}`}
            </button>

            {/* Display errors */}
            {(createError || editError) && (
                <p style={{ color: "red" }}>{createError || editError}</p>
            )}
            {/* Display success */}
            {((!tourData && createSuccess) || (tourData && editSuccess)) && (
                <p style={{ color: "green" }}>
                    {tourData ? "Tour updated successfully!" : "Tour created successfully!"}
                </p>
            )}
        </form>
    );
}

export default CreateTour;
