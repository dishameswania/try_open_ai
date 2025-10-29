# Try Open AI

Flask application with OpenAI integration and JFrog repository management.

## Features

- Flask web application
- OpenAI GPT integration
- JFrog Artifactory repository management
- RESTful API endpoints

## Installation

```bash
pip install -r requirements.txt
```

## Usage

```bash
python open_ai.py
```

The application will run on `http://0.0.0.0:5000`

## API Endpoints

- `GET /` - Home page
- `POST /chat` - Chat with GPT
- `POST /test-connection` - Test JFrog Artifactory connection
- `POST /create-repositories` - Create JFrog repositories

