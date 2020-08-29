var quiz = {
  quizData: null,
  currentQuestion: 0,
  initialiseQuiz: function() {
    fetch('/data/quiz.json')
    .then(response => response.json())
    .then(json => {
      this.quizData = json;
      this.updatePage();
    })
    .catch(error => {
      console.error('Error: ',  error);
    });
  },
  updatePage: function() {
    let questionData = this.quizData[this.currentQuestion];

    // Make introduction text visible if this is the first question
    this.setVisibility(document.querySelector('#firstQuestion'), this.currentQuestion == 0);

    // Set the question text
    document.querySelector('#questionText').innerHTML = questionData.questionText;

    // Set the image
    let imageURL = questionData.image;
    let imageElement = document.querySelector('#image');
    if (imageURL != null) {
      let srcAttr = document.createAttribute('src');
      srcAttr.value = "images/" + imageURL;
      imageElement.setAttributeNode(srcAttr);
    }
    this.setVisibility(imageElement, imageURL != null);

    // Set the instruction text
    this.setVisibility(multiple, questionData.type == 'multi');

    // Set the options
    let options = this.quizData[this.currentQuestion].options;
    let optionsDiv = document.querySelector('#options');
    for (let i = 0; i < options.length; i++) {
      let newOption = document.createElement('button');
      newOption.innerHTML = options[i].optionText;
      let classAttr = document.createAttribute('class');
      classAttr.value = 'optionButton';
      newOption.setAttributeNode(classAttr);
      optionsDiv.appendChild(newOption);
    }
  },
  setVisibility: function(element, condition) {
    if (condition) {
      element.classList.remove('hidden');
    } else {
      element.classList.add('hidden');
    }
  },
  checkAnswer: function(questionType, correct, numOptions) {
    let formValues = new URLSearchParams(window.location.search);
    let correctFeedback = document.querySelector('#correct');
    let incorrectFeedback = document.querySelector('#incorrect');
    let nextQuestion = document.querySelector('#nextQuestion');
    let answerGiven = document.querySelector('#answerGiven');
    let submitButton = document.querySelector('#submit');

    if (!formValues.entries().next().done) {
      let answer = '';
      let answerString = '';
      if (questionType == 'multi') {
        for (let i = 1; i <= numOptions; i = i + 1) {
          if (formValues.has('answer' + i)) {
            let commaString = answer.length > 0 ? ', ' : '';
            answer += commaString + i;
            answerString += commaString + document.querySelector('#label' + i).innerHTML
          }
        }
      } else {
        answer = formValues.get('answer');
        answerString = document.querySelector('#label' + answer).innerHTML;
      }

      answerGiven.innerHTML = 'Your answer was ' + answerString;
      answerGiven.classList.remove('hidden');

      if (answer == correct) {
        for (let i = 1; i <= numOptions; i++) {
          document.querySelector('#option' + i).disabled = true;
        }
        submitButton.classList.add('hidden');
        correctFeedback.classList.remove('hidden');
        nextQuestion.classList.remove('hidden');
      } else {
        incorrectFeedback.classList.remove('hidden');
      }
    }
  }
}
