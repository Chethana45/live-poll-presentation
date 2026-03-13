import { initializeApp } 
from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js"

import { getDatabase, ref, push, onValue } 
from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js"

import { topics } from "./topics.js"


// 🔹 Firebase configuration
const firebaseConfig = {

apiKey: "AIzaSyDZZSJ-ULLXEqg3b5d76yvGIUGdGFxnHmY",
authDomain: "live-poll-presentation.firebaseapp.com",
databaseURL: "https://live-poll-presentation-default-rtdb.firebaseio.com/",
projectId: "live-poll-presentation",
storageBucket: "live-poll-presentation.appspot.com",
messagingSenderId: "157429793183",
appId: "1:157429793183:web:9fbca05234027e651a3daa"

}


// 🔹 Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getDatabase(app)


// Quiz state
let topicIndex = 0
let score = 0


// UI Elements
const topic = document.getElementById("topic")
const theory = document.getElementById("theory")

const question = document.getElementById("question")
const options = document.getElementById("options")

const startBtn = document.getElementById("startBtn")
const nextBtn = document.getElementById("nextBtn")

const timerText = document.getElementById("timer")

const chartCanvas = document.getElementById("chart")

const scoreText = document.getElementById("score")

let chart
let time = 10
let timer



// 🔹 Load topic theory and question
function loadTopic(){

const t = topics[topicIndex]

topic.innerText = t.title
theory.innerText = t.theory

question.innerText = t.question.text

options.innerHTML = ""

t.question.options.forEach(opt=>{

const btn = document.createElement("button")

btn.innerText = opt

btn.onclick = ()=> vote(opt)

options.appendChild(btn)

})

}



// 🔹 Timer
function startTimer(){

time = 10

timer = setInterval(()=>{

timerText.innerText = "Time left: " + time + "s"

time--

if(time < 0){

clearInterval(timer)

showResults()

}

},1000)

}



// 🔹 Submit vote to Firebase
function vote(option){

push(ref(db,"polls/"+topicIndex),{

answer: option

})

if(option === topics[topicIndex].question.correct){

score++

}

clearInterval(timer)

showResults()

}



// 🔹 Show poll results
function showResults(){

const voteRef = ref(db,"polls/"+topicIndex)

onValue(voteRef,(snapshot)=>{

const data = snapshot.val() || {}

const counts = {}

topics[topicIndex].question.options.forEach(o => counts[o] = 0)

Object.values(data).forEach(v => counts[v.answer]++)

const labels = Object.keys(counts)

const values = Object.values(counts)

if(chart) chart.destroy()

chart = new Chart(chartCanvas,{

type:"bar",

data:{
labels:labels,
datasets:[{
label:"Votes",
data:values
}]
}

})

})

}



// 🔹 Start poll
startBtn.onclick = ()=>{

startTimer()

}



// 🔹 Next topic
nextBtn.onclick = ()=>{

topicIndex++

if(topicIndex >= topics.length){

scoreText.innerText = "🎉 Your Score: " + score + "/" + topics.length

return

}

loadTopic()

}



// 🔹 Initialize first topic
loadTopic()
