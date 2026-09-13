const myMessageEl = document.getElementById('new-text-box')
const inputMessageEl = document.getElementById('my-text')
const form = document.querySelector('form')
const personality = document.getElementById('personality-select')

//endpoint con chiave annessa

const endpoint = geminiConfig.endpoint + '?key=' + geminiConfig.apiKey;
const chatHistory = [];


let SYSTEM_PROMP = geminiConfig.systemPrompt[personality.value];
personality.addEventListener('change', function (e) {
    // Sarà 1,2,3,4 o 5
    const index = e.target.value
    SYSTEM_PROMP = geminiConfig.systemPrompt[index];

    console.log("Personalità aggiornata all'indice:", index);
})


form.addEventListener('submit', function (e) {
    e.preventDefault()
    addUserTextMessage()

})


//funcions

function addUserTextMessage() {
    const text = inputMessageEl.value.trim();

    if (text !== '') {
        myMessageEl.innerHTML += `<p class="msg user-msg">${text}</p>`

        addChatHistory('user', text);
        sendToGemini();
        inputMessageEl.value = ''
    }

}

function addChatHistory(role, text) {
    chatHistory.push({
        role: role,
        parts: [{ text: text }]
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
            body: JSON.stringify({
                system_instruction: {
                    parts: [{ text: SYSTEM_PROMP }]
                },
                contents: chatHistory
            })
        }
    )
    const data = await response.json();
    console.log(data);
    const aiText = data.candidates[0].content.parts[0].text;
    addAiTextMessage(aiText)

}

function addAiTextMessage(message) {
    myMessageEl.innerHTML += `<p class="msg ai-msg">${message}</p>`

    addChatHistory('model', message);


}