let canvasWidth = 336
let canvasHeight = 512
let bird = {
    width: 34,
    height: 24,
    x: canvasWidth / 2 - 17,
    y: canvasHeight / 2 - 12,
    angle: 0,
}
let base = {
    x: 0,
    y: canvasHeight - 60,
    width: 336,
    height: 112,
}
let ctx = null;
let bird_img = null;
let bird_upflap_img = null;
let bird_down_flap_img = null;
let base_img = null;
let base_offset = 0;
let pipe_img = null;
let pipe_img_reverse = null;
let pipes = [];
let birdFlaps = [];
let currentImageIndex = 0;
let speed = 0;
let gravity = 0.4;
let game_over = false;
let game_start = true;
let score = 0;
window.onload = () => {
    let canvas = document.getElementById('canvas')
    canvas.width = canvasWidth
    canvas.height = canvasHeight
    ctx = canvas.getContext('2d')

    bird_upflap_img = new Image();
    bird_upflap_img.src = "./resources/sprites/bluebird-upflap.png";
    bird_img = new Image();
    bird_img.src = "./resources/sprites/bluebird-midflap.png";
    bird_down_flap_img = new Image();
    bird_down_flap_img.src = "./resources/sprites/bluebird-downflap.png";

    birdFlaps.push(bird_upflap_img);
    birdFlaps.push(bird_img);
    birdFlaps.push(bird_down_flap_img);
    setInterval(() => {
        currentImageIndex = (currentImageIndex + 1) % birdFlaps.length;
    }, 50);

    base_img = new Image();
    base_img.src = "./resources/sprites/base.png";
    base_img.onload = () => {
        ctx.drawImage(base_img, base.x, base.y, base.width, base.height)
    }

    pipe_img = new Image();
    pipe_img.src = "./resources/sprites/pipe-green.png";

    pipe_img_reverse = new Image();
    pipe_img_reverse.src = "./resources/sprites/pipe-green-reverse.png";

    setInterval(() => {
        const bottomRandomHeight = Math.random() * 100
        let bottomPipe = {
            x: canvasWidth - 30,
            y: canvasHeight - base.height - 60 - bottomRandomHeight + bird.height / 2,
            width: 50,
            height: 112 + bottomRandomHeight - bird.height / 2,
            img: pipe_img,
            passed: false
        }
        pipes.push(bottomPipe);

        const topRandomHeight = Math.random() * 100
        let topPipe = {
            x: canvasWidth - 30,
            y: 0,
            width: 50,
            height: 110 + topRandomHeight - bird.height / 2,
            img: pipe_img_reverse,
            passed: false,
        }
        pipes.push(topPipe);
    }, 1500);


    requestAnimationFrame(animate);

    document.addEventListener('mousedown', (event) => {
        // if (!game_start) {
        //     speed = -6;
        //     bird.angle = 40;
        // }
        speed = -6;
        bird.angle = 40;

        //check mouse position
        var mouseX = event.clientX - canvas.getBoundingClientRect().left;
        var mouseY = event.clientY - canvas.getBoundingClientRect().top;
        if (game_over && (mouseX > 120 && mouseX < 220) && (mouseY > 320 && mouseY < 355)) {
            game_over = false
            bird.y = canvasHeight / 2 - 12;
            pipes = [];
            speed = 0;
            gravity = 0.4;
            score = 0;
            requestAnimationFrame(animate);
        }

        // if (game_start) {
        //     game_start = false
        //     /* bird.y = canvasHeight / 2 - 12;
        //     pipes = [];
        //     speed = 0;
        //     gravity = 0.4;
        //     score = 0; */
        //     requestAnimationFrame(animate);
        // }
    })
}
function animate() {
    // if (game_start) {
    //     birdFlap();
    //     const start_img = new Image();
    //     start_img.src = "../resources/sprites/start.png";
    //     start_img.onload = () => {
    //         ctx.drawImage(start_img, (canvasWidth-100)/2 , (canvasHeight-37)/1.5, 100, 37);
    //     }
    //     requestAnimationFrame(animate);
    //     return;
    // }
    if (game_over) {
        const game_over_img = new Image();
        game_over_img.src = "./resources/sprites/gameover.png";
        game_over_img.onload = () => {
            ctx.drawImage(game_over_img, (canvasWidth-192)/2 , (canvasHeight-42)/2, 192, 42);
        }
        const start_img = new Image();
        start_img.src = "./resources/sprites/start.png";
        start_img.onload = () => {
            ctx.drawImage(start_img, (canvasWidth-100)/2 , (canvasHeight-37)/1.5, 100, 37);
        }
        // birdFlap();
        return;
    }
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    birdFlap();
    drawBase();
    // draw the pipes array
    for (let i = 0; i < pipes.length; i++) {
        let p = pipes[i];
        ctx.drawImage(p.img, p.x-=2 , p.y, p.width, p.height)

        checkTouchPipe(p);

        // check if the pipe is passed
        if (!p.passed && bird.x > p.x + p.width) {
            p.passed = true;
            score += 0.5;
        }
    }

    while(pipes.length > 0 && pipes[0].x < -50) {
        pipes.shift();
    }

    speed += gravity
    bird.y = Math.max( bird.y + speed, 0)

    if (bird.y >= canvasHeight - 60) {
        game_over = true;
    }

    ctx.font = "24px serif";
    ctx.fillStyle = "white";
    ctx.fillText(score, 10, 30);

    requestAnimationFrame(animate);
}

function birdFlap() {
    // 儲存現階段canvas狀態
    ctx.save();

    // 將canvas的原點移動到鳥的中心
    ctx.translate(bird.x + bird.width / 2, bird.y + bird.height / 2);

    // 旋轉鳥的圖案
    ctx.rotate((Math.PI / 180) * bird.angle * -1);

    // 繪製圖案
    ctx.drawImage(birdFlaps[currentImageIndex], -bird.width / 2, -bird.height / 2, bird.width, bird.height);

    // if (!game_start) {
    //     bird.angle -= 2;
    // }
    bird.angle -= 2;
    // 恢復canvas狀態
    ctx.restore();
}

function drawBase() {
    // ctx.drawImage(base_img, base.x, base.y, base.width, base.height);
    if (base_offset < -20) base_offset = 0;
    ctx.drawImage(
        base_img,
        base_offset,
        base.y,
    );
    base_offset -= 2;
}

function checkTouchPipe(p) {
    if (bird.x + bird.width >= p.x && bird.x <= p.x + p.width && bird.y + bird.height >= p.y && bird.y <= p.y + p.height) {
        game_over = true;
    }
}