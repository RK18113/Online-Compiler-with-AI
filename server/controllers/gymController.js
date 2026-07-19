import GymQuestion from "../models/gymQuestionSchema.js";
import GymSubmission from "../models/gymSubmissionSchema.js";
import GymProgress from "../models/gymProgressSchema.js";
import ConceptGraph from "../models/conceptGraphSchema.js";
import UserConceptState from "../models/userConceptStateSchema.js";
import mongoose from "mongoose";
import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { calculateRetention, updateDifficultyCeiling, detectMisconceptions, calculateSkillMaturity } from "../utils/adaptiveEngine.js";

const API_KEY = process.env.API_KEY;
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

export const getQuestions = async (req, res) => {
  try {
    let questions = await GymQuestion.find({ active_status: true });
    
    // Auto-generate seed questions using Gemini if database is empty
    if (questions.length === 0 && genAI) {
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const prompt = `
Generate exactly 2 short PyTorch practice exercises in JSON format.
Each exercise must be an object in a JSON array. Do not use Markdown formatting.
Properties needed for each exercise:
- title: string
- category: string (either 'tensor_operations', or 'autograd')
- difficulty: string (Easy or Medium)
- concept_tags: array of strings (e.g., ['tensor_creation', 'reshape'])
- problem_statement: string (clear instruction)
- constraints: array of strings
- starter_code: string (python function named 'solve' with 'import torch')
- expected_function_name: 'solve'
- visible_test_cases: string (A stringified JSON array with 1 test object, like: '[{"input": [], "expected": "tensor([1., 1.])"}]' - Note: expected must be the EXACT python string representation of the tensor output)
- hints: array of strings (3 layered hints)

Return ONLY a valid JSON array of objects.
`;
        const result = await model.generateContent(prompt);
        let text = result.response.text();
        text = text.replace(/```json/g, "").replace(/```/g, "").trim();
        const generatedQuestions = JSON.parse(text);
        
        await GymQuestion.insertMany(generatedQuestions);
        questions = await GymQuestion.find({ active_status: true });
      } catch (geminiError) {
        console.error("Failed to generate questions via Gemini:", geminiError);
      }
    }
    
    res.status(200).json({ success: true, data: questions });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getQuestionById = async (req, res) => {
  try {
    const question = await GymQuestion.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ success: false, error: "Question not found" });
    }
    res.status(200).json({ success: true, data: question });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const seedQuestions = async (req, res) => {
  const seedData = [
    {
      title: 'Tensor Initialization',
      category: 'tensor_operations',
      difficulty: 'Easy',
      concept_tags: ['tensor_creation', 'indexing'],
      problem_statement: 'Initialize a 3x3 PyTorch tensor filled with ones. Then, change the center element to 5.',
      constraints: ['Use only torch.ones', 'Do not use numpy'],
      starter_code: 'import torch\n\ndef solve():\n    # Write your solution here\n    pass\n',
      expected_function_name: 'solve',
      visible_test_cases: '[{"input": [], "expected": "tensor([[1., 1., 1.], [1., 5., 1.], [1., 1., 1.]])"}]',
      hidden_test_cases: '[{"input": [], "expected": "tensor([[1., 1., 1.], [1., 5., 1.], [1., 1., 1.]])"}]',
      hints: ['Try using torch.ones(3, 3)', 'Access the center element using [1, 1] index'],
    },
    {
      title: 'Shape Manipulation',
      category: 'tensor_operations',
      difficulty: 'Medium',
      concept_tags: ['tensor_shapes', 'reshape', 'view'],
      problem_statement: 'Create a 1D tensor of numbers from 1 to 12. Reshape it into a 3x4 tensor, then flatten it back to 1D.',
      constraints: ['Use torch.arange', 'Use view or reshape'],
      starter_code: 'import torch\n\ndef solve():\n    # Write your solution here\n    pass\n',
      expected_function_name: 'solve',
      visible_test_cases: '[{"input": [], "expected": "tensor([ 1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12])"}]',
      hidden_test_cases: '[{"input": [], "expected": "tensor([ 1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12])"}]',
      hints: ['Use torch.arange(1, 13)', 'Use .view(3, 4) or .reshape(3, 4)'],
    }
  ];

  try {
    await GymQuestion.deleteMany({});
    await GymQuestion.insertMany(seedData);
    res.status(200).json({ success: true, message: 'Questions seeded successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const submitCode = async (req, res) => {
  try {
    const { question_id, code, user_id, emailId } = req.body;
    const question = await GymQuestion.findById(question_id);
    
    if (!question) {
      return res.status(404).json({ success: false, error: 'Question not found' });
    }

    const test_cases = JSON.parse(question.visible_test_cases || "[]");
    
    // We construct a python script to run the user's code and tests
    // A simplified test generator:
    let test_code = `
import json
results = []
try:
    if '${question.expected_function_name}' not in globals():
        raise Exception("Function '${question.expected_function_name}' not defined")
    
    ans = ${question.expected_function_name}()
    ans_str = str(ans)
    expected_str = """${test_cases[0]?.expected}"""
    
    # Strip all whitespace for robust comparison
    passed = "".join(ans_str.split()) == "".join(expected_str.split())
    
    results.append({"passed": passed, "output": ans_str, "expected": expected_str})
except Exception as e:
    results.append({"passed": False, "error": str(e)})

print(json.dumps(results))
`;

    // Call Python Exec Service
    const pythonExecUrl = process.env.PYTHON_EXEC_URL || "http://127.0.0.1:8000/execute";
    
    let execResult;
    try {
      const response = await axios.post(pythonExecUrl, {
        code: code,
        test_code: test_code
      });
      execResult = response.data;
    } catch(err) {
       return res.status(500).json({ success: false, error: "Python execution service unavailable" });
    }
    
    let parsedResults = [];
    let cleanOutput = execResult.stdout || "";
    if (execResult.success && execResult.stdout) {
      try {
        const lines = execResult.stdout.trim().split(/\r?\n/);
        const lastLine = lines.pop();
        parsedResults = JSON.parse(lastLine);
        cleanOutput = lines.join("\n").trim();
      } catch (e) {
        // Output not parseable
      }
    }

    // Save submission
    const submission = new GymSubmission({
      user_id: user_id || null,
      emailId: emailId || "guest@example.com",
      question_id,
      submitted_code: code,
      runtime_output: execResult.stdout || execResult.stderr,
      success_status: execResult.success && parsedResults.length > 0 && parsedResults.every(r => r.passed)
    });
    
    await submission.save();

    // Update progress
    if (emailId) {
      const progress = await GymProgress.findOne({ emailId: emailId });
      if (progress) {
        if (!progress.attempted_questions.includes(question_id)) {
          progress.attempted_questions.push(question_id);
        }
        if (submission.success_status && !progress.solved_questions.includes(question_id)) {
          progress.solved_questions.push(question_id);
        }
        progress.last_active_date = new Date();
        await progress.save();
      } else {
        const newProgress = new GymProgress({
          user_id: user_id || null,
          emailId: emailId,
          attempted_questions: [question_id],
          solved_questions: submission.success_status ? [question_id] : [],
          last_active_date: new Date()
        });
        await newProgress.save();
      }
    }

    // Update UserConceptState
    if (emailId && question.concept_tags && question.concept_tags.length > 0) {
      let conceptStateDoc = await UserConceptState.findOne({ emailId });
      if (!conceptStateDoc) {
        conceptStateDoc = new UserConceptState({
          user_id: user_id || new mongoose.Types.ObjectId(),
          emailId: emailId,
          concept_states: {}
        });
      }
      
      const isSuccess = submission.success_status;
      
      for (const concept of question.concept_tags) {
        let state = conceptStateDoc.concept_states.get(concept);
        if (!state) {
          state = {
            mastery_score: 0,
            retention_score: 0,
            confidence_score: 0,
            times_seen: 0,
            times_correct: 0,
            average_solve_time: 0,
            hint_dependency: 0,
            difficulty_ceiling: 0.3,
            forgetting_risk: 0,
            misconceptions: []
          };
        }
        
        state.times_seen += 1;
        
        // Mocking hint usage tracking since we don't pass it from client yet
        const hintUsage = 0; 
        
        if (isSuccess) {
          state.times_correct += 1;
          state.mastery_score = Math.min(1.0, state.mastery_score + 0.15);
        } else {
          state.mastery_score = Math.max(0.0, state.mastery_score - 0.05);
        }
        
        state.difficulty_ceiling = updateDifficultyCeiling(state, isSuccess, hintUsage);
        
        const newMisconceptions = detectMisconceptions(code, execResult.stderr || "");
        for (const m of newMisconceptions) {
          if (!state.misconceptions.includes(m)) {
            state.misconceptions.push(m);
          }
        }
        
        state.last_practiced = new Date();
        state.retention_score = calculateRetention(state.mastery_score, state.last_practiced);
        
        conceptStateDoc.concept_states.set(concept, state);
      }
      
      await conceptStateDoc.save();
    }

    res.status(200).json({ 

      success: true, 
      data: {
        output: cleanOutput,
        error: execResult.stderr,
        testResults: parsedResults,
        success: submission.success_status
      } 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getHint = async (req, res) => {
  try {
    const { question_id, code, error, hintLevel } = req.body;
    const question = await GymQuestion.findById(question_id);
    if (!question) {
      return res.status(404).json({ success: false, error: 'Question not found' });
    }

    if (!genAI) {
      // Fallback to static hints if AI is not configured
      const staticHint = question.hints && question.hints.length > 0 
        ? (question.hints[hintLevel] || question.hints[question.hints.length - 1]) 
        : "No hints available.";
      return res.status(200).json({ success: true, hint: staticHint });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `
You are a PyTorch teaching assistant. The user is solving: ${question.title}.
Problem statement: ${question.problem_statement}
Current user code:
${code}
Current error or issue:
${error || 'None'}

The user is asking for hint level ${hintLevel + 1} (where 1 is conceptual, 2 is API usage, 3 is implementation logic, and 4 is near-solution).
Provide a short, targeted hint for hint level ${hintLevel + 1}. Do NOT provide the full solution. Focus on educational feedback and PyTorch concepts.
`;

    const result = await model.generateContent(prompt);
    const hintText = result.response.text();

    res.status(200).json({ success: true, hint: hintText });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getProgress = async (req, res) => {
  try {
    const { emailId } = req.query;
    if (!emailId) {
      return res.status(400).json({ success: false, error: 'Email ID required' });
    }
    const progress = await GymProgress.findOne({ emailId });
    res.status(200).json({ success: true, data: progress });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getUserConceptState = async (req, res) => {
  try {
    const { emailId } = req.query;
    if (!emailId) {
      return res.status(400).json({ success: false, error: 'Email ID required' });
    }
    let state = await UserConceptState.findOne({ emailId });
    if (!state) {
      const progress = await GymProgress.findOne({ emailId });
      state = new UserConceptState({
        user_id: progress && progress.user_id ? progress.user_id : new mongoose.Types.ObjectId(),
        emailId: emailId,
        concept_states: {}
      });
      await state.save();
    } else {
      // Dynamically calculate retention for all concepts on fetch
      let updated = false;
      for (const [conceptId, conceptState] of state.concept_states.entries()) {
        const currentRetention = calculateRetention(conceptState.mastery_score, conceptState.last_practiced);
        if (conceptState.retention_score !== currentRetention) {
          conceptState.retention_score = currentRetention;
          conceptState.forgetting_risk = Math.max(0, 1 - currentRetention);
          state.concept_states.set(conceptId, conceptState);
          updated = true;
        }
      }
      if (updated) await state.save();
    }
    res.status(200).json({ success: true, data: state });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getNextQuestion = async (req, res) => {
  try {
    const { emailId } = req.query;
    if (!emailId) {
      return res.status(400).json({ success: false, error: 'Email ID required' });
    }
    let state = await UserConceptState.findOne({ emailId });
    let questions = await GymQuestion.find({ active_status: true });
    
    if (!questions || questions.length === 0) {
      return res.status(404).json({ success: false, error: 'No active questions found' });
    }

    if (!state || !state.concept_states || state.concept_states.size === 0) {
      // Return a random Easy question to start
      const easyQuestions = questions.filter(q => q.difficulty === 'Easy');
      const selected = easyQuestions.length > 0 ? easyQuestions[Math.floor(Math.random() * easyQuestions.length)] : questions[0];
      return res.status(200).json({ success: true, data: selected });
    }

    // Static adaptive logic: Find the weakest concept that the user has seen, or introduce a new one.
    let weakestConcept = null;
    let minMastery = Infinity;
    
    for (const [conceptId, conceptState] of state.concept_states.entries()) {
      if (conceptState.mastery_score < minMastery) {
        minMastery = conceptState.mastery_score;
        weakestConcept = conceptId;
      }
    }
    
    let selectedQuestion = null;
    
    if (weakestConcept && minMastery < 0.7) {
      // Need reinforcement on weakestConcept
      let candidateQuestions = questions.filter(q => q.concept_tags && q.concept_tags.includes(weakestConcept));
      if (candidateQuestions.length > 0) {
        selectedQuestion = candidateQuestions[Math.floor(Math.random() * candidateQuestions.length)];
      }
    }
    
    if (!selectedQuestion) {
      // Pick a question the user hasn't solved yet
      const progress = await GymProgress.findOne({ emailId });
      let solvedIds = progress && progress.solved_questions ? progress.solved_questions.map(id => id.toString()) : [];
      let unsolvedQuestions = questions.filter(q => !solvedIds.includes(q._id.toString()));
      
      if (unsolvedQuestions.length > 0) {
        selectedQuestion = unsolvedQuestions[Math.floor(Math.random() * unsolvedQuestions.length)];
      } else {
        selectedQuestion = questions[Math.floor(Math.random() * questions.length)];
      }
    }
    
    res.status(200).json({ success: true, data: selectedQuestion });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getAdaptiveSession = async (req, res) => {
  try {
    const { emailId } = req.query;
    if (!emailId) {
      return res.status(400).json({ success: false, error: 'Email ID required' });
    }
    
    let state = await UserConceptState.findOne({ emailId });
    let questions = await GymQuestion.find({ active_status: true });
    
    if (!questions || questions.length === 0) {
      return res.status(404).json({ success: false, error: 'No active questions found' });
    }
    
    if (!state || !state.concept_states || state.concept_states.size === 0) {
      // New user, return a random assortment of 5 questions
      const selected = questions.sort(() => 0.5 - Math.random()).slice(0, 5);
      return res.status(200).json({ success: true, data: selected });
    }
    
    const progress = await GymProgress.findOne({ emailId });
    let solvedIds = progress && progress.solved_questions ? progress.solved_questions.map(id => id.toString()) : [];
    
    // Categorize concepts
    let weakConcepts = []; // Mastery < 0.6
    let forgottenConcepts = []; // Retention < 0.7
    let strongConcepts = []; // Mastery > 0.8
    
    for (const [conceptId, conceptState] of state.concept_states.entries()) {
      if (conceptState.mastery_score < 0.6) weakConcepts.push(conceptId);
      else if (conceptState.retention_score < 0.7) forgottenConcepts.push(conceptId);
      else strongConcepts.push(conceptId);
    }
    
    const session = [];
    
    // 1. Weakness Repair (2 questions)
    let weaknessQuestions = questions.filter(q => q.concept_tags && q.concept_tags.some(t => weakConcepts.includes(t)));
    session.push(...weaknessQuestions.sort(() => 0.5 - Math.random()).slice(0, 2));
    
    // 2. Reinforcement / Retention (2 questions)
    let reinforcementQuestions = questions.filter(q => q.concept_tags && q.concept_tags.some(t => forgottenConcepts.includes(t)) && !session.includes(q));
    session.push(...reinforcementQuestions.sort(() => 0.5 - Math.random()).slice(0, 2));
    
    // 3. Exploration / Difficulty Expansion (1 question)
    let newOrStrongQuestions = questions.filter(q => (!solvedIds.includes(q._id.toString())) && !session.includes(q));
    session.push(...newOrStrongQuestions.sort(() => 0.5 - Math.random()).slice(0, 1));
    
    // Fill to 5 if short
    if (session.length < 5) {
      const remaining = questions.filter(q => !session.includes(q));
      session.push(...remaining.sort(() => 0.5 - Math.random()).slice(0, 5 - session.length));
    }
    
    res.status(200).json({ success: true, data: session });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

