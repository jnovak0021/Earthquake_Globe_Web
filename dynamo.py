import boto3
import json
from decimal import Decimal

def convert_floats_to_decimals(obj):
    if isinstance(obj, list):
        return [convert_floats_to_decimals(i) for i in obj]
    elif isinstance(obj, dict):
        return {k: convert_floats_to_decimals(v) for k, v in obj.items()}
    elif isinstance(obj, float):
        return Decimal(str(obj))
    else:
        return obj

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("earthquakeTestTable")

with open("earthquake.json", "r") as f:
    earthquakes = json.load(f, parse_float=Decimal)

for eq in earthquakes:
    eq["ids"] = eq["ids"].strip(",").split(",")[0]  # Use first ID as primary key
    eq = convert_floats_to_decimals(eq)
    table.put_item(Item=eq)

print("Data uploaded successfully!")