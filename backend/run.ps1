& virtualenv venv
& .\venv\Scripts\activate
& pip install -r requirements.txt

if ($null -eq $env:GEMINI_API_KEY) {
    Write-Error "GEMINI_API_KEY environment variable is not set. Please set it by the value from https://aistudio.google.com/api-keys"
    exit 1
} else {
    Write-Host "GEMINI_API_KEY environment variable is set"
}

& python index.py