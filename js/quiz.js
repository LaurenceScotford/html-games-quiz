function checkAnswer() {
  let formValues = new URLSearchParams(window.location.search);
  let result = 'incorrect!\nTry again or go to the next question';
  let answer = formValues.get('answer');
  let correctFeedback = document.querySelector('#correct');
  let incorrectFeedback = document.querySelector('#incorrect');
  let nextQuestion = document.querySelector('#nextQuestion');

  if (answer == '3') {
    correctFeedback.classList.remove('hidden');
    nextQuestion.classList.remove('hidden');
  } else if (answer != null) {
    incorrectFeedback.classList.remove('hidden');
  }
}
