const username = document.getElementById('username');
const saveBtn = document.getElementById('saveScoreBtn');

const mostRecentScore = localStorage.getItem("mostRecentScore");
const finalScore = document.getElementById('final-score');
const highScores = (localStorage.getItem('highScores') == "") ? JSON.parse('[]') : JSON.parse(localStorage.getItem('highScores'));

const MAX_HIGH_SCORES = 5;

finalScore.innerText = mostRecentScore;

username.addEventListener('keyup', () => {
    saveBtn.disabled = !username.value
})
saveHighScore = (e) => {
    e.preventDefault();

    const score = {
        score: mostRecentScore,
        name: username.value
    };

    highScores.push(score);
    highScores.sort((a, b) => b.score - a.score);
    highScores.splice(MAX_HIGH_SCORES);

    localStorage.setItem('highScores', JSON.stringify(highScores));
    window.location.assign("/Quiz-App/index.html")
}