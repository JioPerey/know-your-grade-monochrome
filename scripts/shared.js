// Collapsible Sidebar Function
(function() {
  const sidebar = document.getElementById("sidebar");
  const backdrop = document.getElementById("sidebarBackdrop");
  const hamburger = document.getElementById("hamburgerBtn");

  function isDesktop() {
    return window.matchMedia("(min-width: 1200px)").matches;
  }

  function openSidebar() {
    sidebar.classList.add("sidebar-open");
    hamburger.classList.add("is-open");

    if (isDesktop()) {
      document.body.classList.add("sidebar-expanded");
    } else {
      document.body.style.overflow = "hidden";
      backdrop.classList.add("is-visible");
    }
  }

  function closeSidebar() {
    sidebar.classList.remove("sidebar-open");
    hamburger.classList.remove("is-open");
    document.body.classList.remove("sidebar-expanded");
    document.body.style.overflow = "";
    backdrop.classList.remove("is-visible");
  }

  hamburger.addEventListener("click", function() {
    sidebar.classList.contains("sidebar-open") ? closeSidebar() : openSidebar();
  });

  backdrop.addEventListener("click", closeSidebar);

  document.addEventListener("keydown", function(e) {
    if (e.key === "Escape" && sidebar.classList.contains("sidebar-open")) {
      closeSidebar();
    }
  });

  window.addEventListener("resize", function() {
    if (!sidebar.classList.contains("sidebar-open")) {
      return;
    }

    if (isDesktop()) {
      document.body.classList.add("sidebar-expanded");
      document.body.style.overflow = "";
      backdrop.classList.remove("is-visible");
    } else {
      document.body.classList.remove("sidebar-expanded");
      document.body.style.overflow = "hidden";
      backdrop.classList.add("is-visible");
    }
  })
})();

function validateInputPair(scoreInput, hpsInput, sectionName, errorElement) {
  const score = scoreInput.valueAsNumber;
  const hps = hpsInput.valueAsNumber;

  if (Number.isNaN(score) || Number.isNaN(hps)) {
    return {
      valid: false,
      error: `Please fill out both fields for ${sectionName}.`,
      errorElement
    };
  }

  if (hps <= 0) {
    return {
      valid: false,
      error: `Max Score for ${sectionName} must be greater than 0.`,
      errorElement
    };
  }

  if (score < 0) {
    return {
      valid: false,
      error: `Score for ${sectionName} cannot be negative.`,
      errorElement
    };
  }

  if (score > hps) {
    return {
      valid: false,
      error: `Score for ${sectionName} cannot exceed its max score.`,
      errorElement
    };
  }

  return {
    valid: true,
    score,
    hps
  };
}

function showError(element, message) {
  element.textContent = message;
  element.style.display = "block";
  element.scrollIntoView({ behavior: "smooth", block: "center" });
}

function hideError(element) {
  element.textContent = "";
  element.style.display = "none";
}

function getGradeEquivalent(estimatedGrade) {
  if (estimatedGrade > 100) {
    return "Grade cannot be greater than 100.";
  } else if (estimatedGrade >= 96) {
    return "1.00";
  } else if (estimatedGrade >= 92) {
    return "1.25";
  } else if (estimatedGrade >= 88) {
    return "1.50";
  } else if (estimatedGrade >= 84) {
    return "1.75";
  } else if (estimatedGrade >= 80) {
    return "2.00";
  } else if (estimatedGrade >= 75) {
    return "2.25";
  } else if (estimatedGrade >= 70) {
    return "2.50";
  } else if (estimatedGrade >= 65) {
    return "2.75";
  } else if (estimatedGrade >= 60) {
    return "3.00";
  } else if (estimatedGrade >= 0) {
    return "5.00";
  } else {
    return "Grade cannot be negative.";
  }
}

function getGradeRemarks(remarksElement, estimatedGrade) {
  if (estimatedGrade > 100 || estimatedGrade < 0) {
    return "Invalid grade";
  }

  if (estimatedGrade >= 60) {
    return "PASSED";
  }

  remarksElement.classList.add("failed");
  return "FAILED";
}

function validateGradeInput(input, label) {
  const value = input.valueAsNumber;

  if (Number.isNaN(value)) {
    return { 
      valid: false, 
      error: `Please enter your ${label} grade.`
    };
  }

  if (value < 0) {
    return {
      valid: false,
      error: `${label} grade cannot be negative.`
    };
  }

  if (value > 100) {
    return {
      valid: false,
      error: `${label} grade cannot exceed 100.`
    };
  }

  return {
    valid: true,
    value 
  };
}

function renderGradingSystem(gradingSystemSection) {
  gradingSystemSection.innerHTML = 
  ` 
    <h2>Grading System</h2>
    <div class="card">
      <table>     
        <thead>
          <tr>
            <th>Grade Range</th>
            <th>Point Grade</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>100 - 96</td>
            <td>1.00</td>
            <td>PASSED</td>
          </tr>
          <tr>
            <td>95 - 92</td>
            <td>1.25</td>
            <td>PASSED</td>
          </tr>
          <tr>
            <td>91 - 88</td>
            <td>1.50</td>
            <td>PASSED</td>
          </tr>
          <tr>
            <td>87 - 84</td>
            <td>1.75</td>
            <td>PASSED</td>
          </tr>
          <tr>
            <td>83 - 80</td>
            <td>2.00</td>
            <td>PASSED</td>
          </tr>
          <tr>
            <td>79 - 75</td>
            <td>2.25</td>
            <td>PASSED</td>
          </tr>
          <tr>
            <td>74 - 70</td>
            <td>2.50</td>
            <td>PASSED</td>
          </tr>
          <tr>
            <td>69 - 65</td>
            <td>2.75</td>
            <td>PASSED</td>
          </tr>
          <tr>
            <td>64 - 60</td>
            <td>3.00</td>
            <td>PASSED</td>
          </tr>
          <tr class="failed-row">
            <td>59 - 0</td>
            <td>5.00</td>
            <td>FAILED</td>
          </tr>
          <tr class="muted-row">
            <td colspan="2">Incomplete</td>
            <td>INC</td>
          </tr>
          <tr class="muted-row">
            <td colspan="2">Officially Dropped</td>
            <td>OD</td>
          </tr>
          <tr class="muted-row">
            <td colspan="2">Unofficially Dropped</td>
            <td>UD</td>
          </tr>
        </tbody>
      </table>
    </div>
  `
}

// Scroll Animation Observer
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.10});

document.querySelectorAll(".reveal").forEach(element => revealObserver.observe(element));

// Theme toggle function
(function () {
  const THEME_KEY = "kyg-preferred-theme";
  const root = document.documentElement;
  const themeToggleBtn = document.getElementById("themeToggleBtn");

  if (!themeToggleBtn) return;

  function syncToggleUI() {
    const isDark = root.classList.contains("is-dark-theme");
    themeToggleBtn.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
  }

  syncToggleUI();

  function applyToggle() {
    root.classList.toggle("is-dark-theme");
    try {
      localStorage.setItem(THEME_KEY, root.classList.contains("is-dark-theme") ? "dark" : "light");
    } catch (e) {}
    syncToggleUI();
  }

  themeToggleBtn.addEventListener("click", (event) => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Circular reveal expanding from the click point (where supported)
    if (!document.startViewTransition || reduceMotion) {
      applyToggle();
      return;
    }

    const rect = themeToggleBtn.getBoundingClientRect();
    const x = event.clientX || rect.left + rect.width / 2;
    const y = event.clientY || rect.top + rect.height / 2;
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = document.startViewTransition(applyToggle);
    transition.ready.then(() => {
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 540, easing: "cubic-bezier(0.16, 1, 0.3, 1)", pseudoElement: "::view-transition-new(root)" }
      );
    }).catch(() => {});
  });
})();
