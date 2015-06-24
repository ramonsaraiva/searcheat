from datetime import datetime

from flask.ext.sqlalchemy import SQLAlchemy
from pygeocoder import Geocoder as geo

db = SQLAlchemy()

class Geoposition(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	latitude = db.Column(db.Float(), nullable=False)
	longitude = db.Column(db.Float(), nullable=False)
	accuracy = db.Column(db.Float())

	def __repr__(self):
		return '<Geopos {0}/{1}/{2}'.format(self.latitude, self.longitude, self.accuracy)

	@property
	def serialize(self):
		return {
			'id': self.id,
			'latitude': self.latitude,
			'longitude': self.longitude,
			'accuracy': self.accuracy
		}

class City(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	name = db.Column(db.String(64))
	geoposition_id = db.Column(db.Integer, db.ForeignKey('geoposition.id', ondelete='CASCADE'), nullable=False)
	geoposition = db.relationship('Geoposition', backref=db.backref('city', uselist=False))
	trucks = db.relationship('Truck', backref='city', lazy='dynamic', cascade='all, delete-orphan', order_by='Truck.name')

	# dates
	creation_date = db.Column(db.DateTime())

	def __repr__(self):
		return '<City {0}:{1}'.format(self.id, self.name)

	@property
	def serialize_simple(self):
		return {
			'id': self.id,
			'name': self.name,
			'geoposition': self.geoposition.serialize
		}

	@property
	def serialize(self):
		return {
			'id': self.id,
			'name': self.name,
			'geoposition': self.geoposition.serialize,
			'trucks': self.serialize_trucks
		}

	@property
	def serialize_trucks(self):
		return [t.serialize for t in self.trucks]

	def create(self, geo_data):
		self.name = geo_data.city
		self.geoposition = Geoposition()
		self.geoposition.latitude = geo_data.latitude
		self.geoposition.longitude = geo_data.longitude
		self.geoposition.accuracy = 14
		self.creation_date = datetime.now()

class Truck(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	name = db.Column(db.String(64))
	city_id = db.Column(db.Integer, db.ForeignKey('city.id', ondelete='CASCADE'), nullable=False)
	geoposition_id = db.Column(db.Integer, db.ForeignKey('geoposition.id', ondelete='CASCADE'), nullable=False)
	geoposition = db.relationship('Geoposition', backref=db.backref('truck', uselist=False))
	address = db.Column(db.String(128))
	icon = db.Column(db.String(64))

	# dates
	creation_date = db.Column(db.DateTime(), nullable=False)
	last_update = db.Column(db.DateTime(), nullable=False)

	def __repr__(self):
		return '<Truck {0}:{1}>'.format(self.id, self.name)

	@property
	def serialize(self):
		return {
			'id': self.id,
			'name': self.name,
			'geoposition': self.geoposition.serialize,
			'address': self.address,
			'icon': self.icon,
			'icon_url': '{0}{1}'.format('/icons/', self.icon),
			'last_update': self.last_update.strftime('%d/%m/%Y')
		}

	def create(self, data):
		self.name = data['name']
		self.geoposition = Geoposition()
		self.geoposition.latitude = data['geoposition']['latitude']
		self.geoposition.longitude = data['geoposition']['longitude']
		self.geoposition.accuracy = data['geoposition']['accuracy']

		self.address = geo.reverse_geocode(self.geoposition.latitude,
												self.geoposition.longitude).formatted_address
		self.creation_date = datetime.now()
		self.last_update = datetime.now()
