import requests
import json
import time

HEADER = {'Content-Type': 'application/json'}

TRUCKS_DATA = [
	{
		'name': 'FoodTruck do Ramon',
		'geoposition': {
			'latitude': -29.684372,
			'longitude': -51.125899,
			'accuracy': 8
		},
		'foodtypes': [3, 15, 16],
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
		'foodtypes': [14, 13, 17],
		'icon': 'breno_foodtruck.jpg'
	},
	{
		'name': 'CauCakes',
		'geoposition': {
			'latitude': -29.6802572,
			'longitude': -51.1009033,
			'accuracy': 8
		},
		'foodtypes': [17, 13],
		'icon': 'caucakes.jpg'
	},
	{
		'name': 'Jackie & Jack',
		'geoposition': {
			'latitude': -29.6804343,
			'longitude': -51.1170536,
			'accuracy': 8
		},
		'foodtypes': [5, 1, 16],
		'icon': 'jackie_and_jack.jpg'
	},
	{
		'name': 'FoodTruck da Lu',
		'geoposition': {
			'latitude': -29.676594,
			'longitude': -51.061647,
			'accuracy': 8
		},
		'foodtypes': [6, 10, 17],
		'icon': 'lu.jpg'
	},
	{
		'name': 'Brutus Truck',
		'geoposition': {
			'latitude': -29.688357,
			'longitude': -51.133437,
			'accuracy': 8
		},
		'foodtypes': [1, 2, 15],
		'icon': 'lu.jpg'
	},
	{
		'name': 'Lowie Doces',
		'geoposition': {
			'latitude': -29.683974,
			'longitude': -51.133689,
			'accuracy': 8
		},
		'foodtypes': [13, 17, 16],
		'icon': 'lu.jpg'
	},
	{
		'name': 'Massas do Beto',
		'geoposition': {
			'latitude': -29.684610,
			'longitude': -51.130411,
			'accuracy': 8
		},
		'foodtypes': [5, 15, 16],
		'icon': 'lu.jpg'
	},
	{
		'name': 'Japesca',
		'geoposition': {
			'latitude': -29.680607,
			'longitude': -51.129014,
			'accuracy': 8
		},
		'foodtypes': [7, 8],
		'icon': 'lu.jpg'
	},
	{
		'name': 'Veg Truck',
		'geoposition': {
			'latitude': -29.687854,
			'longitude': -51.127710,
			'accuracy': 8
		},
		'foodtypes': [12, 11],
		'icon': 'lu.jpg'
	},

]

def fill():
	for truck in TRUCKS_DATA:
		time.sleep(1)
		response = requests.post('http://localhost:5000/api/trucks/', data=json.dumps(truck), headers=HEADER)
		response = json.loads(response.text)
		print('.. Truck {0}: {1}'.format(response['id'], response['name']))
