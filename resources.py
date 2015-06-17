from flask import jsonify
from flask.ext.restful import Resource

from models import City

class Cities(Resource):
    def get(self):
        return jsonify(cities=[c.serialize for c in City.query.order_by(City.name).all()])
