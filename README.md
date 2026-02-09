# PaperPilot

PaperPilot is an AI powered research assistant that transforms research papers into clear, structured insights. By uploading a research PDF, users can quickly understand the core ideas, methodology, diagrams, and implications without reading the entire document.

The platform is built to accelerate literature reviews, technical learning, and research validation.

---

## Overview

Research papers are dense, technical, and time consuming to analyze. Paper Pilot simplifies this process by combining document parsing, figure interpretation, and large language model reasoning.

It is designed for:

- Students conducting literature reviews  
- Researchers validating claims  
- Reviewers screening submissions  
- Builders exploring technical ideas  
- Founders identifying research driven opportunities  

---

## Features

- Executive summary generation  
- Methodology breakdown  
- Diagram and architecture explanations  
- Key contributions and takeaways  
- Limitations analysis  
- Future research directions  
- Startup idea generation  
- Interactive chat with the paper  

---

## System Architecture

Paper Pilot consists of a frontend interface and a backend AI processing pipeline.

### Frontend

Handles uploads, user interaction, and visualization.

**Core files**

- `index.html` Upload interface  
- `results.html` Analysis dashboard  
- `script.js` Client logic and API communication  
- `style.css` UI styling  

Key capabilities:

- Drag and drop PDF upload  
- Analysis selection dashboard  
- Streaming response rendering  
- Context aware research chat  

---

### Backend

Processes documents and generates AI outputs.

**Core files**

- `app.py` Main Flask server  
- `utils.py` PDF parsing and processing utilities  
- `list.py` Supporting processing logic  

Backend responsibilities:

1. PDF ingestion  
2. Text extraction  
3. Figure detection  
4. Context preparation  
5. Gemini API prompting  
6. Response generation  

---

## How It Works

1. User uploads a research PDF.  
2. File is sent to the backend `/upload` endpoint.  
3. Text and figures are extracted.  
4. Context is built for AI analysis.  
5. Gemini API generates structured outputs.  
6. Results are displayed on the dashboard.  
7. Users can ask follow up questions via `/ask`.

---

## Tech Stack

### Frontend
- HTML  
- CSS  
- JavaScript  
- Marked.js for Markdown rendering  

### Backend
- Python  
- Flask  

### AI and Processing
- Gemini API  
- PDF parsing libraries  
- Text extraction utilities  

### Infrastructure
- Localhost development server  
- REST API architecture  

---

## Installation

1. Clone the repository

```bash
git clone https://github.com/sanjitchitturi/paperpilot.git
cd paperpilot
```

2. Create a virtual environment

```bash
python -m venv venv
source venv/bin/activate
```

4. Install dependencies
```
pip install -r requirements.txt
```

5. Add environment variables

Create a .env file:

```
GEMINI_API_KEY=your_api_key_here
FLASK_ENV=development
```

5. Run the backend server

```
python app.py
```

Server runs at:

```
http://localhost:5001
```

6. Launch the frontend

Open ```index.html``` in your browser.

API Endpoints
Upload Paper
POST /upload

Uploads a PDF and returns processed paper context.

Ask Questions
POST /ask

Request body:

```
{
  "question": "Explain the methodology",
  "context": "paper text"
}
```

Returns an AI generated answer.

---

## Challenges Faced

- Parsing inconsistent PDF layouts
- Extracting diagrams accurately
- Associating figures with context
- Maintaining summary fidelity
- Handling long document context windows

---

## Accomplishments

- Built a full stack research analysis platform
- Enabled multimodal paper understanding
- Implemented contextual research chat
- Delivered structured, readable outputs
- Designed a clean analysis workflow
- What We Learned
- Multimodal AI integration
- Prompt engineering for research analysis
- PDF parsing optimization
- Context window management
- Frontend and backend orchestration

---

## Roadmap

Planned improvements include:

- Multi paper comparison
- Citation extraction
- Automated literature reviews
- Knowledge graph generation
- Collaborative annotations
- Cloud deployment and scaling

---

## Use Cases

- Literature review acceleration
- Thesis groundwork
- Research validation
- Technical onboarding
- Product ideation
- Replication feasibility checks
