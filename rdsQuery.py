import mysql.connector

# Database connection details
db_config = {
    "host": "earthquake.cn8yiso6kgjx.us-east-1.rds.amazonaws.com",
    "user": "admin",
    "password": "EAhvGyr8Zn55b07I",
    "database": "Earthquake"
}

# Establish connection
try:
    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor()

    # Example query
    cursor.execute("SELECT * FROM Earthquakes;")
    #cursor.execute("LOAD DATA INFILE \"C:\workspace\sp25_p1_t1\earthquake_data_2020_2025.csv\" INTO TABLE Earthquakes FIELDS TERMINATED BY ',' IGNORE 1 ROWS;")

    result = cursor.fetchone()
    print("Connected! Current id:", result[0])

    # Close connection
    cursor.close()
    conn.close()

except mysql.connector.Error as err:
    print("Error:", err)
