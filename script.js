import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";
import { topics } from "./topics.js";

const firebaseConfig = {
  apiKey: "AIzaSyDZZSJ-ULLXEqg3b5d76yvGIUGdGFxnHmY",
  authDomain: "live-poll-presentation.firebaseapp.com",
  databaseURL: "https://live-poll-presentation-default-rtdb.firebaseio.com/",
  projectId: "live-poll-presentation",
  storageBucket: "live-poll-presentation.firebasestorage.app",
  messagingSenderId: "157429793183",
  appId: "1:157429793183:web:9fbca05234027e651a3daa"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

let topicIndex = 0;
let questionIndex = 0;

const topicTitle = document.getElementById("topic");
const desc = document.getElementById("description");
const question = document.getElementById("question");
const options = document.getElementById("options");
const nextBtn = document.getElementById("nextBtn");

function loadQuestion() {

    const currentTopic = topics[topicIndex];
    const currentQuestion = currentTopic.questions[questionIndex];

    topicTitle.innerText = currentTopic.title;
    desc.innerText = currentTopic.description;
    question.innerText = currentQuestion.q;

    options.innerHTML = "";

    currentQuestion.options.forEach(option => {

        const btn = document.createElement("button");
        btn.innerText = option;

        btn.onclick = () => vote(option);

        options.appendChild(btn);

    });

}

function vote(option){

    const voteRef = ref(db, "votes");

    push(voteRef, {
        topic: topics[topicIndex].title,
        question: questionIndex,
        answer: option,
        time: new Date().toISOString()
    });

    alert("Vote submitted: " + option);

}

nextBtn.onclick = () => {

    questionIndex++;

    if (questionIndex >= topics[topicIndex].questions.length) {
        questionIndex = 0;
        topicIndex++;
    }

    if (topicIndex >= topics.length) {
        alert("🎉 Quiz Completed!");
        topicIndex = 0;
        questionIndex = 0;
    }

    loadQuestion();

};

loadQuestion();
