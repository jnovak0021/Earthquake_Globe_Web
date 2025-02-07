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
    totalData = []
    while year <= 2020:
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
            for feature in data['features']:
                print(feature)
                earthquake = {
                    'mag': feature['properties']['mag'],
                    'place': feature['properties']['place'],
                    'time': feature['properties']['time'],
                    'updated': feature['properties']['updated'],
                    'tz': feature['properties']['tz'],
                    'url': feature['properties']['url'],
                    'detail': feature['properties']['detail'],
                    'felt': feature['properties']['felt'],
                    'cdi': feature['properties']['cdi'],
                    'mmi': feature['properties']['mmi'],
                    'alert': feature['properties']['alert'],
                    'status': feature['properties']['status'],
                    'tsunami': feature['properties']['tsunami'],
                    'sig': feature['properties']['sig'],
                    'net': feature['properties']['net'],
                    'code': feature['properties']['code'],
                    'ids': feature['properties']['ids'],
                    'sources': feature['properties']['sources'],
                    'types': feature['properties']['types'],
                    'nst': feature['properties']['nst'],
                    'dmin': feature['properties']['dmin'],
                    'rms': feature['properties']['rms'],
                    'gap': feature['properties']['gap'],
                    'magType': feature['properties']['magType'],
                    'type': feature['properties']['type'],
                    'title': feature['properties']['title'],
                    'coordinates': feature['geometry']['coordinates']
                }
                totalData.append(earthquake)
                #totalData.append(feature)
        else:
            print(f"Failed to retrieve data for {current}: {response.status_code}")
    return totalData

# Query the API and save the data
year = 2020
month = 1
all_data = queryAPI(year, month)

# Save the collected data into a JSON file
with open("earthquake_data_2020_2025.json", "w") as json_file:
    json.dump(all_data, json_file, indent=4)
print("Data saved to earthquake_data_2020_2025.json")