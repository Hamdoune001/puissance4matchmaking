package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"html/template"
	"log"
	"net/http"
	"time"

	_ "github.com/mattn/go-sqlite3"
)

// Player représente un joueur
type Player struct {
	ID         int    `json:"id"`
	Username   string `json:"username"`
	Password   string `json:"password"`
	EntryDate  string `json:"entry_date"`
	LastActive string `json:"last_active"`
}

// Game représente une partie
type Game struct {
	ID        int    `json:"id"`
	Player1ID int    `json:"player1_id"`
	Player2ID int    `json:"player2_id"`
	StartTime string `json:"start_time"`
	EndTime   string `json:"end_time"`
	WinnerID  int    `json:"winner_id"`
	Result    string `json:"result"`
}

// DbConn établit la connexion à la base de données
func DbConn() (db *sql.DB) {
	db, err := sql.Open("sqlite3", "C:/Users/User/Desktop/bil pro/puissance4matchmaking/puissance4.sqlite")
	if err != nil {
		log.Fatal("Erreur lors de la connexion à la base de données :", err)
	}

	defer db.Close()
	return db
}

// Ajouter un joueur dans la base de données
func AddPlayer(username, password string) error {
	// Ouvrir la connexion à la base de données
	db := DbConn()
	defer db.Close()

	// Préparer la requête d'insertion
	stmt, err := db.Prepare("INSERT INTO players(username, password) VALUES(?, ?)")
	if err != nil {
		return err
	}
	defer stmt.Close()

	// Exécuter la requête d'insertion avec les valeurs fournies
	_, err = stmt.Exec(username, password)
	if err != nil {
		return err
	}

	return nil
}

// HandleAddPlayer gère la requête pour ajouter un joueur à la base de données
func HandleAddPlayer(w http.ResponseWriter, r *http.Request) {
	db := DbConn()
	defer db.Close()

	if r.Method == "POST" {
		var player Player
		json.NewDecoder(r.Body).Decode(&player)

		// Insertion du joueur dans la base de données
		insert, err := db.Query("INSERT INTO players(username, password, entry_date, last_active) VALUES(?,?,?,?)", player.Username, player.Password, time.Now().Format("2006-01-02 15:04:05"), time.Now().Format("2006-01-02 15:04:05"))
		if err != nil {
			fmt.Println(err)
			return
		}
		defer insert.Close()

		// Renvoyer la réponse
		json.NewEncoder(w).Encode(player)
	}
}

// HandleAddGame gère la requête pour ajouter une partie à la base de données
func HandleAddGame(w http.ResponseWriter, r *http.Request) {
	db := DbConn()
	defer db.Close()

	if r.Method == "POST" {
		var game Game
		json.NewDecoder(r.Body).Decode(&game)

		// Insertion de la partie dans la base de données
		insert, err := db.Query("INSERT INTO games(player1_id, player2_id, start_time) VALUES(?,?,?)", game.Player1ID, game.Player2ID, time.Now().Format("2006-01-02 15:04:05"))
		if err != nil {
			fmt.Println(err)
			return
		}
		defer insert.Close()

		// Renvoyer la réponse
		json.NewEncoder(w).Encode(game)
	}
}
func UserHandler(w http.ResponseWriter, r *http.Request) {

	tmpl, err := template.ParseFiles("templates/login.html")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	err = tmpl.Execute(w, nil)
	if err != nil {
		http.Error(w, "Erreur lors de l'exécution de la template HTML: "+err.Error(), http.StatusInternalServerError)
		return
	}
}
func main() {
	http.Handle("/templates/", http.StripPrefix("/templates/", http.FileServer(http.Dir("templates/"))))
	http.HandleFunc("/addplayer", HandleAddPlayer)
	http.HandleFunc("/addgame", HandleAddGame)
	http.HandleFunc("/", UserHandler)
	http.HandleFunc("/register", HandleRegister)
	http.HandleFunc("/index", index)
	http.HandleFunc("/login", HandleLogin)
	log.Fatal(http.ListenAndServe(":8080", nil))
}
