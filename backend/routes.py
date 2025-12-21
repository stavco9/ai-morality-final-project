from flask import Blueprint,request, jsonify
from gemini import GeminiAPI

routes = Blueprint('routes', __name__)

@routes.route('/ask/gemini', methods=['POST'])
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