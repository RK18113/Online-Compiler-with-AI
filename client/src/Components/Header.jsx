import React from "react";
import language from "../assets/languages";
import { useNavigate } from "react-router-dom";

function Header({
  language: currentLanguage,
  onLanguageChange,
  handleSave,
  handleLoad,
}) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="flex bg-black/40 backdrop-blur-md border-b border-[#C4DAD2]/20 justify-between font-robotoMono sticky top-0 z-50 transition-all duration-300">
      <div className="w-[50%] flex items-center">
        <select
          value={currentLanguage}
          className="h-[40px] bg-black border-[#C4DAD2] border-2 m-2 rounded-lg pb-1 px-2 text-[#ECDFCC]"
          onChange={(event) => onLanguageChange(event.target.value)}
        >
          {language.map((ele, index) => (
            <option key={index} value={ele}>
              {ele}
            </option>
          ))}
        </select>
      </div>

      <div className="w-[50%] flex justify-end items-center pr-2">
        <div className="flex items-center">
          <button
            className="p-1 px-3 rounded-lg m-2 text-[#ECDFCC] border border-[#C4DAD2]/50 hover:bg-[#C4DAD2] hover:text-black hover:shadow-[0_0_10px_rgba(196,218,210,0.3)] transition-all duration-200 active:scale-95"
            onClick={handleSave}
          >
            Save Code
          </button>
          <button
            className="p-1 px-3 rounded-lg m-2 text-[#ECDFCC] border border-[#C4DAD2]/50 hover:bg-[#C4DAD2] hover:text-black hover:shadow-[0_0_10px_rgba(196,218,210,0.3)] transition-all duration-200 active:scale-95"
            onClick={handleLoad}
          >
            Load Code
          </button>
          <button
            className="p-1 px-3 rounded-lg m-2 text-red-300 border border-red-900/50 hover:bg-red-900/50 hover:text-red-100 transition-all duration-200 active:scale-95"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Header;
