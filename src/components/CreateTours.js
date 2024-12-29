import React, { useReducer, useState } from "react";
import useAuth from "@/hook/useAuth";
import Image from "next/image";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import useTourData from "@/hook/useTourData";
import { FaPlus, FaTimes } from "react-icons/fa";
import style from "../styles/auth.module.css";

function CreateTour({ title, url, onSuccess }) {
    const initialFormState = {
        name: "",
        slug: "",
        price: "",
        category: "",
        pickuppoints: "",
        description: "",
        image: null,
        startDate: null,
        exclusions: [""],
        inclusions: [""],
        itinerary: [{ title: "", description: "", activities: [""] }],
    };

    const formReducer = (state, action) => {
        switch (action.type) {
            case "SET_FIELD":
                return { ...state, [action.field]: action.value };
            case "SET_DYNAMIC_FIELD":
                const updatedField = [...state[action.field]];
                updatedField[action.index] = action.value;
                return { ...state, [action.field]: updatedField };
            case "ADD_DYNAMIC_FIELD":
                return {
                    ...state,
                    [action.field]: [...state[action.field], action.value],
                };
            case "REMOVE_DYNAMIC_FIELD":
                return {
                    ...state,
                    [action.field]: state[action.field].filter((_, i) => i !== action.index),
                };
            case "SET_ITINERARY_FIELD":
                const updatedItinerary = state.itinerary.map((item, idx) =>
                    idx === action.index ? { ...item, [action.key]: action.value } : item
                );
                return { ...state, itinerary: updatedItinerary };
            case "ADD_ITINERARY":
                return {
                    ...state,
                    itinerary: [...state.itinerary, { title: "", description: "", activities: [""] }],
                };
            case "REMOVE_ITINERARY":
                return {
                    ...state,
                    itinerary: state.itinerary.filter((_, idx) => idx !== action.index),
                };
            case "RESET_FORM":
                return initialFormState;
            default:
                return state;
        }
    };

    const generateSlug = (name) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .trim()
            .replace(/\s+/g, "-");
    };

    const [formData, dispatch] = useReducer(formReducer, initialFormState);
    const [imgPreview, setImgPreview] = useState("");
    const { token } = useAuth();
    const { createTour, success, error, loading } = useTourData(token);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            dispatch({ type: "SET_FIELD", field: "image", value: file });
            setImgPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!formData.image) return alert("Please upload an image.");
        if (formData.itinerary.some(item => !item.title || !item.description)) {
            return alert("Please fill out all itinerary fields.");
        }
    
        const formattedDate = formData.startDate
            ? new Intl.DateTimeFormat("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }).format(formData.startDate).replace(/\s/g, "-")
            : null;
    
        const validatedItinerary = formData.itinerary.map((item) => ({
            title: item.title || "Untitled",
            description: item.description || "No description provided",
            activities: Array.isArray(item.activities) ? item.activities.filter(Boolean) : [],
        }));
    
        const metadata = {
            ...formData,
            startDate: formattedDate,
            itinerary: validatedItinerary,
            slug: generateSlug(formData.name),
        };
    
        console.log("Metadata:", metadata);
        console.log("File:", formData.image);
    
        // Pass metadata and file separately
        await createTour(url, metadata, formData.image);
    
        if (success) {
            dispatch({ type: "RESET_FORM" });
            setImgPreview("");
            onSuccess();
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                {["name", "price", "category", "pickuppoints"].map((field) => (
                    <div key={field} className={style.formgroup}>
                        <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                        <input
                            type={field === "price" ? "number" : "text"}
                            name={field}
                            value={formData[field]}
                            onChange={(e) =>
                                dispatch({ type: "SET_FIELD", field, value: e.target.value })
                            }
                            required
                            className={style.authinput}
                        />
                    </div>
                ))}

                {/* Exclusions and Inclusions */}
                {["exclusions", "inclusions"].map((field) => (
                    <div key={field} className={style.formgroup}>
                        <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                        {formData[field].map((item, index) => (
                            <div key={index} className={style.dynamicField}>
                                <input
                                    type="text"
                                    value={item}
                                    onChange={(e) =>
                                        dispatch({
                                            type: "SET_DYNAMIC_FIELD",
                                            field,
                                            index,
                                            value: e.target.value,
                                        })
                                    }
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        dispatch({ type: "REMOVE_DYNAMIC_FIELD", field, index })
                                    }
                                >
                                    <FaTimes />
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() =>
                                dispatch({ type: "ADD_DYNAMIC_FIELD", field, value: "" })
                            }
                        >
                            <FaPlus /> Add {field.slice(0, -1)}
                        </button>
                    </div>
                ))}

                {/* Itinerary Section */}
                <div className={style.formgroup}>
                    <label>Itinerary</label>
                    {formData.itinerary.map((item, index) => (
                        <div key={index} className={style.itineraryItem}>
                            <input
                                type="text"
                                placeholder="Title"
                                value={item.title}
                                onChange={(e) =>
                                    dispatch({
                                        type: "SET_ITINERARY_FIELD",
                                        index,
                                        key: "title",
                                        value: e.target.value,
                                    })
                                }
                            />
                            <textarea
                                placeholder="Description"
                                value={item.description}
                                onChange={(e) =>
                                    dispatch({
                                        type: "SET_ITINERARY_FIELD",
                                        index,
                                        key: "description",
                                        value: e.target.value,
                                    })
                                }
                            />
                            <input
                                type="text"
                                placeholder="Activities (comma-separated)"
                                value={item.activities.join(",")}
                                onChange={(e) =>
                                    dispatch({
                                        type: "SET_ITINERARY_FIELD",
                                        index,
                                        key: "activities",
                                        value: e.target.value.split(","),
                                    })
                                }
                            />
                            <button
                                type="button"
                                onClick={() => dispatch({ type: "REMOVE_ITINERARY", index })}
                            >
                                <FaTimes /> Remove
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => dispatch({ type: "ADD_ITINERARY" })}
                    >
                        <FaPlus /> Add Itinerary
                    </button>
                </div>

                {/* Other Fields */}
                <div className={style.formgroup}>
                    <label>Start Date</label>
                    <DatePicker
                        selected={formData.startDate}
                        onChange={(date) =>
                            dispatch({ type: "SET_FIELD", field: "startDate", value: date })
                        }
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
                        onChange={(e) =>
                            dispatch({ type: "SET_FIELD", field: "description", value: e.target.value })
                        }
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
                {success && <p style={{ color: "green" }}>Tour created successfully!</p>}
                <button type="submit" disabled={loading} className={style.loginbutton}>
                    {loading ? "Processing..." : `Create ${title}`}
                </button>
            </div>
        </form>
    );
}

export default CreateTour;
