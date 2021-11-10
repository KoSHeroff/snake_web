// variables
const amountBlocks = 41;
var active = 'stop';
var directions = { left: { x: -1, y: 0 }, right: { x: 1, y: 0 }, up: { x: 0, y: -1 }, down: { x: 0, y: 1 } };


// start game
settingsGame(amountBlocks);

// Controls
document.onkeydown = snakeControls;

// Functions
function settingsGame(size) {
    var centerBlockid = Math.round(amountBlocks*amountBlocks/2);
    var snake = [ { x: getCoardinates(centerBlockid).x, y: getCoardinates(centerBlockid).y } ], fruit, score = 0;
    var intervalTime = 300;  

    generateField(size);
    drawItem('head', snake[0].x, snake[0].y);
    
    fruit = creatElem(snake);
    drawItem('fruit', fruit.x, fruit.y);
    gameLogic();

    function gameLogic() {
        if(active == 'stop') {
            frame(intervalTime);
            return
        }
        if(snake.some((e, index) => e.x == snake[0].x && e.y == snake[0].y && index != 0)) {
            gameOwer(score);
            return;
        };
        if(snake[0].x == 1 || snake[0].x == 41 || snake[0].y == 0 || snake[0].y == 40) {
            gameOwer(score);
            return;
        }

        if(snake[0].x == fruit.x && snake[0].y == fruit.y) {
            score += 5;
            if(score % 5 == 0) intervalTime = intervalTime / 1.1;
            fruit = creatElem(snake);
            drawItem('fruit', fruit.x, fruit.y);
            snake.push({ x: 2, y: 2 });
            console.log(`Log: time: ${intervalTime}, Score: ${score}`);
        }
        
        
        for(var i = snake.length-1; i >= 0; i--) {
            if(i == snake.length-1) drawItem('none', snake[i].x, snake[i].y);
            if(i > 0) {
                snake[i].x = snake[i-1].x;
                snake[i].y = snake[i-1].y;
                drawItem('tail', snake[i].x, snake[i].y);
            }
        }

        snake[0].x += directions[active].x;
        snake[0].y += directions[active].y;
        drawItem('head', snake[0].x, snake[0].y);

        frame(intervalTime);
    }
    
    function frame(intervalTime) {
        setTimeout(gameLogic, intervalTime);
    }
}

function gameOwer(score) {
    alert(`Game ower. \nYour score ${score}`);
};

function creatElem(snake) {
    var check = true
    while(check) {
        var elem = { x: Math.floor(Math.random() * (amountBlocks-2))+2, y: Math.floor(Math.random() * (amountBlocks-2))+1};
        if(snake.some((e) => e.x == elem.x && e.y == elem.y)) check == true;
        else check = false;
    }
    return elem;
}

function drawItem(type, x, y) {
    const block = document.getElementById(getId(x, y));
    //console.log(`blockid: ${getId(x, y)} x:${x} y:${y} draw item: ${type}`);
    
    switch(type) {
        case 'head':
            block.style.backgroundColor = "#00c200";
            break;
        
        case 'tail':
            block.style.backgroundColor = "#019301";
            break;

        case 'fruit':
            block.style.backgroundColor = "#d5d102";
            break;
        
        case 'none':
            block.style.backgroundColor = "#c29292";
            break;
    }
}

function getCoardinates(id) {
    var posX = (id)%amountBlocks;
    if(posX == 0) posX = amountBlocks;
    var posY = Math.floor(id/amountBlocks);
    //console.log(`Coardinates: X: ${posX} Y: ${posY+1} blockid: ${id}`);
    return { x: posX, y: posY }
}

function getId(x, y) {
    const blockid = y*amountBlocks+x;
    //console.log(`blockid: ${blockid}`);
    return blockid;
}

function generateField(amount) {
    const fieldBlock = document.querySelector(".field");
    var gameBlocks = "";

    fieldBlock.style.width = amount*14+"px";
    for(var i = 1; i <= amount*amount; i++) {
        if(i%amount == 0 || i%amount == 1 || i < amount || i > amount*amount-amount) {
            gameBlocks += `<div class="block wall" id="${i}" title="x: ${getCoardinates(i).x} y: ${getCoardinates(i).y} id: ${i}"></div>`;
            continue;
        }
        gameBlocks += `<div class="block" id="${i}" title="x: ${getCoardinates(i).x} y: ${getCoardinates(i).y} id: ${i}"></div>`;
    }
    fieldBlock.innerHTML = gameBlocks;
}

function snakeControls(click) {
    console.log(click);
    switch(click.keyCode) {
        case 37:
            if(active != 'right') active = 'left';
            break;
        case 38:
            if(active != 'down') active = 'up';
            break;
        case 39:
            if(active != 'left') active = 'right';
            break;
        case 40:
            if(active != 'up') active = "down";
            break;
    }
}