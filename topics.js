import { initializeApp } from
"https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js"

import { getDatabase, ref, push, onValue }
from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js"

import { topics } from "./topics.js"


const firebaseConfig = {

apiKey: "AIzaSyDZZSJ-ULLXEqg3b5d76yvGIUGdGFxnHmY",
authDomain: "live-poll-presentation.firebaseapp.com",
databaseURL:
"https://live-poll-presentation-default-rtdb.firebaseio.com/",
projectId: "live-poll-presentation"

}

const app = initializeApp(firebaseConfig)
const db = getDatabase(app)

let topicIndex = 0

const topicTitle = document.getElementById("topic")
const theory = document.getElementById("theory")

const questionBox = document.getElementById("questionBox")
const question = document.getElementById("question")
const options = document.getElementById("options")

const startBtn = document.getElementById("startBtn")
const nextBtn = document.getElementById("nextBtn")

const chartCanvas = document.getElementById("resultsChart")

let chart


function loadTopic(){

const t = topics[topicIndex]

topicTitle.innerText = t.title
theory.innerText = t.theory

question.innerText = t.question.text

options.innerHTML=""

t.question.options.forEach(option=>{

const btn=document.createElement("button")
btn.innerText=option

btn.onclick=()=>submitVote(option)

options.appendChild(btn)

})

}

function submitVote(option){

push(ref(db,"polls/"+topicIndex),{

answer:option

})

showResults()

}

function showResults(){

questionBox.style.display="none"
chartCanvas.style.display="block"

const voteRef = ref(db,"polls/"+topicIndex)

onValue(voteRef,(snapshot)=>{

const data = snapshot.val() || {}

const counts = {}

topics[topicIndex].question.options.forEach(o=>{
counts[o]=0
})

Object.values(data).forEach(v=>{
counts[v.answer]++
})

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

startBtn.onclick=()=>{

questionBox.style.display="block"
startBtn.style.display="none"

}

nextBtn.onclick=()=>{

topicIndex++

chartCanvas.style.display="none"
questionBox.style.display="none"
startBtn.style.display="inline"

if(topicIndex>=topics.length){

alert("Presentation finished")
return

}

loadTopic()

}

loadTopic()
