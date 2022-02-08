class Fruits {
    static Strawberry = new Fruits('Strawberry')
    static Lemon = new Fruits('Lemon')
    static Watermelon = new Fruits('Watermelon')
    static Pineapple = new Fruits('Pineapple')

    constructor (name) {
        this.name = name
    }

    static fruitNameToClass(name) {
        switch (name) {
            case 'Strawberry':
                return this.Strawberry
            case 'Lemon':
                return this.Lemon
            case 'Watermelon':
                return this.Watermelon
            case 'Pineapple':
                return this.Pineapple
        }
    }
}

/**
 * Sleep for a ${ms} amount of time
 * @param {number} ms 
 */
const sleep = (ms) => {
    return new Promise(resolve => setTimeout(() => resolve(), ms));
}

module.exports = {
    Fruits,
    sleep
}