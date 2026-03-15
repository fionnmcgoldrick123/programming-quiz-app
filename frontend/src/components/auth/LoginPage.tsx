import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../utils/AuthContext";
import Navbar from "../layout/Navbar";
import '../../css-files/auth/AuthPage.css';

function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    const registeredSuccessfully = !!(location.state as { registered?: boolean })?.registered;

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState(registeredSuccessfully ? "Account created! Please sign in." : "");
    const [isSuccess, setIsSuccess] = useState(registeredSuccessfully);
    const [isLoading, setIsLoading] = useState(false);

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
        }

        setIsLoading(false);
    }

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
                                {message}
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
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="input-group">
                                <label className="label">Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    disabled={isLoading}
                                />
                            </div>

                            <button type="submit" className="submit-button" disabled={isLoading}>
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
