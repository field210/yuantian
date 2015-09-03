import os
from datetime import datetime

from flask import Flask, render_template, send_from_directory, request, jsonify
import numpy as np
from dateutil.relativedelta import relativedelta
from bokeh import embed
from bokeh.charts import Line
import Quandl


# initialization
app = Flask(__name__)
app.config.update(
    DEBUG=True,
)


# controllers

@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'), 'ico/favicon.ico')


@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404


@app.route("/")
@app.route('/index/')
def index():
    title = "Yuan's Apps"
    paragraph = ["This is a collection of my apps.",
                 "See more."]

    return render_template("index.html", title=title, paragraph=paragraph)


def plot_stock(ticker, price, duration):
    # === input example ===
    # ticker = 'goog'
    # price = ['Low', 'High', 'Close']
    # duration = 12

    quandl_api_key = 'vzzyasdeesFi-345MTXg'
    try:
        df = Quandl.get('WIKI/' + ticker, authtoken=quandl_api_key)
    except:
        return False

    # calculate start date
    date_end = datetime.today()
    date_start = date_end + relativedelta(months=-duration)

    # convert datetime.datetime to numpy.datetime64, and compare
    if df.index.values.min() > np.datetime64(date_start):
        df_subset = df.loc[:, price]
    else:
        df_subset = df.loc[date_start:date_end, price]

    if duration == 9999:
        title = "All available stock price for " + ticker
    else:
        title = str(duration) + "-month stock price for " + ticker

    p = Line(df_subset, title=title, xlabel='Date', ylabel='Stock price', xscale='datetime', legend=True, palette=['green', 'red', 'blue'])

    # return bokeh plot
    return p


@app.route("/stock/", methods=['GET', 'POST'])
def stock():
    title = "Stock Price Checker"
    paragraph = ["This app uses the Quandle WIKI dataset as stock price data source. After inputing the stock ticker, price type and date range, an interactive plot of stock historical price will be shown."]

    if request.method == 'POST':
        r = request.form

        ticker = r.getlist('ticker')[0]
        price = r.getlist('price')
        duration = int(r.getlist('duration')[0])

        # print(ticker, type(ticker), '\n', price, type(price), '\n', duration, type(duration))

        plot = plot_stock(ticker, price, duration)

        if not plot:
            return jsonify({})
        else:
            script, div = embed.components(plot)
            return jsonify({'script': script, 'div': div})
    else:
        return render_template("stock.html", title=title, paragraph=paragraph)


@app.route("/about_me/")
def about_me():
    title = "About me"
    paragraph = ["Yuan Tian",
                 "Data modeler"]

    return render_template("index.html", title=title, paragraph=paragraph)


# launch
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
