const API_BASE_URL = 'http://localhost:5001';

let selectedFile = null;
let paperContext = null;

if (document.getElementById('uploadBox')) {
    const uploadBox = document.getElementById('uploadBox');
    const fileInput = document.getElementById('fileInput');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const fileName = document.getElementById('fileName');

    uploadBox.addEventListener('click', () => fileInput.click());

    uploadBox.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadBox.classList.add('dragover');
    });

    uploadBox.addEventListener('dragleave', () => {
        uploadBox.classList.remove('dragover');
    });

    uploadBox.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadBox.classList.remove('dragover');
        const files = e.dataTransfer.files;
        if (files.length > 0 && files[0].type === 'application/pdf') {
            handleFileSelect(files[0]);
        }
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFileSelect(e.target.files[0]);
        }
    });

    function handleFileSelect(file) {
        selectedFile = file;
        fileName.textContent = file.name;
        analyzeBtn.disabled = false;
    }

    analyzeBtn.addEventListener('click', async () => {
        if (!selectedFile) return;

        analyzeBtn.disabled = true;
        analyzeBtn.textContent = 'Uploading...';

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await fetch(`${API_BASE_URL}/upload`, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('paperData', JSON.stringify(data));
                window.location.href = 'results.html';
            } else {
                alert('Error: ' + data.error);
                analyzeBtn.disabled = false;
                analyzeBtn.textContent = 'Analyze Paper';
            }
        } catch (error) {
            alert('Error connecting to server: ' + error.message);
            analyzeBtn.disabled = false;
            analyzeBtn.textContent = 'Analyze Paper';
        }
    });
}

if (document.getElementById('resultsContent')) {
    const loading = document.getElementById('loading');
    const resultsContent = document.getElementById('resultsContent');
    const paperTitle = document.getElementById('paperTitle');
    const analysisSection = document.getElementById('analysisSection');
    const analysisContent = document.getElementById('analysisContent');
    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendBtn');
    const actionButtons = document.querySelectorAll('.action-btn');

    const paperData = JSON.parse(localStorage.getItem('paperData'));

    if (!paperData) {
        window.location.href = 'index.html';
    } else {
        paperContext = paperData.text;
        
        setTimeout(() => {
            loading.style.display = 'none';
            resultsContent.style.display = 'block';
            paperTitle.textContent = paperData.filename || 'Research Paper';
            analysisContent.innerHTML = marked.parse(paperData.summary);
            actionButtons[0].classList.add('active');
        }, 1000);
    }

    const actionPrompts = {
        'summary': 'Provide a comprehensive summary of this paper.',
        'diagram': 'Explain the key diagrams, architecture, or methodology in this paper.',
        'limitations': 'What are the main limitations and weaknesses of this research?',
        'future': 'What future research directions or improvements does this paper suggest or what could be done next?',
        'startup': 'Based on this research, suggest a potential startup idea with market opportunity and implementation strategy.'
    };

    actionButtons.forEach(btn => {
        btn.addEventListener('click', async () => {
            const action = btn.dataset.action;
            
            actionButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            analysisSection.querySelector('h2').textContent = btn.textContent;
            analysisContent.innerHTML = '<p>Loading...</p>';

            try {
                const response = await fetch(`${API_BASE_URL}/ask`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        question: actionPrompts[action],
                        context: paperContext
                    })
                });

                const data = await response.json();
                
                if (response.ok) {
                    analysisContent.innerHTML = marked.parse(data.answer);
                } else {
                    analysisContent.innerHTML = '<p>Error: ' + data.error + '</p>';
                }
            } catch (error) {
                analysisContent.innerHTML = '<p>Error: ' + error.message + '</p>';
            }
        });
    });

    async function sendMessage() {
        const question = chatInput.value.trim();
        if (!question) return;

        addMessage(question, 'user');
        chatInput.value = '';
        sendBtn.disabled = true;

        addMessage('Thinking...', 'assistant', true);

        try {
            const response = await fetch(`${API_BASE_URL}/ask`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    question: question,
                    context: paperContext
                })
            });

            const data = await response.json();
            
            removeLastMessage();
            
            if (response.ok) {
                addMessage(data.answer, 'assistant');
            } else {
                addMessage('Error: ' + data.error, 'assistant');
            }
        } catch (error) {
            removeLastMessage();
            addMessage('Error: ' + error.message, 'assistant');
        }

        sendBtn.disabled = false;
    }

    function addMessage(text, sender, isTemporary = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        if (sender === 'assistant' && !isTemporary) {
            messageDiv.innerHTML = marked.parse(text);
        } else {
            messageDiv.textContent = text;
        }
        
        if (isTemporary) messageDiv.classList.add('temporary');
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function removeLastMessage() {
        const temporary = chatMessages.querySelector('.temporary');
        if (temporary) temporary.remove();
    }

    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
}