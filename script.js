const questions = [
  {
    question: "Which is largest animal in the world?",
    answers: [
      { text: "shark", correct: "false" },
      { text: "Blue whale", correct: "true" },
      { text: "Elephant", correct: "false" },
      { text: "Giraffe", correct: "false" },
    ],
  },
  {
    question: "Which is smallest country in the world?",
    answers: [
      { text: "Vatica city", correct: "true" },
      { text: "Bhutan", correct: "false" },
      { text: "Nepal", correct: "false" },
      { text: "SeriLanka", correct: "false" },
    ],
  },
  {
    question: "Which is largest desert in the world?",
    answers: [
      { text: "kalahari", correct: "false" },
      { text: "Gobi", correct: "false" },
      { text: "Sahara", correct: "false" },
      { text: "Antartica", correct: "true" },
    ],
  },
  {
    question: "Which is smallest continent in the world?",
    answers: [
      { text: "Asia", correct: "false" },
      { text: "Australia", correct: "true" },
      { text: "Artica", correct: "false" },
      { text: "Africa", correct: "false" },
    ],
  },
];

const questionElement = document.querySelector("#question");
const answerBtns = document.querySelector("#answer-btns");
const nextBtn = document.querySelector(".next-btn");

let currentQuestionIndex = 0;
let score = 0;

function startQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  nextBtn.innerHTML = "Next";
  showQuestion();
}

function showQuestion() {
  resetState();
  let currentQuestion = questions[currentQuestionIndex];
  let questionNo = currentQuestionIndex + 1;
  questionElement.innerHTML = questionNo + ". " + currentQuestion.question;

  currentQuestion.answers.forEach((answer) => {
    const button = document.createElement("button");
    button.innerHTML = answer.text;
    button.classList.add("btn");
    answerBtns.appendChild(button);
    if (answer.correct) {
      button.dataset.correct = answer.correct;
    }
    button.addEventListener("click", selectAnswer);
  });
}

function resetState() {
  nextBtn.style.display = "none";
  while (answerBtns.firstChild) {
    answerBtns.removeChild(answerBtns.firstChild);
  }
}

function selectAnswer(e) {
  const selectedBtn = e.target;
  const isCorrect = selectedBtn.dataset.correct === "true";
  if (isCorrect) {
    selectedBtn.classList.add("correct");
    score++;
  } else {
    selectedBtn.classList.add("incorrect");
  }
  Array.from(answerBtns.children).forEach((button) => {
    if (button.dataset.correct === "true") {
      button.classList.add("correct");
    }
    button.disabled = true;
  });
  nextBtn.style.display = "block";
}

function showScore() {
  resetState();
  questionElement.innerHTML = `You scored ${score} out of ${questions.length}!`;
  nextBtn.innerHTML = "PLay Again";
  nextBtn.style.display = "Block";
}

function handleNextBtn() {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    showScore();
  }
}

nextBtn.addEventListener("click", () => {
  if (currentQuestionIndex < questions.length) {
    handleNextBtn();
  } else {
    startQuiz();
  }
});
startQuiz();
