from flask import Flask
from flask import send_from_directory

from flask.ext.restful import Api

from models import db

app = Flask(__name__)
app.config.from_object(__name__)

app.config.update({
    'SQL_ALCHEMY_DATABASE_URI': 'postgres://searcheat:searcheat@localhost/searcheat'
})

db.init_app(app)
api = Api(app)

@app.route('/')
def index():
    return send_from_directory('client', 'main.html')

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
