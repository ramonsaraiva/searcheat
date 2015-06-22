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
		'icon': 'ramon_foodtruck.jpg'
	}
	,
	{
		'name': 'FoodTruck do Breno',
		'geoposition': {
			'latitude': -29.680923,
			'longitude': -51.135877,
			'accuracy': 8
		},
		'icon': 'breno_foodtruck.jpg'
	},
	{
		'name': 'CauCakes',
		'geoposition': {
			'latitude': -29.6802572,
			'longitude': -51.1009033,
			'accuracy': 8
		},
		'icon': 'caucakes.jpg'
	},
	{
		'name': 'Jackie & Jack',
		'geoposition': {
			'latitude': -29.6804343,
			'longitude': -51.1170536,
			'accuracy': 8
		},
		'icon': 'jackie_and_jack.jpg'
	},
	{
		'name': 'FoodTruck da Lu',
		'geoposition': {
			'latitude': -29.676594,
			'longitude': -51.061647,
			'accuracy': 8
		},
		'icon': 'lu.jpg'
	}
]

def fill():
	for truck in TRUCKS_DATA:
		response = requests.post('http://localhost:5000/api/trucks/', data=json.dumps(truck), headers=HEADER)
		response = json.loads(response.text)
		print('.. Truck {0}: {1}'.format(response['id'], response['name']))
