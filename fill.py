import requests
import json

URL_CITIES = 'http://localhost:5000/api/cities/'
URL_TRUCKS = 'http://localhost:5000/api/trucks/'

HEADER = {'Content-Type': 'application/json'}

CITIES_DATA = [
    {
        'name': 'Novo Hamburgo',
        'geoposition': {
            'latitude': -29.6905404,
            'longitude': -51.1161786,
            'accuracy': 14
        }
    }
]

TRUCKS_DATA = [
    {
        'name': 'FoodTruck do Ramon',
        'geoposition': {
            'latitude': -29.684372,
            'longitude': -51.125899,
            'accuracy': 14
        }
    }
    ,
    {
        'name': 'FoodTruck do Breno',
        'geoposition': {
            'latitude': -29.680923,
            'longitude': -51.135877,
            'accuracy': 14
        }
    }
]

for c in CITIES_DATA:
    r = requests.post(URL_CITIES, data=json.dumps(c), headers=HEADER)
    print('CITIES: {0}'.format(r.text))

for t in TRUCKS_DATA:
    r = requests.post(URL_TRUCKS, data=json.dumps(t), headers=HEADER)
    print('Trucks: {0}'.format(r.text))

