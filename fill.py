import requests
import json

URL_CITY = 'http://localhost:5000/api/cities/'
HEADER = {'Content-Type': 'application/json'}

data = [
    {
        'name': 'Novo Hamburgo',
        'latitude': -29.6905404,
        'longitude': -51.1161786,
        'accuracy': 14
    }
]

for d in data:
    r = requests.post(URL_CITY, data=d, headers=HEADER)
    print(vars(r))
