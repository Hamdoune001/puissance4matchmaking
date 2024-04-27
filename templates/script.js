let Table;
let TableGUI = document.querySelector("#table");
let buttonsDiv = document.querySelector(".buttons");
let currPlayer = "R";
document.querySelector("#setup").addEventListener("click", () => {
	console.log("Configuration du jeu...");
	let rows = parseInt(document.querySelector("#rows").value);
	let columns = parseInt(document.querySelector("#columns").value);
	if (rows > 0 && columns > 0) {
		setup(rows, columns);
	} else {
		alert("Veuillez entrer un nombre valide de lignes et de colonnes.");
	}
});

function setup(rows, columns) {
	Table = new Array(rows);
	for (i = 0; i < rows; i++) {
		Table[i] = new Array(columns).fill(0);
	}
	TableGUI.innerHTML = "";
	rowHTML = "";
	buttonsDiv.innerHTML = "";
	for (i = 0; i < columns; i++) {
		rowHTML += "<div class='case'></div>";
		buttonsDiv.innerHTML += "<div class='jeton R'></div>";
	}
	for (i = 0; i < rows; i++) {
		TableGUI.innerHTML += "<div class='row'>" + rowHTML + "</div>";
	}

	document.querySelectorAll(".buttons>div").forEach((button, index) => {
		button.addEventListener("click", () => {
			placeCoin(currPlayer, index);
			nextPlayer();
		});
	});
}
window.onload = setup(6, 7);

function nextPlayer() {
	currPlayer == "R" ? (currPlayer = "Y") : (currPlayer = "R");
	document.querySelectorAll(".buttons>div").forEach((button) => {
		if (currPlayer == "R") {
			button.classList.replace("Y", "R");
		} else {
			button.classList.replace("R", "Y");
		}
	});
}

// Function to handle registration form submission
document.getElementById("register-form").addEventListener("submit", function(event) {
	event.preventDefault(); // Prevent default form submission

	// Get username and password from the form
	let username = document.getElementById("username").value;
	let password = document.getElementById("password").value;

	// Send a POST request to the server to register the player
	fetch("/register", {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ username: username, password: password })
	})
		.then(response => response.json())
		.then(data => {
			console.log("Player registered:", data);
			// Optionally, you can do something after the player is registered
		})
		.catch(error => {
			console.error("Error registering player:", error);
		});
});


function checkWin() {
	// Vérification horizontale
	for (let i = 0; i < Table.length; i++) {
		for (let j = 0; j <= Table[i].length - 4; j++) {
			if (
				Table[i][j] != 0 &&
				Table[i][j] == Table[i][j + 1] &&
				Table[i][j] == Table[i][j + 2] &&
				Table[i][j] == Table[i][j + 3]
			) {
				alert("Le joueur " + Table[i][j] + " a gagné !");
				return true;
			}
		}
	}

	// Vérification verticale
	for (let i = 0; i <= Table.length - 4; i++) {
		for (let j = 0; j < Table[i].length; j++) {
			if (
				Table[i][j] != 0 &&
				Table[i][j] == Table[i + 1][j] &&
				Table[i][j] == Table[i + 2][j] &&
				Table[i][j] == Table[i + 3][j]
			) {
				alert("Le joueur " + Table[i][j] + " a gagné !");
				return true;
			}
		}
	}

	// Vérification diagonale (descendante)
	for (let i = 0; i <= Table.length - 4; i++) {
		for (let j = 0; j <= Table[i].length - 4; j++) {
			if (
				Table[i][j] != 0 &&
				Table[i][j] == Table[i + 1][j + 1] &&
				Table[i][j] == Table[i + 2][j + 2] &&
				Table[i][j] == Table[i + 3][j + 3]
			) {
				alert("Le joueur " + Table[i][j] + " a gagné !");
				return true;
			}
		}
	}

	// Vérification diagonale (ascendante)
	for (let i = 3; i < Table.length; i++) {
		for (let j = 0; j <= Table[i].length - 4; j++) {
			if (
				Table[i][j] != 0 &&
				Table[i][j] == Table[i - 1][j + 1] &&
				Table[i][j] == Table[i - 2][j + 2] &&
				Table[i][j] == Table[i - 3][j + 3]
			) {
				alert("Le joueur " + Table[i][j] + " a gagné !");
				return true;
			}
		}
	}

	return false;
}

function placeCoin(coin, column) {
	isPlaced = false;
	for (i = Table.length - 1; i >= 0; i--) {
		if (!isPlaced) {
			if (Table[i][column] == 0) {
				Table[i][column] = coin;
				cellGUI = document
					.querySelectorAll("div.row")
					[i].querySelectorAll("div")[column];
				cellGUI.classList.remove("case");
				cellGUI.classList.add("jeton");
				cellGUI.classList.add(coin);
				isPlaced = true;
				if (checkWin()) {
					return; // Si un joueur a gagné, arrêtez la fonction
				}
			}
		}
	}
	if (!isPlaced) {
		console.log("Plus de Place");
	}
}
