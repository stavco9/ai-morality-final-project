from google import genai
from google.genai import types
from consts import content_types

class GeminiAPI:
    def __init__(self):
        self.client = genai.Client()
        self.model = "gemini-2.5-flash"

    def upload_files(self, files):
        list_of_uploaded_files = []
        for file_key, file_content in files.items():
            try:
                uploaded_file = self.client.files.upload(
                    file=file_content,
                    config=dict(mime_type=content_types['PDF'])
                )
                list_of_uploaded_files.append(uploaded_file)
            except Exception as e:
                print(f"Error uploading file {file_key}: {e}")
                continue
        return list_of_uploaded_files

    def generate_text(self, system_prompt, user_prompt, files=None):
        response_text = None
        contents = []
        if files:
            contents.extend(self.upload_files(files))
        contents.append(user_prompt)
        try:
            response = self.client.models.generate_content(
                model=self.model,
                config=types.GenerateContentConfig(
                    system_instruction=system_prompt
                ),
                contents=contents
            )
            response_text = response.text
        except Exception as e:
            print(f"Error generating text: {e}")
        
        return response_text