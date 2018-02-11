document.addEventListener("DOMContentLoaded", function(){
    canvas = document.getElementById("myCanvas");
    ctx = canvas.getContext("2d");
    document.addEventListener("keydown", keyPush);
    setInterval(game, 1000/30);
});
//game
gs = 100;
tx=5; ty=9;
//player
px=2; py=7;

//car
cars = [];

gravity = 0.23;

drawCars(2,700);
function game() {
    
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    
    
    ctx.fillStyle = "red";
    for(var i=0;i<cars.length;i++){
        
        cars[i].y += gravity;
        if((cars[i].y*gs)+180 > py*gs && cars[i].x == px){
            console.log("Przegrales...");
        }
        if(cars[i].y > ty){
            cars.shift();
            addCar();
        }
        ctx.fillRect(cars[i].x*gs,cars[i].y*gs,gs-2,(2*gs)-2);
    }
        
    ctx.fillStyle = "dodgerblue";
    ctx.fillRect(px*gs,py*gs,gs-2,(2*gs)-2);
    
    
    
    
}

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
    cars.push({x:Math.floor(Math.random()*5),y:0});
}

function keyPush(evt) {
    var oldX = px;
    switch(evt.keyCode){
        case 37:
            px--;
            break;
        case 39:
            px++;
            break;
    }
    
    for(var i=0;i<cars.length;i++){
        if(cars[i].x == px && (cars[i].y*gs)+180 > py*gs){
            px = oldX;
        }
    }
    
    if(px >= tx){
        px=tx-1;
    }
    if(px < 0){
        px=0;
    }
    
    
}