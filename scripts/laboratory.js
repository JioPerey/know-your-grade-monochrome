const GRADE_WEIGHTS = Object.freeze({
  LAB_EXCERCISES: 0.40,
  LAB_EXAM: 0.60
});

const d = document;

const labQuizzesSection = d.getElementById("labQuizzesSection");
const arrowUpIcon = d.getElementById("arrowUpIcon");

if (arrowUpIcon && labQuizzesSection) {
  arrowUpIcon.addEventListener("click", () => {
    labQuizzesSection.scrollIntoView({ behavior: "smooth", block: "center" });
  });
}

// Input Fields
const labQuiz1ScoreInput = d.getElementById("labQuiz1ScoreInput");
const labQuiz1HPSInput = d.getElementById("labQuiz1HPSInput");
const labQuiz2ScoreInput = d.getElementById("labQuiz2ScoreInput");
const labQuiz2HPSInput = d.getElementById("labQuiz2HPSInput");
const labQuizError = d.getElementById("labQuizError");

const labExamScoreInput = d.getElementById("labExamScoreInput");
const labExamHPSInput = d.getElementById("labExamHPSInput");
const labExamError = d.getElementById("labExamError");

const clearLabFieldsBtn = d.getElementById("clearLabFieldsBtn");
const estimateLabGradeBtn = d.getElementById("estimateLabGradeBtn");

// Grade Breakdown Fields
const outputSection = d.getElementById("outputSection");
const gradeBreakdownSection = d.getElementById("gradeBreakdownSection");
const weightedGrade = d.getElementById("weightedGrade");
const pointGrade = d.getElementById("pointGrade");
const remarks = d.getElementById("remarks");

const labExamScoreField = d.getElementById("labExamScoreField");
const labExamHPSField = d.getElementById("labExamHPSField");
const labExamWeightField = d.getElementById("labExamWeightField");

const labQuiz1ScoreField = d.getElementById("labQuiz1ScoreField");
const labQuiz1HPSField = d.getElementById("labQuiz1HPSField");
const labQuiz2ScoreField = d.getElementById("labQuiz2ScoreField");
const labQuiz2HPSField = d.getElementById("labQuiz2HPSField");
const labExercisesWeightField = d.getElementById("labExercisesWeightField");

const totalWeightedGradeField = d.getElementById("totalWeightedGradeField");

// Grading System Section
const gradingSystemSection = d.getElementById("labGradingSystem");

// Buttons
clearLabFieldsBtn.addEventListener("click", clearLabFields);
estimateLabGradeBtn.addEventListener("click", estimateLabGrade);

function clearLabErrors() {
  [labExamError, labQuizError].forEach(hideError);
}

function clearLabFields() {
  outputSection.classList.remove("is-visible");
  labExamScoreInput.value = "";
  labExamHPSInput.value = "";
  labQuiz1ScoreInput.value = "";
  labQuiz1HPSInput.value = "";
  labQuiz2ScoreInput.value = "";
  labQuiz2HPSInput.value = "";
  labQuiz1ScoreInput.focus();
  clearLabErrors();
}

function estimateLabGrade() {
  clearLabErrors();
  outputSection.classList.remove("is-visible");

  const labQuiz1 = validateInputPair(labQuiz1ScoreInput, labQuiz1HPSInput, "Lab Quiz 1", labQuizError);
  if (!labQuiz1.valid) {
    return showError(labQuiz1.errorElement, labQuiz1.error);
  }

  const labQuiz2 = validateInputPair(labQuiz2ScoreInput, labQuiz2HPSInput, "Lab Quiz 2", labQuizError);
  if (!labQuiz2.valid) {
    return showError(labQuiz2.errorElement, labQuiz2.error);
  }

  const labExam = validateInputPair(labExamScoreInput, labExamHPSInput, "Laboratory Exam", labExamError);
  if (!labExam.valid) {
    return showError(labExam.errorElement, labExam.error);
  }

  const labExamWeight = (labExam.score / labExam.hps) * (GRADE_WEIGHTS.LAB_EXAM * 100);
  const labExercisesWeight = ((labQuiz1.score + labQuiz2.score) / (labQuiz1.hps + labQuiz2.hps)) * (GRADE_WEIGHTS.LAB_EXCERCISES * 100);
  const totalWeightedGrade = labExamWeight + labExercisesWeight;

  remarks.classList.remove("failed");

  labExamScoreField.textContent = labExam.score;
  labExamHPSField.textContent = labExam.hps;
  labExamWeightField.textContent = `${labExamWeight.toFixed(2)}%`;

  labQuiz1ScoreField.textContent = labQuiz1.score;
  labQuiz1HPSField.textContent = labQuiz1.hps;
  labQuiz2ScoreField.textContent = labQuiz2.score;
  labQuiz2HPSField.textContent = labQuiz2.hps;
  labExercisesWeightField.textContent = `${labExercisesWeight.toFixed(2)}%`;

  totalWeightedGradeField.textContent = `${totalWeightedGrade.toFixed(2)}%`;
  weightedGrade.textContent = totalWeightedGrade.toFixed(2);

  pointGrade.textContent = getGradeEquivalent(totalWeightedGrade);
  remarks.textContent = getGradeRemarks(remarks, totalWeightedGrade);
  renderGradingSystem(gradingSystemSection);
  outputSection.classList.add("is-visible");
  gradeBreakdownSection.scrollIntoView({ behavior: "smooth", block: "center" });
}