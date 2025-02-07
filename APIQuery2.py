import requests
import csv
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

def safe_float(value, default=0.0):
    try:
        return float(value) if value not in [None, "", "null"] else default
    except ValueError:
        return default  # Handle cases where conversion fails

def queryAPI(year, month):
    totalData = []
    while year < 2025:
        current = f"{year}-{month:02d}-02"
        year, month, next = validDate(year, month)
        params = {
            'format': 'csv',
            'starttime': current,
            'endtime': next
        }
        print(f"Retrieving data for {current}...")
        response = requests.get(base_url, params=params)
        if response.status_code == 200:
            decoded_content = response.content.decode('utf-8')
            csv_reader = csv.DictReader(decoded_content.splitlines())
            for row in csv_reader:
                #print(row)
                earthquake = {
                    'time': row['time'],
                    'latitude': safe_float(row.get('latitude')),
                    'longitude': safe_float(row.get('longitude')),
                    'depth': safe_float(row.get('depth')),
                    'mag': safe_float(row.get('mag')),  
                    #'magType': row['magType'],
                    #'nst': int(row['nst']) if row['nst'] else None,
                    #'gap': float(row['gap']),
                    #'dmin': float(row['dmin']) if row['dmin'] else None,
                    #'rms': float(row['rms']),
                    #'net': row['net'],
                    'id': row['id'],
                    #'updated': row['updated'],
                    'place': row['place'],
                    #'types': row['types'],
                    'status': row['status'],

                    
                    #'url': row['url'],
                    #'detail': row['detail'],
                    #'felt': row['felt'],
                    #'cdi': row['cdi'],
                    #'mmi': row['mmi'],
                    #'alert': row['alert'],
                    #'tsunami': int(row['tsunami']),
                    #'sig': int(row['sig']),
                    #'code': row['code'],
                    
                    #'sources': row['sources'],
                    
                    #'type': row['type'],
                    #'title': row['title'],
                }
                totalData.append(earthquake)
        else:
            print(f"Failed to retrieve data for {current}: {response.status_code}")
    return totalData

# Query the API and save the data
year = 2020
month = 1
all_data = queryAPI(year, month)

# Save the collected data into a CSV file
csv_file_path = "earthquake_data_2020_2025.csv"
with open(csv_file_path, "w", newline='',encoding='utf-8') as csv_file:
    fieldnames = [
        'id', 'time', 'latitude', 'longitude', 'depth', 'mag', 'place', 'status'
    ]
    writer = csv.DictWriter(csv_file, fieldnames=fieldnames)
    writer.writeheader()
    for data in all_data:
        writer.writerow(data)

print("Data saved to earthquake_data_2020_2025.csv")