
content_types = {
    'JSON': 'application/json',
    'FORM_DATA': 'multipart/form-data'
}

mime_types = {
    'PDF': 'application/pdf',
    'JPG': 'image/jpeg'
}

system_prompt = """
Hello
I need you please to respond me in Hebrew, unless I tell you something else
In addition, I can attach you some PDF files

For each PDF file I attach you, can you please give a short summary of this file ?
If no PDF file attached, please write that you haven't detected any PDF file
"""