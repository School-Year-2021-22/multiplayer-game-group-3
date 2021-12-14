const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

let mousePos = new Uint16Array(32);

const renderLines = () => {
    const target = document.querySelector("body > div > div > div.menu-button.red > img").getBoundingClientRect();

    let slicing = false;
    let occurences = 0;

    /**
     * @param {number} x 
     * @param {number} y 
     */
    const inside = (x, y) => {
        return (x > target.left && x < target.right && y > target.top && y < target.bottom);
    }

    if (inside(mousePos[0], mousePos[1]) || inside(mousePos[30], mousePos[31])) occurences++;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.moveTo(mousePos[0], mousePos[1]);
    for (let i = 2; i < 32; i+=2) {
        if (slicing === false && inside(mousePos[i], mousePos[i + 1])) {
            slicing = true;
            occurences++;
        }
        else if (slicing === true && !inside(mousePos[i], mousePos[i + 1])) {
            slicing = false;
            occurences++;
        }
        ctx.lineTo(mousePos[i], mousePos[i + 1]);
    }
    ctx.stroke();
    ctx.closePath();

    if (occurences === 1) console.log("YES!");
}

const resizer = async () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;   
    renderLines();
}

window.addEventListener("resize", resizer);
resizer();

window.addEventListener("mousemove", (event) => {
    if (event.clientX === mousePos[30] && event.clientY === mousePos[31]) return;

    const newMousePos = new Uint16Array([...mousePos.slice(2), event.clientX, event.clientY]);
    mousePos = newMousePos;

    renderLines();
});

// let positionCache = 0;
// setInterval(() => {
//     const newMousePos = new Uint16Array([])

//     renderLines();
// }, 500)