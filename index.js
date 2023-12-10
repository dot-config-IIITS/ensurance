const chatLog = document.getElementById('chat-log'),
    userInput = document.getElementById('user-input'),
    sendButton = document.getElementById('send-button'),
    buttonIcon = document.getElementById('button-icon'),
    info = document.querySelector('.info');

const srcIdsData = {
    1: 'src_f3mYWvizfofE0glcc9Ytn',
    2: 'src_h4pJkwU8el0V7xJbvlJlM',
    3: 'src_wWzuif7i20842zGQn5w7K',
    4: 'src_Rwu5zONlJxZk0LocahJrn',
    5: 'src_Pshn9Pp0vsbntFwEktwmw',
    6: 'src_pMH9zsaLARTiYIdPQ6GyK',
    7: 'src_qWYDKuf9WOkIdilBjBj2X',
    8: 'src_k1bI9zHWefhkv1k5rxtVZ',
    9: 'src_tMuSoyRTDRtnGJWAGoPtC',
    10: 'src_wWFMzTLRSp1yddp0k94Hr',
    11: 'src_YGwwRj0kz3Tojgf3mFel0',
    12: 'src_6cSb2R50WKfjTuBnfVW99',
    13: 'src_iKxpu0ZxRtd5n7pdotJL2',
};

const srcIdSelect = document.getElementById('src-id');
const fileUploadInput = document.getElementById('pdf-upload'); // Add this line

fileUploadInput.addEventListener('change', handleFileUpload); // Add this line

srcIdSelect.addEventListener('change', () => {
    const selectedSrcId = srcIdsData[srcIdSelect.value];
    // updateSourceId(selectedSrcId);
});

function updateSourceId(selectedSrcId) {
    // console.log('Selected Source ID:', selectedSrcId);
}

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
    } else if (message === 'Hi' || message === 'hi' || message === 'Hello' || message === 'hello') {
        userInput.value = '';
        appendMessage('user', message);
        setTimeout(async () => {
            appendMessage('bot', 'Hello, I\'m Your Personal AI-Assistant. \nI\'m Here To Help You Clear All Doubts Related To Your Insurance.');
            buttonIcon.classList.add('fa-solid', 'fa-paper-plane');
            buttonIcon.classList.remove('fas', 'fa-spinner', 'fa-pulse');
        }, 2000);
        return;
    } else if (message === 'test') {
        userInput.value = '';
        appendMessage('user', message);
        setTimeout(async () => {    
            appendMessage('bot', 'Unauthorized Message');
        }, 2000);
        return;
    }

    appendMessage('user', message);
    userInput.value = '';

    const selectedSrcId = srcIdsData[srcIdSelect.value];
    // console.log('===========Source ID:', selectedSrcId);
    setTimeout(async () => {
        try {
            const response = await fetch('https://api.chatpdf.com/v1/chats/message', {
                method: 'POST',
                headers: {
                    'x-api-key': 'sec_b0bihQqZZ6GG1SBBhFyX3DzYNDcqX3ST',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "referenceSources": true,
                    "sourceId": selectedSrcId,
                    "messages": [{
                        "role": "user",
                        "content": message
                    }]
                })
            });

            const result = await response.json();
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


function handleFileUpload(event) {
    const srcId = Object.keys(srcIdsData).length + 1;
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    let userSrcId = '';
    setTimeout(async () => {
            try {
                const response = await fetch('https://api.chatpdf.com/v1/sources/add-file', {
                    method: 'POST',
                    headers: {
                        'x-api-key': 'sec_b0bihQqZZ6GG1SBBhFyX3DzYNDcqX3ST',
                    },
                    body: formData,
                });
    
                const result = await response.json();
                // console.log(response);
                // console.log(result);
                userSrcId = result.sourceId;
            } catch (err) {
                console.error(err);
                if (err.name === 'TypeError') {
                    appendMessage('bot', 'Error: Check Your API Key!');
                }
            }
        }, 2000);

    const optionText = 'Your Current Plan';

    setTimeout(async () => {
        srcIdsData[srcId] = userSrcId;
        await addOptionToDropdown(srcId, optionText);
    }, 5000);

    // console.log('Custom Source ID:', srcId);
    // console.log('Uploaded File:', file);
    // console.log(srcIdsData);
}

function addOptionToDropdown(srcId, optionText) {
    const newOption = document.createElement('option');
    newOption.value = srcId;
    newOption.text = optionText;
    srcIdSelect.add(newOption);
    srcIdSelect.value = srcId;
}