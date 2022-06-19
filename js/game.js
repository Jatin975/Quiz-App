const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-text'))
const hudQuestion = document.getElementById('progressText');
const hudScore = document.getElementById('score');
const progressBar = document.getElementById('progress-bar-full');
const game = document.getElementById('game');
const loader = document.getElementById('loader');

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestion = [];

let questions = [];

fetch("https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple")
    .then((res)=> { 
        return res.json();
    })
    .then(loadedQuestions =>{
            // console.log(loadedQuestions.results)
            questions = loadedQuestions.results.map(loadedQuestion =>{
                const formatedQuestion ={
                    question: loadedQuestion.question
                }
                formatedQuestion.answer = Math.floor(Math.random()*3)+1;
                
                const answerChoices =[...loadedQuestion.incorrect_answers];
                answerChoices.splice(formatedQuestion.answer - 1, 0, loadedQuestion.correct_answer);
                
                answerChoices.forEach((choice, index)=>{
                    formatedQuestion["choice"+(index+1)] = choice
                })
                return formatedQuestion;
            })
            startGame()
        })
    .catch(err=> console.log(err));

const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 10;

const startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuestion = [...questions];

    getNewQuestion();
    game.classList.remove('hidden');
    loader.classList.add('hidden');
}
const getNewQuestion = () => {

    if (availableQuestion.length === 0 || questionCounter >= MAX_QUESTIONS) {

        localStorage.setItem('mostRecentScore', score);
        return window.location.assign("/QuizApp/end.html");
    }
    questionCounter++;
    hudQuestion.innerText = 'Question ' + questionCounter + "/" + MAX_QUESTIONS;
    hudScore.innerText = score + "/" + (MAX_QUESTIONS * CORRECT_BONUS);

    progressBar.style.width = (questionCounter / MAX_QUESTIONS) * 100 + "%";
    const questionIndex = Math.floor(Math.random() * availableQuestion.length);
    currentQuestion = availableQuestion[questionIndex];

    question.innerText = currentQuestion.question;


    choices.forEach(choice => {
        const number = choice.dataset['number'];
        choice.innerText = currentQuestion['choice' + number];
    })

    availableQuestion.splice(questionIndex, 1);
    acceptingAnswers = true;
}
choices.forEach((choice) => {
    choice.addEventListener('click', (e) => {

        if (!acceptingAnswers)
            return;
        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset['number'];

        const classToApply = selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";
        score = selectedAnswer == currentQuestion.answer ? score += CORRECT_BONUS : score;
        hudScore.innerText = score + "/" + (MAX_QUESTIONS * CORRECT_BONUS);

        selectedChoice.parentElement.classList.add(classToApply);


        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion()
        }, 1000)
    })
})
// console.log(question);
// console.log(choices);