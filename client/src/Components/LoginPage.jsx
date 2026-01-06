import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Code, Mail, Lock } from "lucide-react";

const API_BASE_URL = "http://localhost:5000";

export function LoginPage() {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        emailId,
        password,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userEmail", response.data.user.emailId);
      localStorage.setItem("userName", response.data.user.name);

      navigate("/editor");
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f] font-robotoMono relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#C4DAD2]/10 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#C4DAD2]/5 rounded-full blur-[100px] animate-pulse delay-1000"></div>
      </div>

      <div className="bg-[#1e1e1e]/60 backdrop-blur-2xl p-8 rounded-2xl shadow-2xl w-full max-w-md border border-[#C4DAD2]/10 text-[#ECDFCC] z-10 animate-fade-in relative overflow-hidden group/card hover:border-[#C4DAD2]/30 transition-colors duration-500">
        {/* Top Glow Strip */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#C4DAD2]/50 to-transparent"></div>

        <div className="flex flex-col items-center mb-8">
          <div className="p-3 bg-[#C4DAD2]/10 rounded-full mb-4 border border-[#C4DAD2]/20 group-hover/card:scale-110 transition-transform duration-300">
            <Code size={32} className="text-[#C4DAD2]" />
          </div>
          <h2 className="text-3xl font-bold text-[#ECDFCC] tracking-tight">
            Welcome Back
          </h2>
          <p className="text-[#ECDFCC]/60 text-sm mt-2">
            Sign in to continue coding
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-200 px-4 py-3 rounded-lg mb-6 backdrop-blur-sm text-sm flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-red-400 rounded-full"></span>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="group">
            <label className="block text-[#ECDFCC]/80 text-xs font-medium mb-1.5 ml-1 transition-colors group-focus-within:text-[#C4DAD2]">
              EMAIL ADDRESS
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#ECDFCC]/40 group-focus-within:text-[#C4DAD2] transition-colors">
                <Mail size={18} />
              </div>
              <input
                type="email"
                value={emailId}
                onChange={(e) => setEmailId(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#0f0f0f]/50 border border-[#C4DAD2]/20 rounded-xl focus:outline-none focus:border-[#C4DAD2]/60 focus:bg-[#0f0f0f]/80 text-[#ECDFCC] transition-all placeholder-[#ECDFCC]/20 text-sm shadow-inner"
                placeholder="Ex: john@example.com"
                required
              />
            </div>
          </div>

          <div className="group">
            <label className="block text-[#ECDFCC]/80 text-xs font-medium mb-1.5 ml-1 transition-colors group-focus-within:text-[#C4DAD2]">
              PASSWORD
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#ECDFCC]/40 group-focus-within:text-[#C4DAD2] transition-colors">
                <Lock size={18} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 bg-[#0f0f0f]/50 border border-[#C4DAD2]/20 rounded-xl focus:outline-none focus:border-[#C4DAD2]/60 focus:bg-[#0f0f0f]/80 text-[#ECDFCC] transition-all placeholder-[#ECDFCC]/20 text-sm shadow-inner"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#ECDFCC]/40 hover:text-[#C4DAD2] transition-colors p-1"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#C4DAD2] text-[#161e18] py-3 px-4 rounded-xl hover:bg-[#b0c8c0] hover:shadow-[0_0_20px_rgba(196,218,210,0.3)] transition-all duration-300 font-bold tracking-wide text-sm mt-2 active:scale-[0.98] transform"
          >
            Sign In
          </button>

          <p className="mt-6 text-center text-[#ECDFCC]/60 text-sm">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-[#C4DAD2] hover:text-white font-medium hover:underline decoration-1 underline-offset-4 transition-all"
            >
              create one
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
