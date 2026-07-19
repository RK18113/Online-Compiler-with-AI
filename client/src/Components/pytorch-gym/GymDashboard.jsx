import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://online-compiler-with-ai.onrender.com";

export default function GymDashboard({ currentTask, onSelectTask }) {
  const [tasks, setTasks] = useState([]);
  const [progress, setProgress] = useState(null);
  const [conceptState, setConceptState] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleAdaptivePractice = async () => {
    try {
      const emailId = localStorage.getItem("userEmail");
      const res = await axios.get(`${API_BASE_URL}/api/gym/next-question?emailId=${emailId}`);
      if (res.data.success) {
        onSelectTask(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch next adaptive question", error);
      alert("Could not fetch adaptive question");
    }
  };

  const handleStartSession = async () => {
    try {
      const emailId = localStorage.getItem("userEmail");
      const res = await axios.get(`${API_BASE_URL}/api/gym/session?emailId=${emailId}`);
      if (res.data.success && res.data.data.length > 0) {
        onSelectTask(res.data.data[0]); // Load first session task for now
        // A complete implementation could load a session array and iterate through it
      }
    } catch (error) {
      console.error("Failed to start session", error);
      alert("Could not start session");
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const emailId = localStorage.getItem("userEmail");
        const tasksRes = await axios.get(`${API_BASE_URL}/api/gym/questions`);
        let progressRes = { data: { success: false } };
        let conceptRes = { data: { success: false } };
        try {
           progressRes = await axios.get(`${API_BASE_URL}/api/gym/progress?emailId=${emailId}`);
        } catch (e) {
           console.log("No progress found or error");
        }
        try {
           conceptRes = await axios.get(`${API_BASE_URL}/api/gym/concept-state?emailId=${emailId}`);
        } catch (e) {
           console.log("No concept state found or error");
        }
        
        if (tasksRes.data.success) {
          setTasks(tasksRes.data.data);
        }
        if (progressRes.data.success) {
          setProgress(progressRes.data.data);
        }
        if (conceptRes.data.success) {
          setConceptState(conceptRes.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (currentTask) {
    return (
      <div className="p-4">
        <button 
          onClick={() => onSelectTask(null)}
          className="text-sm text-[#ECDFCC] mb-4 hover:text-white"
        >
          &larr; Back to Exercises
        </button>
        <h2 className="text-2xl font-bold mb-2">{currentTask.title}</h2>
        <div className="flex gap-2 mb-4">
          <span className="px-2 py-1 bg-gray-800 text-xs rounded">{currentTask.difficulty}</span>
          <span className="px-2 py-1 bg-gray-800 text-xs rounded">{currentTask.category}</span>
        </div>
        
        <div className="mt-6 space-y-4">
          <div>
            <h3 className="font-semibold text-lg text-[#C4DAD2]">Problem Statement</h3>
            <p className="text-[#ECDFCC] mt-2 text-sm leading-relaxed">
              {currentTask.problem_statement}
            </p>
          </div>
          
          {currentTask.constraints && currentTask.constraints.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg text-[#C4DAD2]">Constraints</h3>
              <ul className="list-disc list-inside text-[#ECDFCC] text-sm mt-2">
                {currentTask.constraints.map((constraint, idx) => (
                  <li key={idx}>{constraint}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  }

  const isSolved = (taskId) => progress?.solved_questions?.includes(taskId);
  const isAttempted = (taskId) => progress?.attempted_questions?.includes(taskId);

  return (
    <div className="p-4">
      <div className="mb-6 p-4 bg-[#181C14] rounded-lg border-2 border-[#C4DAD2]">
        <h3 className="text-lg font-bold text-[#C4DAD2] mb-2">Your Progress</h3>
        <div className="flex gap-4">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-[#ECDFCC]">{progress?.solved_questions?.length || 0}</span>
            <span className="text-xs text-[#ECDFCC]">Solved</span>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-[#ECDFCC]">{progress?.attempted_questions?.length || 0}</span>
            <span className="text-xs text-[#ECDFCC]">Attempted</span>
          </div>
        </div>
      </div>
      
      <div className="mb-6 p-4 bg-[#181C14] rounded-lg border-2 border-[#C4DAD2]">
        <h3 className="text-lg font-bold text-[#C4DAD2] mb-2">Analytics Dashboard</h3>
        {conceptState && conceptState.concept_states && Object.keys(conceptState.concept_states).length > 0 ? (
          <div className="space-y-3">
            {Object.entries(conceptState.concept_states).map(([concept, state]) => (
              <div key={concept} className="flex flex-col">
                <div className="flex justify-between text-xs text-[#ECDFCC] mb-1">
                  <span>{concept} (Ret: {Math.round(state.retention_score * 100)}%)</span>
                  <span>{Math.round(state.mastery_score * 100)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-[#C4DAD2] h-2 rounded-full" style={{ width: `${Math.round(state.mastery_score * 100)}%` }}></div>
                </div>
                {state.misconceptions && state.misconceptions.length > 0 && (
                  <span className="text-[10px] text-red-400 mt-1 block">Misconceptions: {state.misconceptions.join(", ")}</span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[#ECDFCC] text-sm opacity-70">Solve exercises to build your concept mastery profile.</p>
        )}
      </div>


      <div className="flex gap-4 mb-6">
        <button 
          onClick={handleStartSession}
          className="flex-1 py-2 px-4 bg-[#181C14] text-[#C4DAD2] border-2 border-[#C4DAD2] font-bold rounded-lg hover:bg-[#C4DAD2] hover:text-black transition-colors"
        >
          Daily Session
        </button>
        <button 
          onClick={handleAdaptivePractice}
          className="flex-1 py-2 px-4 bg-[#C4DAD2] text-black font-bold rounded-lg hover:bg-white transition-colors"
        >
          Target Weakness
        </button>
      </div>

      <h2 className="text-xl font-bold mb-4 text-[#C4DAD2]">Available Exercises</h2>
      {loading ? (
        <p className="text-[#ECDFCC]">Loading exercises...</p>
      ) : tasks.length === 0 ? (
        <p className="text-[#ECDFCC]">No exercises found.</p>
      ) : (
        <div className="space-y-3">
          {tasks.map(task => (
            <div 
              key={task._id}
              onClick={() => onSelectTask(task)}
              className="p-4 bg-[#181C14] rounded-lg cursor-pointer hover:bg-[#C4DAD2] hover:text-black transition-colors border-2 border-[#C4DAD2] text-[#ECDFCC] hover:border-[#C4DAD2]"
            >
              <div className="flex justify-between">
                <h3 className="font-semibold">{task.title}</h3>
                {isSolved(task._id) && <span className="text-green-500 font-bold text-sm">✓</span>}
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs">{task.category}</span>
                <span className={`text-xs px-2 py-1 rounded ${task.difficulty === 'Easy' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'}`}>
                  {task.difficulty}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
