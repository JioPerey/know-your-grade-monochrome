const GRADE_WEIGHTS = Object.freeze({
  PRELIM: 0.30,
  MIDTERM: 0.30,
  FINALS: 0.40
});

const d = document;

const arrowUpIcon = document.getElementById("arrowUpIcon");
const semGradeSection = document.getElementById("semGradeSection");

if (arrowUpIcon && semGradeSection) {
  arrowUpIcon.addEventListener("click", () => {
    semGradeSection.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  });
}

// Input fields
const prelimGradeInput = document.getElementById("prelimGradeInput");
const midtermGradeInput = document.getElementById("midtermGradeInput");
const finalsGradeInput = document.getElementById("finalsGradeInput");
const semGradeError = d.getElementById("semGradeError");

// Buttons
const clearSemGradeFieldsBtn = document.getElementById("clearSemGradeFieldsBtn");
const estimateSemGradeBtn = document.getElementById("estimateSemGradeBtn");

// Grade Breakdown Fields
const outputSection = d.getElementById("outputSection");
const gradeBreakdownSection = d.getElementById("gradeBreakdownSection");
const weightedGrade = d.getElementById("weightedGrade");
const pointGrade = d.getElementById("pointGrade");
const remarks = d.getElementById("remarks");

const prelimGradeField = d.getElementById("prelimGradeField");
const prelimGradeWeightField = d.getElementById("prelimGradeWeightField");
const midtermGradeField = d.getElementById("midtermGradeField");
const midtermGradeWeightField = d.getElementById("midtermGradeWeightField");
const finalsGradeField = d.getElementById("finalsGradeField");
const finalsGradeWeightField = d.getElementById("finalsGradeWeightField");
const totalWeightedGradeField = d.getElementById("totalWeightedGradeField");

// Grading System Section
const gradingSystemSection = d.getElementById("semGradingSystem");

clearSemGradeFieldsBtn.addEventListener("click", clearSemGradeFields);
estimateSemGradeBtn.addEventListener("click", estimateSemGrade);

function clearSemGradeErrors() {
  hideError(semGradeError);
}

function clearSemGradeFields() {
  outputSection.classList.remove("is-visible");
  prelimGradeInput.value = "";
  midtermGradeInput.value = "";
  finalsGradeInput.value = "";
  prelimGradeInput.focus();
  clearSemGradeErrors();
}

function estimateSemGrade() {
  clearSemGradeErrors();
  outputSection.classList.remove("is-visible");

  const prelim = validateGradeInput(prelimGradeInput, "Prelim");
  if (!prelim.valid) {
    return showError(semGradeError, prelim.error);
  }

  const midterm = validateGradeInput(midtermGradeInput, "Midterm");
  if (!midterm.valid) {
    return showError(semGradeError, midterm.error);
  }

  const finals = validateGradeInput(finalsGradeInput, "Finals");
  if (!finals.valid) {
    return showError(semGradeError, finals.error);
  }

  const prelimWeighted = prelim.value * GRADE_WEIGHTS.PRELIM;
  const midtermWeigted = midterm.value * GRADE_WEIGHTS.MIDTERM;
  const finalsWeighted = finals.value * GRADE_WEIGHTS.FINALS;
  const total = prelimWeighted + midtermWeigted + finalsWeighted;

  remarks.classList.remove("failed");

  prelimGradeField.textContent = prelim.value.toFixed(2);
  prelimGradeWeightField.textContent = `${prelimWeighted.toFixed(2)}%`;

  midtermGradeField.textContent = midterm.value.toFixed(2);
  midtermGradeWeightField.textContent = `${midtermWeigted.toFixed(2)}%`;

  finalsGradeField.textContent = finals.value.toFixed(2);
  finalsGradeWeightField.textContent = `${finalsWeighted.toFixed(2)}%`;

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