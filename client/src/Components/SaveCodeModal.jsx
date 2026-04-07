import React, { useState } from "react";

export function SaveCodeModal({ isOpen, onClose, onSave }) {
  const [codeName, setCodeName] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (codeName.trim()) {
      onSave(codeName);
      setCodeName("");
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto z-50 flex items-center justify-center"
      style={{ isolation: "isolate" }}
    >
      <div className="bg-[#161e18] rounded-lg p-6 w-full max-w-md relative border border-[#C4DAD2]/20 shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-[#ECDFCC]">Save Code</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="codeName"
              className="block text-sm font-medium text-[#ECDFCC] mb-2"
            >
              Name
            </label>
            <input
              type="text"
              id="codeName"
              value={codeName}
              onChange={(e) => setCodeName(e.target.value)}
              className="w-full bg-[#1e1e1e] border border-[#C4DAD2]/30 text-[#ECDFCC] p-2 rounded-md focus:outline-none focus:border-[#C4DAD2] transition-colors"
              placeholder="Enter code name..."
              autoFocus
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded text-[#ECDFCC] border border-[#C4DAD2]/50 hover:bg-[#C4DAD2] hover:text-black transition duration-150"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-[#C4DAD2] text-black hover:bg-[#b0c4bc] transition duration-150 font-medium"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
