const express = require('express');
const bodyParser = require('body-parser');
const quizData = require('./questions.json');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Serve the quiz questions
app.get('/quiz', (req, res) => {
  res.json(quizData);
});

// Handle quiz submission
app.post('/quiz', (req, res) => {
  const userAnswers = req.body.answers;
  let score = 0;
  const results = [];

  // Calculate score and provide feedback
  quizData.forEach((question, index) => {
    const correctAnswer = question.answer;
    const userAnswer = userAnswers[index];

    if (userAnswer === correctAnswer) {
      score++;
      results.push({ question: question.question, userAnswer, correctAnswer, result: 'correct' });
    } else {
      results.push({ question: question.question, userAnswer, correctAnswer, result: 'incorrect' });
    }
  });

  res.json({ score, results });
});

// Handle 404 - Not Found
app.use((req, res) => {
  res.status(404).send('404 - Not Found');
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('500 - Internal Server Error');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
