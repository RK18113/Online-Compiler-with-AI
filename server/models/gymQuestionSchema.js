import mongoose from "mongoose";

const gymQuestionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  difficulty: { type: String, required: true, enum: ['Easy', 'Medium', 'Hard'] },
  concept_tags: [{ type: String }],
  problem_statement: { type: String, required: true },
  constraints: [{ type: String }],
  starter_code: { type: String },
  expected_function_name: { type: String },
  visible_test_cases: { type: String },
  hidden_test_cases: { type: String },
  hints: [{ type: String }],
  solution: { type: String },
  explanation: { type: String },
  tensor_shapes_metadata: { type: Object },
  estimated_time_minutes: { type: Number },
  learning_objective: { type: String },
  related_concepts: [{ type: String }],
  active_status: { type: Boolean, default: true }
}, { timestamps: true });

const GymQuestion = mongoose.model("GymQuestion", gymQuestionSchema);
export default GymQuestion;
