//database initialization
var config = {
	apiKey: "AIzaSyB5w4RMIQuMTdOYoLeAAXep_00_uXGkH-I",
	authDomain: "rps-online-78554.firebaseapp.com",
	databaseURL: "https://rps-online-78554.firebaseio.com",
	projectId: "rps-online-78554",
	storageBucket: "",
	messagingSenderId: "566981574178"
};
firebase.initializeApp(config);
var database = firebase.database();

//check who won and return name of winner
function checkWinner(p1, p2) {
	if (p1 == "Rock" && p2 == "Paper")
		return "p2";
	else if (p1 == "Rock" && p2 == "Scissors")
		return "p1";
	else if (p1 == "Paper" && p2 == "Rock")
		return "p1";
	else if (p1 == "Paper" && p2 == "Scissors")
		return "p2";
	else if (p1 == "Scissors" && p2 == "Paper")
		return "p1";
	else if (p1 == "Scissors" && p2 == "Rock")
		return "p2";
	else if (p1 == p2)
		return "tie";
	else
		return "error"
}

var p1Wins = 0;
var p2Wins = 0;
var ties = 0;

$(document).ready(function() {

	//button listeners
	$("body").on("click", "#p1-join", function() {
		$("#p1-buttons").attr("class", "");
		$("#join-buttons").attr("class", "hidden");
		$("#user-player").text("You are Player 1");
	});
	$("body").on("click", "#p2-join", function() {
		$("#p2-buttons").attr("class", "");
		$("#join-buttons").attr("class", "hidden");
		$("#user-player").text("You are Player 2");
	});
	$("#p1-buttons").on("click", "button", function() {
		$(this).attr("class", "btn btn-primary");
		var selection = $(this).text();
		database.ref("/selections").update({
			p1: selection
		});
	});
	$("#p2-buttons").on("click", "button", function() {
		$(this).attr("class", "btn btn-primary");
		var selection = $(this).text();
		database.ref("/selections").update({
			p2: selection
		});
	});

	//when both users have chosen something, check who won and update
	database.ref("/selections").on("value", function(snap) {
		if (snap.child("p1").exists() && snap.child("p2").exists()) {
			var winner = checkWinner(snap.child("p1").val(), snap.child("p2").val());
			console.log(winner);
			if (winner == "p1") {
				p1Wins++;
				database.ref("/wins").update({
					p1: p1Wins
				});
			}
			else if (winner == "p2") {
				p2Wins++;
				database.ref("/wins").update({
					p2: p2Wins
				});
			}
			else if (winner == "tie") {
				ties++;
				database.ref("/wins").update({
					ties: ties
				});
			}
			
			$("#p1-selection").text(snap.child("p1").val());
			$("#p2-selection").text(snap.child("p2").val());

			$(".btn-primary").attr("class", "btn btn-secondary");

			database.ref("/selections/p1").remove();
			database.ref("/selections/p2").remove();
		}
	});

	//managing wincounts on database and local variables
	database.ref("/wins").on("value", function(snap) {
		if (!snap.child("p1").exists()) {
			database.ref("/wins").update({
				p1: p1Wins
			});
		} else {
			p1Wins = snap.child("p1").val();
			$("#p1-wins").text(p1Wins);
		}
		
		if (!snap.child("p2").exists()) {
			database.ref("/wins").update({
				p2: p2Wins
			});
		} else {
			p2Wins = snap.child("p2").val();
			$("#p2-wins").text(p2Wins);
		}

		if (!snap.child("ties").exists()) {
			database.ref("/wins").update({
				ties: ties
			});
		} else {
			ties = snap.child("ties").val();
			$("#ties").text(ties);
		}
	});
});