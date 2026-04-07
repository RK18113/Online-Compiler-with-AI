import React from "react";

function output({ output }) {
  return (
    <div className="text-[#ECDFCC] font-robotoMono p-2 h-full">
      <div className="h-full w-full overflow-auto bg-black/30 backdrop-blur-md rounded-lg border border-[#C4DAD2]/20 p-3 shadow-inner">
        {output ? (
          output.map((element, index) => (
            <p key={index} className="mb-1">
              {element}
            </p>
          ))
        ) : (
          <span className="opacity-50 italic">
            Click "Run Code" to execute the code.
          </span>
        )}
      </div>
    </div>
  );
}

export default output;
