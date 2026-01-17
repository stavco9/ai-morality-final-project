# Importing flask module in the project is mandatory
# An object of Flask class is our WSGI application.
from flask import Flask
from flask_cors import CORS
from routes import routes
from dotenv import load_dotenv
from logger_config import LoggerConfig

# Configure logging
LoggerConfig.setup()
logger = LoggerConfig.get_logger(__name__)

# Load environment variables from .env file
load_dotenv()

# Flask constructor takes the name of 
# current module (__name__) as argument.
app = Flask(__name__)
CORS(app)

# The route() function of the Flask class is a decorator, 
# which tells the application which URL should call 
# the associated function.
@app.route('/')
def hello_world():
    return 'Hello World'

app.register_blueprint(routes)


# Please set the environment variable GEMINI_API_KEY by the value from https://aistudio.google.com/api-keys
# prior to running the application
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)