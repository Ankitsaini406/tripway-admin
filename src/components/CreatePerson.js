import React, { useState } from "react";
import useAuth from "@/hook/useAuth";
import useAuthorizedRequest from "@/hook/useAuthorizedRequest";
import { MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md";
import style from "../styles/auth.module.css";
import useAgentData from "@/hook/useAgentData";

function CreatePerson({ title, url }) {
    const [formData, setFormData] = useState({
        name: "",
        phoneNumber: "",
        email: "",
        password: "",
        verifyPassword: "",
        agentCode: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showVerifyPassword, setShowVerifyPassword] = useState(false);
    // const [error, setError] = useState("");
    const { token } = useAuth();
    const { makeRequest } = useAuthorizedRequest();
    const { addData, loading, error} = useAgentData(token);
    // const { addData, loading } = useAddData(token, makeRequest);

    // Helper function to generate a 6-character alphanumeric code
    const generateAgentCode = () => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let code = "";
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return `Trip-${code}`;
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const { name, phoneNumber, email, password, verifyPassword } = formData;

        if (!name || !phoneNumber || !email || !password) {
            setError("Please fill in all fields.");
            return;
        }
        if (password !== verifyPassword) {
            setError("Passwords do not match.");
            return;
        }

        // Generate a unique agent code
        const agentCode = generateAgentCode();

        try {
            await addData({ ...formData, agentCode }); // Include the agent code in the data
            setFormData({ name: "", phoneNumber: "", email: "", password: "", verifyPassword: "" });
            alert(`${title} created successfully with code: ${agentCode}`);
        } catch (err) {
            setError("Failed to create agent. Please try again.");
            console.error(err);
        }
    };

    const toggleVisibility = (setter) => () => setter((prev) => !prev);

    return (
        <div>
            <form onSubmit={handleSubmit}>
                {["name", "phoneNumber", "email"].map((field) => (
                    <div className={style.formgroup} key={field}>
                        <label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                        <input
                            className={style.authinput}
                            type={field === "email" ? "email" : "text"}
                            id={field}
                            value={formData[field]}
                            onChange={handleInputChange}
                            placeholder={`Enter your ${field}`}
                            required
                        />
                    </div>
                ))}
                {["password", "verifyPassword"].map((field, index) => (
                    <div className={style.formgroup} key={field}>
                        <label htmlFor={field}>{index === 0 ? "Password" : "Verify Password"}</label>
                        <div className={style.inputicon}>
                            <input
                                className={style.authinput}
                                type={(index === 0 ? showPassword : showVerifyPassword) ? "text" : "password"}
                                id={field}
                                value={formData[field]}
                                onChange={handleInputChange}
                                placeholder={`Enter your ${index === 0 ? "" : "verify "}password`}
                                required
                            />
                            <button
                                type="button"
                                className={style.passwordtogglebtn}
                                onClick={toggleVisibility(index === 0 ? setShowPassword : setShowVerifyPassword)}
                            >
                                {index === 0 ? (showPassword ? <MdOutlineVisibilityOff /> : <MdOutlineVisibility />) : (showVerifyPassword ? <MdOutlineVisibilityOff /> : <MdOutlineVisibility />)}
                            </button>
                        </div>
                    </div>
                ))}
                {error && <p className={style.errormessage}>{error}</p>}
                <button type="submit" className={style.loginbutton}>
                    {loading ? "Adding..." : `Add ${title}`}
                </button>
            </form>
        </div>
    );
}

export default CreatePerson;
