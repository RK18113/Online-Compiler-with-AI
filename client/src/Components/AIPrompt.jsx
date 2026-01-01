import React from "react";

const AIPrompt = ({ AiPrompt, handleAiPrompt }) => {
  return (
    <div className="text-[#ECDFCC] font-robotoMono p-2 h-full">
      <div className="h-full w-full bg-black/30 backdrop-blur-md rounded-lg border border-[#C4DAD2]/20 overflow-hidden">
        <textarea
          className="h-full w-full bg-transparent text-[#ECDFCC] p-3 focus:outline-none resize-none"
          placeholder="Enter the prompt to give more context about your code"
          onChange={handleAiPrompt}
          value={AiPrompt}
        ></textarea>
      </div>
    </div>
  );
};

export default AIPrompt;
