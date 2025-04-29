class Circle extends BaseShape {
    constructor(x, y, diameter, text = "") {
        super(x, y);
        this.width = diameter || 100;
        this.height = diameter || 100;
        this.name = "Circle";
        this.text = text; // New property for text
    }
    
    _renderShape() {
        ellipseMode(CENTER);
        ellipse(0, 0, this.width, this.height);

        if (this.text && this.text.length > 0) {
            // Set text properties
            textAlign(CENTER, CENTER);
            textSize(min(this.width, this.height) / 4); // Adjust size as needed
            fill(0); // or use a color of your choice
            noStroke();
            text(this.text, 0, 0);
        }
    }
    
    _pointInShape(localX, localY) {
        // For ellipses, use distance formula
        const radiusX = this.width / 2;
        const radiusY = this.height / 2;
        
        return ((localX * localX) / (radiusX * radiusX)) + ((localY * localY) / (radiusY * radiusY)) <= 1;
    }
}   