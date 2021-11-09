const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;
// var Datastore = require('nedb');
// var rooms = new Datastore();
app.set('view engine', 'ejs');

app.use(express.static('public'));


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

const gameRoomPrefix = 'room-'

const games = {
}
app.get('/rooms/:gameId', (req, res) => {
  //Get room name
  const roomName = gameRoomPrefix+req.params.gameId
  // If the game doesn't exsist, I'll inizialize it
  if (!games[roomName]){
    games[roomName] = {
      users: [],
      game: {
      }
    }
  }
      
  let userIndex = games[roomName].users.length
  // Connect the user to the socket
  io.on('connection', (socket) => {
    // Join the socket room
    socket.join(roomName)
    // If the user is new, add it
    users = io.sockets.adapter.rooms.get(roomName);
    let userIndex = 0
    if (!games[roomName].users.find((u) => (u.id == socket.id))){
      const newUser = {
        id: socket.id,
        ready: false,
        online: true,
        name: '',
        left: parseInt(Math.random() * 200),
        click: 0
      }
      
      games[roomName].users.push(newUser)
      io.to(roomName).emit(roomName+'_update',games[roomName])
    }

    // When the user closes the session, i remove it from the game
    socket.on("disconnect", () => {
      console.log('disconnect user', socket.id)
      let i = 0
      while (i < games[roomName].users.length) {
        console.log(games[roomName].users[i].id);
        if (games[roomName].users[i].id == socket.id){
          games[roomName].users[i].online = false
        }
        i++;
      } 
      io.to(roomName).emit(roomName+'_update',games[roomName])
    });
    
    // When we received a game update
    // We send it back to all the users
    socket.on(roomName+'_user_update', gameUpdate => {
      console.log('test',gameUpdate)
      games[roomName].users[gameUpdate.i] = {
        ...games[roomName].users[gameUpdate.i],
        ...gameUpdate.user
      }

      io.to(roomName).emit(roomName+'_update',games[roomName])
    });
    

  });

  res.render('room',{
    room: roomName,
    userIndex: userIndex,
    game: games[roomName]
  });

});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});