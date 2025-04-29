class Rectangle extends BaseShape {
    constructor(x, y, width, height,text = "") {
        super(x, y);
        this.width = width || 100;
        this.height = height || 100;
        this.cornerRadius = 0;
        this.name = "Rectangle";
        this.text = text
    }
    
    _renderShape() {
        rectMode(CENTER);
        
        if (this.cornerRadius === 0) {
            rect(0, 0, this.width, this.height);
            if (this.text && this.text.length > 0) {
                // Set text properties
                textAlign(CENTER, CENTER);
                textSize(min(this.width, this.height) / 4); // Adjust size as needed
                fill(0); // or use a color of your choice
                noStroke();
                text(this.text, 0, 0);
            }
        } else {
            rect(0, 0, this.width, this.height, this.cornerRadius);
            if (this.text && this.text.length > 0) {
                // Set text properties
                textAlign(CENTER, CENTER);
                textSize(min(this.width, this.height) / 4); // Adjust size as needed
                fill(0); // or use a color of your choice
                noStroke();
                text(this.text, 0, 0);
            }
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