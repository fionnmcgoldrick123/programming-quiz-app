import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../utils/AuthContext";
import Navbar from "../layout/Navbar";
import '../../css-files/auth/AuthPage.css';

function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    const loginState = location.state as { registered?: boolean; verificationSent?: boolean; verificationLink?: string; verificationNote?: string } | null;
    const registeredSuccessfully = !!loginState?.registered;

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState(registeredSuccessfully ? "Account created! Please verify your email before logging in." : "");
    const [isSuccess, setIsSuccess] = useState(registeredSuccessfully);
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [lastFailedEmail, setLastFailedEmail] = useState("");

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setMessage("");
        setIsSuccess(false);

        if (!email || !password) {
            setMessage("Please fill in all fields");
            return;
        }

        setIsLoading(true);

        const result = await login(email, password);

        if (result.success) {
            navigate("/");
        } else {
            setMessage(result.error || "Login failed");
            setLastFailedEmail(email);
        }

        setIsLoading(false);
    }

    async function handleResendVerification() {
        if (!lastFailedEmail) return;

        setIsResending(true);
        try {
            const response = await fetch('http://127.0.0.1:8000/resend-verification', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: lastFailedEmail })
            });

            if (response.ok) {
                await response.json();
                setMessage(`Verification email sent to ${lastFailedEmail}. Please check your inbox.`);
                setIsSuccess(true);
            } else {
                const errorData = await response.json();
                setMessage(errorData.detail || 'Failed to resend verification email');
                setIsSuccess(false);
            }
        } catch (error) {
            console.error('Error resending verification email:', error);
            setMessage('Network error. Please try again.');
            setIsSuccess(false);
        } finally {
            setIsResending(false);
        }
    }

    const isVerificationError = message.toLowerCase().includes('verify');
    const showResendButton = isVerificationError && lastFailedEmail;

    return (
        <>
            <Navbar />
            <div className="auth-page">
                {/* Floating decorative shapes */}
                <div className="floating-shapes">
                    <div className="shape shape-1"></div>
                    <div className="shape shape-2"></div>
                    <div className="shape shape-3"></div>
                    <div className="shape shape-4"></div>
                    <div className="shape shape-5"></div>
                    <div className="shape shape-6"></div>
                </div>

                {/* Animated gradient orbs */}
                <div className="gradient-orb orb-1"></div>
                <div className="gradient-orb orb-2"></div>
                <div className="gradient-orb orb-3"></div>

                <div className="auth-container">
                    <div className="auth-card">
                        <div className="auth-header">
                            <h1>Welcome Back</h1>
                            <p className="auth-subtitle">Sign in to continue your coding journey</p>
                        </div>

                        {message && (
                            <div className={`error-message ${isSuccess ? 'success-message' : ''}`}>
                                <div>{message}</div>
                                {loginState?.verificationNote && (
                                    <div style={{ marginTop: "8px" }}>{loginState.verificationNote}</div>
                                )}
                                {loginState?.verificationLink && (
                                    <div style={{ marginTop: "10px" }}>
                                        <button
                                            type="button"
                                            className="switch-link"
                                            onClick={() => window.open(loginState.verificationLink, "_blank", "noopener,noreferrer")}
                                            style={{ background: "none", border: "none", padding: 0 }}
                                        >
                                            Open the verification link
                                        </button>
                                    </div>
                                )}
                                {showResendButton && (
                                    <div style={{ marginTop: "10px" }}>
                                        <button
                                            type="button"
                                            className="switch-link"
                                            onClick={handleResendVerification}
                                            disabled={isResending}
                                            style={{ background: "none", border: "none", padding: 0 }}
                                        >
                                            {isResending ? 'Sending...' : 'Resend verification email'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="auth-form">
                            <div className="input-group">
                                <label className="label">Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your.email@example.com"
                                    disabled={isLoading || isResending}
                                />
                            </div>

                            <div className="input-group">
                                <label className="label">Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    disabled={isLoading || isResending}
                                />
                            </div>

                            <button type="submit" className="submit-button" disabled={isLoading || isResending}>
                                {isLoading ? 'Signing in...' : 'Sign In'}
                            </button>
                        </form>

                        <div className="auth-switch">
                            <p>
                                Don't have an account?
                                <span className="switch-link" onClick={() => navigate("/register")}>
                                    {' '}Create one here
                                </span>
                            </p>
                        </div>

                        <div className="code-decoration code-left">
                            <pre>{`function learn() {\n  return success;\n}`}</pre>
                        </div>
                        <div className="code-decoration code-right">
                            <pre>{`const skills =\n  knowledge++;`}</pre>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default LoginPage;
