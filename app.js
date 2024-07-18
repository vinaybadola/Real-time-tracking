const express = require('express');
const app = express();
const socketio = require('socket.io');
const http = require('http');
const path = require('path');

const server = http.createServer(app);
const io = socketio(server);

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
    console.log('A user connected: ' + socket.id);

    socket.on('send-Location', (data) => {
        io.emit('receive-location', { id: socket.id, ...data });
    });

    socket.on('disconnect', () => {
        io.emit('remove-location', socket.id);
        console.log('A user disconnected: ' + socket.id);
    });
});

app.get('/', (req, res) => {
    res.render('index');
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
