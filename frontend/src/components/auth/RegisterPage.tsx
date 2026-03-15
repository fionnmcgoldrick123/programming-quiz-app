import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../layout/Navbar";
import '../../css-files/auth/AuthPage.css';

interface PasswordReq {
    label: string;
    test: (p: string) => boolean;
}

const passwordRequirements: PasswordReq[] = [
    { label: 'At least 6 characters',   test: (p) => p.length >= 6 },
    { label: 'One uppercase letter',     test: (p) => /[A-Z]/.test(p) },
    { label: 'One lowercase letter',     test: (p) => /[a-z]/.test(p) },
    { label: 'One special character',    test: (p) => /[^a-zA-Z0-9\s]/.test(p) },
];

const STRENGTH_LABELS = ['', 'Weak', 'Fair', 'Good', 'Strong'];
const STRENGTH_COLORS = ['', '#ff4444', '#ff9500', '#ffd700', '#4caf50'];

function PasswordStrengthIndicator({ password }: { password: string }) {
    const metCount = passwordRequirements.filter(r => r.test(password)).length;

    return (
        <div className="password-strength">
            <div className="strength-bar-row">
                <div className="strength-bars">
                    {[1, 2, 3, 4].map(i => (
                        <div
                            key={i}
                            className="strength-bar-segment"
                            style={{ background: i <= metCount ? STRENGTH_COLORS[metCount] : '#333' }}
                        />
                    ))}
                </div>
                {password && (
                    <span className="strength-label" style={{ color: STRENGTH_COLORS[metCount] }}>
                        {STRENGTH_LABELS[metCount]}
                    </span>
                )}
            </div>
            <ul className="requirements-list">
                {passwordRequirements.map((req, i) => (
                    <li key={i} className={`requirement ${req.test(password) ? 'met' : 'unmet'}`}>
                        <span className="req-icon">{req.test(password) ? '✓' : '○'}</span>
                        {req.label}
                    </li>
                ))}
            </ul>
        </div>
    );
}

function RegisterPage() {
    const navigate = useNavigate();

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;
    const passwordRule = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9\s]).{6,}$/;

    const [firstName, setFirstName] = useState("");
    const [secondName, setSecondName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [retypePassword, setRetypePassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");

        if (!firstName || !secondName || !email || !password || !retypePassword) {
            setError("All fields are required");
            return;
        }

        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address");
            return;
        }

        if (!passwordRule.test(password)) {
            setError("Password does not meet the requirements listed below");
            return;
        }

        if (password !== retypePassword) {
            setError("Passwords do not match");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch("http://127.0.0.1:8000/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    first_name: firstName,
                    second_name: secondName,
                    email: email,
                    password: password
                })
            });

            if (response.ok) {
                navigate("/login", { state: { registered: true } });
            } else {
                const data = await response.json();
                setError(data.detail || "Registration failed");
            }
        } catch {
            setError("An error occurred during registration");
        }

        setIsLoading(false);
    }

    const passwordsMatch = retypePassword.length > 0 && password === retypePassword;
    const passwordsMismatch = retypePassword.length > 0 && password !== retypePassword;

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

                <div className="auth-container auth-container-wide">
                    <div className="auth-card">
                        <div className="auth-header">
                            <h1>Create Account</h1>
                            <p className="auth-subtitle">Join us and start your coding journey today</p>
                        </div>

                        {error && (
                            <div className="error-message">{error}</div>
                        )}

                        <form onSubmit={handleSubmit} className="auth-form">
                            <div className="input-row">
                                <div className="input-group">
                                    <label className="label">First Name</label>
                                    <input
                                        type="text"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        placeholder="John"
                                        disabled={isLoading}
                                    />
                                </div>
                                <div className="input-group">
                                    <label className="label">Last Name</label>
                                    <input
                                        type="text"
                                        value={secondName}
                                        onChange={(e) => setSecondName(e.target.value)}
                                        placeholder="Doe"
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

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
                                    placeholder="Create a strong password"
                                    disabled={isLoading}
                                />
                                <PasswordStrengthIndicator password={password} />
                            </div>

                            <div className="input-group">
                                <label className="label">Confirm Password</label>
                                <input
                                    type="password"
                                    value={retypePassword}
                                    onChange={(e) => setRetypePassword(e.target.value)}
                                    placeholder="Retype your password"
                                    disabled={isLoading}
                                    className={passwordsMatch ? 'input-match' : passwordsMismatch ? 'input-mismatch' : ''}
                                />
                                {retypePassword && (
                                    <span className={`match-indicator ${passwordsMatch ? 'match' : 'no-match'}`}>
                                        {passwordsMatch ? '✓ Passwords match' : '✗ Passwords do not match'}
                                    </span>
                                )}
                            </div>

                            <button type="submit" className="submit-button" disabled={isLoading}>
                                {isLoading ? 'Creating account...' : 'Create Account'}
                            </button>
                        </form>

                        <div className="auth-switch">
                            <p>
                                Already have an account?
                                <span className="switch-link" onClick={() => navigate("/login")}>
                                    {' '}Sign In
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

export default RegisterPage;