const myMessageEl = document.getElementById('new-text-box')
const inputMessageEl = document.getElementById('my-text')
const form = document.querySelector('form')
const personalityOptions = document.querySelectorAll('.dropdown-menu .dropdown-item');
const switchModeToggle = document.getElementById('mioInterruttore')
const backgroundTheme = document.getElementById('sfondo')
const headerEl = document.querySelector('.app-header')
const footerEl = document.querySelector('.app-footer')
const chatBoxEl = document.querySelector('.chat-box')
const statusEl = document.querySelector('.contact-status')
const dot = document.getElementById('dot')
//endpoint con chiave annessa

const endpoint = geminiConfig.endpoint + '?key=' + geminiConfig.apiKey;
const chatHistory = [];
let clock;

let currentKey = Object.keys(geminiConfig.systemPrompt)[0];
let SYSTEM_PROMP = geminiConfig.systemPrompt[currentKey];
personalityOptions.forEach(option => {
    option.addEventListener('click', function (e) {
        e.preventDefault();

        const index = this.getAttribute('data-value');
        SYSTEM_PROMP = geminiConfig.systemPrompt[index];

        console.log("Personalità aggiornata all'indice:", index);
    });
});
switchModeToggle.addEventListener('change', () => {
    if (switchModeToggle.checked) {
        console.log('accendo dark mode');
        headerEl.classList.add('dark-mode');
        footerEl.classList.add('dark-mode');
        dot.classList.add('dark-mode')
        backgroundTheme.classList.add('dark-mode-background');

    } else {
        console.log('spengo dark mode');
        headerEl.classList.remove('dark-mode');
        footerEl.classList.remove('dark-mode');
        dot.classList.remove('dark-mode')
        backgroundTheme.classList.remove('dark-mode-background');

    }
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

        scrollToBottom();

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
    isWritingStatus();
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

    clearInterval(clock);
    statusEl.innerHTML = 'Online 🟢';

    scrollToBottom();

}

async function isWritingStatus() {

    statusEl.innerHTML = '<span style="font-size: 1rem">Sta Scrivendo </span>'


    clock = setInterval(() => {
        if (!statusEl.innerHTML.endsWith('...')) {

            statusEl.innerHTML += '.'
        }
        else {
            statusEl.innerHTML = '<span style="font-size: 1rem">Sta Scrivendo .</span>'
        }
    }, 1000);

    console.log(clock);




    //STAVO FACENDO IL STO SCRIVENDO: RIPRENDERE CON IL CLOCK CLEAR INTERVAL E LA RISCRITTURA DI ONLINE.

}

function scrollToBottom() {
    chatBoxEl.scrollTop = chatBoxEl.scrollHeight;
}