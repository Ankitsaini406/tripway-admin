import React, { useState } from "react";
import useAuth from "@/hook/useAuth";
import Image from "next/image";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import useTourData from "@/hook/useTourData";
import { FaPlus, FaTimes } from "react-icons/fa";
import style from "../styles/auth.module.css";

function CreateTour({ title, url, onSuccess }) {
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        category: "",
        description: "",
        imageUrl: "",
        startDate: null,
        exclusions: [],
        inclusions: [],
        intinerary: [{ title: "", description: "", activities: [""] }],
    });
    const [imgPreview, setImgPreview] = useState("");
    const { token } = useAuth();
    const { createTour, success, error, loading } = useTourData(token);

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
        const updatedItinerary = formData.intinerary.map((item, idx) =>
            idx === index ? { ...item, [key]: value } : item
        );
        setFormData({ ...formData, intinerary: updatedItinerary });
    };

    // Add a new itinerary entry
    const addItinerary = () => {
        setFormData({
            ...formData,
            intinerary: [...formData.intinerary, { title: "", description: "", activities: [""] }],
        });
    };

    // Remove an itinerary entry
    const removeItinerary = (index) => {
        const updatedItinerary = formData.intinerary.filter((_, idx) => idx !== index);
        setFormData({ ...formData, intinerary: updatedItinerary });
    };

    const validateItinerary = (itinerary) => {
        return itinerary.map((item) => ({
            title: item.title || "Untitled", // Default if title is missing
            description: item.description || "No description provided",
            activities: Array.isArray(item.activities) ? item.activities.filter(Boolean) : [],
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.imageUrl) return alert("Please upload an image.");
        if (formData.intinerary.some(item => !item.title || !item.description)) {
            return alert("Please fill out all itinerary fields.");
        }

        const formattedDate = formData.startDate
            ? new Intl.DateTimeFormat("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }).format(formData.startDate).replace(/\s/g, "-")
            : null;

        const sanitizedItinerary = validateItinerary(formData.intinerary)

        const dataToSend = {
            ...formData,
            startDate: formattedDate,
            itinerary: formData.intinerary || [], // Ensure itinerary is at least an empty array
        };

        await createTour(url, dataToSend);
        if (success) {
            resetForm();
            if (success) onSuccess();
        }
    };

    const resetForm = () => {
        setFormData({
            name: "",
            price: "",
            category: "",
            description: "",
            imageUrl: "",
            startDate: null,
            exclusions: [""],
            inclusions: [""],
            itinerary: [{ title: "", description: "", activities: [""] }],
        });
        setImgPreview("");
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                {["name", "price", "category"].map((field) => (
                    <div key={field} className={style.formgroup}>
                        <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                        <input
                            type={field === "price" ? "number" : "text"}
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
                    {formData.intinerary.map((itineraryItem, index) => (
                        <div key={index} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
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
                {imgPreview && (
                    <Image src={imgPreview} alt="Preview" width={200} height={200} />
                )}
            </div>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>Tour created successfully!</p>}
            <button type="submit" disabled={loading} className={style.loginbutton}>
                {loading ? "Processing..." : `Create ${title}`}
            </button>
        </form>
    );
}

export default CreateTour;
