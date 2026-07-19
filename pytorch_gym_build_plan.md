# PyTorch Gym for Code Buddy

## Purpose
Transform the current MERN-based online compiler into a focused PyTorch practice platform that delivers short, repeatable, hint-driven exercises for tensors, debugging, and neural-network module implementation.

This document is intended to be passed to the implementation agent as the single source of truth.

---

## Current Repository State
The existing repository is a MERN stack online compiler called **Code Buddy**. It already includes:

- A **React frontend** for the coding interface.
- A **Node/Express backend**.
- **Monaco Editor** for code editing.
- **Piston API** for code execution.
- **Google Gemini API** for AI-assisted code analysis.
- A basic AI-guidance flow that explains user mistakes rather than directly solving problems.
- The project is still marked as under construction, with missing or weak areas such as AI response parsing, login, code storage, and model selection.

The new feature must be added on top of this existing foundation without breaking the existing online compiler flow.

---

## Target Product
Build a new module inside the existing app called **PyTorch Gym**.

PyTorch Gym is not a generic tutorial section. It is a deliberate-practice system for PyTorch fluency. The system should help users practice in short bursts throughout the day.

Primary learning targets:

- Tensor manipulation
- Shape reasoning
- Autograd understanding
- Training-loop basics
- Debugging broken PyTorch code
- Implementing common neural-network blocks
- Reading and reconstructing model components

---

## Product Principle
The platform must prioritize:

- Frequent micro-practice
- Immediate execution
- Hint-based learning
- Gradual difficulty progression
- Repetition with variation
- Educational feedback over direct answers

The platform must not become another generic coding playground or another DSA site.

---

## What Must Be Built

### 1. PyTorch Gym section
Create a dedicated section under the app with its own route, layout, and learning flow.

Required learning modes:

- Tensor Drills
- Debugging Challenges
- Architecture Reconstruction
- Shape Prediction
- Daily Challenge
- Training Loop Practice

### 2. Question system
Create structured exercises stored in a database, not only AI-generated on the fly.

### 3. Python execution environment
Execute PyTorch code in a controlled runtime.

### 4. Hint system
Use Gemini to generate layered hints, not immediate solutions.

### 5. Submission evaluation
Use test cases and output checks to validate user answers.

### 6. Progress tracking
Track attempts, streaks, mastery, weak concepts, and hint usage.

---

## Core Product Requirements

### User flow
1. User opens PyTorch Gym.
2. User selects a category or receives a daily challenge.
3. User reads a short problem statement.
4. User writes PyTorch code in the editor.
5. User runs the code.
6. User sees output and failing tests.
7. User requests hints if needed.
8. User submits a final solution.
9. System stores progress and updates concept mastery.

### Exercise types
Each task must belong to one of these categories:

- `tensor_operations`
- `autograd`
- `cnn_blocks`
- `transformers`
- `debugging`
- `pytorch_basics`
- `training_loops`
- `architecture_reconstruction`

### Difficulty levels
Each exercise must support:

- Easy
- Medium
- Hard

Difficulty should be progressive and data-driven.

---

## Recommended Technical Direction
The current app is MERN-based. The new system should keep the React frontend and upgrade the backend where needed for PyTorch execution.

### Frontend
- React
- TailwindCSS
- Monaco Editor
- Reusable component architecture
- Clear panel layout

### Backend
- Current Node/Express backend can remain the main app server.
- Add a Python execution service for PyTorch tasks.
- If a separate service is easier, build a small Python API for execution and evaluation.
- Keep the main app API stable.

### AI
- Gemini should be used for:
  - hint generation
  - explanation generation
  - misconception analysis
  - solution critique
- Gemini should not be the only source of questions.

### Database
- MongoDB for exercises, attempts, hints, user progress, and daily challenge logs.

---

## Architecture Rules

### Do
- Keep the feature modular.
- Separate UI, question data, execution, and AI logic.
- Use reusable components.
- Store exercises as structured data.
- Keep prompts versioned and consistent.
- Add hidden tests for validation.
- Build with future expansion in mind.
- Make each module independently testable.

### Do not
- Do not hardcode all questions inside React components.
- Do not generate every question dynamically with Gemini.
- Do not reveal full solutions in the first hint.
- Do not mix frontend logic, prompt logic, and execution logic in one file.
- Do not depend only on stdout matching.
- Do not trust user code without sandboxing.
- Do not break the existing online compiler workflow.
- Do not introduce unnecessary microservices unless required by execution safety.
- Do not make the UI cluttered.
- Do not add advanced features before the core execution and validation loop works.

---

## Recommended Folder / Module Structure
Use a scalable structure similar to this:

```text
client/
  src/
    components/
      pytorch-gym/
        GymDashboard.jsx
        QuestionCard.jsx
        CodeEditor.jsx
        OutputPanel.jsx
        HintPanel.jsx
        TestResults.jsx
        ProgressSidebar.jsx
        TensorVisualizer.jsx
        DailyChallengeBanner.jsx
    pages/
      PyTorchGym.jsx
    services/
      pytorchGymApi.js
      aiHintsApi.js
    store/
      pytorchGymStore.js

server/
  routes/
    pytorchGymRoutes.js
  controllers/
    pytorchGymController.js
    submissionController.js
    hintController.js
  models/
    Question.js
    Submission.js
    UserProgress.js
    DailyChallenge.js
  services/
    questionService.js
    evaluationService.js
    hintService.js
    progressService.js

python-exec-service/
  app.py
  sandbox/
  evaluator/
  tests/
```

The exact folder names can differ, but the separation must remain.

---

## Database Design

### Question model
Each question should store:

- title
- category
- difficulty
- concept_tags
- problem_statement
- starter_code
- expected_function_name
- visible_test_cases
- hidden_test_cases
- hints
- solution
- explanation
- tensor_shapes_metadata
- estimated_time_minutes
- learning_objective
- related_concepts
- created_at
- updated_at
- active_status

### Submission model
Store:

- user_id
- question_id
- submitted_code
- runtime_output
- hidden_test_results
- visible_test_results
- hint_count
- time_taken
- success_status
- error_type
- created_at

### User progress model
Store:

- user_id
- solved_questions
- attempted_questions
- streak_count
- concept_mastery map
- repeated_mistakes map
- average_solve_time
- hint_usage_rate
- last_active_date

### Daily challenge model
Store:

- date
- question_id
- category
- difficulty
- active flag
- assigned_users if needed

---

## Frontend Requirements

### Layout
The PyTorch Gym page should have a focused three-panel layout.

#### Left panel
- Problem statement
- Constraints
- Examples
- Concept tags
- Hints section
- Progress indicators

#### Center panel
- Monaco editor
- Run button
- Submit button
- Reset button
- Starter code loader
- Language fixed to Python for this mode

#### Right panel
- AI feedback panel
- Tensor shape visualization placeholder
- Test summary
- Weakness notes
- Mastery/progress summary

### UX requirements
- Responsive layout
- Dark developer-style theme
- Minimal clutter
- Clear hierarchy
- Fast navigation between tasks
- Easy keyboard access
- Visible run and submit states
- Clear error messages

### Frontend do
- Make the task state explicit.
- Keep the editor and output visible without excessive scrolling.
- Show only the necessary information initially.
- Reveal hints progressively.
- Use clean cards and spacing.

### Frontend do not
- Do not bury the problem statement in a sidebar that is hard to find.
- Do not use modal overload.
- Do not auto-expand all hints.
- Do not make the page look like a generic blog article.
- Do not hide execution feedback.

---

## Execution Environment Requirements
PyTorch code must run in a restricted sandbox.

### Execution must support
- Python code only for PyTorch Gym
- stdout capture
- stderr capture
- timeout control
- memory limits
- safe hidden-test execution
- return structured results
- deterministic evaluation as much as possible

### Security requirements
- No unrestricted filesystem access
- No internet access
- No arbitrary shell access
- No access to host environment
- No ability to escape sandbox via imports or subprocess tricks
- Use container isolation or equivalent

### Execution do
- Preinstall PyTorch and required scientific libraries in the execution image.
- Return output in JSON format.
- Validate hidden tests separately from visible tests.
- Keep execution time short.

### Execution do not
- Do not run user code directly on the main backend process.
- Do not expose internal paths or secrets.
- Do not allow unrestricted package installation during execution.
- Do not depend on client-side execution for PyTorch tasks.

---

## AI Hint System Requirements
Gemini should be used as a guide, not an answer dump.

### Hint levels
Each question should support layered hints:

1. Conceptual hint
2. API hint
3. Implementation hint
4. Near-solution hint

### Hint behavior
- If the user struggles, hints should become more specific.
- Hints should be short and targeted.
- Hints must not reveal the full final solution immediately.
- Hints should adapt to the detected mistake.

### Mistake detection categories
The AI should recognize common failure types:

- shape mismatch
- wrong dimension ordering
- wrong broadcasting assumptions
- incorrect use of `view` vs `reshape`
- incorrect `permute`
- detached graph issues
- device mismatch
- wrong optimizer usage
- incorrect loss usage
- broken batching
- wrong tensor type or dtype

### AI do
- Keep prompts consistent and structured.
- Ask Gemini to explain the mistake in educational language.
- Prefer feedback that teaches the concept behind the error.

### AI do not
- Do not ask Gemini to solve the entire task first.
- Do not let Gemini fabricate hidden tests.
- Do not trust Gemini output without post-processing.
- Do not return long generic paragraphs when a short precise hint is sufficient.

---

## Question Generation Strategy
Do not make the system depend entirely on live generation.

### Correct approach
1. Maintain a curated seed bank of PyTorch exercises.
2. Use Gemini only to generate variations, hints, explanations, and feedback.
3. Use analytics to decide what exercises to surface next.
4. Rotate difficulty and categories.
5. Reuse concepts with new surface forms.

### Incorrect approach
- Generating every question from scratch at runtime.
- Allowing inconsistent quality.
- Letting the model invent unverified test logic.

---

## Recommended Build Phases

### Phase 1: Integrate the new module shell
Goal: Add the PyTorch Gym route, page layout, and navigation.

Deliverables:
- New route
- New page
- Task selector UI
- Placeholder panels
- Working editor shell

### Phase 2: Add static question data
Goal: Load questions from the database or seed file.

Deliverables:
- Question schema
- Seed questions
- Question fetching API
- Exercise cards

### Phase 3: Add execution and validation
Goal: Run Python/PyTorch code and compare outputs.

Deliverables:
- Sandbox execution
- Visible tests
- Hidden tests
- Structured results

### Phase 4: Add hinting and AI feedback
Goal: Make the app educational.

Deliverables:
- Layered hints
- Mistake detection
- Feedback panel
- Explanation generation

### Phase 5: Add daily challenge and progress tracking
Goal: Make practice recurring.

Deliverables:
- Daily challenge assignment
- Streak tracking
- Progress history
- Weakness analytics

### Phase 6: Add advanced learning modes
Goal: Expand beyond tensor drills.

Deliverables:
- Debugging mode
- Architecture reconstruction mode
- Shape prediction mode
- Training-loop mode

---

## MVP Scope
The first usable version should only include:

- Tensor drills
- Debugging exercises
- Basic hint system
- Code execution
- Visible tests
- Progress tracking

Do not start with full transformer reconstruction or advanced analytics before the MVP works.

---

## Priority Order
Implement in this order:

1. Route and UI shell
2. Question schema and storage
3. Sandbox execution
4. Test evaluation
5. Hint system
6. Daily challenge system
7. Progress tracking
8. Debugging mode
9. Architecture reconstruction mode
10. Analytics and adaptive recommendations

---

## Acceptance Criteria
The feature is complete only when all of the following are true:

- Users can open the PyTorch Gym section.
- Users can solve at least one task end-to-end.
- Code runs in a safe isolated environment.
- Visible tests and hidden tests both work.
- Hints are generated in layers.
- Progress is saved.
- Daily challenge selection works.
- The UI is responsive and understandable.
- The existing compiler functionality remains intact.

---

## Non-Goals for the First Version
Do not attempt these in the first build:

- Multi-language PyTorch support
- Collaborative solving
- Social feed
- Leaderboards with complex ranking systems
- Full authentication redesign
- Advanced model serving infrastructure
- Large-scale recommendation engine
- Mobile app version
- Real-time multiplayer coding

---

## Implementation Dos and Don’ts Summary

### Do
- Build a stable core first.
- Store questions cleanly.
- Keep execution isolated.
- Use Gemini strategically.
- Track user progress.
- Keep exercises short and focused.
- Make the system easy to extend.

### Don’t
- Don’t overbuild UI effects before functionality works.
- Don’t let AI decide everything.
- Don’t ship without sandboxing.
- Don’t combine too many learning modes in the MVP.
- Don’t make the experience dependent on long tutorials.
- Don’t create a feature that is impressive but unusable in short sessions.

---

## Final Product Definition
The final result should feel like a PyTorch practice engine embedded inside the current compiler, not a separate tutorial website.

The user should be able to return for a few minutes, complete one exercise, receive feedback, and leave with a clearer understanding of PyTorch.

That is the core product.
