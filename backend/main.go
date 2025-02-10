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
	//Id        int     `json:"id"`
	Id    string  `json:"id"`
	Time      string  `json:"time"`
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
	Depth     float64 `json:"depth"`
	Mag       float64 `json:"mag"`
	Place     string  `json:"place"`
	Status    string  `json:"status"`
}

type UserPreferences struct {
    ID         int     `json:"id"`         // ID field for unique identifier
    UserId     int     `json:"user_id"`     // Link to the user (foreign key)
    StartTime  string  `json:"start_time"`  // Start time for the preference filter
    EndTime    string  `json:"end_time"`    // End time for the preference filter
    MinMag     float64 `json:"min_mag"`     // Minimum magnitude for filter
    MaxMag     float64 `json:"max_mag"`     // Maximum magnitude for filter
    MinDepth   float64 `json:"min_depth"`   // Minimum depth for filter
    MaxDepth   float64 `json:"max_depth"`   // Maximum depth for filter
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

	log.Println("Successfully connected to Database")

	// create table if not exists
	//declaring err
	//var err error

	// User routes
	router := mux.NewRouter()

	router.HandleFunc("/api/go/users", getUsers(db)).Methods("GET")                          // Get all users
	router.HandleFunc("/api/go/users", createUser(db)).Methods("POST")                       // Create a new user (signup)
	router.HandleFunc("/api/go/login", loginUser(db)).Methods("POST")                        // User login
	router.HandleFunc("/api/go/users/{id}", getUser(db)).Methods("GET")                      // Get user by ID
	router.HandleFunc("/api/go/users/{id}", updateUser(db)).Methods("PUT")                   // Update user
	router.HandleFunc("/api/go/users/{id}", deleteUser(db)).Methods("DELETE")                // Delete user
	router.HandleFunc("/api/go/users/preferences", createUserPreferences(db)).Methods("POST") // Create user preferences
	router.HandleFunc("/api/go/users/preferences/{id}", getUserPreferences(db)).Methods("GET") // Get user preferences

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

/*
INSERT INTO UserPreferences (user_id, start_time, end_time, min_mag, max_mag, min_depth, max_depth)
VALUES ('user123', '2025-01-01 00:00:00', '2025-12-31 23:59:59', 3.0, 7.5, 5.0, 100.0)
ON DUPLICATE KEY UPDATE
    start_time = VALUES(start_time),
    end_time = VALUES(end_time),
    min_mag = VALUES(min_mag),
    max_mag = VALUES(max_mag),
    min_depth = VALUES(min_depth),
    max_depth = VALUES(max_depth);


*/


func createUserPreferences(db *sql.DB) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        log.Println("Saving user preferences")

        var preferences UserPreferences
        err := json.NewDecoder(r.Body).Decode(&preferences)
        if err != nil {
            http.Error(w, "Invalid request body", http.StatusBadRequest)
            return
        }

		log.Printf("Received user ID: %d", preferences.UserId)


        // Check if the user exists in the users table
        var userExists bool
        err = db.QueryRow("SELECT EXISTS(SELECT 1 FROM users WHERE id = ?)", preferences.UserId).Scan(&userExists)
        if err != nil || !userExists {
            http.Error(w, "User does not exist", http.StatusBadRequest)
            log.Println("User does not exist:", preferences.UserId)
            return
        }

        query := `
            INSERT INTO UserPreferences (user_id, start_time, end_time, min_mag, max_mag, min_depth, max_depth)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
                start_time = VALUES(start_time),
                end_time = VALUES(end_time),
                min_mag = VALUES(min_mag),
                max_mag = VALUES(max_mag),
                min_depth = VALUES(min_depth),
                max_depth = VALUES(max_depth);
        `

        _, err = db.Exec(query, preferences.UserId, preferences.StartTime, preferences.EndTime, preferences.MinMag, preferences.MaxMag, preferences.MinDepth, preferences.MaxDepth)
        if err != nil {
            http.Error(w, "Failed to save preferences", http.StatusInternalServerError)
            log.Println("Error saving preferences:", err)
            return
        }

        w.WriteHeader(http.StatusOK)
        w.Write([]byte("Preferences saved successfully"))
    }
}



func getUserPreferences(db *sql.DB) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        log.Println("Retrieving user preferences")

        // Extract user ID from the URL path
        vars := mux.Vars(r)
        userID := vars["id"]

        // Query to retrieve preferences using user_id
        query := `
            SELECT id, start_time, end_time, min_mag, max_mag, min_depth, max_depth
            FROM UserPreferences
            WHERE user_id = ?`

        // Execute the query
        rows, err := db.Query(query, userID)
        if err != nil {
            http.Error(w, "Error retrieving user preferences", http.StatusInternalServerError)
            log.Printf("Error retrieving user preferences: %v", err)
            return
        }
        defer rows.Close()

        // Parse the rows into a struct and send back to the user
        var preferences []UserPreferences
        for rows.Next() {
            var preference UserPreferences
            if err := rows.Scan(&preference.ID, &preference.StartTime, &preference.EndTime, &preference.MinMag, &preference.MaxMag, &preference.MinDepth, &preference.MaxDepth); err != nil {
                http.Error(w, "Error reading user preferences", http.StatusInternalServerError)
                log.Printf("Error reading user preferences: %v", err)
                return
            }
            preferences = append(preferences, preference)
        }

        // Send the preferences as a JSON response
        w.Header().Set("Content-Type", "application/json")
        if err := json.NewEncoder(w).Encode(preferences); err != nil {
            http.Error(w, "Error encoding preferences", http.StatusInternalServerError)
            log.Printf("Error encoding preferences: %v", err)
        }
    }
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
