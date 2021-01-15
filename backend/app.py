import json, time, uuid
from flask import Flask, request, jsonify
from flask_cors import CORS
import bio

submissions = [] # In-memory storage

app = Flask(__name__)
CORS(app)
# NOTE: This route is needed for the default EB health check route
@app.route('/')
def home():
    return "ok"

@app.route('/api/list_submissions')
def list_submissions():
    # In a descending order of timestamp
    reversed_submissions = submissions[::-1]
    return jsonify(reversed_submissions) 

@app.route('/api/submit', methods=["POST"])
def submit():
    data =  json.loads(request.data) # { query }
    if 'query' not in data:
        return 'No valid query provided', 400
    data['results'] = 'Pending'
    data['timestamp'] = int(time.time() * 1000) # Milliseconds
    index = len(submissions)
    # Create submission
    submissions.append(data)
    # Search 
    query_seq = data["query"] # Query DNA sequence
    results = bio.query(query_seq) # Query results
    # Update submission
    if results:
        submissions[index]['results'] = results
    else:
        submissions[index]['results'] = 'No match found'
    # Success result
    return jsonify(results)
    

if __name__ == '__main__':
    app.run(host='0.0.0.0',port=8080)