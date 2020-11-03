/////// LOAD IMAGES ////////

const LEVEL_IMG = new Image();
LEVEL_IMG.src = "assets/img/level.png";

const LIFE_IMG = new Image();
LIFE_IMG.src = "assets/img/life.png";

const SCORE_IMG = new Image();
SCORE_IMG.src = "assets/img/score.png";

/////// LOAD SOUNDS ////////
const WALL_HIT = new Audio();
WALL_HIT.src = "assets/sounds/wall.mp3";

const LIFE_LOST = new Audio();
LIFE_LOST.src = "assets/sounds/life_lost.mp3";

const PADDLE_HIT = new Audio();
PADDLE_HIT.src = "assets/sounds/paddle_hit.mp3";

const WIN = new Audio();
WIN.src = "assets/sounds/win.mp3";

const BRICK_HIT = new Audio();
BRICK_HIT.src = "assets/sounds/brick_hit.mp3";

const dpi = window.devicePixelRatio;
const cvs = document.getElementById("myCanvas");
const ctx = cvs.getContext("2d");
const style = {
    height() {
        return +getComputedStyle(cvs).getPropertyValue('height').slice(0, -2);
    },
    width() {
        return +getComputedStyle(cvs).getPropertyValue('width').slice(0, -2);
    }
}

cvs.setAttribute('width', style.width() * dpi);
cvs.setAttribute('height', style.height() * dpi);
cvs.style.border = "1px solid #0ff";

// MAKE LINE THICK WHEN DRAWING TO CANVAS
ctx.lineWidth = 3;

// GAME VARIABLES AND CONSTANTS
const PADDLE_WIDTH = cvs.width / 10;
const PADDLE_MARGIN_BOTTOM = cvs.height /10;
const PADDLE_HEIGHT = cvs.height /25;
const BALL_RADIUS = cvs.height / 50;
const BRICK_WIDTH = cvs.width / 10;
const BRICK_HEIGHT = cvs.height / 15;

// PLAYER
let LIFE = 3;
let SCORE = 0;
const SCORE_UNIT = 10;
let LEVEL = 1;
const MAX_LEVEL = 3;

let GAME_OVER = false;
let leftArrow = false;
let rightArrow = false;

let flag = 0;
let strt = document.getElementById('start');
let pau = document.getElementById('pause');

strt.addEventListener("click", game_start_action, false);
pau.addEventListener("click", game_pause_action, false);

// CREATE THE PADDLE
const paddle = {
    x : cvs.width/2 - PADDLE_WIDTH/2,
    y : cvs.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT,
    width : PADDLE_WIDTH,
    height : PADDLE_HEIGHT,
    dx : 10
}

// DRAW PADDLE
function drawPaddle(){
    ctx.fillStyle = "#2e3548";
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

    ctx.strokeStyle = "#ffcd05";
    ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

// CONTROL THE PADDLE
// 37 for left key
// 39 for right key
// 32 for spacebar key
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("touchstart", touchHandler);
document.addEventListener("touchmove", touchHandler);
document.addEventListener("mousemove", mouseMoveHandler, false);
// document.addEventListener("keydown", function(event){
//     if(event.keyCode == 37){
//         leftArrow = true;
//     }else if(event.keyCode == 39){
//         rightArrow = true;
//     }
// });
// document.addEventListener("keyup", function(event){
//     if(event.keyCode == 37){
//         leftArrow = false;
//     }else if(event.keyCode == 39){
//         rightArrow = false;
//     }
// });

function keyDownHandler(event){
    if(event.keyCode == 37){
        leftArrow = true;
    }else if(event.keyCode == 39){
        rightArrow = true;
    }else if(event.keyCode == 32){
        spacebar_action();
    }
}

function keyUpHandler(event){
    if(event.keyCode == 37){
        leftArrow = false;
    }else if(event.keyCode == 39){
        rightArrow = false;
    }
}

// MOVE PADDLE
function mouseMoveHandler(e){
    let relativeX = e.clientX - cvs.offsetLeft;
    if (relativeX > 0 && relativeX < cvs.width) {
        paddle.x = relativeX - paddle.width;
    }
    if (paddle.x < 0) {
        paddle.x = 0;
    }
    if ((paddle.x + paddle.width) > cvs.width) {
        paddle.x = cvs.width - paddle.width;
    }
}

function touchHandler(e) {
    if(e.touches) {
        paddle.x = e.touches[0].clientX - cvs.offsetLeft - paddle.width / 2;
        e.preventDefault();
    }
}

function movePaddle(){
    if(rightArrow && paddle.x + paddle.width < cvs.width){
        paddle.x += paddle.dx;
    }else if(leftArrow && paddle.x > 0){
        paddle.x -= paddle.dx;
    }
}

function spacebar_action(){
    if(flag == 0){
        game_start_action();
    } else {
        game_pause_action();
    }
}


function game_start_action(){
    if(flag == 0){
        flag = 1;
        loop();
    }

    $("#start").addClass('hidden');
    $("#pause").removeClass('hidden');
}


function game_pause_action(){
    flag = 0;

    $("#pause").addClass('hidden');
    $('#start').removeClass('hidden');
}

// CREATE THE BALL
const ball = {
    x : cvs.width/2,
    y : paddle.y - BALL_RADIUS,
    radius : BALL_RADIUS,
    speed : 7,
    dx : 7 * (Math.random() * 2 - 1),
    dy : -7
}

// DRAW THE BALL
function drawBall(){
    ctx.beginPath();

    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2);
    ctx.fillStyle = "#ffcd05";
    ctx.fill();

    ctx.strokeStyle = "#2e3548";
    ctx.stroke();

    ctx.closePath();
}

// MOVE THE BALL
function moveBall(){
    ball.x += ball.dx;
    ball.y += ball.dy;
}

// BALL AND WALL COLLISION DETECTION
function ballWallCollision(){
    if(ball.x + ball.radius > cvs.width || ball.x - ball.radius < 0){
        ball.dx = - ball.dx;
        WALL_HIT.play();
    }

    if(ball.y - ball.radius < 0){
        ball.dy = -ball.dy;
        WALL_HIT.play();
    }

    if(ball.y + ball.radius > cvs.height){
        LIFE--; // LOSE LIFE
        flag = 0;
        LIFE_LOST.play();
        resetBall();
    }
}

// RESET THE BALL
function resetBall(){
    flag = 1;
    ball.x = cvs.width/2;
    ball.y = paddle.y - BALL_RADIUS;
    ball.dx = 7 * (Math.random() * 2 - 1);
    ball.dy = -7;
}

// BALL AND PADDLE COLLISION
function ballPaddleCollision(){
    if(ball.x < paddle.x + paddle.width && ball.x > paddle.x && paddle.y < paddle.y + paddle.height && ball.y > paddle.y){

        // PLAY SOUND
        PADDLE_HIT.play();

        // CHECK WHERE THE BALL HIT THE PADDLE
        let collidePoint = ball.x - (paddle.x + paddle.width/2);

        // NORMALIZE THE VALUES
        collidePoint = collidePoint / (paddle.width/2);

        // CALCULATE THE ANGLE OF THE BALL
        let angle = collidePoint * Math.PI/3;


        ball.dx = ball.speed * Math.sin(angle);
        ball.dy = - ball.speed * Math.cos(angle);
    }
}

// CREATE THE BRICKS
const brick = {
    row : 1,
    column : Math.floor(cvs.width / (PADDLE_WIDTH + cvs.width / 50)),
    width : BRICK_WIDTH,
    height : BRICK_HEIGHT,
    offSetLeft : cvs.width / 45,
    offSetTop : cvs.height /8,
    marginTop : 30,
    fillColor : "#2e3548",
    strokeColor : "#FFF"
}

let bricks = [];

function createBricks(){
    for(let r = 0; r < brick.row; r++){
        bricks[r] = [];
        for(let c = 0; c < brick.column; c++){
            bricks[r][c] = {
                x : c * ( brick.offSetLeft + brick.width ) + brick.offSetLeft,
                y : r * ( brick.offSetTop + brick.height ) + brick.offSetTop + brick.marginTop,
                status : true
            }
        }
    }
}

createBricks();

// draw the bricks
function drawBricks(){
    for(let r = 0; r < brick.row; r++){
        for(let c = 0; c < brick.column; c++){
            let b = bricks[r][c];
            // if the brick isn't broken
            if(b.status){
                ctx.fillStyle = brick.fillColor;
                ctx.fillRect(b.x, b.y, brick.width, brick.height);

                ctx.strokeStyle = brick.strokeColor;
                ctx.strokeRect(b.x, b.y, brick.width, brick.height);
            }
        }
    }
}

// ball brick collision
function ballBrickCollision(){
    for(let r = 0; r < brick.row; r++){
        for(let c = 0; c < brick.column; c++){
            let b = bricks[r][c];
            // if the brick isn't broken
            if(b.status){
                if(ball.x + ball.radius > b.x && ball.x - ball.radius < b.x + brick.width && ball.y + ball.radius > b.y && ball.y - ball.radius < b.y + brick.height){
                    BRICK_HIT.play();
                    ball.dy = - ball.dy;
                    b.status = false; // the brick is broken
                    SCORE += SCORE_UNIT;
                }
            }
        }
    }
}

// show game stats
function showGameStats(text, textX, textY, img, imgX, imgY){
    // draw text
    ctx.fillStyle = "#FFF";
    ctx.font = "25px Germania One";
    ctx.fillText(text, textX, textY);

    // draw image
    ctx.drawImage(img, imgX, imgY, width = 25, height = 25);
}

// game over
function gameOver(){
    if(LIFE <= 0){
        showYouLose();
        GAME_OVER = true;
    }
}

// level up
function levelUp(){
    let isLevelDone = true;

    // check if all the bricks are broken
    for(let r = 0; r < brick.row; r++){
        for(let c = 0; c < brick.column; c++){
            isLevelDone = isLevelDone && ! bricks[r][c].status;
        }
    }

    if(isLevelDone){
        WIN.play();

        if(LEVEL >= MAX_LEVEL){
            showYouWin();
            GAME_OVER = true;
            return;
        }
        brick.row++;
        createBricks();
        ball.speed += 0.5;
        resetBall();
        LEVEL++;
    }
}

// UPDATE GAME FUNCTION
// function update(){
//     movePaddle();
//
//     moveBall();
//
//     ballWallCollision();
//
//     ballPaddleCollision();
//
//     ballBrickCollision();
//     flag = 0;
//     gameOver();
//
//     levelUp();
// }

// GAME LOOP
function loop(){
    // CLEAR THE CANVAS
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    drawBall();
    drawPaddle();
    drawBricks();
    movePaddle();
    moveBall();
    ballWallCollision();
    ballPaddleCollision();
    ballBrickCollision();
    // SHOW SCORE
    showGameStats(SCORE, 35, 25, SCORE_IMG, 5, 5);
    // SHOW LIVES
    showGameStats(LIFE, cvs.width - 25, 25, LIFE_IMG, cvs.width-55, 5);
    // SHOW LEVEL
    showGameStats(LEVEL, cvs.width/2, 25, LEVEL_IMG, cvs.width/2 - 30, 5);
    gameOver();
    levelUp();

    if(! GAME_OVER){
        if (flag == 1){
            requestAnimationFrame(loop);
        }
    }
}
loop();


// SELECT SOUND ELEMENT
const soundElement  = document.getElementById("sound");

soundElement.addEventListener("click", audioManager);

function audioManager(){
    // CHANGE IMAGE SOUND_ON/OFF
    let imgSrc = soundElement.getAttribute("src");
    let SOUND_IMG = imgSrc == "assets/img/SOUND_ON.png" ? "assets/img/SOUND_OFF.png" : "assets/img/SOUND_ON.png";

    soundElement.setAttribute("src", SOUND_IMG);

    // MUTE AND UNMUTE SOUNDS
    WALL_HIT.muted = WALL_HIT.muted ? false : true;
    PADDLE_HIT.muted = PADDLE_HIT.muted ? false : true;
    BRICK_HIT.muted = BRICK_HIT.muted ? false : true;
    WIN.muted = WIN.muted ? false : true;
    LIFE_LOST.muted = LIFE_LOST.muted ? false : true;
}

// SHOW GAME OVER MESSAGE
/* SELECT ELEMENTS */
const gameover = document.getElementById("gameover");
const youwon = document.getElementById("youwon");
const youlose = document.getElementById("youlose");
const restart = document.getElementById("restart");

// CLICK ON PLAY AGAIN BUTTON
restart.addEventListener("click", function(){
    location.reload(); // reload the page
})

// SHOW YOU WIN
function showYouWin(){
    gameover.style.display = "block";
    youwon.style.display = "block";
}

// SHOW YOU LOSE
function showYouLose(){
    gameover.style.display = "block";
    youlose.style.display = "block";
}