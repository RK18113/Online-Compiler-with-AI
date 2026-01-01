import React from "react";

function Input({ input, handleInput }) {
  return (
    <div className="text-[#ECDFCC] font-robotoMono h-full w-full p-2">
      <div className="h-full w-full bg-black/30 backdrop-blur-md rounded-lg border border-[#C4DAD2]/20 overflow-hidden">
        <textarea
          className="text-[#ECDFCC] font-robotoMono w-full h-full bg-transparent resize-none border-none p-3 focus:outline-none focus:ring-1 focus:ring-[#C4DAD2]/30"
          onChange={handleInput}
          placeholder="Enter the input here"
          value={input}
        />
      </div>
    </div>
  );
}

export default Input;
