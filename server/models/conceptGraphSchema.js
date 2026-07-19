import mongoose from "mongoose";

const conceptGraphSchema = new mongoose.Schema({
  concept_id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  difficulty_weight: { type: Number, required: true },
  prerequisites: [{ type: String }],
  related_concepts: [{ type: String }],
  parent_domain: { type: String, required: true }
}, { timestamps: true });

const ConceptGraph = mongoose.model("ConceptGraph", conceptGraphSchema);
export default ConceptGraph;
