from flask import Flask, request, jsonify, Response, stream_with_context
from flask_cors import CORS
from gpt4all import GPT4All
from dotenv import load_dotenv
import os
import json

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

model = GPT4All("Meta-Llama-3-8B-Instruct.Q4_0.gguf")

@app.route("/generate", methods=["POST"])
def generate():
    data = request.json
    prompt = data.get("prompt", "")
    
    def generate_stream():
        for token in model.generate(prompt, max_tokens=512, streaming=True):
            yield f"data: {json.dumps({'token': token})}\n\n"
    
    return Response(
        stream_with_context(generate_stream()),
        mimetype='text/event-stream'
    )

if __name__ == "__main__":
    app.run(
        host=os.getenv("FLASK_HOST", "127.0.0.1"),
        port=int(os.getenv("FLASK_PORT", 5000)),
        debug=bool(os.getenv("FLASK_DEBUG", True))
    )
