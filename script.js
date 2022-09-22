const rulesBtn = document.getElementById("rules-btn");
const closeBtn = document.getElementById("close-btn");
const rules = document.getElementById("rules");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let score = 0;

const brickColumnCount = 5; // How many bricks in one column
const brickRowCount = 9; // How many bricks in one row

//Create Ball props

const ball = {
    x: canvas.width/2,
    y: canvas.height/2,
    size:10,
    speed: 4,
    dx:4,
    dy:-4
}

//Create Paddle Props

const paddle = {
    x: canvas.width/2 - 40,
    y: canvas.height - 20,
    width: 80,
    height: 10,
    speed: 8,
    dx: 0
}

// Create Brick Info

const brickInfo = {
    w:70,
    h:20,
    padding:10,
    offsetX:45,
    offsetY:60,
    visible:true
}

//Create Bricks

let bricks = [];
for (let i=0; i<brickRowCount; i++){
    bricks[i]=[];

    //Putting columns in each row

    for(let j=0; j<brickColumnCount; j++){
       const x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
       const y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY;
       bricks[i][j] = {x,y,...brickInfo}
    }
    
}



//Draw Ball On Canvas
function drawBall(){
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
    ctx.fillStyle = "#0095dd";
    ctx.fill();
    ctx.closePath();
}



//Draw Paddle on Caanvas

function drawPaddle(){
    ctx.beginPath();
    ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.fillStyle = "#0095dd";
    ctx.fill();
    ctx.closePath();
}





//Draw Score on Canvas 
function drawScore(){
    ctx.font = "20px Arial";
    ctx.fillText(`Score: ${score}`, canvas.width-100,30);
}

//Draw bricks on canvas

function drawBricks(){
    bricks.forEach(column=>{
        column.forEach(brick=>{
            ctx.beginPath();
            ctx.rect(brick.x,brick.y,brick.w,brick.h);
            ctx.fillStyle = brick.visible? "#0095dd": "transparent";
            ctx.fill();
            ctx.closePath();
        })
    })
}

//Move paddle on canvas
function movePaddle(){
    paddle.x += paddle.dx;

    //Wall detection
    if(paddle.x+paddle.width>canvas.width){
        paddle.x = canvas.width - paddle.width;
        // When paddle goes all the way to right, it will just stop at the end
    }

    if(paddle.x<0){
        paddle.x = 0;
        // 0 is the left side of canvas where it starts
    }
}

//Move ball on canvas
 
function moveBall(){
    ball.x += ball.dx;
    ball.y+= ball.dy;

    //Wall collision (right/left)
    if(ball.x+ball.size> canvas.width || ball.x-ball.size<0){
        ball.dx*=-1;
    }

    if(ball.y-ball.size<0||ball.y+ball.size>canvas.height){
        ball.dy*=-1;
    }

    //Paddle collisiom

    if(ball.x + ball.size> paddle.x && ball.x- ball.size< paddle.x + paddle.width && ball.y+ball.size>paddle.y){
        ball.dy *= -1;
    }

    //Brick collision

    bricks.forEach(column=>{
        column.forEach(brick=>{
            if(brick.visible){
                if( ball.x + ball.size > brick.x && //Left brick side check
                  ball.x - ball.size < brick.x + brick.w && //Right brick side check
                  ball.y + ball.size > brick.y &&// Top side brick check
                  ball.y - ball.size < brick.y + brick.h // bottom side brick check
                   ){
                       ball.dy *= -1;
                       brick.visible = false;
                       updateScore()
                   }
            }
        })
    })

    //Hit bottom wall- lose
    if(ball.y + ball.size > canvas.height){
        score = 0;
        showAllBricks();
    }

   
}

//Update scores

function updateScore(){
    score++;
    if(score % (brickRowCount * brickColumnCount) ==0 ){
        score = 0;
       showAllBricks()
        }
    }

    //Show all bricks
function showAllBricks(){
    bricks.forEach(column=>{
        column.forEach(brick=>{
            brick.visible = true;
        })
    })
}
//Draw Everything
function draw(){

    //Before drawing we have to clear the canvas first
    ctx.clearRect(0,0, canvas.width, canvas.height)

    drawBall();
    drawPaddle();
    drawScore();
    drawBricks()
}

//Update canvas drawing and animation

function update(){
    movePaddle()
    moveBall()
    //Draw everything
    draw();

    requestAnimationFrame(update)

}
update();

//Keydown Event
function keyDown(e){
    if(e.key=="Right"|| e.key == "ArrowRight"){
        paddle.dx = paddle.speed;
    } else if(e.key=="Left"|| e.key == "ArrowLeft"){
        paddle.dx = -paddle.speed;
    }
}

//Key Up

function keyUp(e){
    if(e.key=="Right"|| e.key == "ArrowRight" || e.key=="Left"|| e.key == "ArrowLeft"){
        paddle.dx = 0;
    }
}


//Keyboard event handlers

document.addEventListener("keydown",keyDown)
document.addEventListener("keyup",keyUp)


//Rules and Close Event Handlers
rulesBtn.addEventListener("click",()=>{
rules.classList.add("show");
rulesBtn.classList.add("hide");
})

closeBtn.addEventListener("click",()=>{
    rules.classList.remove("show")
    rulesBtn.classList.remove("hide")
})