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
});

// # CONFIG
// # modify cars widths and height
carW = 20; carH = 1.9;
carDS = carW/2;
playerW = 20; playerH = 1.7;
playerDS = playerW/2;

// # playground
gs = 100;
tx=5; ty=9;
// # player
px=2; py=ty-playerH-0.2;
yv=0;
playerSpeed = 0.2;

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
    
    py += yv*playerSpeed;
    
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
        
        if(cars[i].y > ty){
            // CAR PASSED
            cars.shift();
            
            carsPassed++;
            overallCarsPassed++;
            checkStage();
            
            addPoint();
            
            addCar();
        }
        
        cars[i].y += gravity;
        if(cars[i].x == px && (cars[i].y*gs)+ playerH*gs > py*gs && (cars[i].y*gs) < py*gs+playerH*gs){
            // LOST
            cars = [];
            drawCars(carN,carD);
            px=2; py=ty-playerH-0.2;
            
            yourLoses++;
            carsPassed = 0;
            actualStage = 0;
            
            addPoint();
            
            return;
        }
        ctx.drawImage(srcComputer,cars[i].x*gs+carDS,cars[i].y*gs,gs-carW,carH*gs);
    }
        
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
            px--;
            break;
        case 38:
            yv=-1;
            break;
        case 39:
            px++;
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
        case 38:
            yv=0;
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