from flask import Flask, jsonify, request
from flask_cors import CORS
from cymatic_visualizer import CymaticVisualizer

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

visualizer = CymaticVisualizer()

@app.route('/api/cymatic')
def generate_cymatic():
    freq = float(request.args.get('freq', 396))
    amp = float(request.args.get('amp', 1.0))
    img_data = visualizer.render(freq, amp)
    return jsonify({"image": img_data})

@app.route('/api/bells')
def get_bells():
    bells = [
        {"name": "clarity", "frequency": 396},
        {"name": "strength", "frequency": 417},
        {"name": "transformation", "frequency": 528},
        {"name": "integrity", "frequency": 639},
        {"name": "intuition", "frequency": 741},
        {"name": "manifestation", "frequency": 852},
        {"name": "sovereignty", "frequency": 963}
    ]
    return jsonify(bells)

if __name__ == '__main__':
    app.run(debug=True)
