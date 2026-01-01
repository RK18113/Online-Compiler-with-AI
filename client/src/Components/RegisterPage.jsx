import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const API_BASE_URL = "http://localhost:5000";

export function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    emailId: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/register`, {
        name: formData.name,
        emailId: formData.emailId,
        password: formData.password,
      });

      const loginResponse = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        emailId: formData.emailId,
        password: formData.password,
      });

      localStorage.setItem("token", loginResponse.data.token);
      localStorage.setItem("userEmail", loginResponse.data.user.emailId);
      localStorage.setItem("userName", loginResponse.data.user.name);

      navigate("/editor");
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent font-robotoMono relative overflow-hidden">
      <div className="absolute inset-0 bg-transparent z-0"></div>
      <div className="bg-black/40 backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-96 border border-[#C4DAD2]/20 text-[#ECDFCC] z-10 animate-fade-in relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#C4DAD2]/50 to-transparent rounded-t-2xl"></div>
        <h2 className="text-3xl font-bold mb-6 text-center text-[#ECDFCC] tracking-wider">
          Create Account
        </h2>
        {error && (
          <div className="bg-red-900/50 border border-red-700/50 text-[#ECDFCC] px-4 py-3 rounded mb-4 backdrop-blur-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="mb-4 group">
            <label className="block text-[#ECDFCC] text-sm font-bold mb-2 transition-colors group-hover:text-[#C4DAD2]">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-[#C4DAD2]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C4DAD2]/50 focus:border-transparent bg-black/30 text-[#ECDFCC] transition-all placeholder-white/20"
              placeholder="Enter your name"
              required
            />
          </div>
          <div className="mb-4 group">
            <label className="block text-[#ECDFCC] text-sm font-bold mb-2 transition-colors group-hover:text-[#C4DAD2]">
              Email
            </label>
            <input
              type="email"
              name="emailId"
              value={formData.emailId}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-[#C4DAD2]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C4DAD2]/50 focus:border-transparent bg-black/30 text-[#ECDFCC] transition-all placeholder-white/20"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-4 group">
            <label className="block text-[#ECDFCC] text-sm font-bold mb-2 transition-colors group-hover:text-[#C4DAD2]">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-[#C4DAD2]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C4DAD2]/50 focus:border-transparent bg-black/30 text-[#ECDFCC] transition-all placeholder-white/20"
                placeholder="Create a password"
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
          <div className="mb-6 group">
            <label className="block text-[#ECDFCC] text-sm font-bold mb-2 transition-colors group-hover:text-[#C4DAD2]">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-[#C4DAD2]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C4DAD2]/50 focus:border-transparent bg-black/30 text-[#ECDFCC] transition-all placeholder-white/20"
                placeholder="Confirm your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#ECDFCC]/70 hover:text-[#C4DAD2] transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-[#C4DAD2]/10 border border-[#C4DAD2]/50 text-[#ECDFCC] py-3 px-4 rounded-lg hover:bg-[#C4DAD2] hover:text-black hover:shadow-[0_0_15px_rgba(196,218,210,0.4)] transition-all duration-300 font-bold tracking-wide active:scale-95"
          >
            Register
          </button>
          <p className="mt-4 text-center text-[#ECDFCC]/80 text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#C4DAD2] hover:text-white underline decoration-dashed underline-offset-4 hover:decoration-solid transition-all"
            >
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
