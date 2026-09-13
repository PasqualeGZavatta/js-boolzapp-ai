const myMessageEl = document.getElementById('new-text-box')

const inputMessageEl = document.getElementById('my-text')
const form = document.querySelector('form')

let messageText = '';
let whoIsWriting = '';
//endpoint con chiave annessa

const endpoint = geminiConfig.endpoint + '?key=' + geminiConfig.apiKey;

const chatHistory = [];







form.addEventListener('submit', function (e) {
    e.preventDefault()
    addUserTextMessage()

})


//funcions

function addUserTextMessage() {

    if (inputMessageEl.value.trim() !== '') {
        myMessageEl.innerHTML += `<p class="msg user-msg">${inputMessageEl.value}</p>`

        whoIsWriting = 'user';
        messageText = inputMessageEl.value;
        addChatHistory();
        sendToGemini();
        inputMessageEl.value = ''
    }

}

function addChatHistory() {
    chatHistory.push({
        role: whoIsWriting,
        parts: [{ text: messageText }]
    })
    // console.table(chatHistory)
}

async function sendToGemini() {
    const response = await fetch(endpoint,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ contents: chatHistory })
        }
    )
    const data = await response.json();
    console.log(data);
    const aiText = data.candidates[0].content.parts[0].text
    addAiTextMessage(aiText)

}

function addAiTextMessage(message) {
    myMessageEl.innerHTML += `<p class="msg ai-msg">${message}</p>`

    whoIsWriting = 'model';
    messageText = message;
    addChatHistory();


}