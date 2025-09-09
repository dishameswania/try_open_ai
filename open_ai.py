from openai import OpenAI
from flask import Flask, render_template, request, jsonify
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Initialize the OpenAI client with API key from environment variable
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

# Initialize Flask app
app = Flask(__name__)

def ask_gpt(question):
    try:
        # Create a prompt for the GPT model using the new client
        response = client.chat.completions.create(
            model="gpt-4o",  # or "gpt-4" if you have access
            messages=[
                {"role": "user", "content": question}
            ],
            temperature=0.7,  # Control randomness: 0 is deterministic, 1 is random
            max_completion_tokens=2000,  # Increased limit for detailed responses
        )
        
        # Extract and return the model's response
        answer = response.choices[0].message.content.strip()
        return answer
    
    except Exception as e:
        return f"An error occurred: {str(e)}"

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        user_question = data.get('message', '')
        
        if not user_question:
            return jsonify({'error': 'No message provided'}), 400
        
        # Get the answer from GPT
        answer = ask_gpt(user_question)
        
        return jsonify({'response': answer})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
    # Create templates directory if it doesn't exist
    os.makedirs('templates', exist_ok=True)
    os.makedirs('static/css', exist_ok=True)
    os.makedirs('static/js', exist_ok=True)
    
    # Run the Flask app
    app.run(debug=True, host='0.0.0.0', port=5000)