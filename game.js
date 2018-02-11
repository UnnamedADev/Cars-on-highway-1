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
    setInterval(game, 1000/30);
    addPoint();
    
    // # GRAPHIC
    srcPlayer = document.getElementById("srcPlayer");
    srcComputer = document.getElementById("srcComputer");
    
    // # INIT TIMER
    mySec = 0;
    myMin = 0;
    myHour = 0;
    timer();
});

// # CONFIG
// # modify cars widths and height
carMarg = 20; carH = 1.9;
carDS = carMarg/2;
playerW = 20; playerH = 1.7;
playerDS = playerW/2;

// # playground
gs = 100;
tx=5; ty=9;
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
    
    ctx.fillStyle = "#444";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    
    py += yv*playerSpeedV;
    px += xv*playerSpeedH;
    // # lines between lanes
    for(var j=0;j<tx-1;j++){
        ctx.beginPath();
        ctx.setLineDash([0, 0]);
        ctx.moveTo((j+1)*gs,0*gs);
        ctx.lineTo((j+1)*gs,ty*gs);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "white";
        ctx.stroke();
        ctx.closePath();
    }
    
    // # middle lane lines
    for(var j=0.5;j<tx;j++){
        ctx.beginPath();
        ctx.setLineDash([40, 40]);
        ctx.moveTo(j*gs,0*gs);
        ctx.lineTo(j*gs,ty*gs);
        ctx.lineWidth = 4;
        ctx.strokeStyle = "yellow";
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
        ctx.drawImage(srcComputer,cars[i].x*gs+carDS,cars[i].y*gs,gs-carMarg,carH*gs);
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
    cars.push({x:Math.floor(Math.random()*5),y:-2});
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
    }
    // pass lane when car
    for(var i=0;i<cars.length;i++){
        if(cars[i].x == px && (cars[i].y*gs)+ playerH*gs > py*gs && (cars[i].y*gs) < py*gs+playerH*gs){
            px = oldX;
        }
    }
    
    // pass X
    if(px >= tx){
        px=tx-1;
    }
    if(px < 0){
        px=0;
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
    setTimeout(timer,1000);
}