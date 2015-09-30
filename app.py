from datetime import datetime

from flask import Flask, render_template, send_from_directory, request, \
    jsonify, Markup
import numpy as np
import pandas as pd
from dateutil.relativedelta import relativedelta

import dill
from pandas.io.json import json_normalize

from settings import *

model = dill.load(open(APP_ROOT + '/full_pipeline.p', 'rb'))

# initialization
app = Flask(__name__)
app.config.update(
    DEBUG=True,
)


# controllers

# website icon
@app.route("/favicon.ico")
def favicon():
    return send_from_directory(os.path.join(app.root_path, "static"),
                               "ico/favicon.ico")


# render error page
@app.errorhandler(404)
def page_not_found(e):
    return render_template("404.html"), 404


# render home page
@app.route("/", methods=["GET", "POST"])
@app.route("/index/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        r = request.form

        user_request = {
            'DwellingType'   : r.getlist('DwellingType')[0],
            'LivingArea'     : int(r.getlist('LivingArea')[0]),
            'NumBedrooms'    : int(r.getlist('NumBedrooms')[0]),
            'NumBaths'       : int(r.getlist('NumBaths')[0]),
            'ExteriorStories': int(r.getlist('ExteriorStories')[0]),
            'Pool'           : r.getlist('Pool')[0],
            'GeoLon'         : float(r.getlist('GeoLon')[0]),
            'GeoLat'         : float(r.getlist('GeoLat')[0]),
            'PublicRemarks'  : ''
        }

        predicted_price = model(json_normalize(user_request))[0]
        predicted_price = int(round(predicted_price, -2))

        print predicted_price

        return render_template("housing.html")

    else:
        return render_template("housing.html")


# render about me page
@app.route("/about_me/")
def about_me():
    return render_template("about_me.html")


# launch
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
