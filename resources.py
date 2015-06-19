from flask import request

from flask.ext.restful import Resource
from flask.ext.restful import reqparse

from models import City
from models import Truck

class Cities(Resource):
    def __init__(self):
        self.reqparse = reqparse.RequestParser()
        self.reqparse.add_argument('name', type=str, location='json', required=True)
        self.reqparse.add_argument('geoposition', type=dict, location='json', required=True)

    def post(self):
        args = self.reqparse.parse_args()
        city = City()
        city.create(args)
        return city.serialize

    def get(self, id):
        if id:
            return City.query.get_or_404(id).serialize
        cities = [c.serialize for c in City.query.order_by(City.name).all()]
        return cities

class Trucks(Resource):
    def __init__(self):
        self.reqparse = reqparse.RequestParser()
        self.reqparse.add_argument('name', type=str, location='json', required=True)
        self.reqparse.add_argument('geoposition', type=dict, location='json', required=True)

    def post(self):
        args = self.reqparse.parse_args()
        truck = Truck()
        truck.create(args)
        return truck.serialize

    def get(self, id):
        if id:
            return Truck.query.get_or_404(id).serialize
        trucks = [t.serialize for t in Truck.query.order_by(Truck.name).all()]
        return trucks
