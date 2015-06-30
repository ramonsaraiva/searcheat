from flask import Flask
from models import db

import flask_admin as admin
from flask_admin.contrib import sqla
from flask_admin.contrib.sqla import filters

app = Flask(__name__)
app.config.from_object(__name__)

app.config.update({
	'SQLALCHEMY_DATABASE_URI': 'postgres://searcheat:searcheat@localhost/searcheat'
})

db.init_app(app)
