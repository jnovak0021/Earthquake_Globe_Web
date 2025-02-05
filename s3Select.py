import boto3
import json

# Initialize the S3 client
s3_client = boto3.client('s3')

# Define the S3 bucket and object key
bucket_name = 'earthquakebucket'
object_key = 'earthquake_data_2020_2025.json.gz'

# Define the SQL expression
expression = "SELECT * FROM S3Object[*] s WHERE s.properties.mag > 9 AND s.properties.time > 1735689600000"

# Define the input and output serialization formats
input_serialization = {
    'JSON': {'Type': 'DOCUMENT'},
    'CompressionType': 'GZIP'
}
output_serialization = {
    'JSON': {}
}

# Perform the S3 select query
response = s3_client.select_object_content(
    Bucket=bucket_name,
    Key=object_key,
    Expression=expression,
    ExpressionType='SQL',
    InputSerialization=input_serialization,
    OutputSerialization=output_serialization
)

# Process the response
for event in response['Payload']:
    if 'Records' in event:
        records = event['Records']['Payload'].decode('utf-8')
        data = json.loads(records)
        print(data)

# Save the filtered data to a JSON file
with open('output.json', 'w') as json_file:
    json.dump(data, json_file, indent=4)
print("Data saved to output.json")