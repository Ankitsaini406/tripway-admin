import React, { useState, useEffect } from "react";
import useAuth from "@/hook/useAuth";
import useAuthorizedRequest from "@/hook/useAuthorizedRequest";
import useEditData from "@/hook/useEditData";
import style from "../styles/auth.module.css";
import modalStyle from "../styles/modal.module.css";

function EditPersonData({ person, onCancel, url }) {
    const { token } = useAuth();
    const { makeRequest } = useAuthorizedRequest();
    const { editData, loading, error } = useEditData(`${url}`, person.uid, makeRequest, token);
    const [formData, setFormData] = useState({ name: "", email: "", phoneNumber: "" });

    useEffect(() => {
        if (person) {
            setFormData({ name: person.name, email: person.email, phoneNumber: person.phoneNumber });
        }
    }, [person]);

    const handleChange = ({ target: { name, value } }) => {
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await editData(formData);
            onCancel();
        } catch (err) {
            console.error(`Error editing ${url}:`, err);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {["name", "email", "phoneNumber"].map((field) => (
                <div className={style.formgroup} key={field}>
                    <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                    <input
                        className={style.authinput}
                        type={field === "email" ? "email" : "text"}
                        name={field}
                        value={formData[field]}
                        onChange={handleChange}
                        required
                    />
                </div>
            ))}
            {loading && <p>Saving changes...</p>}
            {error && <p className={style.error}>Error: {error}</p>}
            <div className={modalStyle.savecancle}>
                <button className={`${modalStyle.savecanclebtn} ${modalStyle.savebtn}`} type="submit">
                    Save
                </button>
                <button
                    className={`${modalStyle.savecanclebtn} ${modalStyle.canclebtn}`}
                    type="button"
                    onClick={onCancel}
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}

export default EditPersonData;
