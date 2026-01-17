import logging
from flask import Blueprint,request, jsonify
from gemini import GeminiAPI
from helpers import parse_request_data, parse_request_files
from consts import system_prompt

logger = logging.getLogger(__name__)
routes = Blueprint('routes', __name__)

@routes.route('/ask/gemini', methods=['POST'])
def ask_gemini():
    files = parse_request_files(request)
    if not files:
        logger.info("No files uploaded. Continuing with text prompt.")
    
    data = parse_request_data(request, 'body')

    if data is None:
        return jsonify({'error': 'body field is required'}), 400

    response_text = GeminiAPI().generate_text(system_prompt, data, files)

    if response_text is None:
        return jsonify({'error': 'Failed to generate response'}), 500
    
    return jsonify({'response': response_text})