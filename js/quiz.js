var quiz = {
  quizData: null,
  currentQuestion: 0,
  page: null,
  maxAttempts: 2,
  attemptNum: 0,
  maxPointsPerQuestion: 2,
  penaltyPerExtraAttempt: 1,
  totalScore: 0,
  initialiseQuiz: function() {
    this.page = this.getPageElements();
    fetch('./data/quiz.json')
    .then(response => response.json())
    .then(json => {
      this.quizData = json;
      this.page.submit.addEventListener('click', this.checkAnswer);
      this.page.nextQuestion.addEventListener('click', function() {
        quiz.showNextQuestion(false);
      });
      this.page.replay.addEventListener('click', function() {
        quiz.showNextQuestion(true);
      });
      this.updatePage();
    })
    .catch(error => {
      console.error('Error: ',  error);
    });
  },
  updatePage: function() {
    let questionData = this.quizData[this.currentQuestion];

    // Make introduction text visible if this is the first question
    this.setVisibility(this.page.firstQuestion, this.currentQuestion == 0);

    // Set the question numbering
    this.page.questionNum.innerHTML = this.currentQuestion + 1;
    this.page.totalQuestions.innerHTML = this.quizData.length;

    // Set the question text
    this.page.questionText.innerHTML = questionData.questionText;

    // Set the image
    let imageURL = questionData.image;

    if (imageURL != null) {
      this.page.image.setAttribute('src', "images/" + imageURL);
    }

    this.setVisibility(this.page.image, imageURL != null);

    // Set the instruction text
    this.setVisibility(this.page.multiple, questionData.type == 'multi');

    // Set the options
    let options = this.quizData[this.currentQuestion].options;

    for (let i = 0; i < options.length; i++) {
      let newOption = document.createElement('button');
      newOption.innerHTML = options[i].optionText;
      newOption.setAttribute('class', 'optionButton');
      newOption.setAttribute('id', 'option' + i);
      this.page.options.appendChild(newOption);
      document.querySelector('#option' + i).addEventListener('click', this.optionClicked);
    }

    // Set up submit button
    this.setSubmitState();
    this.setVisibility(this.page.submit, true);

    // Hide the feedback
    this.setVisibility(this.page.correct, false);
    this.setVisibility(this.page.incorrect, false);

    // Hide the score
    this.setVisibility(this.page.score, false);

    // Hide the next question button
    this.setVisibility(this.page.nextQuestion, false);

    // Hide the final question message and button
    this.setVisibility(this.page.finalQuestion, false);
  },
  checkAnswer: function() {
    // increment attempt number
    quiz.attemptNum++;
    let hadPermittedAttempts = (quiz.attemptNum == quiz.maxAttempts);

    // Hide incorrect feedback in case it is still showing from a previous attempt
    quiz.setVisibility(quiz.page.incorrect, false);

    // Check users selections to see if they have selected the correct options
    let options = quiz.quizData[quiz.currentQuestion].options;
    let answeredCorrectly = true;

    for (let i = 0; i < options.length; i++) {
      let isSelected = document.querySelector('#option' + i).classList.contains('selected');
      if ((options[i].correct && !isSelected) || (!options[i].correct && isSelected)) {
        answeredCorrectly = false;
      }
    }

    if (answeredCorrectly || hadPermittedAttempts) {
      let optButtons = document.querySelectorAll('.optionButton');
      for (let i = 0; i < options.length; i++) {
        optButtons[i].disabled = true;
      }

      quiz.setVisibility(quiz.page.submit, false);

      let points = answeredCorrectly ? quiz.maxPointsPerQuestion - ((quiz.attemptNum - 1) * quiz.penaltyPerExtraAttempt) : 0;
      quiz.totalScore += points;
      quiz.page.points.innerHTML = points;
      quiz.setVisibility(quiz.page.score, true);
      quiz.setVisibility(quiz.page.pluralPoints, points != 1);

      if (quiz.currentQuestion == quiz.quizData.length - 1) {
        quiz.page.totalPoints.innerHTML = quiz.totalScore;
        quiz.page.maxPoints.innerHTML = quiz.quizData.length * quiz.maxPointsPerQuestion;
        quiz.setVisibility(quiz.page.finalQuestion, true);
      } else {
        quiz.page.nextQuestionNum.innerHTML = quiz.currentQuestion + 2;
        quiz.setVisibility(quiz.page.nextQuestion, true);
      }
    }

    if (answeredCorrectly) {
      quiz.setVisibility(quiz.page.correct, true);
    } else {
        quiz.setVisibility(quiz.page.incorrect, true);
        quiz.setVisibility(quiz.page.retry, !hadPermittedAttempts);
    }
  },
  optionClicked: function(evt) {
    // If option is currently selected, deselect it
    if (evt.target.classList.contains('selected')) {
      evt.target.classList.remove('selected');
    } else {
      // We're selecting the option
      // If questionType is 'single', cycle through all options and deselect them
      if (quiz.quizData[quiz.currentQuestion].type == 'single') {
        let options = document.querySelectorAll('.optionButton');

        for (let i = 0; i < options.length; i++) {
          options[i].classList.remove('selected');
        }
      }
      // Now select the option
      evt.target.classList.add('selected');
    }
    quiz.setSubmitState();
  },
  setSubmitState: function() {
    quiz.page.submit.disabled = document.querySelectorAll('.selected').length == 0;
  },
  showNextQuestion: function(reset) {
    // Reset attempt number
    quiz.attemptNum = 0;

    // Remove existing answer options
    while (quiz.page.options.firstChild) {
      quiz.page.options.removeChild(quiz.page.options.firstChild);
    }

    // Show next question (or first if resetting)
    if (reset) {
      quiz.currentQuestion = 0;
      quiz.totalScore = 0;
    } else {
      quiz.currentQuestion++;
    }

    quiz.updatePage();
  },
  getPageElements: function() {
    let elementsWithID = document.querySelectorAll('*[id]');
    let pageEls = {};

    for (let i = 0; i < elementsWithID.length; i++) {
      pageEls[elementsWithID[i].id] = elementsWithID[i];
    }

    return pageEls;
  },
  setVisibility: function(element, condition) {
    if (condition) {
      element.classList.remove('hidden');
    } else {
      element.classList.add('hidden');
    }
  }
}
