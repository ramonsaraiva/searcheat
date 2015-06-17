from flask.ext.sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Geoposition(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    latitude = db.Column(db.Float(), nullable=False)
    longitude = db.Column(db.Float(), nullable=False)
    accuracy = db.Column(db.Float())

    def __repr__(self):
        return '<Geopos {0}/{1}/{2}'.format(self.latitude, self.longitude, self.accuracy)

class City(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    # geoposition?
    name = db.Column(db.String(64))

    def __repr__(self):
        return '<City {0}:{1}'.format(self.id, self.name)

class Truck(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    geoposition_id = db.Column(db.Integer, db.ForeignKey('geoposition.id', ondelete='CASCADE'), nullable=False)
    geoposition = db.relationship('Geoposition', backref=db.backref('truck', uselist=False))
    name = db.Column(db.String(64))

    def __repr__(self):
        return '<Truck {0}:{1}>'.format(self.id, self.name)
