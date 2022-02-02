import { CanvasUtils } from './common.mjs'

const canvas = document.getElementById('myCanvas')

const app = {
    data () {
        return {
            socket: null,
            counter: 0
            // room: ROOM, //eslint-disable-line
            // game: GAME //eslint-disable-line
            // userIndex: USER_INDEX //eslint-disable-line
        }
    },
    methods: {
        async cutFruit () {
            this.socket.emit('_cut_fruit')
        }
    },
    mounted () {
        this.socket = window.io()
        // to send:
        // socket.emit('chat message', input.value);
        // this.socket.on(ROOM + '_update', (msg) => { //eslint-disable-line
        //   console.log(msg)
        //   this.game = msg
        // })
        this.socket.on('_counter_update', (serverCounter) => {
            this.counter = serverCounter
        })

    new CanvasUtils(canvas, new Map([['body > div > div.fruit.food-strawberry.rotate-l', this.cutFruit], ['body > div > div.fruit.lemon.rotate-r', this.cutFruit], ['body > div > div.fruit.watermelon.rotate-r', this.cutFruit], ['body > div > div.fruit.pineapple.rotate-l', this.cutFruit]])) //eslint-disable-line
    }
}

window.Vue.createApp(app).mount('.app')
