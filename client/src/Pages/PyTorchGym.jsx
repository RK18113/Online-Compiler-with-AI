import React, { useState, useRef } from 'react';
import GymDashboard from '../Components/pytorch-gym/GymDashboard';
import CodeEditorPanel from '../Components/pytorch-gym/CodeEditorPanel';
import FeedbackPanel from '../Components/pytorch-gym/FeedbackPanel';
import { useNavigate } from 'react-router-dom';

export function PyTorchGym() {
  const navigate = useNavigate();
  const [currentTask, setCurrentTask] = useState(null);
  const [executionResult, setExecutionResult] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const editorRef = useRef(null);

  const [leftWidth, setLeftWidth] = useState(33.33);
  const [centerWidth, setCenterWidth] = useState(33.33);

  const startResizeLeft = (e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startLeftWidth = leftWidth;

    const onMouseMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const totalWidth = document.body.clientWidth;
      const deltaPercent = (deltaX / totalWidth) * 100;
      setLeftWidth(Math.max(15, Math.min(60, startLeftWidth + deltaPercent)));
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const startResizeRight = (e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startCenterWidth = centerWidth;

    const onMouseMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const totalWidth = document.body.clientWidth;
      const deltaPercent = (deltaX / totalWidth) * 100;
      setCenterWidth(Math.max(15, Math.min(60, startCenterWidth + deltaPercent)));
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  return (
    <div className="h-screen flex flex-col bg-[#181C14] text-[#ECDFCC] font-robotoMono">
      {/* Header */}
      <header className="p-4 bg-[#181C14] border-b-2 border-[#C4DAD2] flex justify-between items-center z-20">
        <h1 className="text-xl font-bold text-[#C4DAD2]">PyTorch Gym</h1>
        <nav>
          <button 
            onClick={() => navigate('/editor')}
            className="p-1 px-3 rounded-lg text-[#ECDFCC] border-2 border-[#C4DAD2] hover:bg-[#C4DAD2] hover:text-black transition-colors"
          >
            Back to Compiler
          </button>
        </nav>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Panel: Problem Statement / Dashboard */}
        <div style={{ width: `${leftWidth}%` }} className="overflow-y-auto bg-[#181C14] flex-shrink-0">
          <GymDashboard currentTask={currentTask} onSelectTask={setCurrentTask} />
        </div>

        {/* Resizer 1 */}
        <div 
          onMouseDown={startResizeLeft} 
          className="w-1 cursor-col-resize bg-[#C4DAD2] hover:bg-white hover:w-2 active:bg-white active:w-2 transition-all z-10 flex-shrink-0"
        />

        {/* Center Panel: Editor & Execution */}
        <div style={{ width: `${centerWidth}%` }} className="flex flex-col flex-shrink-0">
          <CodeEditorPanel 
            currentTask={currentTask} 
            setExecutionResult={setExecutionResult}
            setIsExecuting={setIsExecuting}
            editorRef={editorRef}
          />
        </div>

        {/* Resizer 2 */}
        <div 
          onMouseDown={startResizeRight} 
          className="w-1 cursor-col-resize bg-[#C4DAD2] hover:bg-white hover:w-2 active:bg-white active:w-2 transition-all z-10 flex-shrink-0"
        />

        {/* Right Panel: Feedback & Output */}
        <div style={{ width: `${100 - leftWidth - centerWidth}%` }} className="overflow-y-auto bg-[#181C14] flex-shrink-0">
          <FeedbackPanel 
            executionResult={executionResult}
            isExecuting={isExecuting}
            currentTask={currentTask}
            editorRef={editorRef}
          />
        </div>
      </div>
    </div>
  );
}
