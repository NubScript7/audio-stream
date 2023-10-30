const ip = require('./ip');
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const PORT = process.env.PORT || '3000';
const cors = require('cors');

const ports = [];

app.use(express.json());
app.use(cors());

function range(min,max){
  return Math.floor(Math.random() * (max - min) + min);
}

function findAvailablePort(){
  let port = range(1,1000);
  while(ports.includes(port)){
    port = range(1,1000);
  }
  return port;
}

app.get('/',(req,res)=>{
  res.sendFile(__dirname + '/views/audio.html');
})

app.get('/listen',(req,res)=>{
  res.sendFile(__dirname + '/views/listen.html');
})

io.on('connection',socket=>{
  socket.on('request-port',()=>{
    let port = findAvailablePort();
    socket.emit('available-port',port);
  })
  socket.on('audio',(port,blob)=>{
    if(!port)return;
    console.log(port)
    io.emit(`audio:${port}`,blob);
  })
})

server.listen(PORT,()=>{
  console.log('server listening at port 3000');
  console.log('shareable ip domain: '+ip.address())
})
