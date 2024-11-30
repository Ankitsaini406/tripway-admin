import React, { useState, useEffect } from "react";
import style from '../styles/auth.module.css';
import useAuth from "@/hook/useAuth";
import Image from "next/image";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import useTourData from "@/hook/useTourData";

function EditTour({ title, url, tourData, onSuccess }) {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        category: '',
        description: '',
        imageUrl: '',
        startDate: null,
    });
    const [imgPreview, setImgPreview] = useState('');
    const { token } = useAuth();
    const { editTour, loading, error, success } = useTourData(token);

    // Initialize form with existing tour data
    useEffect(() => {
        if (tourData) {
            setFormData({
                name: tourData.name || '',
                price: tourData.price || '',
                category: tourData.category || '',
                description: tourData.description || '',
                imageUrl: tourData.imageUrl || '',
                startDate: tourData.startDate || null,
            });
            if (tourData.imageUrl) {
                setImgPreview(`https://tripwayholidays.in//tour-image/${tourData.imageUrl}`);
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
            setFormData((prevData) => ({ ...prevData, imageUrl: file.name }));
            setImgPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.imageUrl) return alert("Please upload an image.");

        await editTour(url, tourData.id, formData);

        if (success) {
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
            imageUrl: '',
            startDate: null,
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
            <DatePicker
                selected={formData.startDate}
                onChange={(date) => setFormData((prevData) => ({ ...prevData, startDate: date }))}
                className={`${style.authinput} ${style.datepicker}`}
                placeholderText="Start Date"
                required
            />
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
                disabled={loading}
                className={style.loginbutton}
            >
                {loading ? 'Processing...' : `Update ${title}`}
            </button>

            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>Tour updated successfully!</p>}
        </form>
    );
}

export default EditTour;
