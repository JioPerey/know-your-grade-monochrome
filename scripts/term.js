const GRADE_WEIGHTS = Object.freeze({
  LECTURE: 0.60,
  LABORATORY: 0.40
});

const d = document;

const termGradeSection = d.getElementById("termGradeSection");
const arrowUpIcon = d.getElementById("arrowUpIcon");

if (arrowUpIcon && termGradeSection) {
  arrowUpIcon.addEventListener("click", () => {
    termGradeSection.scrollIntoView({
      behavior: "smooth",
      block: "center" 
    });
  });
}

// Input Fields
const lecGradeInput = d.getElementById("lecGradeInput");
const labGradeInput = d.getElementById("labGradeInput");
const termGradeError = d.getElementById("termGradeError");

// Buttons
const clearTermGradeFieldsBtn = d.getElementById("clearTermGradeFieldsBtn");
const estimateTermGradeBtn = d.getElementById("estimateTermGradeBtn");

// Grade Breakdown Fields
const outputSection = d.getElementById("outputSection");
const gradeBreakdownSection = d.getElementById("gradeBreakdownSection");
const weightedGrade = d.getElementById("weightedGrade");
const pointGrade = d.getElementById("pointGrade");
const remarks = d.getElementById("remarks");

const lecGradeField = d.getElementById("lecGradeField");
const lecGradeWeightField = d.getElementById("lecGradeWeightField");
const labGradeField = d.getElementById("labGradeField");
const labGradeWeightField = d.getElementById("labGradeWeightField");
const totalWeightedGradeField = d.getElementById("totalWeightedGradeField");

// Grading System Section
const gradingSystemSection = d.getElementById("termGradingSystem");

clearTermGradeFieldsBtn.addEventListener("click", clearTermGradeFields);
estimateTermGradeBtn.addEventListener("click", estimateTermGrade);

function clearTermGradeErrors() {
  hideError(termGradeError);
}

function clearTermGradeFields() {
  outputSection.classList.remove("is-visible");
  lecGradeInput.value = "";
  labGradeInput.value = "";
  lecGradeInput.focus();
  clearTermGradeErrors();
}

function estimateTermGrade() {
  clearTermGradeErrors();
  outputSection.classList.remove("is-visible");

  const lec = validateGradeInput(lecGradeInput, "Lecture");
  if (!lec.valid) {
    return showError(termGradeError, lec.error);
  }

  const lab = validateGradeInput(labGradeInput, "Laboratory");
  if (!lab.valid) {
    return showError(termGradeError, lab.error);
  }

  const lecWeighted = lec.value * GRADE_WEIGHTS.LECTURE;
  const labWeighted = lab.value * GRADE_WEIGHTS.LABORATORY;
  const total = lecWeighted + labWeighted;

  remarks.classList.remove("failed");

  lecGradeField.textContent = lec.value.toFixed(2);
  lecGradeWeightField.textContent = `${lecWeighted.toFixed(2)}%`;

  labGradeField.textContent = lab.value.toFixed(2);
  labGradeWeightField.textContent = `${labWeighted.toFixed(2)}%`;

  totalWeightedGradeField.textContent = `${total.toFixed(2)}%`;
  weightedGrade.textContent = total.toFixed(2);

  pointGrade.textContent = getGradeEquivalent(total);
  remarks.textContent = getGradeRemarks(remarks, total);
  renderGradingSystem(gradingSystemSection);
  outputSection.classList.add("is-visible");
  gradeBreakdownSection.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
}