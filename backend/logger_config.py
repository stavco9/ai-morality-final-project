import logging
import sys


class LoggerConfig:
    """Logger configuration class for centralized logging setup."""
    
    _configured = False
    
    @classmethod
    def setup(cls):
        """
        Configure logging for the application.
        Sets up logging with INFO level and a structured format that includes
        timestamp, logger name, log level, and message.
        """
        if not cls._configured:
            logging.basicConfig(
                level=logging.INFO,
                format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
                datefmt='%Y-%m-%d %H:%M:%S',
                handlers=[
                    logging.StreamHandler(sys.stdout)
                ]
            )
            cls._configured = True
    
    @staticmethod
    def get_logger(name: str):
        """
        Get a logger instance for the specified module.
        
        Args:
            name: The name of the module (typically __name__)
            
        Returns:
            A configured logger instance
        """
        return logging.getLogger(name)

