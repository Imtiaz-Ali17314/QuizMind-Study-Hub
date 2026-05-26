/* ==========================================================================
   QUIZMIND SYSTEM CONTROLLER
   ========================================================================== */

// 1. Preset Decks Database
const presetDecks = {
  science: [
    {
      question: "Which is the largest animal in the world?",
      answers: [
        { text: "Whale shark", correct: false },
        { text: "Blue whale", correct: true },
        { text: "African elephant", correct: false },
        { text: "Colossal squid", correct: false }
      ]
    },
    {
      question: "What is the approximate speed of light?",
      answers: [
        { text: "300,000 km/s", correct: true },
        { text: "150,000 km/s", correct: false },
        { text: "1,000,000 km/s", correct: false },
        { text: "3,000 km/s", correct: false }
      ]
    },
    {
      question: "Which planet in our solar system has the most moons?",
      answers: [
        { text: "Jupiter", correct: false },
        { text: "Saturn", correct: true },
        { text: "Neptune", correct: false },
        { text: "Mars", correct: false }
      ]
    },
    {
      question: "What is the most abundant gas in Earth's atmosphere?",
      answers: [
        { text: "Oxygen", correct: false },
        { text: "Carbon dioxide", correct: false },
        { text: "Nitrogen", correct: true },
        { text: "Argon", correct: false }
      ]
    }
  ],
  geography: [
    {
      question: "Which is the smallest country in the world?",
      answers: [
        { text: "Monaco", correct: false },
        { text: "Vatican City", correct: true },
        { text: "San Marino", correct: false },
        { text: "Liechtenstein", correct: false }
      ]
    },
    {
      question: "What is the longest river in the world?",
      answers: [
        { text: "Amazon River", correct: false },
        { text: "Nile River", correct: true },
        { text: "Yangtze River", correct: false },
        { text: "Mississippi River", correct: false }
      ]
    },
    {
      question: "Which is the largest desert in the world?",
      answers: [
        { text: "Sahara Desert", correct: false },
        { text: "Arabian Desert", correct: false },
        { text: "Gobi Desert", correct: false },
        { text: "Antarctic Desert", correct: true }
      ]
    },
    {
      question: "What is the capital city of Australia?",
      answers: [
        { text: "Sydney", correct: false },
        { text: "Melbourne", correct: false },
        { text: "Canberra", correct: true },
        { text: "Brisbane", correct: false }
      ]
    }
  ],
  history: [
    {
      question: "In which year did the Titanic sink in the Atlantic Ocean?",
      answers: [
        { text: "1912", correct: true },
        { text: "1905", correct: false },
        { text: "1920", correct: false },
        { text: "1898", correct: false }
      ]
    },
    {
      question: "Who was the first emperor of the Roman Empire?",
      answers: [
        { text: "Julius Caesar", correct: false },
        { text: "Augustus Caesar", correct: true },
        { text: "Nero", correct: false },
        { text: "Marcus Aurelius", correct: false }
      ]
    },
    {
      question: "Which ancient civilization constructed the Machu Picchu citadel?",
      answers: [
        { text: "Aztecs", correct: false },
        { text: "Mayans", correct: false },
        { text: "Incas", correct: true },
        { text: "Olmecs", correct: false }
      ]
    },
    {
      question: "What was the duration of the Hundred Years' War between England and France?",
      answers: [
        { text: "100 years", correct: false },
        { text: "116 years", correct: true },
        { text: "99 years", correct: false },
        { text: "105 years", correct: false }
      ]
    }
  ],
  tech: [
    {
      question: "Who is credited with creating the World Wide Web in 1989?",
      answers: [
        { text: "Bill Gates", correct: false },
        { text: "Alan Turing", correct: false },
        { text: "Tim Berners-Lee", correct: true },
        { text: "Steve Jobs", correct: false }
      ]
    },
    {
      question: "Which programming language was originally developed under the name 'Oak'?",
      answers: [
        { text: "Python", correct: false },
        { text: "C++", correct: false },
        { text: "Java", correct: true },
        { text: "Ruby", correct: false }
      ]
    },
    {
      question: "In computer hardware, what does GPU stand for?",
      answers: [
        { text: "General Processing Unit", correct: false },
        { text: "Graphics Processing Unit", correct: true },
        { text: "Grid power Unit", correct: false },
        { text: "Giga Port Utility", correct: false }
      ]
    },
    {
      question: "What was the name of the first electronic general-purpose computer built in 1945?",
      answers: [
        { text: "ENIAC", correct: true },
        { text: "UNIVAC", correct: false },
        { text: "Colossus", correct: false },
        { text: "EDSAC", correct: false }
      ]
    }
  ]
};

// 2. Global State Configuration
const state = {
  activeDeckKey: 'science',
  activeDeckName: 'General Science',
  questions: [],
  currentQuestionIdx: 0,
  
  // Game metrics
  score: 0,
  points: 0,
  streak: 0,
  maxStreak: 0,
  multiplier: 1.0,
  lifelines: {
    fifty: true,
    freeze: true
  },
  
  // Timer attributes
  timerLimit: 15,
  timeLeft: 15,
  timerInterval: null,
  timeFrozen: false,
  questionStartTime: 0,
  responseTimes: [], // logs details of each answer speed

  // Flashcards state
  flashcardIdx: 0,
  flashcardFlipped: false,
  masteredCount: 0,
  reviewCount: 0
};

// DOM elements mapping
const viewSetup = document.querySelector("#view-setup");
const viewQuiz = document.querySelector("#view-quiz");
const viewFlashcard = document.querySelector("#view-flashcard");
const viewResults = document.querySelector("#view-results");

// Setup HUD DOM
const presetCards = document.querySelectorAll(".preset-card");
const activeDeckNameLbl = document.querySelector("#active-deck-name");
const activeDeckCountLbl = document.querySelector("#active-deck-count");
const activeStreakRecordLbl = document.querySelector("#active-streak-record");
const inputNotes = document.querySelector("#input-notes");
const btnParseNotes = document.querySelector("#btn-parse-notes");
const btnLaunchQuiz = document.querySelector("#btn-launch-quiz");
const btnLaunchFlash = document.querySelector("#btn-launch-flash");

// Active Quiz HUD DOM
const hudProgress = document.querySelector("#hud-progress");
const hudStreakCount = document.querySelector("#hud-streak-count");
const hudMultiplier = document.querySelector("#hud-multiplier");
const hudScore = document.querySelector("#hud-score");
const questionText = document.querySelector("#question");
const answerBtns = document.querySelector("#answer-btns");
const timerBarCircle = document.querySelector("#timer-bar-circle");
const timerDigitalLabel = document.querySelector("#timer-digital-label");
const lifelineFifty = document.querySelector("#lifeline-fifty");
const lifelineFreeze = document.querySelector("#lifeline-freeze");
const quizNextBtn = document.querySelector("#quiz-next-btn");

// Flashcard HUD DOM
const flashcardProgress = document.querySelector("#flashcard-progress");
const flashcardContainerEl = document.querySelector("#flashcard-container-el");
const flashcardQuestionText = document.querySelector("#flashcard-question-text");
const flashcardAnswerText = document.querySelector("#flashcard-answer-text");
const btnFlashReview = document.querySelector("#btn-flash-review");
const btnFlashMastered = document.querySelector("#btn-flash-mastered");
const btnExitFlashcards = document.querySelector("#btn-exit-flashcards");

// Results HUD DOM
const resultsVerdict = document.querySelector("#results-verdict");
const resultsScoreDetails = document.querySelector("#results-score-details");
const statPoints = document.querySelector("#stat-points");
const statMaxStreak = document.querySelector("#stat-max-streak");
const statAvgSpeed = document.querySelector("#stat-avg-speed");
const statsCanvas = document.querySelector("#stats-canvas");
const leaderboardBody = document.querySelector("#leaderboard-body");
const btnRetryQuiz = document.querySelector("#btn-retry-quiz");
const btnBackSetup = document.querySelector("#btn-back-setup");

// Initialization
document.addEventListener("DOMContentLoaded", () => {
  setupAppEvents();
  loadLeaderboard();
  syncActiveDeckData();
});

// App configuration and visual event triggers
function setupAppEvents() {
  // Preset select cards
  presetCards.forEach(card => {
    card.addEventListener("click", () => {
      presetCards.forEach(c => c.classList.remove("active"));
      card.classList.add("active");
      
      const key = card.getAttribute("data-deck");
      state.activeDeckKey = key;
      state.activeDeckName = card.querySelector("h6").textContent;
      syncActiveDeckData();
    });
  });

  // Notes parsing engine trigger
  btnParseNotes.addEventListener("click", parseCustomNotesToQuiz);

  // Launch modes
  btnLaunchQuiz.addEventListener("click", startQuizWorkflow);
  btnLaunchFlash.addEventListener("click", startFlashcardWorkflow);

  // Quiz playback mechanics
  quizNextBtn.addEventListener("click", handleQuizNextAction);
  lifelineFifty.addEventListener("click", triggerFiftyFiftyLifeline);
  lifelineFreeze.addEventListener("click", triggerFreezeTimeLifeline);

  // Flashcards deck flipping mechanics
  flashcardContainerEl.addEventListener("click", () => {
    state.flashcardFlipped = !state.flashcardFlipped;
    flashcardContainerEl.classList.toggle("flip", state.flashcardFlipped);
  });

  btnFlashReview.addEventListener("click", () => handleFlashcardAction('review'));
  btnFlashMastered.addEventListener("click", () => handleFlashcardAction('mastered'));
  btnExitFlashcards.addEventListener("click", () => showViewPanel(viewSetup));

  // Results CTAs
  btnRetryQuiz.addEventListener("click", () => {
    if (state.questions.length > 0) {
      startQuizWorkflow();
    } else {
      showViewPanel(viewSetup);
    }
  });
  btnBackSetup.addEventListener("click", () => showViewPanel(viewSetup));
}

// 3. View Switcher
function showViewPanel(activePanel) {
  // Clear running intervals if exiting active quiz
  if (activePanel !== viewQuiz && state.timerInterval) {
    clearInterval(state.timerInterval);
  }

  [viewSetup, viewQuiz, viewFlashcard, viewResults].forEach(pane => {
    pane.classList.remove("active");
  });
  activePanel.classList.add("active");
}

function syncActiveDeckData() {
  const currentPreset = presetDecks[state.activeDeckKey];
  activeDeckNameLbl.textContent = state.activeDeckName;
  activeDeckCountLbl.textContent = `${currentPreset.length} Questions`;
  
  // Fetch streak records from local cache
  const localStreaks = localStorage.getItem(`streak_record_${state.activeDeckKey}`) || "0";
  activeStreakRecordLbl.textContent = `🔥 ${localStreaks}`;
}

// 4. Text-to-Quiz NLP Generator (Study notes parser)
function parseCustomNotesToQuiz() {
  const text = inputNotes.value.trim();
  if (!text) {
    alert("Please paste note text first!");
    return;
  }

  if (text.length < 50) {
    alert("Please write a longer text block (at least 50 characters) to analyze!");
    return;
  }

  // Visual feedback loader
  const origBtnText = btnParseNotes.innerHTML;
  btnParseNotes.innerHTML = `<span>Analyzing semantics...</span>`;
  btnParseNotes.setAttribute("disabled", "true");

  setTimeout(() => {
    try {
      const generatedQuestions = extractQuestionsFromText(text);
      if (generatedQuestions.length === 0) {
        throw new Error("Could not extract definitions or facts from notes.");
      }

      // Save custom deck
      presetDecks['custom'] = generatedQuestions;
      state.activeDeckKey = 'custom';
      state.activeDeckName = 'Custom AI Deck';

      // Update Setup selections
      presetCards.forEach(c => c.classList.remove("active"));
      activeDeckNameLbl.textContent = state.activeDeckName;
      activeDeckCountLbl.textContent = `${generatedQuestions.length} Questions`;

      alert(`Success! Generated an active deck of ${generatedQuestions.length} study questions.`);
    } catch (e) {
      alert("AI Parser: " + e.message + "\nLoading preset quiz instead.");
    } finally {
      btnParseNotes.innerHTML = origBtnText;
      btnParseNotes.removeAttribute("disabled");
    }
  }, 1200);
}

// Smart Client-Side Fact & Definition Parser
function extractQuestionsFromText(text) {
  // Split paragraphs into sentences
  const sentences = text.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 15);
  const questionsList = [];

  // Vocabulary bank to extract distractors
  const wordBank = [];
  const words = text.toLowerCase().replace(/[^\w\s]/g, "").split(/\s+/).filter(w => w.length > 4);
  words.forEach(w => {
    if (!wordBank.includes(w) && wordBank.length < 60) {
      // capitalize first letter for display
      wordBank.push(w.charAt(0).toUpperCase() + w.slice(1));
    }
  });

  // Helper to create a fill‑in‑the‑blank question from a sentence
  function createBlankQuestion(sentence) {
    const wordsInSent = sentence.split(/\s+/);
    // pick a word longer than 4 characters that is not a common stop word
    const stopWords = ["the","and","that","with","from","this","these","those","have","has","was","were","are","been","being","for","but","also","such","which","who","whom","where","when","why","how","about","into","over","under","while","after","before","since","until","about","above","below","between","among","against","amongst","about","around","among"];    
    const candidates = wordsInSent.filter(w => w.length > 4 && !stopWords.includes(w.toLowerCase()));
    if (candidates.length === 0) return null;
    const targetIdx = Math.floor(Math.random() * candidates.length);
    const targetWord = candidates[targetIdx].replace(/[.,;:!?]/g, "");
    const capitalized = targetWord.charAt(0).toUpperCase() + targetWord.slice(1);
    const blank = "__________";
    const question = wordsInSent.map(w => {
      return w.replace(targetWord, blank);
    }).join(' ');
    // Build distractors from wordBank ensuring uniqueness
    const distractors = [];
    const bank = wordBank.filter(w => w !== capitalized);
    while (distractors.length < 3 && bank.length > 0) {
      const idx = Math.floor(Math.random() * bank.length);
      distractors.push(bank.splice(idx, 1)[0]);
    }
    while (distractors.length < 3) {
      distractors.push("Concept");
    }
    const answers = [{ text: capitalized, correct: true }, ...distractors.map(d => ({ text: d, correct: false }))];
    shuffleArray(answers);
    return { question: question, answers: answers };
  }

  // Process each sentence, attempting definition triggers first
  sentences.forEach(sentence => {
    // Detect definition‑like triggers
    const triggers = [
      { pattern: /\s+is\s+a\s+/i, replacement: " is a " },
      { pattern: /\s+was\s+a\s+/i, replacement: " was a " },
      { pattern: /\s+refers\s+to\s+/i, replacement: " refers to " },
      { pattern: /\s+is\s+called\s+/i, replacement: " is called " },
      { pattern: /\s+known\s+as\s+/i, replacement: " known as " }
    ];
    let matchedTrigger = null;
    for (let t of triggers) {
      if (t.pattern.test(sentence)) {
        matchedTrigger = t;
        break;
      }
    }
    if (matchedTrigger) {
      const parts = sentence.split(matchedTrigger.pattern);
      if (parts.length === 2 && parts[0].trim().length > 2 && parts[1].trim().length > 5) {
        const subject = parts[0].trim();
        const definition = parts[1].trim();
        const capitalizedSubject = subject.charAt(0).toUpperCase() + subject.slice(1);
        const fillBlankQuestion = `__________${matchedTrigger.replacement}${definition}.`;
        const answers = [{ text: capitalizedSubject, correct: true }];
        // distractors
        const collectedDistractors = [];
        const fallbacks = ["Concept", "Application", "Database", "Process", "System", "Protocol", "Framework"];
        let attempts = 0;
        while (collectedDistractors.length < 3 && attempts < 100) {
          attempts++;
          const randomWord = wordBank[Math.floor(Math.random() * wordBank.length)];
          if (randomWord && randomWord !== capitalizedSubject && !collectedDistractors.includes(randomWord)) {
            collectedDistractors.push(randomWord);
          }
        }
        while (collectedDistractors.length < 3) {
          const fallback = fallbacks[Math.floor(Math.random() * fallbacks.length)];
          if (!collectedDistractors.includes(fallback)) {
            collectedDistractors.push(fallback);
          }
        }
        collectedDistractors.forEach(d => answers.push({ text: d, correct: false }));
        shuffleArray(answers);
        questionsList.push({ question: fillBlankQuestion, answers: answers });
      }
    } else {
      // Fallback to blank‑fill generation for this sentence
      const blankQ = createBlankQuestion(sentence);
      if (blankQ) {
        questionsList.push(blankQ);
      }
    }
  });

  // Ensure we have at most 10 questions
  return questionsList.slice(0, 10);
}

// --- Utility Functions ---

/**
 * Fisher-Yates shuffle to randomize array elements in-place.
 */
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/**
 * Draw a rounded rectangle on canvas context.
 */
function drawRoundedRect(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// 5. Active Gamified Quiz Engine
function startQuizWorkflow() {
  state.questions = presetDecks[state.activeDeckKey] || presetDecks.science;
  
  if (state.questions.length === 0) {
    alert("The selected study deck has no questions. Try another deck or paste notes!");
    return;
  }

  // Reset metrics
  state.currentQuestionIdx = 0;
  state.score = 0;
  state.points = 0;
  state.streak = 0;
  state.maxStreak = 0;
  state.multiplier = 1.0;
  state.lifelines.fifty = true;
  state.lifelines.freeze = true;
  state.responseTimes = [];

  // Reset Lifeline UI buttons
  lifelineFifty.removeAttribute("disabled");
  lifelineFifty.classList.remove("disabled");
  lifelineFreeze.removeAttribute("disabled");
  lifelineFreeze.classList.remove("disabled");

  showViewPanel(viewQuiz);
  loadNextQuizQuestion();
}

function loadNextQuizQuestion() {
  state.timeFrozen = false;
  state.timeLeft = state.timerLimit;
  quizNextBtn.style.display = "none";
  lifelineFreeze.classList.remove("active");

  const currentQ = state.questions[state.currentQuestionIdx];
  questionText.innerHTML = `${state.currentQuestionIdx + 1}. ${currentQ.question}`;

  // Tally indices HUD
  hudProgress.textContent = `${state.currentQuestionIdx + 1} / ${state.questions.length}`;
  hudStreakCount.textContent = `🔥 ${state.streak}`;
  hudMultiplier.textContent = `${state.multiplier.toFixed(2)}x Mult`;
  hudScore.textContent = `${state.points.toLocaleString()} pts`;

  // Render option choices
  answerBtns.innerHTML = "";
  currentQ.answers.forEach(ans => {
    const btn = document.createElement("button");
    btn.innerHTML = ans.text;
    btn.className = "btn";
    btn.dataset.correct = ans.correct;
    
    btn.addEventListener("click", selectAnswer);
    answerBtns.appendChild(btn);
  });

  // Track start time
  state.questionStartTime = Date.now();

  // Reset circular countdown timer visual ring variables
  timerBarCircle.style.strokeDashoffset = 0;
  timerDigitalLabel.textContent = `${state.timeLeft}s`;
  timerBarCircle.style.stroke = "var(--accent-emerald)";

  // Start Interval timer
  if (state.timerInterval) clearInterval(state.timerInterval);
  state.timerInterval = setInterval(updateActiveTimer, 1000);
}

function updateActiveTimer() {
  if (state.timeFrozen) return;

  state.timeLeft--;
  timerDigitalLabel.textContent = `${state.timeLeft}s`;

  // Circular animation updates (dasharray is 213.6 for r=34)
  const offset = ((state.timerLimit - state.timeLeft) / state.timerLimit) * 213.6;
  timerBarCircle.style.strokeDashoffset = offset;

  // Change visual color threshold
  if (state.timeLeft <= 5 && state.timeLeft > 2) {
    timerBarCircle.style.stroke = "var(--warning)";
  } else if (state.timeLeft <= 2) {
    timerBarCircle.style.stroke = "var(--accent-pink)";
  }

  // Time-out logic
  if (state.timeLeft <= 0) {
    clearInterval(state.timerInterval);
    resolveTimeoutAnswer();
  }
}

function selectAnswer(e) {
  clearInterval(state.timerInterval);
  
  const selectedBtn = e.target;
  const isCorrect = selectedBtn.dataset.correct === "true";
  const duration = (Date.now() - state.questionStartTime) / 1000;
  
  // Log response duration
  state.responseTimes.push({
    correct: isCorrect,
    time: duration
  });

  if (isCorrect) {
    selectedBtn.classList.add("correct");
    state.score++;
    state.streak++;
    
    if (state.streak > state.maxStreak) state.maxStreak = state.streak;

    // Calculate score points (base points + speed bonus) * multiplier
    const speedFactor = Math.max(0.2, (state.timeLeft / state.timerLimit));
    const basePts = 1000;
    const speedPts = Math.round(basePts * speedFactor);
    state.points += Math.round((basePts + speedPts) * state.multiplier);

    // Increment Multiplier on correct streaks
    state.multiplier = 1.0 + (state.streak * 0.25);
  } else {
    selectedBtn.classList.add("incorrect");
    state.streak = 0;
    state.multiplier = 1.0;
    
    // Highlight the button that was selected incorrect
    Array.from(answerBtns.children).forEach(btn => {
      if (btn.dataset.correct === "true") {
        btn.classList.add("correct"); // reveal correct answer
      }
    });
  }

  // Deactivate all buttons
  disableAnswerButtons();
  quizNextBtn.style.display = "block";
}

function resolveTimeoutAnswer() {
  state.streak = 0;
  state.multiplier = 1.0;
  state.responseTimes.push({ correct: false, time: state.timerLimit });

  Array.from(answerBtns.children).forEach(btn => {
    if (btn.dataset.correct === "true") {
      btn.classList.add("correct");
    }
    btn.disabled = true;
  });

  quizNextBtn.style.display = "block";
}

function disableAnswerButtons() {
  Array.from(answerBtns.children).forEach(btn => {
    btn.disabled = true;
  });
}

function triggerFiftyFiftyLifeline() {
  if (!state.lifelines.fifty) return;

  const currentQ = state.questions[state.currentQuestionIdx];
  const buttons = Array.from(answerBtns.children);

  // Find incorrect buttons
  const incorrectButtons = buttons.filter(btn => btn.dataset.correct !== "true");
  
  // Shuffle incorrect arrays to remove randomly
  shuffleArray(incorrectButtons);

  // Disable two wrong buttons
  incorrectButtons.slice(0, 2).forEach(btn => {
    btn.disabled = true;
    btn.style.opacity = "0.2";
  });

  state.lifelines.fifty = false;
  lifelineFifty.setAttribute("disabled", "true");
  lifelineFifty.classList.add("disabled");
}

function triggerFreezeTimeLifeline() {
  if (!state.lifelines.freeze) return;

  state.timeFrozen = true;
  state.lifelines.freeze = false;
  
  lifelineFreeze.setAttribute("disabled", "true");
  lifelineFreeze.classList.add("active");
}

function handleQuizNextAction() {
  state.currentQuestionIdx++;
  
  if (state.currentQuestionIdx < state.questions.length) {
    loadNextQuizQuestion();
  } else {
    showResultsDashboard();
  }
}

// 6. Active Recall Flashcards System
function startFlashcardWorkflow() {
  state.questions = presetDecks[state.activeDeckKey] || presetDecks.science;
  
  if (state.questions.length === 0) {
    alert("The selected study deck has no questions. Try another deck or paste notes!");
    return;
  }

  state.flashcardIdx = 0;
  state.masteredCount = 0;
  state.reviewCount = 0;

  showViewPanel(viewFlashcard);
  loadNextFlashcard();
}

function loadNextFlashcard() {
  state.flashcardFlipped = false;
  flashcardContainerEl.classList.remove("flip");

  const currentQ = state.questions[state.flashcardIdx];
  flashcardProgress.textContent = `Card ${state.flashcardIdx + 1} / ${state.questions.length}`;

  // Front question
  flashcardQuestionText.textContent = currentQ.question;

  // Back correct answer
  const correctOption = currentQ.answers.find(a => a.correct);
  flashcardAnswerText.textContent = correctOption ? correctOption.text : "Term explanation unavailable.";
}

function handleFlashcardAction(type) {
  if (type === 'mastered') state.masteredCount++;
  else state.reviewCount++;

  state.flashcardIdx++;
  
  if (state.flashcardIdx < state.questions.length) {
    loadNextFlashcard();
  } else {
    alert(`Deck completed!\nMastered: ${state.masteredCount} cards\nNeeds Review: ${state.reviewCount} cards.`);
    showViewPanel(viewSetup);
  }
}

// 7. Results Dashboard & Canvas Telemetry Charts
function showResultsDashboard() {
  showViewPanel(viewResults);
  
  // Set scoreboard numbers
  resultsScoreDetails.textContent = `You scored ${state.score} out of ${state.questions.length} (${Math.round((state.score / state.questions.length) * 100)}%)`;
  statPoints.textContent = `${state.points.toLocaleString()} pts`;
  statMaxStreak.textContent = `🔥 ${state.maxStreak}`;

  // Average response time
  let totalSpeed = 0;
  state.responseTimes.forEach(t => totalSpeed += t.time);
  const avg = state.responseTimes.length > 0 ? (totalSpeed / state.responseTimes.length) : 0;
  statAvgSpeed.textContent = `${avg.toFixed(1)}s`;

  // Verdict evaluation message
  const pct = (state.score / state.questions.length) * 100;
  if (pct === 100) resultsVerdict.textContent = "🏆 Flawless Victory! Perfect Score!";
  else if (pct >= 70) resultsVerdict.textContent = "🎓 Outstanding! You're a Master!";
  else if (pct >= 50) resultsVerdict.textContent = "📚 Good Effort! Keep Reviewing!";
  else resultsVerdict.textContent = "✍️ Practice Makes Perfect! Try Again!";

  // Save score to Leaderboard local Cache
  saveToLeaderboard(state.activeDeckName, state.score, state.questions.length, state.points);
  
  // Save streak record
  const currentRecord = parseInt(localStorage.getItem(`streak_record_${state.activeDeckKey}`) || "0");
  if (state.maxStreak > currentRecord) {
    localStorage.setItem(`streak_record_${state.activeDeckKey}`, state.maxStreak.toString());
  }

  // Sync main settings records
  syncActiveDeckData();

  // Load Leaderboard UI
  loadLeaderboard();

  // Draw response speed telemetry graph
  drawCanvasVelocityChart();
}

function drawCanvasVelocityChart() {
  const ctx = statsCanvas.getContext('2d');
  
  // Auto set resolution parameters
  const w = statsCanvas.width = statsCanvas.offsetWidth;
  const h = statsCanvas.height = statsCanvas.offsetHeight;

  ctx.clearRect(0, 0, w, h);
  
  if (state.responseTimes.length === 0) return;

  const padding = 20;
  const graphWidth = w - padding * 2;
  const graphHeight = h - padding * 2;

  // Find max response time to scale chart
  const times = state.responseTimes.map(t => t.time);
  const maxTime = Math.max(state.timerLimit, ...times);

  const colWidth = graphWidth / state.responseTimes.length;

  // Draw grid lines
  ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
  ctx.lineWidth = 1;
  for (let s = 5; s <= maxTime; s += 5) {
    const y = h - padding - (s / maxTime) * graphHeight;
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(w - padding, y);
    ctx.stroke();

    ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
    ctx.font = "8px 'Fira Code', monospace";
    ctx.fillText(`${s}s`, padding - 15, y + 3);
  }

  // Plot data columns
  state.responseTimes.forEach((data, idx) => {
    const colHeight = (data.time / maxTime) * graphHeight;
    const x = padding + idx * colWidth + colWidth * 0.15;
    const y = h - padding - colHeight;
    const barW = colWidth * 0.7;

    // Correct vs Incorrect colors (glowing emerald vs neon pink)
    ctx.fillStyle = data.correct ? "rgba(16, 185, 129, 0.6)" : "rgba(236, 72, 153, 0.6)";
    ctx.strokeStyle = data.correct ? "var(--accent-emerald)" : "var(--accent-pink)";
    ctx.lineWidth = 1.5;

    drawRoundedRect(ctx, x, y, barW, colHeight, 4);
    ctx.fill();
    ctx.stroke();

    // Draw question label X axis
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.font = "8px 'Outfit', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`Q${idx+1}`, x + barW/2, h - 5);
  });
}



// 8. Caching Score lists
function saveToLeaderboard(deckName, score, total, pts) {
  const localScores = localStorage.getItem("quizmind_leaderboard");
  let leaderboard = [];

  if (localScores) {
    try {
      leaderboard = JSON.parse(localScores);
    } catch (e) {
      leaderboard = [];
    }
  }

  const entry = {
    date: new Date().toLocaleDateString(undefined, {month: 'short', day: 'numeric'}),
    deck: deckName,
    accuracy: `${score}/${total}`,
    points: pts
  };

  leaderboard.push(entry);
  
  // Keep only the top 10 scores
  leaderboard.sort((a, b) => b.points - a.points);
  leaderboard = leaderboard.slice(0, 10);

  localStorage.setItem("quizmind_leaderboard", JSON.stringify(leaderboard));
}

function loadLeaderboard() {
  const localScores = localStorage.getItem("quizmind_leaderboard");
  let leaderboard = [];

  if (localScores) {
    try {
      leaderboard = JSON.parse(localScores);
    } catch (e) {
      leaderboard = [];
    }
  }

  leaderboardBody.innerHTML = "";

  if (leaderboard.length === 0) {
    leaderboardBody.innerHTML = `
      <tr>
        <td colspan="4" style="text-align:center;color:var(--text-muted);font-style:italic;">No scores logged yet.</td>
      </tr>
    `;
    return;
  }

  leaderboard.forEach(entry => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${entry.date}</td>
      <td style="font-weight:600;">${entry.deck}</td>
      <td>${entry.accuracy}</td>
      <td>${entry.points.toLocaleString()}</td>
    `;
    leaderboardBody.appendChild(tr);
  });
}

// Helpers

