document.addEventListener("DOMContentLoaded", function(){
    canvas = document.getElementById("myCanvas");
    ctx = canvas.getContext("2d");
    document.addEventListener("keydown", keyPush);
    setInterval(game, 1000/10);
});

gs = 100;
tx=3; ty=9;

px=2; py=7;

function game() {
    3
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    
    ctx.fillStyle = "dodgerblue";
    ctx.fillRect(px*gs,py*gs,gs-2,(2*gs)-2);
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
        px=0;
    }
    if(px < 0){
        px=tx-1;
    }
}