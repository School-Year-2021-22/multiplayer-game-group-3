const app = {
  data () {
    return {
      socket: null,
      room: window.ROOM,
      game: window.GAME,
      userIndex: window.USER_INDEX
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
    }
  },
  mounted () {
    this.socket = window.io()
    // to send:
    // socket.emit('chat message', input.value);
    this.socket.on(window.ROOM + '_update', (msg) => {
      this.game = msg
    })
  }
}

window.Vue.createApp(app).mount('.app')
