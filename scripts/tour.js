(function () {
  "use strict";

  const TOUR_SEEN_STORAGE_KEY = "kyg-tour-seen-v1";
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function selectElement(selector) {
    return document.querySelector(selector);
  }

  const sidebar = selectElement("#sidebar");
  const hamburgerButton = selectElement("#hamburgerBtn");
  const themeToggleButton = selectElement("#themeToggleBtn");

  if (!sidebar || !hamburgerButton || !themeToggleButton) {
    return;
  }

  /* Typing speed settings. All values are in milliseconds. */
  const TYPING_BASE_DELAY = 28;
  const TYPING_RANDOM_EXTRA_DELAY = 22;
  const TYPING_PUNCTUATION_PAUSE = 110;
  const COMPACT_BUBBLE_DISPLAY_TIME = 450;

  /* Sample data for the demo. Each page has its own set of fields. */
  const DEMO_CONFIGURATIONS = [
    {
      // Lecture page
      probe: "#quiz1ScoreInput",
      introMessage:
        "Now a quick demo with sample scores. Quizzes are out of 30, the assessment task is out of 100, participation is out of 10 and the lecture exam is out of 70.",
      fields: [
        ["#quiz1ScoreInput", "26"],
        ["#quiz1HPSInput", "30"],
        ["#quiz2ScoreInput", "28"],
        ["#quiz2HPSInput", "30"],
        ["#task1ScoreInput", "92"],
        ["#task1HPSInput", "100"],
        ["#participationScoreInput", "9"],
        ["#participationHPSInput", "10"],
        ["#lecExamScoreInput", "58"],
        ["#lecExamHPSInput", "70"]
      ]
    },
    {
      // Laboratory page
      probe: "#labQuiz1ScoreInput",
      introMessage:
        "Now a quick demo with sample lab scores. Lab quizzes are out of 30 and the laboratory exam is out of 100.",
      fields: [
        ["#labQuiz1ScoreInput", "27"],
        ["#labQuiz1HPSInput", "30"],
        ["#labQuiz2ScoreInput", "25"],
        ["#labQuiz2HPSInput", "30"],
        ["#labExamScoreInput", "80"],
        ["#labExamHPSInput", "100"]
      ]
    },
    {
      // Term page
      probe: "#lecGradeInput",
      introMessage:
        "Now a quick demo with sample grades. I will enter 88 for lecture and 92 for laboratory.",
      fields: [
        ["#lecGradeInput", "88"],
        ["#labGradeInput", "92"]
      ]
    },
    {
      // Semestral page
      probe: "#prelimGradeInput",
      introMessage:
        "Now a quick demo with sample grades. I will enter 85 for prelim, 88 for midterm and 90 for finals.",
      fields: [
        ["#prelimGradeInput", "85"],
        ["#midtermGradeInput", "88"],
        ["#finalsGradeInput", "90"]
      ]
    }
  ];

  // This is the button that lets the visitor replay the tour.
  const replayTourButton = document.createElement("button");
  replayTourButton.type = "button";
  replayTourButton.className = "tour-btn";
  replayTourButton.textContent = "tour";
  replayTourButton.setAttribute("aria-label", "Replay the guided tour");
  themeToggleButton.before(replayTourButton);

  function isSidebarOpen() {
    return sidebar.classList.contains("sidebar-open");
  }

  /*
    How long the message stays on screen after it is fully typed.
    Longer messages stay a little longer so they can be read.
  */
  function getReadingTime(message) {
    return Math.min(9000, 2200 + message.length * 45);
  }

  /* Every step of the tour. */
  function buildTourSteps() {
    const demoConfiguration = DEMO_CONFIGURATIONS.find(function (configuration) {
      return selectElement(configuration.probe);
    });

    async function closeSidebarIfWeOpenedIt(tourSession) {
      if (tourSession.openedSidebar && isSidebarOpen()) {
        hamburgerButton.click();
        tourSession.openedSidebar = false;
        await waitForTime(tourSession, prefersReducedMotion ? 0 : 450);
      }
    }

    const steps = [
      {
        selector: ".page-title",
        useTextRange: true,
        text: "Hi, I'm Jio Perey, the developer of kyg.com. KYG is short for Know Your Grade."
      },
      {
        selector: ".university-name",
        useTextRange: true,
        text: "This calculator is exclusively built for University of Cabuyao students."
      },
      {
        selector: "#hamburgerBtn",
        showRippleOnArrive: true,
        text: "This menu holds all four calculators. Let me open it and show you what each one is for.",
        afterMessage: async function (tourSession) {
          if (!isSidebarOpen()) {
            hamburgerButton.click();
            tourSession.openedSidebar = true;
            await waitForTime(tourSession, prefersReducedMotion ? 0 : 500);
          }
        }
      },
      {
        selector: '.sidebar .nav-link[href="index.html"]',
        text: "Lecture is for computing your grade in the lecture-only course."
      },
      {
        selector: '.sidebar .nav-link[href="laboratory.html"]',
        text: "Laboratory is for computing your grade in the laboratory-only course."
      },
      {
        selector: '.sidebar .nav-link[href="term.html"]',
        text: "Term is for computing your term grade, which combines your lecture and laboratory grades."
      },
      {
        selector: '.sidebar .nav-link[href="semestral.html"]',
        text: "Semestral is for computing your semestral grade from your prelim, midterm and finals.",
        afterMessage: closeSidebarIfWeOpenedIt
      },
      {
        selector: "#themeToggleBtn",
        text: "Prefer a darker look? Switch between light and dark mode here. Your choice is remembered."
      },
      {
        selector: ".component-weight",
        text: "Each section shows how much it counts toward your final grade."
      }
    ];

    if (demoConfiguration) {
      steps.push(
        {
          selector: demoConfiguration.fields[0][0],
          text: demoConfiguration.introMessage
        },
        {
          kind: "fill",
          demoConfiguration: demoConfiguration,
          onlyWhenFound: demoConfiguration.probe
        },
        {
          selector: ".estimate-grade-btn",
          text: "Now I press Estimate Grade to compute the result.",
          afterMessage: async function (tourSession) {
            const estimateButton = selectElement(".estimate-grade-btn");
            const buttonRect = estimateButton.getBoundingClientRect();

            showRipple(
              buttonRect.left + buttonRect.width / 2,
              buttonRect.top + buttonRect.height / 2
            );
            estimateButton.click();
            await waitForTime(tourSession, prefersReducedMotion ? 300 : 2000);
          }
        },
        {
          selector: ".computed-grade-container",
          onlyWhenFound: ".estimate-grade-btn",
          text: "Here are your weighted grade, your point grade, and whether you passed or failed."
        },
        {
          selector: ".grade-breakdown-section table",
          onlyWhenFound: ".estimate-grade-btn",
          text: "This table breaks the result down component by component, so you can see where your points come from."
        },
        {
          selector: ".grading-system-section .card",
          onlyWhenFound: ".estimate-grade-btn",
          text: "And this is the grading system, showing how each grade range converts to a point grade."
        },
        {
          selector: ".clear-btn",
          text: "The Clear button wipes every field so you can start over with your real scores.",
          afterMessage: async function (tourSession) {
            const clearButton = selectElement(".clear-btn");
            const buttonRect = clearButton.getBoundingClientRect();

            showRipple(
              buttonRect.left + buttonRect.width / 2,
              buttonRect.top + buttonRect.height / 2
            );
            clearButton.click();
            restoreDemoValues(tourSession);
            await waitForTime(tourSession, prefersReducedMotion ? 300 : 1800);
          }
        }
      );
    }

    steps.push({
      selector: ".tour-btn",
      text: "That's the whole tour. Good luck with your grades! You can replay it any time from this button."
    });

    return steps.filter(function (step) {
      return selectElement(step.onlyWhenFound || step.selector);
    });
  }

  /* Helpers */

  /*
    A wait that can be interrupted.
    It finishes after the given time, or right away when
    the visitor presses next or the tour gets cancelled.
  */
  function waitForTime(tourSession, milliseconds) {
    return new Promise(function (resolve) {
      if (tourSession.cancelled) {
        resolve();
        return;
      }

      const timerId = setTimeout(finishWaiting, milliseconds);

      function finishWaiting() {
        clearTimeout(timerId);
        tourSession.advance = null;
        resolve();
      }

      tourSession.advance = finishWaiting;
    });
  }

  function createTourElements() {
    const cursor = document.createElement("div");
    cursor.className = "tour-cursor";
    cursor.setAttribute("aria-hidden", "true");
    cursor.innerHTML =
      '<svg viewBox="0 0 24 24"><path d="M4 2.5 20 11l-7.2 2.2L10 20.5z"/></svg>';

    const tip = document.createElement("div");
    tip.className = "tour-tip is-compact";
    tip.setAttribute("role", "status");
    tip.setAttribute("aria-live", "polite");
    tip.innerHTML =
      '<p class="tour-label">Jio Perey</p>' +
      '<p class="tour-text">' +
      '<span class="tour-typed"></span>' +
      '<span class="tour-caret"></span>' +
      "</p>" +
      '<div class="tour-foot">' +
      '<span class="tour-count"></span>' +
      '<span class="tour-actions">' +
      '<button type="button" class="tour-next">next</button>' +
      '<button type="button" class="tour-skip">skip</button>' +
      "</span>" +
      "</div>";

    // Once the height animation ends, let the browser size the bubble on its own again.
    tip.addEventListener("transitionend", function (event) {
      if (event.target === tip && event.propertyName === "height") {
        tip.style.height = "";
      }
    });

    document.body.append(cursor, tip);

    return {
      cursor: cursor,
      tip: tip,
      typedText: tip.querySelector(".tour-typed"),
      count: tip.querySelector(".tour-count"),
      nextButton: tip.querySelector(".tour-next"),
      skipButton: tip.querySelector(".tour-skip")
    };
  }

  function getPointerPosition(element, step) {
    if (step.useTextRange) {
      const textRange = document.createRange();
      textRange.selectNodeContents(element);
      const textRect = textRange.getBoundingClientRect();

      return {
        x: textRect.right + 4,
        y: textRect.top + textRect.height / 2
      };
    }

    const elementRect = element.getBoundingClientRect();

    // For tall blocks, point near the top so the cursor stays in view.
    if (elementRect.height > 220) {
      return {
        x: elementRect.left + elementRect.width / 2,
        y: elementRect.top + 48
      };
    }

    return {
      x: elementRect.left + elementRect.width / 2,
      y: elementRect.top + elementRect.height / 2
    };
  }

  /*
    Puts the bubble next to the cursor.
    The position is worked out using the final size of the bubble,
    so it never gets pushed off screen while it grows.
    When the bubble must flip to the left or above the cursor,
    it is pinned by its right or bottom edge instead.
    This makes it grow toward the open space and not jump around.
  */
  function placeTipBubble(tipBubble, pointerX, pointerY, finalWidth, finalHeight) {
    const viewportWidth = document.documentElement.clientWidth;
    const viewportHeight = document.documentElement.clientHeight;
    const edgeGap = 12;
    const preferredLeft = pointerX + 14;
    const preferredTop = pointerY + 22;
    const mustFlipToLeft = preferredLeft + finalWidth > viewportWidth - edgeGap;
    const mustFlipAbove = preferredTop + finalHeight > viewportHeight - edgeGap;

    tipBubble.style.left = "auto";
    tipBubble.style.right = "auto";
    tipBubble.style.top = "auto";
    tipBubble.style.bottom = "auto";

    if (mustFlipToLeft) {
      const leftEdge = Math.max(edgeGap, pointerX - finalWidth - 6);
      tipBubble.style.right = viewportWidth - leftEdge - finalWidth + "px";
    } else {
      tipBubble.style.left = preferredLeft + "px";
    }

    if (mustFlipAbove) {
      const topEdge = Math.max(edgeGap, pointerY - finalHeight - 16);
      tipBubble.style.bottom = viewportHeight - topEdge - finalHeight + "px";
    } else {
      tipBubble.style.top = preferredTop + "px";
    }

    const horizontalOrigin = mustFlipToLeft ? "right" : "left";
    const verticalOrigin = mustFlipAbove ? "bottom" : "top";
    tipBubble.style.transformOrigin = horizontalOrigin + " " + verticalOrigin;
  }

  function showRipple(positionX, positionY) {
    const rippleElement = document.createElement("div");
    rippleElement.className = "tour-ripple";
    rippleElement.style.left = positionX + "px";
    rippleElement.style.top = positionY + "px";
    document.body.append(rippleElement);

    setTimeout(function () {
      rippleElement.remove();
    }, 700);
  }

  function isElementInViewport(element) {
    const elementRect = element.getBoundingClientRect();
    return elementRect.top > 70 && elementRect.bottom < window.innerHeight - 20;
  }

  // Put every field and the results panel back the way they were.
  function restoreDemoValues(tourSession) {
    if (!tourSession.savedFieldValues) {
      return;
    }

    tourSession.savedFieldValues.forEach(function (savedField) {
      const inputElement = savedField[0];
      const originalValue = savedField[1];
      inputElement.value = originalValue;
    });

    tourSession.savedFieldValues = null;

    const outputSection = selectElement("#outputSection");

    if (outputSection) {
      outputSection.classList.remove("is-visible");
    }
  }

  /* Chat bubble typing */

  // Turns the bubble back into the small pill that only shows the name.
  function resetBubbleToCompact(tourElements) {
    tourElements.tip.classList.add("is-compact");
    tourElements.tip.classList.remove("is-done");
    tourElements.tip.style.height = "";
    tourElements.typedText.textContent = "";
  }

  /*
    Works out how big the bubble will be once the whole message is typed.
    It briefly shows the full message, measures it, and then goes back to the compact pill.
    The browser does not paint in between, so the visitor never sees this.
  */
  function measureFinalBubbleSize(tourElements, message) {
    const tipBubble = tourElements.tip;

    tipBubble.style.left = "0px";
    tipBubble.style.top = "0px";
    tipBubble.style.right = "auto";
    tipBubble.style.bottom = "auto";
    tipBubble.style.height = "";

    tipBubble.classList.remove("is-compact");
    tipBubble.classList.add("is-done");
    tourElements.typedText.textContent = message;

    const finalSize = {
      width: tipBubble.offsetWidth,
      height: tipBubble.offsetHeight
    };

    resetBubbleToCompact(tourElements);

    return finalSize;
  }

  /*
    Changes what the bubble shows and animates the height change.
    First we remember the current height. Then we let the content change
    and measure the new natural height. Finally we pin the old height,
    force the browser to notice it, and set the new height so the CSS transition runs.
  */
  function changeBubbleContent(tourElements, applyContentChange) {
    const tipBubble = tourElements.tip;
    const previousHeight = tipBubble.offsetHeight;

    tipBubble.style.height = "";
    applyContentChange();

    const nextHeight = tipBubble.offsetHeight;

    if (previousHeight === nextHeight) {
      return;
    }

    tipBubble.style.height = previousHeight + "px";
    void tipBubble.offsetHeight;
    tipBubble.style.height = nextHeight + "px";
  }

  // Each character waits a little, and a few extra milliseconds after punctuation.
  function getTypingDelay(character) {
    if (prefersReducedMotion) {
      return 0;
    }

    const randomExtraDelay = Math.random() * TYPING_RANDOM_EXTRA_DELAY;
    const isPunctuation = ",.!?".includes(character);
    const punctuationPause = isPunctuation ? TYPING_PUNCTUATION_PAUSE : 0;

    return TYPING_BASE_DELAY + randomExtraDelay + punctuationPause;
  }

  // Types the message into the bubble one character at a time.
  async function typeMessage(tourSession, tourElements, message) {
    let typedSoFar = "";

    for (const character of Array.from(message)) {
      if (tourSession.cancelled) {
        return;
      }

      // The visitor pressed next while typing, so show the rest right away.
      if (tourSession.finishTypingNow) {
        break;
      }

      typedSoFar += character;

      changeBubbleContent(tourElements, function () {
        tourElements.tip.classList.remove("is-compact");
        tourElements.typedText.textContent = typedSoFar;
      });

      await waitForTime(tourSession, getTypingDelay(character));
    }

    if (tourSession.cancelled) {
      return;
    }

    tourSession.finishTypingNow = false;

    // Show the full message, hide the caret, and reveal the counter and buttons.
    changeBubbleContent(tourElements, function () {
      tourElements.tip.classList.remove("is-compact");
      tourElements.typedText.textContent = message;
      tourElements.tip.classList.add("is-done");
    });
  }

  /*
    Shows the small pill first, then types the message inside it.
    The pill gives the visitor a moment to notice the bubble
    before the words start to appear.
  */
  async function speakMessage(tourSession, tourElements, message, pointerPosition) {
    tourSession.isSpeaking = true;
    tourSession.finishTypingNow = false;

    const finalSize = measureFinalBubbleSize(tourElements, message);

    placeTipBubble(
      tourElements.tip,
      pointerPosition.x,
      pointerPosition.y,
      finalSize.width,
      finalSize.height
    );

    tourElements.tip.classList.add("is-on");

    if (prefersReducedMotion) {
      changeBubbleContent(tourElements, function () {
        tourElements.tip.classList.remove("is-compact");
        tourElements.typedText.textContent = message;
        tourElements.tip.classList.add("is-done");
      });
    } else {
      await waitForTime(tourSession, COMPACT_BUBBLE_DISPLAY_TIME);

      if (!tourSession.cancelled) {
        await typeMessage(tourSession, tourElements, message);
      }
    }

    tourSession.isSpeaking = false;
  }

  /* Demo, type sample values into the fields. */
  async function typeDemoValues(tourSession, tourElements, demoConfiguration) {
    tourElements.tip.classList.remove("is-on");

    tourSession.savedFieldValues = Array.from(document.querySelectorAll(".card input")).map(
      function (inputElement) {
        return [inputElement, inputElement.value];
      }
    );

    const cursorHopTransition =
      "transform 0.6s cubic-bezier(0.65, 0, 0.35, 1), opacity 0.3s ease";
    tourElements.cursor.style.transition = cursorHopTransition;

    for (const field of demoConfiguration.fields) {
      if (tourSession.cancelled) {
        break;
      }

      const fieldSelector = field[0];
      const sampleValue = field[1];
      const inputElement = selectElement(fieldSelector);

      if (!inputElement) {
        continue;
      }

      if (!isElementInViewport(inputElement)) {
        inputElement.scrollIntoView({
          behavior: prefersReducedMotion ? "auto" : "smooth",
          block: "center"
        });
        await waitForTime(tourSession, prefersReducedMotion ? 50 : 650);
      }

      const inputRect = inputElement.getBoundingClientRect();
      const targetX = inputRect.left + inputRect.width / 2;
      const targetY = inputRect.top + inputRect.height / 2;
      tourElements.cursor.style.transform = `translate(${targetX}px, ${targetY}px)`;

      await waitForTime(tourSession, prefersReducedMotion ? 0 : 700);

      if (tourSession.cancelled) {
        break;
      }

      inputElement.focus({ preventScroll: true });
      inputElement.value = "";

      for (const character of sampleValue) {
        if (tourSession.cancelled) {
          break;
        }

        inputElement.value += character;
        inputElement.dispatchEvent(new Event("input", { bubbles: true }));
        await waitForTime(tourSession, prefersReducedMotion ? 0 : 140);
      }

      await waitForTime(tourSession, prefersReducedMotion ? 0 : 350);
      inputElement.blur();
    }

    tourElements.cursor.style.transition = "";
  }

  /* Runner */
  let activeTourSession = null;

  async function runTour(tourSession) {
    const tourElements = createTourElements();
    tourSession.tourElements = tourElements;

    tourElements.skipButton.addEventListener("click", function () {
      cancelTour();
    });

    tourElements.nextButton.addEventListener("click", function () {
      advanceTour();
    });

    // Start somewhere neutral, with no transition on the very first placement.
    tourElements.cursor.style.transition = "none";
    tourElements.cursor.style.transform =
      `translate(${window.innerWidth * 0.6}px, ${window.innerHeight * 0.65}px)`;
    void tourElements.cursor.offsetWidth;
    tourElements.cursor.style.transition = "";
    tourElements.cursor.classList.add("is-on");

    const steps = buildTourSteps();
    const totalVisibleSteps = steps.filter(function (step) {
      return step.kind !== "fill";
    }).length;
    let shownStepCount = 0;

    for (let stepIndex = 0; stepIndex < steps.length && !tourSession.cancelled; stepIndex++) {
      const step = steps[stepIndex];

      if (step.kind === "fill") {
        await typeDemoValues(tourSession, tourElements, step.demoConfiguration);
        continue;
      }

      const targetElement = selectElement(step.selector);

      if (!targetElement) {
        continue;
      }

      tourElements.tip.classList.remove("is-on");

      const isInsideFixedArea = !!targetElement.closest("header, .sidebar");

      if (!isInsideFixedArea) {
        targetElement.scrollIntoView({
          behavior: prefersReducedMotion ? "auto" : "smooth",
          block: "center"
        });
        await waitForTime(tourSession, prefersReducedMotion ? 50 : 700);

        if (tourSession.cancelled) {
          break;
        }
      }

      const pointerPosition = getPointerPosition(targetElement, step);
      tourElements.cursor.style.transform =
        `translate(${pointerPosition.x}px, ${pointerPosition.y}px)`;
      await waitForTime(tourSession, prefersReducedMotion ? 0 : 1200);

      if (tourSession.cancelled) {
        break;
      }

      if (step.showRippleOnArrive) {
        showRipple(pointerPosition.x, pointerPosition.y);
      }

      shownStepCount += 1;
      tourElements.count.textContent = `${shownStepCount}/${totalVisibleSteps}`;

      // The bubble pops up small, then the message is typed into it.
      await speakMessage(tourSession, tourElements, step.text, pointerPosition);

      if (tourSession.cancelled) {
        break;
      }

      await waitForTime(tourSession, getReadingTime(step.text));

      if (tourSession.cancelled) {
        break;
      }

      if (step.afterMessage) {
        await step.afterMessage(tourSession);
      }
    }
  }

  function cleanUpTour(tourSession) {
    restoreDemoValues(tourSession);

    if (tourSession.openedSidebar && isSidebarOpen()) {
      hamburgerButton.click();
    }

    if (tourSession.tourElements) {
      tourSession.tourElements.tip.classList.remove("is-on");
      tourSession.tourElements.cursor.classList.remove("is-on");

      const elementsToRemove = [
        tourSession.tourElements.tip,
        tourSession.tourElements.cursor
      ];

      setTimeout(function () {
        elementsToRemove.forEach(function (elementToRemove) {
          elementToRemove.remove();
        });
      }, 350);
    }

    document.removeEventListener("keydown", handleKeyDown);
    document.removeEventListener("click", handleDocumentClick, true);
    activeTourSession = null;
  }

  function cancelTour() {
    if (!activeTourSession) {
      return;
    }

    activeTourSession.cancelled = true;

    if (activeTourSession.advance) {
      activeTourSession.advance();
    }
  }

  /*
    Moves the tour forward.
    If the bubble is still typing, it finishes the typing first.
    Only the next press after that moves on to the next step.
  */
  function advanceTour() {
    if (!activeTourSession) {
      return;
    }

    if (activeTourSession.isSpeaking) {
      activeTourSession.finishTypingNow = true;
    }

    if (activeTourSession.advance) {
      activeTourSession.advance();
    }
  }

  function handleKeyDown(event) {
    if (!activeTourSession) {
      return;
    }

    if (event.key === "Escape") {
      cancelTour();
    }

    if (event.key === "ArrowRight") {
      advanceTour();
    }
  }

  // A real click anywhere ends the tour. Clicks made by the tour itself are ignored.
  function handleDocumentClick(event) {
    if (!activeTourSession || !event.isTrusted) {
      return;
    }

    if (event.target.closest(".tour-tip")) {
      return;
    }

    cancelTour();
  }

  function startTour() {
    if (activeTourSession) {
      return;
    }

    const tourSession = {
      cancelled: false,
      openedSidebar: false,
      advance: null,
      tourElements: null,
      savedFieldValues: null,
      isSpeaking: false,
      finishTypingNow: false
    };

    activeTourSession = tourSession;

    try {
      localStorage.setItem(TOUR_SEEN_STORAGE_KEY, "1");
    } catch (storageError) {
      // Storage can be blocked by the browser, so we just carry on.
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("click", handleDocumentClick, true);

    runTour(tourSession)
      .catch(function () {})
      .finally(function () {
        cleanUpTour(tourSession);
      });
  }

  replayTourButton.addEventListener("click", function (event) {
    event.stopPropagation();

    // Wait a moment so the same click does not cancel the tour right away.
    setTimeout(startTour, 0);
  });

  let hasSeenTour = false;

  try {
    hasSeenTour = localStorage.getItem(TOUR_SEEN_STORAGE_KEY) === "1";
  } catch (storageError) {
    // Storage can be blocked by the browser, so we treat the tour as not seen.
  }

  if (!hasSeenTour) {
    setTimeout(startTour, 1200);
  }
})();