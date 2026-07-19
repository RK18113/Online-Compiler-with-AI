import React from "react";
import language from "../assets/languages";
import { useNavigate } from "react-router-dom";

function Header({
  language: currentLanguage,
  onLanguageChange,
  runCode,
  AICall,
  handleSave,
  handleLoad,
}) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="flex bg-[#181C14] justify-between font-robotoMono">
      <div className="w-[50%]">
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

      <div className="w-[50%] flex justify-between">
        <div>
          <button
            className="p-1 px-2 rounded-lg m-2 text-[#ECDFCC] border-2 border-[#C4DAD2] hover:bg-[#C4DAD2] hover:text-black"
            onClick={() => {
              runCode();
              AICall();
            }}
          >
            Run Code
          </button>
          <button
            className="p-1 px-2 rounded-lg m-2 text-[#ECDFCC] border-2 border-[#C4DAD2] hover:bg-[#C4DAD2] hover:text-black"
            onClick={AICall}
          >
            AI Hint
          </button>
        </div>

        <div className="flex items-center">
          <button
            className="p-1 px-2 rounded-lg m-2 text-green-400 border-2 border-green-500 hover:bg-green-500 hover:text-black font-bold"
            onClick={() => navigate('/gym')}
          >
            PyTorch Gym
          </button>
          <button
            className="p-1 px-2 rounded-lg m-2 text-[#ECDFCC] border-2 border-[#C4DAD2] hover:bg-[#C4DAD2] hover:text-black"
            onClick={handleSave}
          >
            Save Code
          </button>
          <button
            className="p-1 px-2 rounded-lg m-2 text-[#ECDFCC] border-2 border-[#C4DAD2] hover:bg-[#C4DAD2] hover:text-black"
            onClick={handleLoad}
          >
            Load Code
          </button>
          <button
            className="p-1 px-2 rounded-lg m-2 text-[#ECDFCC] border-2 border-[#C4DAD2] hover:bg-[#C4DAD2] hover:text-black"
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
