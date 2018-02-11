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
cx=2; cy=0;
gravity = 0.3;
function game() {
    
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    
    cy += gravity;
    
    if((cy*gs)+180 >= py*gs && cx == px){
        px=2; cx=2; cy=0;
    }
    
    if(cy > ty){
        cy=0;
        cx = Math.floor(Math.random()*5)
    }
    
    ctx.fillStyle = "dodgerblue";
    ctx.fillRect(px*gs,py*gs,gs-2,(2*gs)-2);
    
    ctx.fillStyle = "red";
    ctx.fillRect(cx*gs,cy*gs,gs-2,(2*gs)-2);
    
}

function keyPush(evt) {
    switch(evt.keyCode){
        case 37:
            px--;
            break;
        case 39:
            px++;
            break;
    }
    
    if(px >= tx){
        px=tx-1;
    }
    if(px < 0){
        px=0;
    }
}