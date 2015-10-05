from datetime import datetime

from flask import Flask, render_template, send_from_directory, request, \
    jsonify

from dateutil.relativedelta import relativedelta


import dill

from settings import *
from module import *

model = dill.load(open(APP_ROOT + '/full_pipeline.p', 'rb'))

# initialization
app = Flask(__name__)
app.config.update(DEBUG=True,)


# controllers

# website icon
@app.route('/favicon.ico')
def favicon():
    return send_from_directory(APP_STATIC,'ico/favicon.ico')


# render home page
@app.route('/', methods=['GET', 'POST'])
@app.route('/index/', methods=['GET', 'POST'])
def index():
    title='Housing Sold Price Predictor'
    if request.method == 'POST':
        r = request.form

        # combine user request to dict
        user_request = {
            'DwellingType'   : r.getlist('DwellingType')[0],
            'LivingArea'     : float(r.getlist('LivingArea')[0]),
            'NumBedrooms'    : int(r.getlist('NumBedrooms')[0]),
            'NumBaths'       : int(r.getlist('NumBaths')[0]),
            'ExteriorStories': int(r.getlist('ExteriorStories')[0]),
            'Pool'           : r.getlist('Pool')[0],
            'GeoLon'         : float(r.getlist('GeoLon')[0]),
            'GeoLat'         : float(r.getlist('GeoLat')[0]),
            'PublicRemarks'  : ''
        }

        return PredictPrice(model, user_request)

    else:
        return render_template('index.html',title=title)


# render analysis page
@app.route('/analysis/')
def analysis():
    title='Behind the Scene'
    return render_template('analysis.html',title=title)


# render about me page
@app.route('/about_me/')
def about_me():
    title='About me'
    return render_template('about_me.html',title=title)


# render error page
@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404


# launch
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)


