import json
from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def index():

    # use render_template to serve up the index.html
    return render_template('index.html')

@app.route("/samples")
def samples():
    # open the json file, located at static/data/samples.json
    with open('static/data/samples.json') as e:
    # use json.load() to read in the file as json
        data = json.load(e)
    # return that json through the Flask endpoini
    return data

if __name__ == "__main__":
    app.run(debug=True)