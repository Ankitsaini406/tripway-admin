import React, { useState } from "react";
import useAuth from "@/hook/useAuth";
import useAuthorizedRequest from "@/hook/useAuthorizedRequest";
import { useAddData } from "@/hook/useAddData";
import { MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md";
import style from '../styles/auth.module.css';

function CreatePerson({ title, url }) {

    const [name, setName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [verifyPassword, setVerifyPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showVerifyPassword, setShowVerifyPassword] = useState(false);
    const [error, setError] = useState("");
    const { token } = useAuth();
    const { makeRequest } = useAuthorizedRequest();
    const { addData, loading } = useAddData(token, makeRequest);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!email || !password || !name || !phoneNumber) {
            setError("Please fill in all fields.");
            return;
        }

        if (password !== verifyPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {

            await addData({ name, email, phoneNumber, password, verifyPassword, }, `${url}`);
            setName("");
            setPhoneNumber("");
            setEmail("");
            setPassword("");
            setVerifyPassword("");
            setError("");
            alert(`${title} created successfully!`);

        } catch (err) {
            setError("Failed to sign up. Please try again.");
            console.error(err);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleVerifyPasswordVisibility = () => {
        setShowVerifyPassword(!showVerifyPassword);
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className={style.formgroup}>
                    <label htmlFor="name">Name</label>
                    <input
                        className={style.authinput}
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your Name"
                        required
                    />
                </div>
                <div className={style.formgroup}>
                    <label htmlFor="phonenumber">Phone Number</label>
                    <input
                        className={style.authinput}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]+"
                        id="phoneNumber"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="Enter your Phone Number"
                        required
                    />
                </div>
                <div className={style.formgroup}>
                    <label htmlFor="email">Email</label>
                    <input
                        className={style.authinput}
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                    />
                </div>
                <div className={style.formgroup}>
                    <label htmlFor="password">Password</label>
                    <div className={style.inputicon}>
                        <input
                            className={style.authinput}
                            type={showPassword ? "text" : "password"}
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                        />
                        <button
                            type="button"
                            className={style.passwordtogglebtn}
                            onClick={togglePasswordVisibility}
                        >
                            {showPassword ? (
                                <MdOutlineVisibilityOff />
                            ) : (
                                <MdOutlineVisibility />
                            )}
                        </button>
                    </div>
                </div>
                <div className={style.formgroup}>
                    <label htmlFor="verifyPassword">Verify Password</label>
                    <div className={style.inputicon}>
                        <input
                            className={style.authinput}
                            type={showVerifyPassword ? "text" : "password"}
                            id="verify-password"
                            value={verifyPassword}
                            onChange={(e) => setVerifyPassword(e.target.value)}
                            placeholder="Enter your password again"
                            required
                        />
                        <button
                            type="button"
                            className={style.passwordtogglebtn}
                            onClick={toggleVerifyPasswordVisibility}
                        >
                            {showVerifyPassword ? (
                                <MdOutlineVisibilityOff />
                            ) : (
                                <MdOutlineVisibility />
                            )}
                        </button>
                    </div>
                </div>
                {error && <p className={style.errormessage}>{error}</p>}
                <button type="submit" className={style.loginbutton}> {loading ? `Adding...` : `Add ${title}`}</button>
            </form>
        </div>
    )
}

export default CreatePerson;