async function fetchQuestions() {
    try {
      const response = await fetch('/quiz');
      const data = await response.json();
      const quizQuestions = document.getElementById('quizQuestions');
      data.forEach((question, index) => {
        const questionElement = document.createElement('div');
        questionElement.innerHTML = `
          <p>${index + 1}. ${question.question}</p>
          <ul>
            ${question.options.map(option => `<li><input type="radio" name="answer${index}" value="${option}">${option}</li>`).join('')}
          </ul>
        `;
        quizQuestions.appendChild(questionElement);
      });
    } catch (error) {
      console.error('Failed to fetch quiz questions:', error);
    }
  }

  async function submitAnswers(event) {
    event.preventDefault();
    const form = document.getElementById('quizForm');
    const formData = new FormData(form);
    const answers = [];

    for (const pair of formData.entries()) {
      answers.push(pair[1]);
    }
if(answers.length==10){
    document.getElementsByClassName("quiz")[0].hidden=true;
    document.getElementById("quizResults").hidden=false;
    try {
      const response = await fetch('/quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ answers })
      });

      const data = await response.json();
     
      displayResults(data);
    } catch (error) {
      console.error('Failed to submit quiz answers:', error);
    }
}

  }

  function displayResults(data) {
    const quizResults = document.getElementById('quizResults');
    quizResults.innerHTML = `<h1>Results</h1>
      <h2>Your score: ${data.score}</h2>
      <ul>
        ${data.results.map(result => `
          <li>
            <p>${result.question}</p>
            <p><b>Your answer:</b> ${result.userAnswer}</p>
            <p><b>Correct answer:</b> ${result.correctAnswer}</p>
            <p><b>Result:</b> <span style="color: ${result.result === 'correct' ? 'green' : 'red'};  font-weight: 600;">${result.result}</span></p>
          </li>
        `).join('')}
      </ul>
    `;
  }

  document.getElementById('quizForm').addEventListener('submit', submitAnswers);

  fetchQuestions();