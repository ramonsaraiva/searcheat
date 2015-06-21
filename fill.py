import requests
import json

HEADER = {'Content-Type': 'application/json'}

CITIES_DATA = [
	{
		'name': 'Novo Hamburgo',
		'geoposition': {
			'latitude': -29.6905404,
			'longitude': -51.1161786,
			'accuracy': 8
		}
	}
]

TRUCKS_DATA = [
	[
		{
			'name': 'FoodTruck do Ramon',
			'geoposition': {
				'latitude': -29.684372,
				'longitude': -51.125899,
				'accuracy': 8
			}
		}
		,
		{
			'name': 'FoodTruck do Breno',
			'geoposition': {
				'latitude': -29.680923,
				'longitude': -51.135877,
				'accuracy': 8
			}
		}
	]
]

def fill():
	for city, trucks in zip(CITIES_DATA, TRUCKS_DATA):
		response = requests.post('http://localhost:5000/api/cities/', data=json.dumps(city), headers=HEADER)
		response = json.loads(response.text)
		city_id = response['id']
		print('City {0}: {1}'.format(city_id, response['name']))

		for truck in trucks:
			response = requests.post('http://localhost:5000/api/cities/{0}/trucks/'.format(city_id), data=json.dumps(truck), headers=HEADER)
			response = json.loads(response.text)
			print('.. Truck {0}: {1}'.format(response['id'], response['name']))
