import React, { useState, useEffect } from "react";
import useAuth from "@/hook/useAuth";
import useAuthorizedRequest from "@/hook/useAuthorizedRequest";
import useEditData from "@/hook/useEditData";
import style from '../styles/auth.module.css';


function EditPersonData({ person, onCancel, url }) {

    const { token } = useAuth();
    const { makeRequest } = useAuthorizedRequest();
    const { editData, loading, error } = useEditData(`${url}`, person.uid, makeRequest, token);
    const [formData, setFormData] = useState({
        name: person.name,
        email: person.email,
        phoneNumber: person.phoneNumber,
    });


    useEffect(() => {
        setFormData({
            name: person.name,
            email: person.email,
            phoneNumber: person.phoneNumber,
        });
    }, [person]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await editData(formData, `update-${url}`); // Call the editAgent function from the hook
            onCancel(); // Close the modal or return to previous screen
        } catch (err) {
            console.error(`Error editing ${url}:`, err.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className={style.formgroup}>
                <label>Name</label>
                <input
                    className={style.authinput}
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className={style.formgroup}>
                <label>Email</label>
                <input
                    className={style.authinput}
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className={style.formgroup}>
                <label>Phone Number</label>
                <input
                    className={style.authinput}
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                />
            </div>
            {loading && <p>Saving changes...</p>}
            {error && <p className={style.error}>Error: {error}</p>}
            <div className={style.savecancle}>
                <button className={`${style.savecanclebtn} ${style.savebtn}`} type="submit">Save</button>
                <button className={`${style.savecanclebtn} ${style.canclebtn}`} type="button" onClick={onCancel}>
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default EditPersonData;