import React, { useState, useEffect } from "react";
import useAuth from "@/hook/useAuth";
import { MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md";
import style from "../styles/auth.module.css";
import modalStyle from "../styles/modal.module.css";
import useAgentData from "@/hook/useAgentData";

function EditPersonData({ person, onCancel, url }) {
    const { token } = useAuth();
    const { editData, loading, error } = useAgentData(token);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phoneNumber: "",
        password: "",
        verifyPassword: ""
    });

    const [oldData, setOldData] = useState({
        name: "",
        email: "",
        phoneNumber: "",
        password: "",
        verifyPassword: "",
    });

    useEffect(() => {
        if (person) {
            const initialData = {
                name: person.name,
                email: person.email,
                phoneNumber: person.phoneNumber,
                password: person.password || "",
                verifyPassword: person.verifyPassword || "",
            };

            setFormData(initialData);
            setOldData(initialData);
        }
    }, [person]);

    const handleChange = ({ target: { name, value } }) => {
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedData = { ...formData };
        const dataToUpdate = {};

        Object.keys(updatedData).forEach((key) => {
            if (updatedData[key] !== oldData[key]) {
                dataToUpdate[key] = updatedData[key];
            }
        });

        if (!updatedData.password) {
            delete dataToUpdate.password;
            delete dataToUpdate.verifyPassword;
        }

        try {
            await editData(`${url}`, person.uid, dataToUpdate);
            onCancel();
        } catch (err) {
            console.error(`Error editing ${url}:`, err);
        }
    };

    const toggleVisibility = (setter) => () => setter((prev) => !prev);

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
            {["password", "verifyPassword"].map((field, index) => (
                <div className={style.formgroup} key={field}>
                    <label>{index === 0 ? "Password" : "Confirm Password"}</label>
                    <div className={style.inputicon}>
                        <input
                            className={style.authinput}
                            type={(index === 0 ? showPassword : showConfirmPassword) ? "text" : "password"}
                            name={field}
                            value={formData[field]}
                            onChange={handleChange}
                            placeholder={index === 0 ? "Enter new password" : "Confirm new password"}
                        />
                        <button
                            type="button"
                            className={style.passwordtogglebtn}
                            onClick={toggleVisibility(index === 0 ? setShowPassword : setShowConfirmPassword)}
                        >
                            {index === 0
                                ? (showPassword ? <MdOutlineVisibilityOff /> : <MdOutlineVisibility />)
                                : (showConfirmPassword ? <MdOutlineVisibilityOff /> : <MdOutlineVisibility />)}
                        </button>
                    </div>
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
