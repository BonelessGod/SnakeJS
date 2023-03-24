window.onload = function(){

    var canvasWidth = screen.width - 30;
    var canvasHeight = screen.height * (60/100);
    var blockSize = 20; 
    var ctx;
    var delay = 75;

    var snakee;
    var applee;

    var widthInBlocks = canvasWidth/blockSize;
    var heightInBlocks = canvasHeight/blockSize;

    var score;
    var timeout;

    init()

    function init(){

        //var canvas = document.createElement('canvas');
        var canvas = document.getElementById('snakeCanvas')
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.style.border = '15px solid #444';
        canvas.style.display= "block"
        canvas.style.backgroundColor = "#c7f0d8";
        // document.body.appendChild(canvas);

        ctx = canvas.getContext('2d');

        snakee = new Snake([[6,4], [5,4], [4,4]], 'right');
        applee = new Apple([8, 10]);
        score = 0;
        refreshCanvas();

    }

    function refreshCanvas(){
        

        snakee.advance();

        if(snakee.checkCollision()){
            gameOver();
        } else {

            if(snakee.isEatingApple(applee)){
                score++
                snakee.ateApple = true;
                do
                {
                    applee.setNewPosition();
                }
                while(applee.isOnSnake(snakee));
                
            }

            ctx.clearRect(0,0,canvasWidth, canvasHeight)
            drawScore();
            snakee.draw();
            applee.draw();
            
    
            timeout = setTimeout(refreshCanvas, delay)
    
        }


    }

    function gameOver(){
        ctx.save();
        ctx.font = "bold 20px Space Monkey";
        var centerX = canvasWidth / 2;
        var centerY = canvasHeight /2;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle"
        ctx.fillText("Game Over", centerX, centerY + 120);
        ctx.font = "bold 10px Space Monkey";
        ctx.fillText("Appuyer sur la touche espace pour recommencer", centerX, centerY + 180)
        ctx.restore;
    }

    function restart(){
        snakee = new Snake([[6,4], [5,4], [4,4]], 'right');
        applee = new Apple([8, 10]);
        score = 0;
        clearTimeout(timeout)
        refreshCanvas();
    }

    function drawScore(){

        var centerX = canvasWidth / 2;
        var centerY = canvasHeight /2;

        ctx.save();
        ctx.font = "bold 40px Space Monkey"
        ctx.fillText(score.toString(),centerX, centerY);

        ctx.restore();
    }

    function drawBlock(ctx, position){
        
        var x = position[0] * blockSize;
        var y = position[1] * blockSize;
        ctx.fillRect(x ,y ,blockSize ,blockSize )

    }

    function Snake(body, direction) {

        this.body = body;
        this.direction = direction;
        this.ateApple = false;

        this.draw = function(){
            ctx.save();
            ctx.fillStyle = '#43523d';
            for(var i = 0; i < this.body.length; i++){
                drawBlock(ctx, this.body[i]);
            }
            ctx.restore()
             
        }

        this.advance = function(){

            var nextPosition = this.body[0].slice();

            switch(this.direction){
                case 'left':
                    nextPosition[0]--
                    break;
                case 'right':
                    nextPosition[0]++
                    break;
                case 'up':
                    nextPosition[1]--
                    break;
                case 'down':
                    nextPosition[1]++
                    break;
                default:
                    throw("Invalid Direction")
            }
            
            this.body.unshift(nextPosition);
            !this.ateApple ? this.body.pop() : this.ateApple = false;
        };

        this.setDirection = function(newDirection){
            var allowedDirections;
            switch(this.direction){
                case 'left':
                case 'right':
                    allowedDirections = ['up', 'down'];
                    break;
                case 'up':
                case 'down':
                    allowedDirections = ['left', 'right'];
                    break;
                default:
                    throw("Invalid Direction")
            }
            if(allowedDirections.indexOf(newDirection) > -1){{
                this.direction = newDirection
            }}
        };

        this.checkCollision = function(){

            var wallCollision = false;
            var snakeCollision = false;
            var head = this.body[0];
            var rest = this.body.slice(1);
            var snakeX = head[0];
            var snakeY = head[1];
            var minX = 0;
            var minY = 0;
            var maxX = widthInBlocks - 1;
            var maxY = heightInBlocks - 1;

            var isNotBetweenHorizontalWall = snakeX < minX || snakeX > maxX
            var isNotBetweenVerticalWall = snakeY < minY || snakeY > maxY
            
            if(isNotBetweenHorizontalWall || isNotBetweenVerticalWall){
                wallCollision = true;
            }

            for(var i = 0; i < rest.length ; i++){
                if(snakeX === rest[i][0] && snakeY === rest[i][1]){
                    snakeCollision  = true;
                }
            }

            console.log("wall collision: " + wallCollision + "|" + "snake collision: " + snakeCollision)
            
            return wallCollision || snakeCollision;

        };

        this.isEatingApple = function(appleToEat){
            var head = this.body[0]
            
            return head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1] ? true : false;
            
        }

    }

    function Apple(position){
        this.position = position;
        this.draw = function() {
            ctx.save();
            ctx.fillStyle = "#43523d";
            ctx.beginPath();
            var radius = blockSize/2;

            var x = this.position[0]*blockSize + radius;
            var y = this.position[1]*blockSize + radius;


            ctx.arc(x, y, radius, 0, Math.PI*2, true)
            ctx.fill();
            ctx.restore();
        }
        this.setNewPosition = function()
        {

            var newX = Math.round(Math.random() * (widthInBlocks - 1));
            var newY = Math.round(Math.random() * (heightInBlocks - 1));
            this.position = [newX, newY]

        }
        this.isOnSnake = function(snakeToCheck) {
            var siOnSnake = false;

            for(var i = 0; i < snakeToCheck; i++){
                this.position[0] === snakeToCheck.body[i][0] && this.position[1] === snakeToCheck.body[i][1] ?
                isOnSnake = true : isOnSnake = false;
            }
        }
    }

    document.onkeydown = function handleKeyDown(e){
        var key = e.key;
        var newDirection;

        switch(key){
            case "ArrowUp":
                newDirection = "up";
                break;
            case "ArrowDown":
                newDirection = "down";
                break;
            case "ArrowLeft":
                newDirection = "left";
                break;
            case "ArrowRight":
                newDirection = "right";
                break;
            case " ":
                restart();
                return;
            default:
                return;
        }



        snakee.setDirection(newDirection)
    }

    upBtn = document.getElementById("up");
    upBtn.addEventListener('click', function() {
        snakee.setDirection(("up"))
    })
    downBtn = document.getElementById("down");
    downBtn.addEventListener('click', function() {
        snakee.setDirection(("down"))
    })
    rightBtn = document.getElementById("right");
    rightBtn.addEventListener('click', function() {
        snakee.setDirection(("right"))
    })
    leftBtn = document.getElementById("left");
    leftBtn.addEventListener('click', function() {
        snakee.setDirection(("left"))
    })
    restartBtn = document.getElementById("restart");
    restartBtn.addEventListener("click", function(){
        restart();
        return;
    })


}