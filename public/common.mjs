class CanvasUtils {
    #canvas
    #ctx
    #targetsMap

    #mousePos = new Uint16Array(32)

    /**
     * @param {HTMLCanvasElement} canvas
     * @param {Map<(keyof HTMLElementTagNameMap | string), () => Promise<void>>} targetsMap
     */
    constructor (canvas, targetsMap) {
        this.#canvas = canvas
        this.#ctx = canvas.getContext('2d')

        this.#targetsMap = targetsMap

        window.addEventListener('resize', this.resizer)
        this.resizer()

        window.addEventListener('mousemove', (event) => {
            if (event.clientX === this.#mousePos[30] && event.clientY === this.#mousePos[31]) return

            const newMousePos = new Uint16Array([...this.#mousePos.slice(2), event.clientX, event.clientY])
            this.#mousePos = newMousePos
        })

        window.requestAnimationFrame(() => this.gameLoop())
    }

    /**
     * @param {number} x
     * @param {number} y
     * @param {DOMRect} target
     * @returns {boolean}
     */
    #insideCheck (x, y, target) {
        return (x > target.left && x < target.right && y > target.top && y < target.bottom)
    }

    /**
     * @param {DOMRect} target
     * @param {() => Promise<void>} func
     */
    async #checkObj (target, func) {
        let slicing = false
        let occurences = 0

        if (this.#insideCheck(this.#mousePos[0], this.#mousePos[1], target) || this.#insideCheck(this.#mousePos[30], this.#mousePos[31], target)) occurences++

        for (let i = 2; i < 32; i += 2) {
            if (slicing === false && this.#insideCheck(this.#mousePos[i], this.#mousePos[i + 1], target)) {
                slicing = true
                occurences++
            } else if (slicing === true && !this.#insideCheck(this.#mousePos[i], this.#mousePos[i + 1], target)) {
                slicing = false
                occurences++
            }
            // ctx.lineTo(mousePos[i], mousePos[i + 1]);
        }

        if (occurences === 1) {
            func()
        }
    }

    renderLines () {
        // const target = document.querySelector("body > div > div > div.home-button.home-button-blue > img").getBoundingClientRect();

        // let slicing = false;
        // let occurences = 0;

        // /**
        //  * @param {number} x
        //  * @param {number} y
        //  */
        // const inside = (x, y) => {
        //     return (x > target.left && x < target.right && y > target.top && y < target.bottom);
        // }

        // if (inside(mousePos[0], mousePos[1]) || inside(mousePos[30], mousePos[31])) occurences++;

        for (const target of this.#targetsMap) {
            const targetQuery = target[0]
            const assFunction = target[1]

            const domElement = document.querySelector(targetQuery)
            if (domElement === null) {
                // console.error("Null dom element was passed to CanvasUtils, targetQuery: " + targetQuery)
                // this.#targetsMap.delete(targetQuery);
                return
            }

            this.#checkObj(domElement.getBoundingClientRect(), assFunction)
        }

        this.#ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height)
        this.#ctx.beginPath()
        this.#ctx.moveTo(this.#mousePos[0], this.#mousePos[1])
        for (let i = 2; i < 32; i += 2) {
            // if (slicing === false && inside(mousePos[i], mousePos[i + 1])) {
            //     slicing = true;
            //     occurences++;
            // }
            // else if (slicing === true && !inside(mousePos[i], mousePos[i + 1])) {
            //     slicing = false;
            //     occurences++;
            // }
            this.#ctx.lineTo(this.#mousePos[i], this.#mousePos[i + 1])
        }
        this.#ctx.stroke()
        this.#ctx.closePath()

        // if (occurences === 1) window.location.assign(`${window.location.protocol}//${window.location.host}/rooms/room1`)
        // if (occurences === 1) {
        //     enterGame()
        // }
    }

    async resizer () {
        this.#canvas.width = window.innerWidth
        this.#canvas.height = window.innerHeight
        this.renderLines()
    }

    gameLoop () {
        const newMousePos = new Uint16Array([...this.#mousePos.slice(2), this.#mousePos[30], this.#mousePos[31]])
        this.#mousePos = newMousePos

        this.renderLines()

        window.requestAnimationFrame(() => this.gameLoop())
    }
}

export { CanvasUtils }
export default CanvasUtils
