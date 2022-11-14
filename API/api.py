import json
import time
import requests
from flask import Flask, request

app = Flask(__name__)
url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?" #put URL here
vicinity_radius = "500" #put vicinity radius here
places = []
def getLocations(lat, lng, query, key):
    places = []
    r = requests.get(url + 
                    "&location=" + str(lat) + "," + str(lng) + 
                    "&radius=" + vicinity_radius + 
                    "&name=" + query + 
                    "&sensor=false&key=" + key)
    
    result = r.json()['results']
    return result

def handleData(data):
    lat = data['lat']
    lng = data['lng']
    query = data['query']
    key = data['key']
    r = requests.get(url + 
                    "&location=" + str(lat) + "," + str(lng) + 
                    "&radius=" + vicinity_radius + 
                    "&name=" + query + 
                    "&sensor=false&key=" + key)
    
    result = r.json()['results']
    return result


@app.route("/getLocations", methods=['GET','POST'])
def run():
    request_data = request.get_json()
    
    return handleData(request_data)
    

if __name__ == "__main__":
    app.run(debug=False)