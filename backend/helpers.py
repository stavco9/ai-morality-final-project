from consts import content_types, mime_types
import io
import os
import json

def serialize_data(data):
    if type(data) in [dict, list]:
        return json.dumps(data, ensure_ascii=False)
    return data

def parse_response_data(data):
    if type(data) == str:
        data = data.replace("```json\n", "").replace("\n```", "")
        try:
            return json.loads(data)
        except json.JSONDecodeError:
            print(f"Invalid JSON in response data: {data}")
            return None
    return data

def parse_request_data(request, form_key: str = 'body'):
    content_type = request.content_type.split(';')[0].strip().lower()

    if content_type == content_types['JSON']:
        return serialize_data(request.json)
    elif content_type == content_types['FORM_DATA']:
        try:
            form_body = request.form.get(form_key)
            if form_body is None:
                raise ValueError(f"Form key {form_key} not found in form data")
            return serialize_data(json.loads(form_body))
        except json.JSONDecodeError:
            raise ValueError(f"Invalid JSON in form data for key {form_key}")
        except Exception as e:
            raise ValueError(f"Failed to parse form data: {e}")
    else:
        raise ValueError(f"Unsupported content type: {request.content_type}")

def get_file_mime_type(file):
    if file.mimetype == content_types['FORM_DATA']:
        file_extension = os.path.splitext(file.filename)[1].strip('.')
        mime_type = mime_types.get(file_extension.upper(), None)
        return mime_type
    else:
        return file.mimetype

def parse_request_files(request):   
    file_data = {}
    for key, file in request.files.items():
        file_content = file.read()
        if type(file_content) == bytes:
            file_content = io.BytesIO(file_content)
        elif type(file_content) == str:
            file_content = io.StringIO(file_content)
        else:
            print(f"Unsupported file content type: {type(file_content)}")
            continue

        file_mime_type = get_file_mime_type(file)


        if file_mime_type is None:
            print(f"Unsupported file mime type: {file_mime_type}")
            continue

        file_data[key] = {
            'content': file_content,
            'mime_type': file_mime_type
        }
    return file_data