import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../layout/Navbar";
import '../../css-files/auth/AuthPage.css';

function VerifyEmailPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const [message, setMessage] = useState("Verifying your email address...");
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        if (!token) {
            setMessage("This verification link is missing a token.");
            setIsSuccess(false);
            return;
        }

        const verificationToken = token;

        let active = true;

        async function verifyEmail() {
            try {
                const response = await fetch(`http://127.0.0.1:8000/verify-email?token=${encodeURIComponent(verificationToken)}`);
                const data = await response.json();

                if (!active) {
                    return;
                }

                if (response.ok) {
                    setMessage(data.message || "Email verified successfully.");
                    setIsSuccess(true);
                } else {
                    setMessage(data.detail || "Verification failed.");
                    setIsSuccess(false);
                }
            } catch {
                if (!active) {
                    return;
                }
                setMessage("Unable to verify your email right now.");
                setIsSuccess(false);
            }
        }

        verifyEmail();

        return () => {
            active = false;
        };
    }, [token]);

    return (
        <>
            <Navbar />
            <div className="auth-page">
                <div className="floating-shapes">
                    <div className="shape shape-1"></div>
                    <div className="shape shape-2"></div>
                    <div className="shape shape-3"></div>
                    <div className="shape shape-4"></div>
                    <div className="shape shape-5"></div>
                    <div className="shape shape-6"></div>
                </div>
                <div className="gradient-orb orb-1"></div>
                <div className="gradient-orb orb-2"></div>
                <div className="gradient-orb orb-3"></div>

                <div className="auth-container">
                    <div className="auth-card">
                        <div className="auth-header">
                            <h1>Email Verification</h1>
                            <p className="auth-subtitle">Confirm your account so you can sign in</p>
                        </div>

                        <div className={`error-message ${isSuccess ? 'success-message' : ''}`}>
                            {message}
                        </div>

                        <button className="submit-button" type="button" onClick={() => navigate("/login")}>
                            Go to Login
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default VerifyEmailPage;
