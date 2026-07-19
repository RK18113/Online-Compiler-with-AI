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
import AIPrompt from "./Components/AIPrompt";
import { LoginPage } from "./Components/LoginPage";
import { CodeListModal } from "./Components/CodeListModal";
import { PyTorchGym } from "./Pages/PyTorchGym";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://online-compiler-with-ai.onrender.com";

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
  const [AiPrompt, setAiPrompt] = useState("");
  const [showOutput, setShowOutput] = useState(true);
  const [showAiPrompt, setShowAiPrompt] = useState(true);
  const [isLoadModalOpen, setIsLoadModalOpen] = useState(false);
  const [savedCodes, setSavedCodes] = useState([]);

  useEffect(() => {
    setOutput("");
  }, []);

  const [outputButtonStyle, setOutputButtonStyle] = useState(
    "p-1 border-2 rounded-md rounded-b-none text-white pr-2 pl-2 bg-[#C4DAD2] text-black"
  );
  const [inputButtonStyle, setInputButtonStyle] = useState(
    "p-1 border-2 border-black rounded-md rounded-b-none text-grey pr-2 pl-2 hover:bg-[#C4DAD2] hover:text-black"
  );
  const [aiPromptButtonStyle, setAiPromptButtonStyle] = useState(
    "p-1 border-2 rounded-md rounded-b-none text-white pr-2 pl-2 bg-[#C4DAD2] text-black"
  );
  const [aiHintButtonStyle, setAiHintButtonStyle] = useState(
    "p-1 border-2 border-black rounded-md rounded-b-none text-grey pr-2 pl-2 hover:bg-[#C4DAD2] hover:text-black"
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
      "p-1 border-2 rounded-md rounded-b-none text-white pr-2 pl-2 bg-[#C4DAD2] text-black"
    );
    setOutputButtonStyle(
      "p-1 border-2 border-black rounded-md rounded-b-none text-grey pr-2 pl-2 hover:bg-[#C4DAD2] hover:text-black"
    );
  }

  function handleOutputClick() {
    setShowOutput(true);
    setOutputButtonStyle(
      "p-1 border-2 rounded-md rounded-b-none text-white pr-2 pl-2 bg-[#C4DAD2] text-black"
    );
    setInputButtonStyle(
      "p-1 border-2 border-black rounded-md rounded-b-none text-grey pr-2 pl-2 hover:bg-[#C4DAD2] hover:text-black"
    );
  }

  function handleAiPromptClick() {
    setShowAiPrompt(true);
    setAiPromptButtonStyle(
      "p-1 border-2 rounded-md rounded-b-none text-white pr-2 pl-2 bg-[#C4DAD2] text-black"
    );
    setAiHintButtonStyle(
      "p-1 border-2 border-black rounded-md rounded-b-none text-grey pr-2 pl-2 hover:bg-[#C4DAD2] hover:text-black"
    );
  }

  function handleAiHintClick() {
    setShowAiPrompt(false);
    setAiHintButtonStyle(
      "p-1 border-2 rounded-md rounded-b-none text-white pr-2 pl-2 bg-[#C4DAD2] text-black"
    );
    setAiPromptButtonStyle(
      "p-1 border-2 border-black rounded-md rounded-b-none text-grey pr-2 pl-2 hover:bg-[#C4DAD2] hover:text-black"
    );
  }

  function handleInput(event) {
    setInput(event.target.value);
    console.log(input);
  }

  function handleAiPrompt(event) {
    setAiPrompt(event.target.value);
    console.log(AiPrompt);
  }

  async function handleAICall() {
    try {
      setAiHint(["Analysing Please Wait..."]);
      handleAiHintClick();
      const response = await axios.post(`${API_BASE_URL}/api/ai/analyseCode`, {
        code: editorRef.current.getValue(),
        error: "", // Provide an empty string or your own error message if needed
        prompt: AiPrompt,
      });
      console.log(response.data.hint);
      setAiHint(response.data.hint);
      // Set to false so that the AIbox is shown instead of AIPrompt
      setShowAiPrompt(false);
    } catch (error) {
      console.error(error);
      setAiHint("Error in the server");
      setShowAiPrompt(false);
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
        "p-1 border-2 rounded-md rounded-b-none text-white pr-2 pl-2 bg-[#C4DAD2] text-black"
      );
      setInputButtonStyle(
        "p-1 border-2 border-black rounded-md rounded-b-none text-grey pr-2 pl-2 hover:bg-[#C4DAD2] hover:text-black"
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
              <div className="h-screen flex flex-col">
                <Header
                  language={language} // This should now stay in sync
                  onLanguageChange={handleLanguage}
                  runCode={handleRunCode}
                  AICall={handleAICall}
                  handleSave={handleSave}
                  handleLoad={handleLoad}
                  className="p-2"
                />
                <div className="flex flex-1 overflow-hidden">
                  <MonacoEditor
                    language={language}
                    editorRef={editorRef}
                    theme="vs-dark"
                    className="w-full h-full"
                  />
                  <div className="w-full flex flex-col">
                    <div className="p-2 pb-0 border-b-2 bg-black font-robotoMono font-semibold text-white flex flex-wrap">
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
                    {showOutput ? (
                      <Output output={output} />
                    ) : (
                      <Input input={input} handleInput={handleInput}></Input>
                    )}

                    <div className="p-2 pb-0 border-b-2 bg-black font-robotoMono font-semibold text-white flex flex-wrap">
                      <button
                        className={aiPromptButtonStyle}
                        onClick={handleAiPromptClick}
                      >
                        AI Prompt
                      </button>
                      <button
                        className={aiHintButtonStyle}
                        onClick={handleAiHintClick}
                      >
                        AI Hint
                      </button>
                    </div>
                    {showAiPrompt ? (
                      <AIPrompt
                        AiPrompt={AiPrompt}
                        handleAiPrompt={handleAiPrompt}
                      />
                    ) : (
                      <AIbox AiHint={AiHint} />
                    )}
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
        <Route
          path="/gym"
          element={
            <PrivateRoute>
              <PyTorchGym />
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
