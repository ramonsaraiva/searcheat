import requests
import json

HEADER = {'Content-Type': 'application/json'}

TRUCKS_DATA = [
	{
		'name': 'FoodTruck do Ramon',
		'geoposition': {
			'latitude': -29.684372,
			'longitude': -51.125899,
			'accuracy': 8
		},
		'icon': 'aaaaaaaaaaa.jpg'
	}
	,
	{
		'name': 'FoodTruck do Breno',
		'geoposition': {
			'latitude': -29.680923,
			'longitude': -51.135877,
			'accuracy': 8
		},
		'icon': 'aaaaaaaaa.jpg'
	}
]

def fill():
	for truck in TRUCKS_DATA:
		response = requests.post('http://localhost:5000/api/trucks/', data=json.dumps(truck), headers=HEADER)
		response = json.loads(response.text)
		print('.. Truck {0}: {1}'.format(response['id'], response['name']))
