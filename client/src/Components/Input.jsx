import React from "react";

function Input({ input, handleInput }) {
  return (
    <div className=" text-[#ECDFCC] font-robotoMono ">
      <div className="h-[50vh] w-full">
        <textarea
          className="text-[#ECDFCC] font-robotoMono w-full h-full bg-[#0f211e] resize-none border-none p-2 pt-1 m-0"
          onChange={handleInput}
          placeholder="Enter the input here"
          value={input}
        />
      </div>
    </div>
  );
}

export default Input;
