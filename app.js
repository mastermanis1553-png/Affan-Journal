const firebaseConfig = {
  apiKey: "AIzaSyCYNSLrTEAZz1lcqlKS5rSlHtCoZXj1W6I",
  authDomain: "jornal-74e5f.firebaseapp.com",
  projectId: "jornal-74e5f"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

function signup() {
let email = document.getElementById("email").value;
let password = document.getElementById("password").value;

auth.createUserWithEmailAndPassword(email, password)
.then(() => alert("Account Created"))
.catch(err => alert(err.message));
}

function login() {
let email = document.getElementById("email").value;
let password = document.getElementById("password").value;

auth.signInWithEmailAndPassword(email, password)
.then(() => window.location = "dashboard.html")
.catch(err => alert(err.message));
}

function addTrade() {
let entry = parseFloat(document.getElementById("entry").value);
let sl = parseFloat(document.getElementById("sl").value);
let target = parseFloat(document.getElementById("target").value);

let risk = Math.abs(entry - sl);
let reward = Math.abs(target - entry);
let rr = reward / risk;

db.collection("trades").add({
entry, sl, target, rr,
user: auth.currentUser.uid
});

alert("Trade Saved 🔥");
loadTrades();
}

function loadTrades() {
let table = document.getElementById("table");

let total = 0;
let wins = 0;
let totalRR = 0;

db.collection("trades")
.where("user", "==", auth.currentUser.uid)
.get()
.then(snapshot => {

table.innerHTML = `
<tr>
<th>Entry</th>
<th>SL</th>
<th>Target</th>
<th>RR</th>
<th>Result</th>
</tr>`;

snapshot.forEach(doc => {
let t = doc.data();

total++;
if(t.result === "win") wins++;

totalRR += t.rr;

let colorClass = t.result === "win" ? "win" : "loss";

table.innerHTML += `
<tr>
<td>${t.entry}</td>
<td>${t.sl}</td>
<td>${t.target}</td>
<td>${t.rr.toFixed(2)}</td>
<td class="${colorClass}">${t.result}</td>
</tr>`;
});

// 🔥 CALCULATIONS
let winrate = (wins / total) * 100;
let expectancy = totalRR / total;

document.getElementById("total").innerText = total;
document.getElementById("winrate").innerText = winrate.toFixed(1) + "%";
document.getElementById("expectancy").innerText = expectancy.toFixed(2) + "R";

});
}
