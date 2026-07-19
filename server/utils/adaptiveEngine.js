// Adaptive Learning Engine Implementation

export const calculateRetention = (mastery_score, last_practiced) => {
  if (!last_practiced) return 0;
  
  // Exponential decay forgetting curve: R(t) = e^(-λt)
  const now = new Date();
  const daysElapsed = (now - new Date(last_practiced)) / (1000 * 60 * 60 * 24);
  
  // λ depends on current mastery (higher mastery = slower forgetting)
  const lambda = 0.5 * (1.1 - mastery_score); 
  const retention = Math.exp(-lambda * daysElapsed);
  
  return retention;
};

export const updateDifficultyCeiling = (state, isSuccess, hintUsage) => {
  // Increase if success with low hints, decrease if failed
  let adjustment = 0;
  if (isSuccess) {
    if (hintUsage === 0) adjustment = 0.1;
    else if (hintUsage === 1) adjustment = 0.05;
    else adjustment = 0; 
  } else {
    adjustment = -0.15;
  }
  
  const newCeiling = Math.max(0.1, Math.min(1.0, state.difficulty_ceiling + adjustment));
  return newCeiling;
};

export const detectMisconceptions = (code, error) => {
  const misconceptions = [];
  const lowerCode = code.toLowerCase();
  const lowerError = (error || "").toLowerCase();

  // Simple rule-based misconception detection
  if (lowerError.includes("size mismatch") || lowerError.includes("broadcast")) {
    misconceptions.push("broadcasting_alignment");
  }
  if (lowerError.includes("dimension out of range") || lowerCode.includes(".unsqueeze(")) {
    if (lowerError.includes("dimension out of range")) {
      misconceptions.push("unsqueeze_dimension");
    }
  }
  if (lowerCode.includes(".view(") && lowerError.includes("contiguous")) {
    misconceptions.push("view_vs_reshape");
  }
  if (lowerError.includes("grad") && !lowerCode.includes("zero_grad")) {
    misconceptions.push("forgot_zero_grad");
  }

  return misconceptions;
};

export const calculateSkillMaturity = (state) => {
  // M = 0.3*A + 0.25*R + 0.15*C + 0.15*D + 0.15*H
  // Simplified for MVP
  const accuracy = state.times_seen > 0 ? (state.times_correct / state.times_seen) : 0;
  const retention = state.retention_score || 0;
  const hintIndependence = Math.max(0, 1 - state.hint_dependency);
  
  const maturity = (0.4 * accuracy) + (0.3 * retention) + (0.3 * hintIndependence);
  return maturity;
};
