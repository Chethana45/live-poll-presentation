

import { initializeApp }
from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js"

import { getDatabase, ref, push, onValue }
from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js"

import { topics } from "./topics.js"

const firebaseConfig = {

apiKey:"AIzaSyDZZSJ-ULLXEqg3b5d76yvGIUGdGFxnHmY",

authDomain:"live-poll-presentation.firebaseapp.com",

databaseURL:"https://live-poll-presentation-default-rtdb.firebaseio.com/",

projectId:"live-poll-presentation"

}

const app = initializeApp(firebaseConfig)

const db = getDatabase(app)

let topicIndex=0

let score=0

const topic=document.getElementById("topic")
const theory=document.getElementById("theory")

const question=document.getElementById("question")

const options=document.getElementById("options")

const startBtn=document.getElementById("startBtn")

const nextBtn=document.getElementById("nextBtn")

const timerText=document.getElementById("timer")

const chartCanvas=document.getElementById("chart")

const scoreText=document.getElementById("score")

let chart
let time=10
let timer

function loadTopic(){

const t=topics[topicIndex]

topic.innerText=t.title
theory.innerText=t.theory

question.innerText=t.question.text

options.innerHTML=""

t.question.options.forEach(opt=>{

const btn=document.createElement("button")

btn.innerText=opt

btn.onclick=()=>vote(opt)

options.appendChild(btn)

})

}

function startTimer(){

time=10

timer=setInterval(()=>{

timerText.innerText="Time left: "+time

time--

if(time<0){

clearInterval(timer)

showResults()

}

},1000)

}

function vote(option){

push(ref(db,"polls/"+topicIndex),{

answer:option

})

if(option===topics[topicIndex].question.correct){

score++

}

clearInterval(timer)

showResults()

}

function showResults(){

const voteRef=ref(db,"polls/"+topicIndex)

onValue(voteRef,(snapshot)=>{

const data=snapshot.val()||{}

const counts={}

topics[topicIndex].question.options.forEach(o=>counts[o]=0)

Object.values(data).forEach(v=>counts[v.answer]++)

const labels=Object.keys(counts)

const values=Object.values(counts)

if(chart) chart.destroy()

chart=new Chart(chartCanvas,{

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

startTimer()

}

nextBtn.onclick=()=>{

topicIndex++

if(topicIndex>=topics.length){

scoreText.innerText="🎉 Your Score: "+score+"/"+topics.length

return

}

loadTopic()

}

loadTopic()
