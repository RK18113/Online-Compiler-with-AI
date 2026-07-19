import mongoose from "mongoose";

const gymProgressSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  emailId: { type: String, required: true, unique: true },
  solved_questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'GymQuestion' }],
  attempted_questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'GymQuestion' }],
  streak_count: { type: Number, default: 0 },
  concept_mastery: { type: Map, of: Number },
  repeated_mistakes: { type: Map, of: Number },
  average_solve_time: { type: Number, default: 0 },
  hint_usage_rate: { type: Number, default: 0 },
  last_active_date: { type: Date }
}, { timestamps: true });

const GymProgress = mongoose.model("GymProgress", gymProgressSchema);
export default GymProgress;
