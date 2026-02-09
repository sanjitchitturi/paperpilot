from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
import google.generativeai as genai
from utils import extract_text_from_pdf, generate_summary, ask_question

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Configure Gemini API
genai.configure(api_key=os.getenv('GEMINI_API_KEY'))

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/upload', methods=['POST'])
def upload_file():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not file.filename.endswith('.pdf'):
            return jsonify({'error': 'Only PDF files are allowed'}), 400
        
        filepath = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(filepath)
        
        # Extract text from PDF
        text = extract_text_from_pdf(filepath)
        
        if not text:
            return jsonify({'error': 'Could not extract text from PDF'}), 400
        
        # Generate summary using Gemini
        summary = generate_summary(text)
        
        # Clean up uploaded file
        os.remove(filepath)
        
        return jsonify({
            'filename': file.filename,
            'text': text,
            'summary': summary
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/ask', methods=['POST'])
def ask():
    try:
        data = request.get_json()
        
        if not data or 'question' not in data or 'context' not in data:
            return jsonify({'error': 'Question and context are required'}), 400
        
        question = data['question']
        context = data['context']
        
        # Get answer from Gemini
        answer = ask_question(question, context)
        
        return jsonify({'answer': answer}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy'}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5001)