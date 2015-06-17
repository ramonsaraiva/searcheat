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
    return send_from_directory('templates', 'base.html')

@app.route('/<path:path>')
def _static(path):
    return send_from_directory('static', path)
