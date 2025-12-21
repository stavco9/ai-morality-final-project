from flask import Blueprint,request, jsonify
from gemini import GeminiAPI
from helpers import parse_request_data, parse_request_files
from consts import system_prompt

routes = Blueprint('routes', __name__)

@routes.route('/ask/gemini', methods=['POST'])
def ask_gemini():
    files = parse_request_files(request)
    if not files:
        print("No files uploaded. Continuing with text prompt.")
    
    data = parse_request_data(request, 'body')
    user_prompt = data.get('prompt')

    if user_prompt is None:
        return jsonify({'error': 'Prompt is required'}), 400

    response_text = GeminiAPI().generate_text(system_prompt, user_prompt, files)

    if response_text is None:
        return jsonify({'error': 'Failed to generate response'}), 500
    
    return jsonify({'response': response_text})