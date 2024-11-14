'use client'

import React, { useState } from "react";
import { MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md";
import style from './auth.module.css';
import useAuth from "@/hook/useAuth";

function LoginPage() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const {login, error} = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            login(email, password);
        } catch (error) {
            console.error("Error during sign-in:", error);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className={style.adminlogin}>
            <div className={style.loginblur}>
                <div className={style.logincontainer}>
                    <div className={style.logincard}>
                        <h2 className={style.logintitle}>Admin Login</h2>
                        <form onSubmit={handleSubmit}>
                            <div className={style.formgroup}>
                                <label htmlFor="email">Email</label>
                                <input
                                    className={style.authinput}
                                    type="email"
                                    id="admin-email"
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
                            {error && <p className={style.errormessage}>{error}</p>}
                            <button type="submit" className={style.loginbutton}>Login</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default LoginPage;