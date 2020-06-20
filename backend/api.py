import time
import os
import requests
import requests_cache

from flask import Flask
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

# requests will be cached for 1 week = 604800 seconds
requests_cache.install_cache(
    'pet_cache', backend='sqlite', expire_after=604800)


@app.route('/time')
def get_current_time():
    return {'time': time.time()}


@app.route('/upc/<ean_code>', methods=["GET"])
def upc_to_details(ean_code):
    # Our Camera module in React only returns EAN codes, which is the same as the UPC only that there is an extra '0' at the beginning
    # will remove first character to convert EAN -> UPC

    # TO DO: error handling
    API_HOST = os.getenv("UPC_API_HOST")
    API_KEY = os.getenv("UPC_API_KEY")
    API_URL = os.getenv("UPC_API_URL")
    upc = ean_code[1:]
    now = time.ctime(int(time.time()))

    headers = {
        'x-rapidapi-host': API_HOST,
        'x-rapidapi-key': API_KEY
    }
    params = {
        'upc': str(upc)
    }
    response = requests.request('GET', API_URL, headers=headers,
                                params=params)

    json_resp = response.json()['items']

    return {'title': json_resp['title'], 'description': json_resp['description'], 'image': json_resp['images'][0], 'upc': json_resp['upc']}


if __name__ == '__main__':
    app.run(host='192.168.0.20', port=5000, threaded=True, debug=True)
