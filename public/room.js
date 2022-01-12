const app = {
  data () {
    return {
      socket: null,
      room: ROOM, //eslint-disable-line
      game: GAME, //eslint-disable-line
      userIndex: USER_INDEX //eslint-disable-line
    }
  },
  methods: {
    moveUser (amount) {
      this.socket.emit(this.room + '_user_update', {
        i: this.userIndex,
        user: {
          left: this.game.users[this.userIndex].left + amount
        }
      })
    },
    cutFruit (amount) {
      this.socket.emit(this.room + '_user_update', {
        i: this.userIndex,
        user: {
          cuttedFruits: this.game.users[this.userIndex].cuttedFruits + 1
        }
      })
    }
  },
  mounted () {
    this.socket = window.io()
    // to send:
    // socket.emit('chat message', input.value);
    this.socket.on(ROOM + '_update', (msg) => {
      console.log(msg)
      this.game = msg
    })
  }
}

window.Vue.createApp(app).mount('.app')
