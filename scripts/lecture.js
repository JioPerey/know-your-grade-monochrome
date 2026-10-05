const GRADE_WEIGHTS = Object.freeze({
  LEC_EXAM: 0.50,
  QUIZZES: 0.20,
  TASKS: 0.20,
  PARTICIPATION: 0.10
});

const d = document;

const lecQuizzesSection = d.getElementById("lecQuizzesSection");
const arrowUpIcon = d.getElementById("arrowUpIcon");

if (arrowUpIcon && lecQuizzesSection) {
  arrowUpIcon.addEventListener("click", () => {
    lecQuizzesSection.scrollIntoView({ behavior: "smooth", block: "center" });
  });
}

// Input Fields
const quiz1ScoreInput = d.getElementById("quiz1ScoreInput");
const quiz1HPSInput = d.getElementById("quiz1HPSInput");
const quiz2ScoreInput = d.getElementById("quiz2ScoreInput");
const quiz2HPSInput = d.getElementById("quiz2HPSInput");

const task1ScoreInput = d.getElementById("task1ScoreInput");
const task1HPSInput = d.getElementById("task1HPSInput");

const participationScoreInput = d.getElementById("participationScoreInput");
const participationHPSInput = d.getElementById("participationHPSInput");

const lecExamScoreInput = d.getElementById("lecExamScoreInput");
const lecExamHPSInput = d.getElementById("lecExamHPSInput");

const clearBtn = d.getElementById("clearBtn");
const estimateLecGradeBtn = d.getElementById("estimateLecGradeBtn");

const quizzesError = d.getElementById("quizzesError");
const task1Error = d.getElementById("task1Error");
const participationError = d.getElementById("participationError");
const lecExamError = d.getElementById("lecExamError");

// Buttons
clearBtn.addEventListener("click", clearFields);
estimateLecGradeBtn.addEventListener("click", estimateLecGrade);

// Grade Breakdown Fields
const quiz1Score = d.getElementById("quiz1Score");
const quiz1HPS = d.getElementById("quiz1HPS");
const quiz2Score = d.getElementById("quiz2Score");
const quiz2HPS = d.getElementById("quiz2HPS");
const quizzesWeightField = d.getElementById("quizzesWeightField");

const task1Score = d.getElementById("task1Score");
const task1HPS = d.getElementById("task1HPS");
const tasksWeightField = d.getElementById("tasksWeightField");

const participationScore = d.getElementById("participationScore");
const participationHPS = d.getElementById("participationHPS");
const participationWeightField = d.getElementById("participationWeightField");

const lecExamScore = d.getElementById("lecExamScore");
const lecExamHPS = d.getElementById("lecExamHPS");
const lecExamWeightField = d.getElementById("lecExamWeightField");

const totalWeightedGradeField = d.getElementById("totalWeightedGradeField");

// Grading System Section
const gradingSystemSection = d.getElementById("lecGradingSystem");

const outputSection = d.getElementById("outputSection");
const gradeBreakdownSection = d.getElementById("gradeBreakdownSection");

const weightedGrade = d.getElementById("weightedGrade");
const pointGrade = d.getElementById("pointGrade");
const remarks = d.getElementById("remarks");

function clearAllErrors() {
  [lecExamError, quizzesError, task1Error, participationError].forEach(hideError);
}

function clearFields() {
  outputSection.classList.remove("is-visible");
  lecExamScoreInput.value = "";
  lecExamHPSInput.value = "";
  quiz1ScoreInput.value = "";
  quiz1HPSInput.value = "";
  quiz2ScoreInput.value = "";
  quiz2HPSInput.value = "";
  task1ScoreInput.value = "";
  task1HPSInput.value = "";
  participationScoreInput.value = "";
  participationHPSInput.value = "";
  quiz1ScoreInput.focus();
  clearAllErrors();
}

function estimateLecGrade() {
  clearAllErrors();
  outputSection.classList.remove("is-visible");

  const quiz1 = validateInputPair(quiz1ScoreInput, quiz1HPSInput, "Quiz 1", quizzesError);
  if (!quiz1.valid) {
    return showError(quiz1.errorElement, quiz1.error);
  }

  const quiz2 = validateInputPair(quiz2ScoreInput, quiz2HPSInput, "Quiz 2", quizzesError);
  if (!quiz2.valid) {
    return showError(quiz2.errorElement, quiz2.error);
  }

  const task1 = validateInputPair(task1ScoreInput, task1HPSInput, "Assessment Task 1", task1Error);
  if (!task1.valid) {
    return showError(task1.errorElement, task1.error);
  }

  const participation = validateInputPair(participationScoreInput, participationHPSInput, "Participation", participationError);
  if (!participation.valid) {
    return showError(participation.errorElement, participation.error);
  }

  const lecExam = validateInputPair(lecExamScoreInput, lecExamHPSInput, "Lecture Exam", lecExamError);
  if (!lecExam.valid) {
    return showError(lecExam.errorElement, lecExam.error);
  }

  const lecExamWeight = (lecExam.score / lecExam.hps) * (GRADE_WEIGHTS.LEC_EXAM * 100);
  const quizzesWeight = ((quiz1.score + quiz2.score) / (quiz1.hps + quiz2.hps)) * (GRADE_WEIGHTS.QUIZZES * 100);
  const tasksWeight = (task1.score / task1.hps) * (GRADE_WEIGHTS.TASKS * 100);
  const participationWeight = (participation.score / participation.hps) * (GRADE_WEIGHTS.PARTICIPATION * 100);
  const totalWeightedGrade = lecExamWeight + quizzesWeight + tasksWeight + participationWeight;

  remarks.classList.remove("failed");

  lecExamScore.textContent = lecExam.score;
  lecExamHPS.textContent = lecExam.hps;
  lecExamWeightField.textContent = `${lecExamWeight.toFixed(2)}%`;

  quiz1Score.textContent = quiz1.score;
  quiz1HPS.textContent = quiz1.hps;
  quiz2Score.textContent = quiz2.score;
  quiz2HPS.textContent = quiz2.hps;
  quizzesWeightField.textContent = `${quizzesWeight.toFixed(2)}%`;

  task1Score.textContent = task1.score;
  task1HPS.textContent = task1.hps;
  tasksWeightField.textContent = `${tasksWeight.toFixed(2)}%`;

  participationScore.textContent = participation.score;
  participationHPS.textContent = participation.hps;
  participationWeightField.textContent = `${participationWeight.toFixed(2)}%`;

  totalWeightedGradeField.textContent = `${totalWeightedGrade.toFixed(2)}%`;
  weightedGrade.textContent = totalWeightedGrade.toFixed(2);

  pointGrade.textContent = getGradeEquivalent(totalWeightedGrade);
  remarks.textContent = getGradeRemarks(remarks, totalWeightedGrade);
  renderGradingSystem(gradingSystemSection);
  outputSection.classList.add("is-visible");
  gradeBreakdownSection.scrollIntoView({ behavior: "smooth", block: "center" });
}