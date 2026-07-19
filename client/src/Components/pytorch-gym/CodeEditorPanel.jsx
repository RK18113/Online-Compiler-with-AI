import React, { useRef, useState, useEffect } from 'react';
import MonacoEditor from '../MonacoEditor';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://online-compiler-with-ai.onrender.com";

export default function CodeEditorPanel({ currentTask, setExecutionResult, setIsExecuting, editorRef }) {

  useEffect(() => {
    let changeListener = null;

    const setupEditor = () => {
      if (editorRef.current) {
        if (currentTask) {
          const savedCode = localStorage.getItem(`gym_code_${currentTask._id}`);
          editorRef.current.setValue(savedCode || currentTask.starter_code || `# Write your solution here\n`);
          
          changeListener = editorRef.current.onDidChangeModelContent(() => {
            localStorage.setItem(`gym_code_${currentTask._id}`, editorRef.current.getValue());
          });
        } else {
          editorRef.current.setValue(`# Select an exercise from the left panel to begin.\n`);
        }
      }
    };

    if (editorRef.current) {
      setupEditor();
    } else {
      setTimeout(() => {
        setupEditor();
      }, 500);
    }

    return () => {
      if (changeListener) {
        changeListener.dispose();
      }
    };
  }, [currentTask]);

  const handleSubmit = async () => {
    if (!currentTask) return;
    setIsExecuting(true);
    setExecutionResult(null);
    try {
      const emailId = localStorage.getItem("userEmail");
      const currentCode = editorRef.current.getValue();
      const response = await axios.post(`${API_BASE_URL}/api/gym/submit`, {
        question_id: currentTask._id,
        code: currentCode,
        emailId: emailId
      });
      setExecutionResult(response.data.data);
    } catch (error) {
      console.error("Submission failed", error);
      setExecutionResult({ error: "Failed to submit code." });
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#181C14]">
      <div className="flex justify-between items-center p-2 bg-[#181C14] border-b-2 border-[#C4DAD2]">
        <span className="text-sm font-semibold text-[#ECDFCC] px-2">Python (PyTorch)</span>
        <div className="flex gap-2">
          <button 
            onClick={handleSubmit}
            disabled={!currentTask}
            className="px-4 py-1 bg-[#C4DAD2] text-black font-semibold hover:bg-[#a8c2b9] rounded text-sm disabled:opacity-50"
          >
            Run & Submit
          </button>
        </div>
      </div>
      
      <div className="flex-1">
        <MonacoEditor
          language="python"
          editorRef={editorRef}
          theme="vs-dark"
          className="w-full h-full"
        />
      </div>
    </div>
  );
}
