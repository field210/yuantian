Housing Sold Price Predictor
============================

The [Housing Sold Price Predictor](http://yuantian.herokuapp.com) use scraped housing sold price dataset in Phoenix, AZ. The dataset has 37000+ tuples of variables such as:

-	Geolocation (Latitude and Longitude)
-	Housing type (e.g., house, townhouse, and apartment)
-	Housing size (in square feet)
-	Bedroom and bathroom number
-	Pool type
-	Exterior Stories number
-	Customer reviews
-	Sold price

The prediction model is developed using python `sklearn` package. Multiple algorithms (e.g., `KNeighborsRegressor`,`DictVectorizer`,`TfidfVectorizer` and `LinearRegression`) are included. `GridSearchCV` is employed to search the best-fit parameters for the model. Detailed analyses can be viewed here: http://yuantian.herokuapp.com/analysis

The integrated model is dumped using `dill` python package and deployed on the web server. The responsive web app development on the server-end uses `flask` framework and related python packages. The front-end techiques involve:

-	bootstrap framework (bootstrap-select, formValidation)
-	javascript (jquery)
-	css (font-awesome)
-	html

You are welcomed to visit my app at http://yuantian.herokuapp.com and provide me feedback.
