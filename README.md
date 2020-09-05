# html-games-quiz
A simple HTML quiz. This quiz features multiple choice questions of both single-answer and multiple-answer types. Players have up to two attempts to answer each question correctly. The quiz is scored, with 0 points awarded for an incorrectly answered question, 1 point for a question answered correctly on a second attempt and 2 points for a question answered correctly on a first attempt. The final score is shown at the end of the quiz. The player has the option to replay the quiz when they reach the end.
## How to create new questions
Questions are stored in the **quiz.json** file within the **data** folder. The root of this file is an array containing the questions in the quiz. Each question is a single object with the following properties:
- **type**: set to "single" for a single-answer type question, or "multi" for a multiple-answer type question
- **questionText**: The question to be shown to the player (this can include HTML if required)
- **image**: The filename of an image to be shown with the question, or **null** if there is no image. Images must be stored in the **images** folder
- **options**: An array of answer options. Each answer option is an object with the following properties:
  - **optionText**: The answer text to be shown to the player. This can include HTML if required
  - **correct**: Set to **true** if this answer is correct, or **false** otherwise
