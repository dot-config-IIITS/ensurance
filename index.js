const chatLog = document.getElementById('chat-log'),
    userInput = document.getElementById('user-input'),
    sendButton = document.getElementById('send-button'),
    buttonIcon = document.getElementById('button-icon'),
    info = document.querySelector('.info');

sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

async function sendMessage() {
    const message = userInput.value.trim();

    if (message === '') {
        return;
    }
    else if (message === 'developer') {
        userInput.value = '';
        appendMessage('user', message);
        setTimeout(async () => {
            appendMessage('bot', 'Hello, I\'m Your Personal AI-Assistant. \nI\'m Here To Help You Clear All Doubts Related To Your Insurance.');
            buttonIcon.classList.add('fa-solid', 'fa-paper-plane');
            buttonIcon.classList.remove('fas', 'fa-spinner', 'fa-pulse');
        }, 2000);
        return;
    }
    appendMessage('user', message);
    userInput.value = '';

setTimeout(async () => {
    try {
        const response = await fetch('https://api.chatpdf.com/v1/chats/message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': 'sec_b0bihQqZZ6GG1SBBhFyX3DzYNDcqX3ST',
            },
            body: JSON.stringify({"referenceSources": true, "sourceId": "src_f3mYWvizfofE0glcc9Ytn", "messages":[{"role":"user","content":message}]})
        });

        const result = await response.json();
        // console.log(result);
        appendMessage('bot', result.content);
        buttonIcon.classList.add('fa-solid', 'fa-paper-plane');
        buttonIcon.classList.remove('fas', 'fa-spinner', 'fa-pulse');
    } catch (err) {
        console.error(err);
        if (err.name === 'TypeError') {
            appendMessage('bot', 'Error: Check Your API Key!');
            buttonIcon.classList.add('fa-solid', 'fa-paper-plane');
            buttonIcon.classList.remove('fas', 'fa-spinner', 'fa-pulse');
        }
    }
}, 2000);
return;
}

function appendMessage(sender, message) {
    info.style.display = "none";
    // change send button icon to loading using fontawesome
    buttonIcon.classList.remove('fa-solid', 'fa-paper-plane');
    buttonIcon.classList.add('fas', 'fa-spinner', 'fa-pulse');

    const messageElement = document.createElement('div');
    const iconElement = document.createElement('div');
    const chatElement = document.createElement('div');
    const icon = document.createElement('i');

    chatElement.classList.add("chat-box");
    iconElement.classList.add("icon");
    messageElement.classList.add(sender);
    messageElement.innerText = message;

    // add icons depending on who send message bot or user
    if (sender === 'user') {
        icon.classList.add('fa-regular', 'fa-user');
        iconElement.setAttribute('id', 'user-icon');
    } else {
        icon.classList.add('fa-solid', 'fa-robot');
        iconElement.setAttribute('id', 'bot-icon');
    }

    iconElement.appendChild(icon);
    chatElement.appendChild(iconElement);
    chatElement.appendChild(messageElement);
    chatLog.appendChild(chatElement);
    chatLog.scrollTo = chatLog.scrollHeight;

}