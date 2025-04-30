const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

let state = {
  bpm: 90,
  key: 'C',
  motifs: [0, 1, 2, 3, 4]
};

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', socket => {
  console.log('Client connected');
  socket.emit('init', state);

  socket.on('bpm', newBPM => {
    state.bpm = newBPM;
    console.log('BPM changed to', newBPM);
  });

  socket.on('key', newKey => {
    state.key = newKey;
    console.log('Key changed to', newKey);
  });

  socket.on('motifs', newMotifs => {
    state.motifs = newMotifs;
    console.log('Motifs changed to', newMotifs);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));

module.exports = { io, state };

