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

Or install via pip3:

```bash
pip3 install -r requirements.txt
```

## Setup

To run your application, you'll need to:

1. Create a `.env` file in your project root with:

   ```
   OPENAI_API_KEY=your_actual_api_key_here
   ```

2. Install the dependencies (see Installation above)

3. Run your application:

   ```bash
   python3 open_ai.py
   ```

The application will run on `http://0.0.0.0:5000`

## API Endpoints

- `GET /` - Home page
- `POST /chat` - Chat with GPT
- `POST /test-connection` - Test JFrog Artifactory connection
- `POST /create-repositories` - Create JFrog repositories
