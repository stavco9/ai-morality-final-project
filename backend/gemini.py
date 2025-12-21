from google import genai
from google.genai import types

class GeminiAPI:
    def __init__(self):
        self.client = genai.Client()
        self.model = "gemini-2.5-flash"

    def generate_text(self, system_prompt, user_prompt):
        response_text = None

        try:
            response = self.client.models.generate_content(
                model=self.model,
                config=types.GenerateContentConfig(
                    system_instruction=system_prompt
                ),
                contents=user_prompt
            )
            response_text = response.text
        except Exception as e:
            print(f"Error generating text: {e}")
        
        return response_text