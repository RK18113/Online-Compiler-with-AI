import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

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
    <div className="min-h-screen flex items-center justify-center bg-transparent font-robotoMono relative overflow-hidden">
      <div className="absolute inset-0 bg-transparent z-0"></div>
      <div className="bg-black/40 backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-96 border border-[#C4DAD2]/20 text-[#ECDFCC] z-10 animate-fade-in relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#C4DAD2]/50 to-transparent rounded-t-2xl"></div>
        <h2 className="text-3xl font-bold mb-6 text-center text-[#ECDFCC] tracking-wider">
          Code Editor
        </h2>
        {error && (
          <div className="bg-red-900/50 border border-red-700/50 text-[#ECDFCC] px-4 py-3 rounded mb-4 backdrop-blur-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="mb-4 group">
            <label className="block text-[#ECDFCC] text-sm font-bold mb-2 transition-colors group-hover:text-[#C4DAD2]">
              Email
            </label>
            <input
              type="email"
              value={emailId}
              onChange={(e) => setEmailId(e.target.value)}
              className="w-full px-4 py-3 border border-[#C4DAD2]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C4DAD2]/50 focus:border-transparent bg-black/30 text-[#ECDFCC] transition-all placeholder-white/20"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-6 group">
            <label className="block text-[#ECDFCC] text-sm font-bold mb-2 transition-colors group-hover:text-[#C4DAD2]">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-[#C4DAD2]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C4DAD2]/50 focus:border-transparent bg-black/30 text-[#ECDFCC] transition-all placeholder-white/20"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#ECDFCC]/70 hover:text-[#C4DAD2] transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-[#C4DAD2]/10 border border-[#C4DAD2]/50 text-[#ECDFCC] py-3 px-4 rounded-lg hover:bg-[#C4DAD2] hover:text-black hover:shadow-[0_0_15px_rgba(196,218,210,0.4)] transition-all duration-300 font-bold tracking-wide active:scale-95"
          >
            Login
          </button>
          <p className="mt-4 text-center text-[#ECDFCC]/80 text-sm">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-[#C4DAD2] hover:text-white underline decoration-dashed underline-offset-4 hover:decoration-solid transition-all"
            >
              Register here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
