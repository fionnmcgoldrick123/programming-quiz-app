import PromptPage from './pages/PromptPage'
import '../css-files/App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../utils/AuthContext";
import LandingPage from './pages/LandingPage';
import LoginPage from './auth/LoginPage';
import RegisterPage from './auth/RegisterPage';
import QuizPage from './pages/QuizPage';
import UserPage from './pages/UserPage';
import CodeSandboxPage from './pages/CodeSandboxPage';
import AboutPage from './pages/AboutPage';
import StatsPage from './StatsPage';
import SocialPage from './pages/SocialPage';
import PublicProfilePage from './pages/PublicProfilePage';

function App() {
  return(
    <>
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/prompt" element = {<PromptPage />} />
          <Route path="/login" element = {<LoginPage />} />
          <Route path="/register" element = {<RegisterPage />} />
          <Route path="/profile" element = {<UserPage/>} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/code-sandbox" element={<CodeSandboxPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/social" element={<SocialPage />} />
          <Route path="/user/:userId" element={<PublicProfilePage />} />
        </Routes>
      </AuthProvider>
    </Router>
    </>
  )
}

export default App
