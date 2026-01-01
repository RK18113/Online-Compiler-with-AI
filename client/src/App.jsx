import { useState, useEffect, useRef } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { RegisterPage } from "./Components/RegisterPage";
import axios from "axios";
import MonacoEditor from "./Components/MonacoEditor";
import Header from "./Components/Header";
import Output from "./Components/Output";
import Input from "./Components/Input";
import AIbox from "./Components/AIbox";

import { LoginPage } from "./Components/LoginPage";
import { CodeListModal } from "./Components/CodeListModal";

const API_BASE_URL = "http://localhost:5000";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
}

function App() {
  const editorRef = useRef(null);
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState(null);
  const [input, setInput] = useState("");
  const [AiHint, setAiHint] = useState(null);
  const [showOutput, setShowOutput] = useState(true);
  const [isLoadModalOpen, setIsLoadModalOpen] = useState(false);
  const [savedCodes, setSavedCodes] = useState([]);
  const [context, setContext] = useState("");

  // Resizing State
  const [editorWidth, setEditorWidth] = useState(60); // Percentage
  const [isDragging, setIsDragging] = useState(false);

  // Vertical Resizing State
  const [aiHeight, setAiHeight] = useState(40); // Percentage
  const [isDraggingVertical, setIsDraggingVertical] = useState(false);
  const rightPanelRef = useRef(null);

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const newWidth = (e.clientX / window.innerWidth) * 100;
    if (newWidth > 20 && newWidth < 80) {
      // Min/Max constraints
      setEditorWidth(newWidth);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsDraggingVertical(false);
  };

  const handleVerticalMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent interfering with horizontal resize
    setIsDraggingVertical(true);
  };

  const handleVerticalMouseMove = (e) => {
    if (!isDraggingVertical || !rightPanelRef.current) return;

    const panelRect = rightPanelRef.current.getBoundingClientRect();
    const relativeY = e.clientY - panelRect.top;
    const newHeight = 100 - (relativeY / panelRect.height) * 100;

    if (newHeight > 10 && newHeight < 90) {
      setAiHeight(newHeight);
    }
  };

  useEffect(() => {
    setOutput("");
  }, []);

  const [outputButtonStyle, setOutputButtonStyle] = useState(
    "p-1 rounded-md rounded-b-none text-black pr-2 pl-2 bg-[#C4DAD2] transition-all duration-200"
  );
  const [inputButtonStyle, setInputButtonStyle] = useState(
    "p-1 rounded-md rounded-b-none text-grey pr-2 pl-2 hover:bg-[#C4DAD2] hover:text-black transition-all duration-200"
  );

  const handleSave = async () => {
    try {
      const code = editorRef.current.getValue();
      const name = prompt("Enter a name for your code:");
      if (!name) return;

      const emailId = localStorage.getItem("userEmail");
      const response = await axios.post(`${API_BASE_URL}/api/code/saveCode`, {
        name,
        language,
        code,
        emailId,
      });

      alert("Code saved successfully!");
    } catch (error) {
      alert("Error saving code: " + error.message);
    }
  };

  const handleLoad = async () => {
    try {
      const emailId = localStorage.getItem("userEmail");
      const response = await axios.get(`${API_BASE_URL}/api/code/getAllCode`, {
        params: { emailId },
      });
      setSavedCodes(response.data.data);
      setIsLoadModalOpen(true);
    } catch (error) {
      alert("Error loading codes: " + error.message);
    }
  };

  const handleCodeSelect = (code) => {
    // Update the language state first
    setLanguage(code.language);

    // Then update the editor model language
    if (editorRef.current) {
      const model = editorRef.current.getModel();
      if (model) {
        monaco.editor.setModelLanguage(model, code.language);
      }
    }

    // Set the editor value with a slight delay
    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.setValue(code.code);
      }
    }, 50);

    setIsLoadModalOpen(false);
  };

  const handleLanguage = (newLanguage) => {
    setLanguage(newLanguage);
    // If editor ref exists, update the model's language
    if (editorRef.current) {
      const model = editorRef.current.getModel();
      if (model) {
        monaco.editor.setModelLanguage(model, newLanguage);
      }
    }
  };

  function handleInputClick() {
    setShowOutput(false);
    setInputButtonStyle(
      "p-1 rounded-md rounded-b-none text-black pr-2 pl-2 bg-[#C4DAD2] transition-all duration-200"
    );
    setOutputButtonStyle(
      "p-1 rounded-md rounded-b-none text-grey pr-2 pl-2 hover:bg-[#C4DAD2] hover:text-black transition-all duration-200"
    );
  }

  function handleOutputClick() {
    setShowOutput(true);
    setOutputButtonStyle(
      "p-1 rounded-md rounded-b-none text-black pr-2 pl-2 bg-[#C4DAD2] transition-all duration-200"
    );
    setInputButtonStyle(
      "p-1 rounded-md rounded-b-none text-grey pr-2 pl-2 hover:bg-[#C4DAD2] hover:text-black transition-all duration-200"
    );
  }

  function handleInput(event) {
    setInput(event.target.value);
    console.log(input);
  }

  async function handleAICall() {
    try {
      setAiHint(["Analysing Please Wait..."]);
      const fullPrompt = context || "";
      const response = await axios.post(`${API_BASE_URL}/api/ai/analyseCode`, {
        code: editorRef.current.getValue(),
        error: "", // Provide an empty string or your own error message if needed
        prompt: fullPrompt,
      });
      console.log(response.data.hint);
      setAiHint(response.data.hint);
    } catch (error) {
      console.error(error);
      setAiHint("Error in the server");
    }
  }

  async function handleRunCode() {
    try {
      setOutput(["Executing Please Wait..."]);
      const response = await axios.post(`${API_BASE_URL}/api/code/run`, {
        code: editorRef.current.getValue(),
        stdin: input,
        language: language,
      });

      setShowOutput(true);
      setOutputButtonStyle(
        "p-1 rounded-md rounded-b-none text-black pr-2 pl-2 bg-[#C4DAD2] transition-all duration-200"
      );
      setInputButtonStyle(
        "p-1 rounded-md rounded-b-none text-grey pr-2 pl-2 hover:bg-[#C4DAD2] hover:text-black transition-all duration-200"
      );

      setOutput(response.data.run.output.split("\n"));

      // Automatically analyze the AI Hint after code execution
      await handleAICall();
    } catch (error) {
      console.log(error);
      setOutput(["Error in the Server"]);
      await handleAICall(error.message); // Pass the error to AI analysis
    }
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/editor"
          element={
            <PrivateRoute>
              <div
                className="min-h-screen flex flex-col bg-[#0f0f0f] animate-fade-in overflow-hidden"
                onMouseMove={(e) => {
                  if (isDragging) handleMouseMove(e);
                  if (isDraggingVertical) handleVerticalMouseMove(e);
                }}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                <Header
                  language={language}
                  onLanguageChange={handleLanguage}
                  runCode={handleRunCode}
                  AICall={handleAICall}
                  handleSave={handleSave}
                  handleLoad={handleLoad}
                  className="p-2"
                />

                {/* Context Input */}
                <div className="px-2 pb-2">
                  <input
                    type="text"
                    placeholder="Enter context here (e.g., 'Writing a Binary Search algorithm')..."
                    className="w-full bg-[#1e1e1e] border border-[#C4DAD2]/30 text-[#ECDFCC] p-2 rounded-md focus:outline-none focus:border-[#C4DAD2] transition-colors font-robotoMono text-sm"
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                  />
                </div>

                <div className="flex-grow flex overflow-hidden px-2 pb-2 relative">
                  {/* Editor Panel - Left Side */}
                  <div
                    className="flex flex-col bg-[#1e1e1e] rounded-lg overflow-hidden border border-[#C4DAD2]/20"
                    style={{ width: `${editorWidth}%` }}
                  >
                    <MonacoEditor
                      language={language}
                      editorRef={editorRef}
                      theme="vs-dark"
                    />
                  </div>

                  {/* Resizer Handle */}
                  <div
                    className="w-2 hover:bg-[#C4DAD2] transition-colors mx-1 cursor-col-resize flex items-center justify-center group active:bg-[#C4DAD2]"
                    onMouseDown={handleMouseDown}
                  >
                    <div className="w-[1px] h-8 bg-[#C4DAD2]/30 group-hover:bg-[#C4DAD2] rounded-full"></div>
                  </div>

                  {/* Output/AI Panel - Right Side */}
                  <div
                    ref={rightPanelRef}
                    className="flex flex-col bg-[#1e1e1e] rounded-lg border border-[#C4DAD2]/20 overflow-hidden min-w-0"
                    style={{ width: `${100 - editorWidth}%` }}
                  >
                    <div
                      className="flex flex-col min-h-0"
                      style={{ height: `${100 - aiHeight}%` }}
                    >
                      <div className="flex-none p-2 border-b border-[#C4DAD2]/20 flex justify-between items-center gap-2">
                        <div className="flex gap-2">
                          <button
                            className={inputButtonStyle}
                            onClick={handleInputClick}
                          >
                            Input
                          </button>
                          <button
                            className={outputButtonStyle}
                            onClick={handleOutputClick}
                          >
                            Output
                          </button>
                        </div>
                        <div>
                          <button
                            className="p-1 px-3 rounded-lg m-1 text-[#ECDFCC] border border-[#C4DAD2]/50 hover:bg-[#C4DAD2] hover:text-black transition-all duration-200 text-sm"
                            onClick={() => {
                              handleRunCode();
                            }}
                          >
                            Run Code
                          </button>
                          <button
                            className="p-1 px-3 rounded-lg m-1 text-[#ECDFCC] border border-[#C4DAD2]/50 hover:bg-[#C4DAD2] hover:text-black transition-all duration-200 text-sm"
                            onClick={handleAICall}
                          >
                            AI Hint
                          </button>
                        </div>
                      </div>

                      <div className="flex-grow overflow-auto p-0 min-h-0">
                        {showOutput ? (
                          <Output output={output} />
                        ) : (
                          <Input input={input} handleInput={handleInput} />
                        )}
                      </div>
                    </div>

                    {/* Vertical Resizer */}
                    <div
                      className="h-2 hover:bg-[#C4DAD2] transition-colors cursor-row-resize flex items-center justify-center group active:bg-[#C4DAD2] border-t border-b border-[#C4DAD2]/20"
                      onMouseDown={handleVerticalMouseDown}
                    >
                      <div className="w-8 h-[1px] bg-[#C4DAD2]/30 group-hover:bg-[#C4DAD2] rounded-full"></div>
                    </div>

                    <div
                      className="flex flex-col min-h-0"
                      style={{ height: `${aiHeight}%` }}
                    >
                      <div className="flex-none p-2 border-b border-[#C4DAD2]/20 flex gap-2">
                        <div className="text-[#C4DAD2] font-semibold text-sm">
                          AI Assistant
                        </div>
                      </div>

                      <div className="flex-grow overflow-auto p-0 min-h-0">
                        <AIbox AiHint={AiHint} />
                      </div>
                    </div>
                  </div>
                </div>

                <CodeListModal
                  isOpen={isLoadModalOpen}
                  onClose={() => setIsLoadModalOpen(false)}
                  codes={savedCodes}
                  onSelect={handleCodeSelect}
                />
              </div>
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
