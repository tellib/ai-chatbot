from flask import Flask, request, jsonify
from gpt4all import GPT4All

app = Flask(__name__)

model = GPT4All("Meta-Llama-3-8B-Instruct.Q4_0.gguf")

@app.route("/generate", methods=["POST"])
def generate():
    data = request.json
    prompt = data.get("prompt", "")
    response = model.generate(prompt, max_tokens=1024)
    print(response)
    return jsonify({"response": response})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=1000)
