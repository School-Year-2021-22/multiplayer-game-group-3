import { CanvasUtils } from "./common.mjs";

const canvas = document.getElementById("myCanvas");

new CanvasUtils(canvas, new Map([["body > div > div > div.home-button.home-button-blue > img", async () => {
    const userName = document.querySelector('#userName').value
    if (userName) {
        window.location.assign(`${window.location.protocol}//${window.location.host}/rooms/${userName}`)
    } else {
        alert('add a name!')
    }
}]]));