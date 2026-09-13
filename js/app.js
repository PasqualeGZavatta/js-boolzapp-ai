const myMessageEl = document.getElementById('new-text-box')

const inputMessageEl = document.getElementById('my-text')
const form = document.querySelector('form')




form.addEventListener('submit', function (e) {
    e.preventDefault()
    addTextMessage()

})


//funcions

function addTextMessage() {

    if (inputMessageEl.value.trim() !== '') {
        myMessageEl.innerHTML += `<p>${inputMessageEl.value}</p>`
        inputMessageEl.value = ''
    }

}