import json
from flask import Flask, request, jsonify
from flask_cors import CORS
import bio, db  
app = Flask(__name__)
CORS(app)
# NOTE: This route is needed for the default EB health check route
@app.route('/')
def home():
    return "ok"

@app.route('/api/list_submissions')
def list_submissions():
    userId = 'ginkgo'
    data = db.get_submissions_by_user(userId)
    return jsonify(data)

@app.route('/api/submit', methods=["POST"])
def submit():
    dna_seq = json.loads(request.data)["dna_seq"] # Input DNA sequence
    results = bio.query(dna_seq)
    return jsonify(results)
    

if __name__ == '__main__':
    app.run(port=8080)