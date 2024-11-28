from flask import Flask, request, jsonify
from flask_cors import CORS
from gpt4all import GPT4All
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
# CORS(app, resources={r"/*": {"origins": ["http://localhost:4000", "http://localhost:3000"]}})
CORS(app, resources={r"/*": {"origins": "*"}})

model = GPT4All("Meta-Llama-3-8B-Instruct.Q4_0.gguf")

@app.route("/generate", methods=["POST"])
def generate():
    data = request.json
    prompt = data.get("prompt", "")
    response = model.generate(prompt, max_tokens=512)
    print(response)
    return jsonify({"response": response})


if __name__ == "__main__":
    app.run(
        host=os.getenv("FLASK_HOST", "127.0.0.1"),
        port=int(os.getenv("FLASK_PORT", 5000)),
        debug=bool(os.getenv("FLASK_DEBUG", True))
    )
