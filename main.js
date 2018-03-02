var Main = {
    canvas: null,
    ctx: null,
    cHeight: null,
    cWidth: null,
    playing: false,
    player: null,
    up: false,
    down: false,
    right: false,
    left: false,
    enemies: [],
    enemySpawnCounter: null,
    init: function () {
        this.enemySpawnCounter = 0;
        this.canvas = document.getElementById("canvas");
        this.ctx = Main.canvas.getContext("2d");
        this.cHeight = Main.canvas.height;
        this.cWidth = Main.canvas.width;

        window.addEventListener("keydown", function (e) {
            if (e.key === "ArrowRight") {
                Main.right = true;
            }
            if (e.key === "ArrowLeft") {
                Main.left = true;
            }
            if (e.key === "ArrowUp") {
                Main.up = true;
            }
            if (e.key === "ArrowDown") {
                Main.down = true;
            }
        });
        window.addEventListener("keyup", function (e) {
            if (e.key === "ArrowRight") {
                Main.right = false;
            }
            if (e.key === "ArrowLeft") {
                Main.left = false;
            }
            if (e.key === "ArrowUp") {
                Main.up = false;
            }
            if (e.key === "ArrowDown") {
                Main.down = false;
            }
        });

        document.getElementById("startButton").addEventListener("click", function () {
            Main.playing = true;
            Main.player = Main.spawnPlayer();
            Main.gameloop();
        });

    },
    gameloop: function () {
        if (Main.playing) {
            Main.draw();
        }
        //spawna fiender
        Main.enemySpawnCounter++;
        if (Main.enemySpawnCounter === 100) {
            Main.spawnEnemy();
            Main.enemySpawnCounter = 0;
        }

        //spelarens rörelser
        if (Main.up) {
            if (!Main.player.yPos <= 0) {
                Main.player.yPos -= Main.player.speed;
            }
        }
        if (Main.down) {
            if (!(Main.player.yPos >= Main.cHeight - Main.player.height))
                Main.player.yPos += Main.player.speed;
        }
        if (Main.right) {
            if (!(Main.player.xPos >= Main.cWidth - Main.player.width)) {
                Main.player.xPos += Main.player.speed;
            }
        }
        if (Main.left) {
            if (!(Main.player.xPos <= 0)) {
                Main.player.xPos -= Main.player.speed;
            }
        }

        //loop för att uppdatera alla fiender
        Main.enemies.forEach(function (enemy) {
            //flytta på fienden
            enemy.move();
            //kontrollera om fienden kolliderar mot någon kant
            if (enemy.xPos > Main.cWidth - enemy.width || enemy.xPos < 0) {
                enemy.xSpeed = -enemy.xSpeed;
            }
            if (enemy.yPos > Main.cHeight - enemy.height || enemy.yPos < 0) {
                enemy.ySpeed = -enemy.ySpeed;
            }

            //kontrollera kollision med spelaren
            if(Main.checkCollision(Main.player, enemy)){
                Main.player.health--;
                Main.enemies.splice(Main.enemies.indexOf(enemy), 1);
                if(Main.player.health <= 0){
                    Main.endGame();
                }
            }
            if(Main.player.invurnable){
                Main.player.color = "darkgrey";
            } else {
                Main.player.color = "black";
            }

        });
        window.requestAnimationFrame(Main.gameloop);
    },
    draw: function () {
        Main.ctx.clearRect(0, 0, Main.cWidth, Main.cHeight);

        if (Main.player.isAlive) {
            Main.ctx.beginPath();
            Main.ctx.fillStyle = Main.player.color;
            Main.ctx.fillRect(Main.player.xPos, Main.player.yPos, Main.player.width, Main.player.height);
            Main.ctx.stroke();
            Main.ctx.closePath();
        }


        Main.enemies.forEach(function (enemy) {
            Main.ctx.beginPath();
            Main.ctx.fillStyle = "red";
            Main.ctx.fillRect(enemy.xPos, enemy.yPos, enemy.width, enemy.height);
            Main.ctx.stroke();
            Main.ctx.closePath();
        });

    },
    spawnPlayer: function () {
        var x = Main.cWidth / 2;
        var y = Main.cHeight / 2;
        var player = new Player(x, y);
        player.isAlive = true;
        return player;
    },
    spawnEnemy: function () {
        var x = Math.floor((Math.random() * (Main.cWidth - 50) - 50) + 50);
        var y = Math.floor(Math.random() * (Main.cHeight - 50) - 50) + 50;
        var enemy = new Enemy(x, y);
        if (Math.random() < 0.5)
            enemy.xSpeed *= -1;
        if (Math.random() < 0.5)
            enemy.ySpeed *= -1;
        enemy.isAlive = true;
        Main.enemies.push(enemy);
    },
    checkCollision: function (rect1, rect2) {
        if (rect1.xPos < rect2.xPos + rect2.width &&
            rect1.xPos + rect1.width > rect2.xPos &&
            rect1.yPos < rect2.yPos + rect2.height &&
            rect1.yPos + rect1.height > rect2.yPos) {

            if(!Main.player.invurnable){
                Main.player.invurnable = true;
                setTimeout(function(){
                    Main.player.invurnable = false;
                }, 2000)
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
};
window.onload = function () {
    Main.init();
}