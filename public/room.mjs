import { CanvasUtils } from './common.mjs'

const canvas = document.getElementById('myCanvas')

const app = {
    data () {
        return {
            socket: null,
            counter: 0,
            fruits: {}
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
        const socket = window.io()
        this.socket = socket
        // Object.freeze(this.socket)

        const canvasUtils = new CanvasUtils(canvas, new Map([['body > div > div.fruit.fruit-target', this.cutFruit]])) //eslint-disable-line
        // to send:
        // socket.emit('chat message', input.value);
        // this.socket.on(ROOM + '_update', (msg) => { //eslint-disable-line
        //   console.log(msg)
        //   this.game = msg
        // })
        socket.on('_counter_update', (serverCounter) => {
            this.counter = serverCounter
        })

        socket.once('_fruit_list_update', (fruits) => {
            this.fruits = fruits
            console.log('Received fruit list update event')
        })

        socket.on('_fruit_list_push', (fruitObj) => {
            // this.fruits.push(fruitObj)
            const pushedObj = Object.assign(fruitObj, { position: { x: Math.floor(Math.random() * canvasUtils.canvasSize.width), y: Math.floor(Math.random() * canvasUtils.canvasSize.height) } })
            this.fruits[pushedObj.id] = pushedObj
            // console.log('pushed', pushedObj.id)
            console.log(this.fruits)
        })

        socket.on('_fruit_list_pop', (id) => {
            const possibleIndex = Object.values(this.fruits).findIndex((fruit) => fruit?.id ?? undefined === id)
            if (possibleIndex !== -1) /* delete this.fruits[possibleIndex] */ this.fruits.splice(possibleIndex, 1)
            // console.log('popped', id)
            console.log(this.fruits)
        })
    }
}

window.Vue.createApp(app).mount('.app')
