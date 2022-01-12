const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const port = process.env.PORT || 3000
// eslint-disable-next-line no-unused-vars
// const development = process.env.NODE_ENV === 'development'

// var Datastore = require('nedb');
// var rooms = new Datastore();
app.set('view engine', 'ejs')

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.render('homepage')
})

// app.get('/rooms/:gameId', (req, res) => {
//   res.render('room')
// })

const gameRoomPrefix = 'room-'
const games = {
}
app.get('/rooms/:gameId/:name', (req, res) => {
  // Get room name
  const roomName = gameRoomPrefix + req.params.gameId
  // If the game doesn't exsist, I'll inizialize it
  if (!games[roomName]) {
    games[roomName] = {
      users: [],
      game: {
      }
    }
  }

  const userIndex = games[roomName].users.length

  const newUser = {
    id: userIndex,
    ready: false,
    online: true,
    name: req.params.name,
    cuttedFruits: 0,
    left: parseInt(Math.random() * 200),
  }

  games[roomName].users.push(newUser)

  // Connect the user to the socket
  io.on('connection', (socket) => {
    games[roomName].users[games[roomName].users.length - 1].session_id = socket.id
    io.to(roomName).emit(roomName + '_update', games[roomName])
    // Join the socket room
    socket.join(roomName)
    // If the user is new, add it
    // users = io.sockets.adapter.rooms.get(roomName);
    // When the user closes the session, i remove it from the game
    socket.on('disconnect', () => {
      console.log('disconnect user', socket.id)
      let i = 0
      while (i < games[roomName].users.length) {
        console.log(games[roomName].users[i].session_id);
        if (games[roomName].users[i].session_id == socket.id){
          games[roomName].users[i].online = false
        }
        i++;
      }
      // const user = games[roomName].users.find(user => user.id === socket.id)
      // user ?? (games[roomName].users[user.id].online = false)
      // user ?? (io.to(roomName).emit(roomName + '_update', games[roomName]))
      io.to(roomName).emit(roomName + '_update', games[roomName])
    })

    // When we received a game update
    // We send it back to all the users
    socket.on(roomName + '_user_update', gameUpdate => {
      console.log('test', gameUpdate)
      games[roomName].users[gameUpdate.i] = {
        ...games[roomName].users[gameUpdate.i],
        ...gameUpdate.user
      }

      io.to(roomName).emit(roomName + '_update', games[roomName])
    })
  })

  res.render('room', {
    room: roomName,
    userIndex: userIndex,
    game: games[roomName]
  })
})

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`)
})
