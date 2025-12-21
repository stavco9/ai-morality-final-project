from consts import content_types
import io
import json

def parse_request_data(request, form_key: str = 'body'):
    content_type = request.content_type.split(';')[0].strip().lower()

    if content_type == content_types['JSON']:
        return request.json
    elif content_type == content_types['FORM_DATA']:
        try:
            form_body = request.form.get(form_key)
            if form_body is None:
                raise ValueError(f"Form key {form_key} not found in form data")
            return json.loads(form_body)
        except json.JSONDecodeError:
            raise ValueError(f"Invalid JSON in form data for key {form_key}")
        except Exception as e:
            raise ValueError(f"Failed to parse form data: {e}")
    else:
        raise ValueError(f"Unsupported content type: {request.content_type}")

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

        file_data[key] = file_content
    return file_data