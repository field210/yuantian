import locale
from pandas.io.json import json_normalize
import numpy as np
import pandas as pd

from sklearn import cross_validation
from sklearn.pipeline import Pipeline, FeatureUnion
from sklearn.preprocessing import Imputer, StandardScaler
from sklearn.linear_model import LinearRegression, Ridge
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.feature_extraction import DictVectorizer
from sklearn.neighbors import KNeighborsRegressor
from sklearn.grid_search import GridSearchCV
from sklearn.base import BaseEstimator, TransformerMixin


class ColumnSelectTransformer(BaseEstimator, TransformerMixin):
    '''
    Transformer class that selects columns from a pandas dataframe
    to a numpy array
    '''

    def __init__(self, cols):
        ''' Constructor takes `cols`, a list of column labels to use '''
        self.cols = cols

    def fit(self, X, y=None):
        return self

    def transform(self, X):
        ''' X should be a pandas DataFrame. Output selected columns. '''
        return X.loc[:, self.cols]


class DictTransformer(BaseEstimator, TransformerMixin):
    '''
    Transformer class that converts a pandas dataframe into a dict
    representation that can be fed into DictVectorizer
    '''

    def fit(self, X, y=None):
        return self

    def transform(self, X):
        ''' X should be a pandas DataFrame. Output a list of dicts. '''
        return [{column: val for column, val in row.iteritems()} for _, row in
                X.iterrows()]


class ListTransformer(BaseEstimator, TransformerMixin):
    '''
    Transformer that converts a pandas dataframe into a list
    '''

    def fit(self, X, y=None):
        return self

    def transform(self, X):
        return X.values.ravel()


class ModelTransformer(BaseEstimator, TransformerMixin):
    '''
    ModelTransformer make an estimator act like a transformer for the
    sklearn pipeline
    It transforms the input data to prediction values. The predictions can
    then be fed into
    downstream regression analyses.
    '''

    def __init__(self, model):
        self.model = model

    def fit(self, X, y=None):
        self.model.fit(X, y)
        return self

    def transform(self, X):
        return [self.model.predict(x) for x in X]


def PredictPrice(model, dict):
    '''
    make a prediction using user request as dict
    '''
    prediction = model(json_normalize(dict))[0]
    prediction = int(round(prediction, -2))
    locale.setlocale(locale.LC_ALL, 'en_US')
    prediction = locale.format("%d", prediction, grouping=True)

    return prediction
