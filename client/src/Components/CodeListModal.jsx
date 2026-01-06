export function CodeListModal({ isOpen, onClose, codes, onSelect }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto z-50 flex items-center justify-center"
      style={{ isolation: "isolate" }}
    >
      <div
        className="bg-[#161e18] rounded-lg p-6 w-full max-w-2xl relative border border-[#C4DAD2]/20 shadow-lg flex flex-col"
        style={{ maxHeight: "80vh" }}
      >
        <h2 className="text-2xl font-bold mb-4 text-[#ECDFCC] sticky top-0 bg-[#161e18] py-2 z-10">
          Your Saved Code
        </h2>
        <div className="grid gap-4 overflow-y-auto pr-2 custom-scrollbar">
          {codes.length === 0 ? (
            <div className="text-gray-400 text-center py-8">
              No code saved yet.
            </div>
          ) : (
            codes.map((code) => (
              <div
                key={code._id}
                className="border border-[#C4DAD2]/30 p-4 rounded-lg hover:bg-[#C4DAD2] hover:text-black cursor-pointer transition duration-200 group relative"
                onClick={() => onSelect(code)}
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-lg group-hover:text-black text-[#ECDFCC]">
                    {code.name}
                  </h3>
                  <span className="text-xs px-2 py-1 rounded border border-[#C4DAD2]/30 group-hover:border-black/30">
                    {code.language}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-6 pt-2 border-t border-[#C4DAD2]/20 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded text-[#ECDFCC] border border-[#C4DAD2]/50 hover:bg-[#C4DAD2] hover:text-black transition duration-150"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
