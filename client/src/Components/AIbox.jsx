import React from "react";

const AIbox = ({ AiHint }) => {
  return (
    <div className="text-[#ECDFCC] font-robotoMono p-2 h-full">
      <div className="h-full bg-black/30 backdrop-blur-md overflow-y-auto p-3 opacity-50 italic rounded-lg border border-[#C4DAD2]/20 shadow-inner">
        {AiHint
          ? AiHint
          : 'Click "Run Code" or "AI Hint" check if there are any errors'}
      </div>
    </div>
  );
};

export default AIbox;
