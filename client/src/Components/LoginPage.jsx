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
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="bg-[#161e18] p-8 rounded-lg shadow-md w-96 border border-[#ECDFCC] text-[#ECDFCC]">
        <h2 className="text-2xl font-bold mb-6 text-center text-[#ECDFCC]">
          Code Editor Login
        </h2>
        {error && (
          <div className="bg-red-900 border border-red-700 text-[#ECDFCC] px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-[#ECDFCC] text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              value={emailId}
              onChange={(e) => setEmailId(e.target.value)}
              className="w-full px-3 py-2 border border-[#ECDFCC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C4DAD2] bg-[#161e18] text-[#ECDFCC]"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-[#ECDFCC] text-sm font-bold mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-[#ECDFCC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C4DAD2] bg-[#161e18] text-[#ECDFCC]"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#ECDFCC] hover:text-[#C4DAD2]"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-[#161e18] border border-[#ECDFCC] text-[#ECDFCC] py-2 px-4 rounded-lg hover:bg-[#C4DAD2] hover:text-black transition duration-150"
          >
            Login
          </button>
          <p className="mt-4 text-center text-[#ECDFCC]">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-[#C4DAD2] hover:text-[#ECDFCC]"
            >
              Register here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
