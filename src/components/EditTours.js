import React, { useState, useEffect } from "react";
import style from '../styles/auth.module.css';
import useAuth from "@/hook/useAuth";
import Image from "next/image";
import DatePicker from "react-datepicker";
import { FaPlus, FaTimes } from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";
import useTourData from "@/hook/useTourData";

function EditTour({ title, url, tourData, onSuccess }) {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        category: '',
        pickuppoints: '',
        description: '',
        imageUrl: '',
        startDate: null,
        exclusions: [],
        inclusions: [],
        itinerary: [{ title: "", description: "", activities: [""] }],
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
                pickuppoints: tourData.pickuppoints || '',
                description: tourData.description || '',
                imageUrl: tourData.imageUrl || '',
                startDate: tourData.startDate || null,
                exclusions: tourData.exclusions || [],
                inclusions: tourData.inclusions || [],
                itinerary: tourData.itinerary || [{ title: "", description: "", activities: [""] }],
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

    const handleDynamicFieldChange = (field, index, value) => {
        const updatedField = [...formData[field]];
        updatedField[index] = value;
        setFormData((prevData) => ({ ...prevData, [field]: updatedField }));
    };

    const addDynamicField = (field) => {
        if (formData[field].length < 10) {
            setFormData((prevData) => ({ ...prevData, [field]: [...prevData[field], ""] }));
        }
    };

    const removeDynamicField = (field, index) => {
        setFormData((prevData) => ({
            ...prevData,
            [field]: prevData[field].filter((_, i) => i !== index),
        }));
    };

    const handleItineraryChange = (index, key, value) => {
        const updatedItinerary = formData.itinerary.map((item, idx) =>
            idx === index ? { ...item, [key]: value } : item
        );
        setFormData({ ...formData, itinerary: updatedItinerary });
    };

    // Add a new itinerary entry
    const addItinerary = () => {
        setFormData({
            ...formData,
            itinerary: [...formData.itinerary, { title: "", description: "", activities: [""] }],
        });
    };

    // Remove an itinerary entry
    const removeItinerary = (index) => {
        const updatedItinerary = formData.itinerary.filter((_, idx) => idx !== index);
        setFormData({ ...formData, itinerary: updatedItinerary });
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
            pickuppoints: '',
            description: '',
            imageUrl: '',
            startDate: null,
            exclusions: [],
            inclusions: [],
            itinerary: [{ title: "", description: "", activities: [""] }],
        });
        setImgPreview('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                {['name', 'price', 'category', 'pickuppoints'].map((field) => (
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
                    <label>Itinerary</label>
                    {formData.itinerary.map((itineraryItem, index) => (
                        <div
                            key={index}
                            style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <label>
                                    Day:
                                    <input
                                        type="text"
                                        value={itineraryItem.title}
                                        onChange={(e) => handleItineraryChange(index, "title", e.target.value)}
                                    />
                                </label>
                                <label>
                                    Description:
                                    <textarea
                                        value={itineraryItem.description}
                                        onChange={(e) => handleItineraryChange(index, "description", e.target.value)}
                                    />
                                </label>
                                <label>
                                    Activities (comma-separated):
                                    <input
                                        type="text"
                                        value={itineraryItem.activities.join(",")}
                                        onChange={(e) =>
                                            handleItineraryChange(index, "activities", e.target.value.split(","))
                                        }
                                    />
                                </label>
                            </div>
                            <button type="button" onClick={() => removeItinerary(index)}>
                                Remove Itinerary
                            </button>
                        </div>
                    ))}
                </div>
                <button type="button" onClick={addItinerary}>
                    Add New Itinerary
                </button>
            </div>
            {["exclusions", "inclusions"].map((field) => (
                <div key={field} style={{ display: 'flex', flexWrap: 'wrap', margin: '10px 0 10px 0' }} className={style.formGroup}>
                    <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                    {formData[field].map((item, index) => (
                        <div key={index} className={style.dynamicField}>
                            <input
                                type="text"
                                value={item}
                                onChange={(e) => handleDynamicFieldChange(field, index, e.target.value)}
                                className={style.authInput}
                            />
                            <button type="button" onClick={() => removeDynamicField(field, index)}>
                                <FaTimes />
                            </button>
                        </div>
                    ))}
                    <button type="button" onClick={() => addDynamicField(field)}>
                        <FaPlus /> Add {field.slice(0, -1)}
                    </button>
                </div>
            ))}
            <div className={style.formgroup}>
                <label>Start Date</label>
                <DatePicker
                    selected={formData.startDate}
                    onChange={(date) => setFormData((prevData) => ({ ...prevData, startDate: date }))}
                    className={`${style.authinput} ${style.datepicker}`}
                    placeholderText="Start Date"
                    required
                />
            </div>
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
            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>Tour updated successfully!</p>}
            <button
                type="submit"
                disabled={loading}
                className={style.loginbutton}
            >
                {loading ? 'Processing...' : `Update ${title}`}
            </button>
        </form>
    );
}

export default EditTour;
