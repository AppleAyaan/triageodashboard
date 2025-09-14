from flask import Flask, request, jsonify, Response
from flask_cors import CORS
import queue

app = Flask(__name__)
CORS(app)

alerts = []
subscribers = []

@app.route("/alerts", methods=["POST"])
def new_alert():
    data = request.json
    alerts.append(data)
    for q in subscribers:
        q.put(data)
    return jsonify({"status": "ok"}), 200

@app.route("/alerts", methods=["GET"])
def get_alerts():
    return jsonify(alerts)

@app.route("/stream")
def stream():
    def event_stream(q):
        while True:
            data = q.get()
            yield f"data: {data}\n\n"

    q = queue.Queue()
    subscribers.append(q)
    return Response(event_stream(q), mimetype="text/event-stream")

if __name__ == "__main__":
    app.run(port=5001, debug=True)
