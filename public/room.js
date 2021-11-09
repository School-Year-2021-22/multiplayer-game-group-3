const app = {
  data() {
    return {
      socket: null,
      room: ROOM,
      game: GAME,
      userIndex: USER_INDEX
    }
  },
  methods: {
    moveUser(amount) {
      this.socket.emit(this.room+'_user_update', {
        i: this.userIndex,
        user: {
          left: this.game.users[this.userIndex].left + amount
        }
      })
    }
  },
  mounted() {
    this.socket = io();
    // to send: 
    // socket.emit('chat message', input.value);    
    this.socket.on(ROOM+'_update', (msg) => {
      this.game = msg
    });
  }
}

Vue.createApp(app).mount('.app')