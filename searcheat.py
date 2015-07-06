from flask import Flask
from flask import send_from_directory

from flask.ext.restful import Api

from models import db
from models import FoodType

from resources import Cities
from resources import Trucks
from resources import FoodTypes
from resources import Geocode

app = Flask(__name__)
app.config.from_object(__name__)

app.config.update({
	'SQLALCHEMY_DATABASE_URI': 'postgres://searcheat:searcheat@localhost/searcheat'
})

db.init_app(app)
api = Api(app)

# resources
api.add_resource(Cities, '/api/cities/', '/api/cities/<int:id>/')
api.add_resource(Trucks, '/api/trucks/', '/api/trucks/<int:id>/')
api.add_resource(FoodTypes, '/api/foodtypes/', '/api/foodtypes/<int:id>/')
api.add_resource(Geocode, '/api/geocode/')

@app.route('/')
def index():
	return send_from_directory('client', 'main.html')

@app.route('/icons/<path:path>')
def _icon(path):
	return send_from_directory('data/icons', path)

@app.route('/<path:path>')
def _static(path):
	return send_from_directory('client', path)

# client commands

@app.cli.command()
def create():
	db.create_all()

@app.cli.command()
def drop():
	db.drop_all()

@app.cli.command()
def reset():
	from fill import fill
	db.drop_all()
	db.create_all()

	foodtypes = [
		'Hamburguer',		# 1
		'Frango',			# 2
		'Pizza',			# 3
		'Cachorro Quente',	# 4
		'Massas',			# 5
		'Wrap',				# 6
		'Peixe',			# 7
		'Japonesa',			# 8
		'Mexicana',			# 9
		'Indiana',			# 10
		'Vegana',			# 11
		'Vegetariana',		# 12
		'Doces',			# 13
		'Gelados',			# 14
		'Cervejas',			# 15
		'Bebidas',			# 16
		'Cafes'				# 17
	]

	for foodtype in foodtypes:
		f = FoodType()
		f.name = foodtype
		f.slugify()

		f.priority = 1
		db.session.add(f)

	db.session.commit()
	fill()

@app.cli.command()
def tornado():
	from tornado.wsgi import WSGIContainer
	from tornado.httpserver import HTTPServer
	from tornado.ioloop import IOLoop

	sv = HTTPServer(WSGIContainer(app))
	sv.listen(5000)
	IOLoop.instance().start()
