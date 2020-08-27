function checkAnswer(questionType, correct, numOptions) {
  let formValues = new URLSearchParams(window.location.search);
  let correctFeedback = document.querySelector('#correct');
  let incorrectFeedback = document.querySelector('#incorrect');
  let nextQuestion = document.querySelector('#nextQuestion');
  let answerGiven = document.querySelector('#answerGiven');


  if (!formValues.entries().next().done) {
    let answer = "";
    let answerString = "";
    if (questionType == "multi") {
      for (let i = 1; i <= numOptions; i = i + 1) {
        if (formValues.has('answer' + i)) {
          let commaString = answer.length > 0 ? ", " : "";
          answer += commaString + i;
          answerString += commaString + document.querySelector("#label" + i).innerHTML
        }
      }
    } else {
      answer = formValues.get('answer');
      answerString = document.querySelector("#label" + answer).innerHTML;
    }

    answerGiven.innerHTML = "Your answer was " + answerString;
    answerGiven.classList.remove('hidden');

    if (answer == correct) {
      correctFeedback.classList.remove('hidden');
      nextQuestion.classList.remove('hidden');
    } else {
      incorrectFeedback.classList.remove('hidden');
    }
  }
}
