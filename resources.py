from flask import request

from flask.ext.restful import Resource
from flask.ext.restful import reqparse

from pygeocoder import Geocoder as geo

from models import db
from models import City
from models import FoodType
from models import Truck

def get_format(f):
	return f.split('.')[1]

class Cities(Resource):
	def __init__(self):
		self.reqparse = reqparse.RequestParser()
		self.reqparse.add_argument('geoposition', type=dict, location='json', required=True)

	def post(self):
		args = self.reqparse.parse_args()
		city = City()
		city.create(args)

		db.session.add(city)
		db.session.commit()
		return city.serialize

	def get(self, id=None):
		if id:
			return City.query.get_or_404(id).serialize
		cities = [c.serialize_simple for c in City.query.order_by(City.name).all()]
		return cities

class Trucks(Resource):
	def __init__(self):
		self.reqparse = reqparse.RequestParser()
		self.reqparse.add_argument('name', type=str, location='json', required=True)
		self.reqparse.add_argument('geoposition', type=dict, location='json', required=True)
		self.reqparse.add_argument('icon', type=str, location='json', required=False)
		self.reqparse.add_argument('foodtypes', type=list, location='json', required=True)

	def post(self):
		args = self.reqparse.parse_args()

		geo_data = geo.reverse_geocode(args['geoposition']['latitude'], args['geoposition']['longitude'])
		city = db.session.query(City).filter(City.name==geo_data.city).first()
		if not city:
			city = City()
			city.create(geo_data)

		truck = Truck()
		truck.create(args)
		city.trucks.append(truck)

		db.session.add(city)
		db.session.flush()

		if args['icon']:
			icon = '{0}.{1}'.format(truck.id, get_format(args['icon']))
			truck.icon = icon

		foodtypes = FoodType.query.filter(FoodType.id.in_(args['foodtypes']))
		for f in foodtypes:
			truck.foodtypes.append(f)

		db.session.commit()
		return truck.serialize

	def get(self, id=None):
		if id:
			return Truck.query.get_or_404(id).serialize
		trucks = [t.serialize for t in Truck.query.order_by(Truck.name).all()]
		return trucks

class FoodTypes(Resource):
	def get(self, id=None):
		if id:
			trucks = Truck.query.filter(Truck.city_id==id).all()
			foodtypes = FoodType.query.filter(FoodType.trucks.any(Truck.id.in_([t.id for t in trucks]))).order_by(FoodType.priority, FoodType.id)
			return [f.serialize for f in foodtypes]
		foodtypes = [f.serialize for f in FoodType.query.order_by(FoodType.priority, FoodType.id)]
		return foodtypes

class Geocode(Resource):
	def __init__(self):
		self.reqparse = reqparse.RequestParser()
		self.reqparse.add_argument('lat', type=float, location='json', required=True)
		self.reqparse.add_argument('lng', type=float, location='json', required=True)

	def post(self):
		args = self.reqparse.parse_args()

		geo_data = geo.reverse_geocode(args['lat'], args['lng'])
		return {'city': geo_data.city}
