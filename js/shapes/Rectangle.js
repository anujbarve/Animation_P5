class Rectangle extends BaseShape {
    constructor(x, y, width, height) {
        super(x, y);
        this.width = width || 100;
        this.height = height || 100;
        this.cornerRadius = 0;
        this.name = "Rectangle";
    }
    
    _renderShape() {
        rectMode(CENTER);
        
        if (this.cornerRadius === 0) {
            rect(0, 0, this.width, this.height);
        } else {
            rect(0, 0, this.width, this.height, this.cornerRadius);
        }
    }
    
    _pointInShape(localX, localY) {
        return (
            localX >= -this.width/2 &&
            localX <= this.width/2 &&
            localY >= -this.height/2 &&
            localY <= this.height/2
        );
    }
}