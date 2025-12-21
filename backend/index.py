# Importing flask module in the project is mandatory
# An object of Flask class is our WSGI application.
from flask import Flask, request, jsonify
from gemini import GeminiAPI

# Flask constructor takes the name of 
# current module (__name__) as argument.
app = Flask(__name__)

# The route() function of the Flask class is a decorator, 
# which tells the application which URL should call 
# the associated function.
@app.route('/')
def hello_world():
    return 'Hello World'


@app.route('/ask/gemini', methods=['POST'])
def ask_gemini():
    data = request.json
    user_prompt = data.get('prompt')

    if user_prompt is None:
        return jsonify({'error': 'Prompt is required'}), 400

    system_prompt = open("system_prompt.txt", "r").read()
    response_text = GeminiAPI().generate_text(system_prompt, user_prompt)

    if response_text is None:
        return jsonify({'error': 'Failed to generate response'}), 500
    
    return jsonify({'response': response_text})

# Please set the environment variable GEMINI_API_KEY by the value from https://aistudio.google.com/api-keys
# prior to running the application
if __name__ == '__main__':
    app.run()