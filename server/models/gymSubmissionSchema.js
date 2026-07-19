import mongoose from "mongoose";

const gymSubmissionSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  emailId: { type: String, required: true }, // since current code uses email for tracking
  question_id: { type: mongoose.Schema.Types.ObjectId, ref: 'GymQuestion', required: true },
  submitted_code: { type: String, required: true },
  runtime_output: { type: String },
  hidden_test_results: { type: Object },
  visible_test_results: { type: Object },
  hint_count: { type: Number, default: 0 },
  time_taken: { type: Number },
  success_status: { type: Boolean, default: false },
  error_type: { type: String }
}, { timestamps: true });

const GymSubmission = mongoose.model("GymSubmission", gymSubmissionSchema);
export default GymSubmission;
