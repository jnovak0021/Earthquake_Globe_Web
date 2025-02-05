import requests
import json
from datetime import datetime, timedelta

# Define the API endpoint
base_url = "https://earthquake.usgs.gov/fdsnws/event/1/query"

def validDate(year, month):
    if(month < 12):
        month += 1
    else:
        year += 1
        month = 1
    return year, month, f"{year}-{month:02d}-01"

def queryAPI(year, month):
    totalData = {}
    while year < 2025:
        current = f"{year}-{month:02d}-02"
        year, month, next = validDate(year, month)
        params = {
            'format': 'geojson',
            'starttime': current,
            'endtime': next
        }
        print(f"Retrieving data for {current}...")
        response = requests.get(base_url, params=params)
        if response.status_code == 200:
            data = response.json()
            totalData[current] = data
        else:
            print(f"Failed to retrieve data for {current}: {response.status_code}")
    return totalData

# Query the API and save the data
year = 2020
month = 1
all_data = queryAPI(year, month)
print("Data retrieval complete.")

# Save the collected data into a JSON file
with open("earthquake_data_2020_2025.json", "w") as json_file:
    json.dump(all_data, json_file, indent=4)
print("Data saved to earthquake_data_2020_2025.json")