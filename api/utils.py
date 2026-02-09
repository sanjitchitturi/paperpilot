import PyPDF2
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini
genai.configure(api_key=os.getenv('GEMINI_API_KEY'))
model = genai.GenerativeModel('gemini-3-flash-preview')

def extract_text_from_pdf(pdf_path):
    """
    Extract text content from a PDF file.
    
    Args:
        pdf_path (str): Path to the PDF file
        
    Returns:
        str: Extracted text from the PDF
    """
    try:
        text = ""
        with open(pdf_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            num_pages = len(pdf_reader.pages)
            
            for page_num in range(num_pages):
                page = pdf_reader.pages[page_num]
                text += page.extract_text()
        
        return text.strip()
    
    except Exception as e:
        print(f"Error extracting text from PDF: {str(e)}")
        return None

def generate_summary(text):
    """
    Generate a comprehensive summary of the research paper using Gemini.
    
    Args:
        text (str): Full text of the research paper
        
    Returns:
        str: Generated summary
    """
    try:
        prompt = f"""You are an expert research assistant. Provide a comprehensive summary of the following research paper. 

Include:
- Main objective and research question
- Methodology used
- Key findings and results
- Main contributions

Research Paper:
{text[:30000]}

Summary:"""

        response = model.generate_content(prompt)
        return response.text
    
    except Exception as e:
        print(f"Error generating summary: {str(e)}")
        return "Error generating summary. Please try again."

def ask_question(question, context):
    """
    Answer a question about the research paper using Gemini.
    
    Args:
        question (str): User's question
        context (str): Full text of the research paper
        
    Returns:
        str: Answer to the question
    """
    try:
        prompt = f"""You are an expert research assistant analyzing a research paper. Answer the following question based on the paper content.

Research Paper:
{context[:30000]}

Question: {question}

Provide a detailed and accurate answer based on the paper content:"""

        response = model.generate_content(prompt)
        return response.text
    
    except Exception as e:
        print(f"Error answering question: {str(e)}")
        return "Error generating answer. Please try again."