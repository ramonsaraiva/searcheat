from flask import jsonify

from flask.ext.restful import Resource
from flask.ext.restful import reqparse

from models import City

class Cities(Resource):
    def __init__(self):
        self.reqparse = reqparse.RequestParser()
        self.reqparse.add_argument('name', type=str, location='json', required=True)
        self.reqparse.add_argument('latitude', type=float, location='json', required=True)
        self.reqparse.add_argument('longitude', type=float, location='json', required=True)
        self.reqparse.add_argument('accuracy', type=str, location='json', required=True)

    def get(self, id):
        if id:
            return City.query.get_or_404(id).serialize
        return jsonify(cities=[c.serialize for c in City.query.order_by(City.name).all()])

    def post(self):
        args = self.reqparse.parse_args()

        city = City()
        c.create(args)
        return c.serialize
