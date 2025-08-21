import React, { useState } from "react";
import './style.css';
import { useNavigate } from "react-router-dom";
import { useSignIn } from './hooks/useSignIn';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
function Signin() {
    const { phone_number, setPhoneNumber, password, setPassword, error, loading, handleLogin } = useSignIn();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const handleSubmit = async (event) => {
        event.preventDefault();
        const success = await handleLogin();
        if (success) {
            navigate("/dashboard");
        }
    };
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    return (
        <div className="signin-container">
            <p className="welcome">Welcome Back!</p>
            <div className="forms">
                <form onSubmit={handleSubmit}>
                    <h2>Sign In</h2>
                    <label htmlFor="phone_number">Phone Number :</label><br />
                    <input
                        type="text"
                        id="phone_number"
                        placeholder="Enter your phone number"
                        required
                        value={phone_number}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                    /><br /><br />
                    <div className="password-input">
                        <label htmlFor="password">Password:</label><br />
                        <div className="input-wrapper">
                        <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                placeholder="Enter your password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        <span className="password-toggle" data-testid="password-toggle" onClick={togglePasswordVisibility} role="img"
  aria-label="Toggle password visibility" >
                            {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                        </span>
                        </div>
                    </div>
                      {loading && <p>Loading...</p>}
                      {error && <p style={{ color: "red" }}>Error: {error}</p>}
                    <button type="submit" className="button2">Login</button>
                </form>
            </div>
        </div>
    );
}
export default Signin;




















