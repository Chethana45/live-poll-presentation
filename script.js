import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js"
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js"

import { topics } from "./topics.js"

const firebaseConfig = {

apiKey: "YOUR_KEY",
authDomain: "YOUR_DOMAIN",
databaseURL: "YOUR_DATABASE_URL",
projectId: "YOUR_PROJECT_ID"

}

const app = initializeApp(firebaseConfig)

const db = getDatabase(app)

let topicIndex = 0
let questionIndex = 0

const topic = document.getElementById("topic")
const desc = document.getElementById("description")
const question = document.getElementById("question")
const options = document.getElementById("options")
const nextBtn = document.getElementById("nextBtn")

function loadQuestion(){

const t = topics[topicIndex]

topic.innerText = t.title
desc.innerText = t.description

const q = t.questions[questionIndex]

question.innerText = q.q

options.innerHTML=""

q.options.forEach(opt=>{

const btn=document.createElement("button")

btn.innerText=opt

btn.onclick=()=>vote(opt)

options.appendChild(btn)

})

}

function vote(option){

const voteRef = ref(db,"votes")

push(voteRef,{
topic:topicIndex,
question:questionIndex,
answer:option
})

alert("Vote submitted!")

}

nextBtn.onclick=()=>{

questionIndex++

if(questionIndex>=2){

questionIndex=0
topicIndex++

}

if(topicIndex>=topics.length){

alert("Quiz Completed 🎉")
return

}

loadQuestion()

}

loadQuestion()