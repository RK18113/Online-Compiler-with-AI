import React, { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://online-compiler-with-ai.onrender.com";

export default function FeedbackPanel({ executionResult, isExecuting, currentTask, editorRef }) {
  const [activeTab, setActiveTab] = useState('output'); // 'output' or 'hints'
  const [hints, setHints] = useState([]);
  const [isHintLoading, setIsHintLoading] = useState(false);

  // Load hints from localStorage when task changes
  React.useEffect(() => {
    if (currentTask) {
      const savedHints = localStorage.getItem(`gym_hints_${currentTask._id}`);
      if (savedHints) {
        try {
          setHints(JSON.parse(savedHints));
        } catch (e) {
          setHints([]);
        }
      } else {
        setHints([]);
      }
    } else {
      setHints([]);
    }
    setActiveTab('output');
  }, [currentTask]);

  const requestHint = async () => {
    if (!currentTask) return;
    setIsHintLoading(true);
    try {
      const code = editorRef.current ? editorRef.current.getValue() : "";
      const error = executionResult?.error || "";
      const hintLevel = hints.length;
      
      const response = await axios.post(`${API_BASE_URL}/api/gym/hint`, {
        question_id: currentTask._id,
        code,
        error,
        hintLevel
      });
      
      if (response.data.success) {
        const newHints = [...hints, response.data.hint];
        setHints(newHints);
        localStorage.setItem(`gym_hints_${currentTask._id}`, JSON.stringify(newHints));
      }
    } catch (error) {
      console.error("Failed to fetch hint", error);
    } finally {
      setIsHintLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#181C14]">
      <div className="flex bg-[#181C14] border-b-2 border-[#C4DAD2] p-2 gap-2">
        <button
          onClick={() => setActiveTab('output')}
          className={`px-4 py-1 rounded text-sm font-semibold transition-colors ${
            activeTab === 'output' ? 'bg-[#C4DAD2] text-black' : 'bg-[#181C14] text-[#ECDFCC] border border-[#C4DAD2] hover:bg-[#C4DAD2] hover:text-black'
          }`}
        >
          Output & Tests
        </button>
        <button
          onClick={() => setActiveTab('hints')}
          className={`px-4 py-1 rounded text-sm font-semibold transition-colors ${
            activeTab === 'hints' ? 'bg-[#C4DAD2] text-black' : 'bg-[#181C14] text-[#ECDFCC] border border-[#C4DAD2] hover:bg-[#C4DAD2] hover:text-black'
          }`}
        >
          AI Hints
        </button>
      </div>

      <div className="p-4 flex-1 overflow-y-auto">
        {activeTab === 'output' ? (
          <div>
            {!currentTask && <p className="text-gray-400 text-sm">Select a task first.</p>}
            {currentTask && !isExecuting && !executionResult && <p className="text-gray-400 text-sm">Run your code to see the output here.</p>}
            {isExecuting && <p className="text-[#C4DAD2] text-sm animate-pulse">Running execution...</p>}
            
            {executionResult && !isExecuting && (
              <div className="space-y-4">
                <div className={`p-3 rounded border-l-4 ${executionResult.success ? 'bg-green-900 border-green-500' : 'bg-red-900 border-red-500'}`}>
                   <p className="font-semibold">{executionResult.success ? 'All Tests Passed!' : 'Tests Failed or Error Occurred'}</p>
                </div>
                
                {executionResult.error && (
                  <div className="bg-black p-3 rounded overflow-x-auto text-red-400 font-mono text-sm whitespace-pre-wrap">
                    {executionResult.error}
                  </div>
                )}
                
                {executionResult.output && !executionResult.error && (
                  <div className="bg-black p-3 rounded overflow-x-auto text-gray-300 font-mono text-sm whitespace-pre-wrap">
                    {executionResult.output}
                  </div>
                )}
                
                {executionResult.testResults && executionResult.testResults.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-semibold mb-2">Test Results</h3>
                    {executionResult.testResults.map((test, idx) => (
                      <div key={idx} className={`p-2 mb-2 rounded border-l-2 ${test.passed ? 'border-green-500 bg-[#181C14]' : 'border-red-500 bg-[#181C14]'}`}>
                        <p className={`text-sm font-semibold ${test.passed ? 'text-green-500' : 'text-red-500'}`}>Test {idx + 1}: {test.passed ? 'Passed' : 'Failed'}</p>
                        {test.error && <p className="text-xs text-red-400 mt-1">{test.error}</p>}
                        {test.expected && (
                           <div className="text-xs text-[#ECDFCC] mt-2 font-mono bg-black p-2 rounded">
                             <p className="mb-1"><span className="text-gray-400">Expected:</span> {test.expected}</p>
                             <p><span className="text-gray-400">Output:</span> {test.output}</p>
                           </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="bg-[#181C14] p-4 rounded-lg border-2 border-[#C4DAD2] mb-4">
              <p className="text-sm text-[#ECDFCC]">
                Stuck? Request a hint to guide you in the right direction. The AI will analyze your code and provide layered feedback without giving away the direct answer.
              </p>
              <button 
                onClick={requestHint}
                disabled={!currentTask || isHintLoading || hints.length >= 4}
                className="mt-4 px-4 py-2 bg-[#C4DAD2] text-black hover:bg-[#a8c2b9] rounded text-sm font-semibold w-full disabled:opacity-50"
              >
                {isHintLoading ? 'Analyzing...' : 'Request Hint'}
              </button>
            </div>
            
            <div className="space-y-4">
              {hints.map((hint, idx) => (
                <div key={idx} className="bg-[#181C14] p-4 rounded-lg border-l-4 border-[#C4DAD2]">
                  <h4 className="text-sm font-semibold text-[#C4DAD2] mb-2">Hint Level {idx + 1}</h4>
                  <div className="text-sm text-[#ECDFCC] whitespace-pre-wrap">{hint}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
