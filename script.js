document.addEventListener('DOMContentLoaded', () => {
    const minimizeBtn = document.querySelector('.minimize-btn');
    const chatArea = document.querySelector('.chat-area');
    const inputArea = document.querySelector('.input-area');
    const sendBtn = document.querySelector('.send-btn');
    const inputField = document.querySelector('.input-area input');
    const refreshLogo = document.getElementById('refresh-logo');

    const OPENROUTER_API_KEY = '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'; // Replace with your key

    // Refresh page on logo click
    refreshLogo.addEventListener('click', () => {
        location.reload();
    });

    // Minimize chat window
    minimizeBtn.addEventListener('click', () => {
        chatArea.classList.toggle('hidden');
        inputArea.classList.toggle('hidden');
        minimizeBtn.textContent = chatArea.classList.contains('hidden') ? '+' : '-';
    });

    // Append message to chat area with animation
    const appendMessage = (message, isUser) => {
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-message ${isUser ? 'user' : 'bot'}`;
        msgDiv.textContent = message;
        if (!isUser && message === "Hello! How can I assist you today?") {
            msgDiv.textContent += ' 😊'; // Add emoji only for the welcome message
        }
        Object.assign(msgDiv.style, {
            marginBottom: '10px',
            opacity: '0',
            transform: 'translateY(10px)'
        });
        chatArea.appendChild(msgDiv);
        chatArea.scrollTop = chatArea.scrollHeight;
        setTimeout(() => {
            msgDiv.style.opacity = '1';
            msgDiv.style.transform = 'translateY(0)';
        }, 50);
        return msgDiv;
    };

    // Fetch response from DeepSeek R1 Nitro
    const fetchBotResponse = async (userMessage) => {
        const thinkingMsg = appendMessage('Thinking...', false);
        try {
            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'deepseek/deepseek-r1:free',
                    messages: [{ role: 'user', content: userMessage }],
                    temperature: 0.6
                })
            });
            if (!response.ok) throw new Error('API error');
            const data = await response.json();
            let botResponse = data.choices[0].message.content;

            // Check for specific question and override response
            const creatorQuestions = [
                'who made you', 'who created you', 'who built you', 'who designed you',
                'who brought you into existence', 'who is your creator', 'who invented you',
                'who gave you life', 'who programmed you', 'who developed you', 'who shaped you',
                'who put you together', 'who formed you', 'who produced you', 'who constructed you',
                'who is responsible for you', 'who gave birth to you', 'who engineered you',
                'who manufactured you', 'who assembled you', 'where do you come from', 'where are you from',
                'where were you made', 'where were you created', 'where were you built', 'where were you designed',
                'where were you brought into existence', 'where were you invented', 'where were you programmed',
                'where were you developed', 'where were you shaped', 'where were you put together',
                'where were you formed', 'where were you produced', 'where were you constructed',
                'who are you', 'what are you', 'what is your purpose', 'what is your function',
            ];

            if (creatorQuestions.some(q => userMessage.toLowerCase().includes(q))) {
                botResponse = "Greetings! I'm Mani, an artificial intelligence assistant created by Mirza Rameez. I'm at your service and would be delighted to assist you with any inquiries or tasks you may have. 😊";
            }

            chatArea.removeChild(thinkingMsg);
            appendMessage(botResponse, false);
        } catch (error) {
            console.error('Fetch error:', error);
            chatArea.removeChild(thinkingMsg);
            appendMessage('Sorry, something went wrong.', false);
        }
    };

    // Handle send button click
    sendBtn.addEventListener('click', () => {
        const message = inputField.value.trim();
        if (message) {
            appendMessage(message, true);
            inputField.value = '';
            fetchBotResponse(message);
        }
    });

    // Handle Enter key press
    inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendBtn.click();
    });

    // Initial welcome message
    appendMessage('Hello! I am Mani, How can I assist you today?😊', false);
});