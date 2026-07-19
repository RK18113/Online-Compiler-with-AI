import mongoose from "mongoose";

const userConceptStateSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  emailId: { type: String, required: true },
  concept_states: {
    type: Map,
    of: new mongoose.Schema({
      mastery_score: { type: Number, default: 0 },
      retention_score: { type: Number, default: 0 },
      confidence_score: { type: Number, default: 0 },
      last_practiced: { type: Date },
      times_seen: { type: Number, default: 0 },
      times_correct: { type: Number, default: 0 },
      average_solve_time: { type: Number, default: 0 },
      hint_dependency: { type: Number, default: 0 },
      difficulty_ceiling: { type: Number, default: 0.3 },
      forgetting_risk: { type: Number, default: 0 },
      misconceptions: [{ type: String }]
    }, { _id: false })
  }
}, { timestamps: true });

const UserConceptState = mongoose.model("UserConceptState", userConceptStateSchema);
export default UserConceptState;
