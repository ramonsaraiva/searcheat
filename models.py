from flask.ext.sqlalchemy import SQLAlchemy

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

		def __repr__(self):
				return '<City {0}:{1}'.format(self.id, self.name)

		@property
		def serialize(self):
				return {
						'id': self.id,
						'name': self.name,
						'geoposition': self.geoposition.serialize
				}

		def create(self, data):
				self.name = data['name']
				self.geoposition = Geoposition()
				self.geoposition.latitude = data['geoposition']['latitude']
				self.geoposition.longitude = data['geoposition']['longitude']
				self.geoposition.longitude = data['geoposition']['accuracy']

class Truck(db.Model):
		id = db.Column(db.Integer, primary_key=True)
		name = db.Column(db.String(64))
		city_id = db.Column(db.Integer, db.ForeignKey('city.id', ondelete='CASCADE'), nullable=False)
		geoposition_id = db.Column(db.Integer, db.ForeignKey('geoposition.id', ondelete='CASCADE'), nullable=False)
		geoposition = db.relationship('Geoposition', backref=db.backref('truck', uselist=False))

		def __repr__(self):
				return '<Truck {0}:{1}>'.format(self.id, self.name)

		@property
		def serialize(self):
				return {
						'id': self.id,
						'name': self.name,
						'geoposition': self.geoposition.serialize
				}

		def create(self, data):
				self.name = data['name']
				self.geoposition = Geoposition()
				self.geoposition.latitude = data['geoposition']['latitude']
				self.geoposition.longitude = data['geoposition']['longitude']
				self.geoposition.accuracy = data['geoposition']['accuracy']
