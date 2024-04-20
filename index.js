const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Load questions from JSON file
const questions = JSON.parse(fs.readFileSync('questions.json', 'utf-8'));

// Serve HTML file
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// API endpoint to get questions
app.get('/api/questions', (req, res) => {
    res.json(questions);
});

// API endpoint to submit answers
app.post('/api/submit', (req, res) => {
    const answers = req.body.answers;
    let score = 0;
    const results = [];

    questions.forEach((question, index) => {
        if (question.answer === answers[index]) {
            score++;
            results.push({ correct: true, your_answer: answers[index], correct_answer: question.answer });
        } else {
            results.push({ correct: false, your_answer: answers[index], correct_answer: question.answer });
        }
    });

    console.log(results);

    res.json({ score, results });
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
