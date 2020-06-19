import time

from flask import Flask
from flask_cors import CORS


app = Flask(__name__)
CORS(app)


@app.route('/time')
def get_current_time():
    return {'time': time.time()}


if __name__ == '__main__':
    app.run(host='192.168.0.20', port=5000, threaded=True, debug=True)
