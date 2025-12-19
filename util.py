import json
import pickle
import numpy as np
import os

__locations = None
__data_columns = None
__model = None


def get_estimated_price(location, sqft, bhk, bath):
    try:
        # Standardize to lowercase to match columns.json keys
        loc_index = __data_columns.index(location.lower())
    except ValueError:
        loc_index = -1

    x = np.zeros(len(__data_columns))
    x[0] = sqft
    x[1] = bath
    x[2] = bhk
    if loc_index >= 0:
        x[loc_index] = 1

    # Ensure the model is loaded before predicting
    return round(__model.predict([x])[0], 2)


def get_location_names():
    return __locations


def load_saved_artifacts():
    print("🔍 Loading saved artifacts...")

    global __data_columns
    global __locations
    global __model

    # ✅ get the absolute path for the current folder
    base_dir = os.path.dirname(os.path.abspath(__file__))

    # ✅ use correct folder name 'artifcats' (your current name)
    columns_path = os.path.join(base_dir, 'artifcats', 'columns.json')
    model_path = os.path.join(base_dir, 'artifcats', 'bangalore_home_prices_model.pickle')

    # ✅ check if files exist (helps debugging on Render)
    print("Looking for files:")
    print(columns_path)
    print(model_path)

    with open(columns_path, 'r') as f:
        __data_columns = json.load(f)['data_columns']
        __locations = __data_columns[3:]

    if __model is None:
        with open(model_path, 'rb') as f:
            __model = pickle.load(f)

    print("✅ Loaded saved artifacts successfully!")


if __name__ == '__main__':
    load_saved_artifacts()
    print(get_location_names())
