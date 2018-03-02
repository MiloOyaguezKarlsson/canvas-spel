function Enemy(startX, startY){
    this.xSpeed = 5;
    this.ySpeed = 5;
    this.xPos = startX;
    this.yPos = startY;
    this.width = 50;
    this.height = 50;
    this.move = function(){
        this.xPos += this.xSpeed;
        this.yPos += this.ySpeed;
    }
}
