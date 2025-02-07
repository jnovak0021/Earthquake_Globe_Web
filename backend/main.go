package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/mux"
	"golang.org/x/crypto/bcrypt" //this is for the create user func
)

type User struct {
	Id       int    `json:"id"`
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password,omitempty"`
}

type Earthquake struct {
	Id        string  `json:"id"`
	Time      string  `json:"time"`
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
	Depth     float64 `json:"depth"`
	Mag       float64 `json:"mag"`
	Place     string  `json:"place"`
	Status    string  `json:"status"`
}

func connectWithRetry(dsn string) *sql.DB {
	var db *sql.DB
	var err error

	for retries := 5; retries > 0; retries-- {
		db, err = sql.Open("mysql", dsn)
		if err == nil && db.Ping() == nil {
			return db
		}
		log.Printf("Retrying connection to the database. Retries left: %d", retries-1)
		time.Sleep(5 * time.Second)
	}

	log.Fatalf("Failed to connect to the database: %v", err)
	return nil
}

func main() {
	log.Print("Application started")
	log.Println("This is a log message with a newline.")
	log.Println("Database")
	//connect to database

	//store password for user admin
	// Define your DSN (Data Source Name)
	dbConfig := map[string]string{
		"host":     "earthquake.cn8yiso6kgjx.us-east-1.rds.amazonaws.com",
		"user":     "admin",
		"password": "EAhvGyr8Zn55b07I",
		"database": "Earthquake",
	}
	dsn := fmt.Sprintf("%s:%s@tcp(%s)/%s", dbConfig["user"], dbConfig["password"], dbConfig["host"], dbConfig["database"])

	// Call the connectWithRetry function
	db := connectWithRetry(dsn)
	defer db.Close()

	/*db, err := sql.Open("mysql", os.Getenv("DATABASE_URL"))
	if err != nil {
		log.Println("Database failed")
		log.Fatal(err)
	}
	*/
	//defer db.Close()

	log.Println("Successfully connected to Database")

	// create table if not exists
	//declaring err
	//var err error

	// _, err = db.Exec(`CREATE TABLE IF NOT EXISTS users (
	//     id INT AUTO_INCREMENT PRIMARY KEY,
	//     name TEXT,
	//     email TEXT,
	// 	password TEXT NOT NULL
	// // )`)
	// if err != nil {
	// 	log.Fatalf("Error creating table: %v", err)
	// }

	// User routes
	router := mux.NewRouter()

	router.HandleFunc("/api/go/users", getUsers(db)).Methods("GET")           // Get all users
	router.HandleFunc("/api/go/users", createUser(db)).Methods("POST")        // Create a new user (signup)
	router.HandleFunc("/api/go/login", loginUser(db)).Methods("POST")         // User login
	router.HandleFunc("/api/go/users/{id}", getUser(db)).Methods("GET")       // Get user by ID
	router.HandleFunc("/api/go/users/{id}", updateUser(db)).Methods("PUT")    // Update user
	router.HandleFunc("/api/go/users/{id}", deleteUser(db)).Methods("DELETE") // Delete user

	//add router decleration for quering earthquake data
	router.HandleFunc("/api/go/earthquakes", getEarthquakes(db)).Methods("GET") // Get all earthquakes

	// wrap the router with CORS and JSON content type middlewares
	enhancedRouter := enableCORS(jsonContentTypeMiddleware(router))

	// start server
	log.Fatal(http.ListenAndServe(":8080", enhancedRouter))
	log.Println("Successfully reached end of main")

}

func enableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Set CORS headers
		w.Header().Set("Access-Control-Allow-Origin", "*") // Allow any origin
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		// Check if the request is for CORS preflight
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		// Pass down the request to the next middleware (or final handler)
		next.ServeHTTP(w, r)
	})
}

func jsonContentTypeMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Set JSON Content-Type
		w.Header().Set("Content-Type", "application/json")
		next.ServeHTTP(w, r)
	})
}

// function to get earthquakes from aws
// function to get earthquakes from aws
func getEarthquakes(db *sql.DB) http.HandlerFunc {
	log.Println("EARTHQUAKES")

	return func(w http.ResponseWriter, r *http.Request) {
		// Extract query parameters
		startTime := r.URL.Query().Get("startTime")
		endTime := r.URL.Query().Get("endTime")
		minMagnitude := r.URL.Query().Get("minMagnitude")
		maxMagnitude := r.URL.Query().Get("maxMagnitude")
		minDepth := r.URL.Query().Get("minDepth")
		maxDepth := r.URL.Query().Get("maxDepth")

		// Build the SQL query with the parameters
		query := `
            SELECT id, time, latitude, longitude, depth, mag, place, status
            FROM Earthquakes
            WHERE time BETWEEN ? AND ?
            AND mag BETWEEN ? AND ?
            AND depth BETWEEN ? AND ?
        `
		rows, err := db.Query(query, startTime, endTime, minMagnitude, maxMagnitude, minDepth, maxDepth)
		if err != nil {
			log.Fatal(err)
		}
		defer rows.Close()

		earthquakes := []Earthquake{}
		for rows.Next() {
			var e Earthquake
			var timeBytes []byte
			if err := rows.Scan(&e.Id, &timeBytes, &e.Latitude, &e.Longitude, &e.Depth, &e.Mag, &e.Place, &e.Status); err != nil {
				log.Fatal(err)
			}
			e.Time = string(timeBytes)
			earthquakes = append(earthquakes, e)
		}
		if err := rows.Err(); err != nil {
			log.Fatal(err)
		}

		// Log the earthquakes
		for _, e := range earthquakes {
			log.Printf("Earthquake: %+v\n", e)
		}

		// Encode the earthquakes as JSON and write to the response
		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(earthquakes); err != nil {
			http.Error(w, "Failed to encode earthquakes as JSON", http.StatusInternalServerError)
		}
	}
}

// get all users
func getUsers(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		rows, err := db.Query("SELECT * FROM users")
		if err != nil {
			log.Fatal(err)
		}
		defer rows.Close()

		users := []User{} // array of users
		for rows.Next() {
			var u User
			if err := rows.Scan(&u.Id, &u.Name, &u.Email, &u.Password); err != nil {
				log.Fatal(err)
			}
			users = append(users, u)
		}
		if err := rows.Err(); err != nil {
			log.Fatal(err)
		}

		json.NewEncoder(w).Encode(users)
	}
}

// get user by id
func getUser(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		id := vars["id"]

		var u User
		err := db.QueryRow("SELECT * FROM users WHERE id = ?", id).Scan(&u.Id, &u.Name, &u.Email, &u.Password)
		if err != nil {
			w.WriteHeader(http.StatusNotFound)
			return
		}

		json.NewEncoder(w).Encode(u)
	}
}

// create user
func createUser(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var u User
		json.NewDecoder(r.Body).Decode(&u)

		// Hash the password before storing it
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(u.Password), bcrypt.DefaultCost)
		if err != nil {
			http.Error(w, "Error hashing password", http.StatusInternalServerError)
			return
		}

		result, err := db.Exec("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", u.Name, u.Email, string(hashedPassword))
		if err != nil {
			http.Error(w, "Error saving user", http.StatusInternalServerError)
			return
		}

		id, err := result.LastInsertId()
		if err != nil {
			http.Error(w, "Error getting last inserted ID", http.StatusInternalServerError)
			return
		}
		u.Id = int(id)

		// Don't return the password in the response
		u.Password = ""
		json.NewEncoder(w).Encode(u)
	}
}

// update user
func updateUser(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var u User
		if err := json.NewDecoder(r.Body).Decode(&u); err != nil {
			http.Error(w, "Invalid request payload", http.StatusBadRequest)
			return
		}

		vars := mux.Vars(r)
		id := vars["id"]

		// If a new password is provided, hash it before updating
		var hashedPassword string
		if u.Password != "" {
			hash, err := bcrypt.GenerateFromPassword([]byte(u.Password), bcrypt.DefaultCost)
			if err != nil {
				http.Error(w, "Failed to hash password", http.StatusInternalServerError)
				return
			}
			hashedPassword = string(hash)
		}

		// Update query
		var err error
		if hashedPassword != "" {
			_, err = db.Exec("UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?", u.Name, u.Email, hashedPassword, id)
		} else {
			_, err = db.Exec("UPDATE users SET name = ?, email = ? WHERE id = ?", u.Name, u.Email, id)
		}

		if err != nil {
			log.Println("Error updating user:", err)
			http.Error(w, "Failed to update user", http.StatusInternalServerError)
			return
		}

		// Retrieve updated user info (excluding password for security)
		var updatedUser User
		err = db.QueryRow("SELECT id, name, email FROM users WHERE id = ?", id).Scan(&updatedUser.Id, &updatedUser.Name, &updatedUser.Email)
		if err != nil {
			log.Println("Error retrieving updated user:", err)
			http.Error(w, "Failed to fetch updated user", http.StatusInternalServerError)
			return
		}

		// Send the updated user data in the response
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(updatedUser)
	}
}

// delete user
func deleteUser(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		id := vars["id"]

		var u User
		err := db.QueryRow("SELECT * FROM users WHERE id = ?", id).Scan(&u.Id, &u.Name, &u.Email)
		if err != nil {
			w.WriteHeader(http.StatusNotFound)
			return
		} else {
			_, err := db.Exec("DELETE FROM users WHERE id = ?", id)
			if err != nil {
				//todo : fix error handling
				w.WriteHeader(http.StatusNotFound)
				return
			}

			json.NewEncoder(w).Encode("User deleted")
		}
	}
}

func loginUser(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var input User
		json.NewDecoder(r.Body).Decode(&input)

		var storedUser User
		err := db.QueryRow("SELECT id, name, email, password FROM users WHERE email = ?", input.Email).
			Scan(&storedUser.Id, &storedUser.Name, &storedUser.Email, &storedUser.Password)
		if err != nil {
			http.Error(w, "Invalid email or password", http.StatusUnauthorized)
			return
		}

		// Compare hashed password with provided password
		err = bcrypt.CompareHashAndPassword([]byte(storedUser.Password), []byte(input.Password))
		if err != nil {
			http.Error(w, "Invalid email or password", http.StatusUnauthorized)
			return
		}

		// Remove password from response
		storedUser.Password = ""
		json.NewEncoder(w).Encode(storedUser)
	}
}
