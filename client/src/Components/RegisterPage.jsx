import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const API_BASE_URL = "https://online-compiler-with-ai.onrender.com";

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
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="bg-[#161e18] p-8 rounded-lg shadow-md w-96 border border-[#ECDFCC] text-[#ECDFCC]">
        <h2 className="text-2xl font-bold mb-6 text-center text-[#ECDFCC]">
          Create Account
        </h2>
        {error && (
          <div className="bg-red-900 border border-red-700 text-[#ECDFCC] px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label className="block text-[#ECDFCC] text-sm font-bold mb-2">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-[#ECDFCC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C4DAD2] bg-[#161e18] text-[#ECDFCC]"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-[#ECDFCC] text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              name="emailId"
              value={formData.emailId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-[#ECDFCC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C4DAD2] bg-[#161e18] text-[#ECDFCC]"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-[#ECDFCC] text-sm font-bold mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
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
          <div className="mb-6">
            <label className="block text-[#ECDFCC] text-sm font-bold mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-[#ECDFCC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C4DAD2] bg-[#161e18] text-[#ECDFCC]"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#ECDFCC] hover:text-[#C4DAD2]"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-[#161e18] border border-[#ECDFCC] text-[#ECDFCC] py-2 px-4 rounded-lg hover:bg-[#C4DAD2] hover:text-black transition duration-150"
          >
            Register
          </button>
          <p className="mt-4 text-center text-[#ECDFCC]">
            Already have an account?{" "}
            <Link to="/login" className="text-[#C4DAD2] hover:text-[#ECDFCC]">
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
