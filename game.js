// # PROGRESS
stage = [];
function buildStages(){
    
    stage[0] = 0;
    stage[1] = 10;
    
    for(var i=2;i<12;i++){
        stage[i] = Math.floor(stage[i-1]*1.4);
    }
}
// # PREGENERATION
document.addEventListener("DOMContentLoaded", function(){
    buildStages();
    canvas = document.getElementById("myCanvas");
    ctx = canvas.getContext("2d");
    document.addEventListener("keydown", keyPush);
    document.addEventListener("keyup", keyRelease);
    gameInterval = window.setInterval(game, 1000/30);
    addPoint();
    
    // # GRAPHIC
    srcPlayer = document.getElementById("srcPlayer");
    srcComputer = [];
    srcComputer[0] = document.getElementById("srcComputer1");
    srcComputer[1] = document.getElementById("srcComputer2");
    srcComputer[2] = document.getElementById("srcComputer3");
    srcBackground = document.getElementById("srcBackground");
    
    // # INIT TIMER
    timerState = true;
    mySec = 0;
    myMin = 0;
    myHour = 0;
    timer();
});
// # PAUSE
    isPaused = false;
// # CONFIG
// # modify cars widths and height
carMarg = 20; carH = 1.9;
carDS = carMarg/2;
playerW = 20; playerH = 1.7;
playerDS = playerW/2;

// # playground
gs = 100;
tx=5; ty=9;

ly=0; lv=1;
lineSpeed = 0.2 * 100;

// # player
px=2; py=ty-playerH-0.2;
xv=yv=0;
playerSpeedV = 0.18;
playerSpeedH = 0.12;

    carsPassed = 0;
    overallCarsPassed = 0;
    yourLoses = 0;
    actualStage = 0;

// # car
cars = [];
//# rest conf
carN = 2; carD = 700;
gravity = 0.23;

// # GAME
drawCars(carN,carD);

function game() {
    // pass Y
    if(py*gs+playerH*gs >= ty*gs){
        py=ty-playerH;
        console.log(py);
    }
    if(py*gs <= 0){
        py=0;
        console.log(py);
    }
    // pass X
    if(px*gs+gs-playerW > tx*gs){
        px=tx-(gs-playerW)/100;
    }
    if(px < 0){
        px=0;
    }
    
    ctx.fillStyle = "#444";
    ctx.fillRect(0,0,canvas.width,canvas.height);
   //optional image backgrpund //ctx.drawImage(srcBackground,0,0,canvas.width,canvas.height)
    
    py += yv*playerSpeedV;
    px += xv*playerSpeedH;
    
    ly += lv * lineSpeed;
    // # lines between lanes
    for(var j=0;j<tx-1;j++){
        ctx.beginPath();
        ctx.setLineDash([0, 0]);
        ctx.moveTo((j+1)*gs,0*gs);
        ctx.lineTo((j+1)*gs,ty*gs);
        ctx.lineWidth = 3;
        ctx.strokeStyle = "white";
        ctx.stroke();
        ctx.closePath();
    }
    
    // # middle lane lines
    if(ly>=40){
        ly=-80;
    }
    for(var j=0.5;j<tx;j++){
        ctx.beginPath();
        ctx.setLineDash([40, 80]);
        ctx.moveTo(j*gs,0*gs+ly);
        ctx.lineTo(j*gs,ty*gs+ly);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "white";
        ctx.stroke();
        ctx.closePath();
    }
    // # rest
    for(var i=0;i<cars.length;i++){
        
        //COMPUTER MOVEMENT
        cars[i].y += gravity;
        
        // CAR PASSED
        if(cars[i].y > ty){
            
            cars.shift();
            
            carsPassed++;
            overallCarsPassed++;
            checkStage();
            
            addPoint();
            
            addCar();
        }
        
        // LOST
        // y crash detection
        if(cars[i].y*gs+ playerH*gs > py*gs && (cars[i].y*gs) < py*gs+playerH*gs){
            var a = true;
            // x crash detection
            if(px*gs >= cars[i].x*gs && px*gs <= cars[i].x*gs+gs-carMarg || px*gs+gs-playerW >= cars[i].x*gs && px*gs+gs-playerW <= cars[i].x*gs+gs-carMarg ){
               
                cars = [];
                drawCars(carN,carD);
                px=2; py=ty-playerH-0.2;

                yourLoses++;
                carsPassed = 0;
                actualStage = 0;
                
                mySec=-1; myMin=0; myHour=0;

                addPoint();

                return;   
            }
        }
        
       //draw car
        ctx.drawImage(srcComputer[cars[i].tmodel],cars[i].x*gs+carDS,cars[i].y*gs,gs-carMarg,carH*gs);
    }
    
    //draw player
    ctx.drawImage(srcPlayer, px*gs+playerDS, py*gs,gs-playerW, playerH*gs);
    
}
// # FUNCTIONS
function drawCars(carNumber, carDelay){
    
        addCar();
        carNumber--;
    
        if(carNumber <= 0){
            return;
        }
    
        setTimeout(function(){
            drawCars(carNumber,carDelay);
        },carDelay);
}

function addCar(){
    cars.push({x:Math.floor(Math.random()*5),y:-2, tmodel:Math.floor(Math.random()*3)});
}

function keyPush(evt) {
    var oldX = px;
    var oldY = py;
    switch(evt.keyCode){
        case 37:
            xv=-1;
            break;
        case 38:
            yv=-1;
            break;
        case 39:
            xv=1;
            break;
        case 40:
            yv=1;
            break;
        case 27:
            gamePause();
            break;
    }
    // pass lane when car
    for(var i=0;i<cars.length;i++){
        if(cars[i].x == px && (cars[i].y*gs)+ playerH*gs > py*gs && (cars[i].y*gs) < py*gs+playerH*gs){
            px = oldX;
        }
    }
    
    
}
function keyRelease(evt) {
    switch(evt.keyCode){
        case 37:
            xv=0;
            break;
        case 38:
            yv=0;
            break;
        case 39:
            xv=0;
            break;
        case 40:
            yv=0;
            break;
    }
}

function addPoint() {
    
    document.getElementById("carsPassed").innerHTML = carsPassed;
    document.getElementById("overallCarsPassed").innerHTML = overallCarsPassed;
    document.getElementById("yourLoses").innerHTML = yourLoses;
    document.getElementById("actualStage").innerHTML = actualStage;
    document.getElementById("nextStage").innerHTML = actualStage+1;
    document.getElementById("nextStageCars").innerHTML = stage[actualStage+1]-carsPassed;
}
function checkStage() {
    
    if(carsPassed >= stage[actualStage+1]){
        actualStage++;
    }
}
function timer(){
    if(timerState != false){
         mySec++;
        if(mySec>=60){
            mySec=0;
            myMin++;
        }
        if(myMin>=60){
            myMin=0;
            myHour++;
        }

        document.getElementById("survived").innerHTML = myHour+" hour "+myMin+" min "+mySec+" sec";
    }
   
    setTimeout(timer,1000);
}
function gamePause(){
    console.log("xd");
    
    switch(isPaused){
        case false:
            console.log("pauza");
            window.clearInterval(gameInterval);
            timerState = false;
            
            document.getElementById("pauseinfo").innerHTML = "press esc to resume";
            document.getElementById("pausedornot").innerHTML = "paused";
            
            ctx.fillStyle = "rgba(0,0,0,0.6)";
            ctx.fillRect(0,0,canvas.width,canvas.height);
            document.getElementById("myCanvas").style.borderColor = "#222";
            
            isPaused = true;
            break;
        case true:
            console.log("unpauza");
            gameInterval = window.setInterval(game, 1000/30);
            timerState = true;
            
            document.getElementById("pauseinfo").innerHTML = "press esc to pause";
            document.getElementById("pausedornot").innerHTML = "playing...";
            
            document.getElementById("myCanvas").style.borderColor = "";
            
            isPaused = false;
            break;
    }
}