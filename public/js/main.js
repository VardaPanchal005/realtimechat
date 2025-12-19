const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName=document.getElementById('room-name');
const userList=document.getElementById('users');

const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
});

const socket = io();

socket.emit('joinRoom', { username, room });

socket.on('roomUsers',({room,users})=>{
    outputRoomName(room);
    outputUsers(users);
});

socket.on('message', message => {
    console.log(message);
    outputMessage(message);

    chatMessages.scrollTop = chatMessages.scrollHeight;
});

chatForm.addEventListener('submit', e => {
    e.preventDefault();

    const msg = e.target.elements.msg.value;
    socket.emit('chatMessage', msg);

    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});


function outputMessage(message) {
    const div = document.createElement('div');

    const meta = document.createElement('p');
    meta.className = 'meta';
    meta.textContent = message.username;

    const timeSpan = document.createElement('span');
    timeSpan.textContent = message.time;
    meta.appendChild(timeSpan);

    const text = document.createElement('p');
    text.className = 'text';
    text.textContent = message.text;

    div.appendChild(meta);
    div.appendChild(text);

    chatMessages.appendChild(div);
}

function outputRoomName(room){
    roomName.innerText=room;
}

function outputUsers(users){
    // Clear existing list items
    userList.innerHTML = '';

    users.forEach(user => {
        const li = document.createElement('li');
        li.textContent = user.username;
        userList.appendChild(li);
    });
}
