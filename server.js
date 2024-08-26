const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {userJoin,getRoomUsers}=require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'public')));

const botName = 'Chatroom Bot';

io.on('connection', socket => {

    socket.on('joinRoom', ({ username, room }) => {
        const user=userJoin(socket.id,username,room);
        socket.join(user.room)
        socket.emit('message', formatMessage(botName, 'Welcome to the chat room!'));


        socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} has joined the chat`));
        io.to(user.room).emit('roomUsers',{
            room:user.room,
            users:getRoomUsers(user.room)
        });

        socket.on('chatMessage', msg => {
            io.to(room).emit('message', formatMessage(username, msg));
        });

        socket.on('disconnect', () => {
            io.to(room).emit('message', formatMessage(botName, `${username} has left the chat`));

            io.to(user.room).emit('roomUsers',{
                room:user.room,
                users:getRoomUsers(user.room)
            });
    
        });
    });
});

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
