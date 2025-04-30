const express = require('express');
const { createServer } = require('node:http');
const { Server } = require('socket.io');
const path = require('path');

const { spawn } = require('child_process');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  transports: ['websocket']
});
let state = {
  bpm: 90,
  key: 'C',
  motifs: [0, 1, 2, 3, 4],
  appendGeneratedTheme: false,
  useMotifGenerator: true,
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

  socket.on('enableGeneratedTheme', newEnable => {
    state.enableGeneratedTheme = newEnable;
    console.log('Enable using generated theme changed to:', newEnable);
  });

  socket.on('useMotifGenerator', newEnable => {
    state.useMotifGenerator = newEnable;
    console.log('Use motiff generator: ', newEnable);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));

// Serve from root directory
const staticDir = path.join(__dirname);

const httpServerProcess = spawn(
  path.join(__dirname, 'node_modules', '.bin', 'http-server'),
  [staticDir, '-p', '8080', '-s', 'index.html'], // -s enables SPA fallback to index.html
  {
    stdio: ['ignore', 'ignore', 'ignore'], // suppress stdout, stderr
    shell: process.platform === 'win32'    // required on Windows
  }
);

process.on('exit', () => httpServerProcess.kill());

console.log(`Available on:
  http://127.0.0.1:8080`)

module.exports = { io, state };

