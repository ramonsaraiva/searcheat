from flask import Flask
from flask import send_from_directory

from flask.ext.restful import Api

from models import db

from resources import Cities

app = Flask(__name__)
app.config.from_object(__name__)

app.config.update({
    'SQLALCHEMY_DATABASE_URI': 'postgres://searcheat:searcheat@localhost/searcheat'
})

db.init_app(app)
api = Api(app)

# resources

api.add_resource(Cities, '/api/cities/', '/api/cities/<int:id>/')

@app.route('/')
def index():
    return send_from_directory('templates', 'base.html')

@app.route('/<path:path>')
def _static(path):
    return send_from_directory('static', path)

# client commands

@app.cli.command()
def create():
    db.create_all()

@app.cli.command()
def drop():
    db.drop_all()
