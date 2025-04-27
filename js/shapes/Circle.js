class Circle extends BaseShape {
    constructor(x, y, diameter) {
        super(x, y);
        this.width = diameter || 100;
        this.height = diameter || 100;
        this.name = "Circle";
    }
    
    _renderShape() {
        ellipseMode(CENTER);
        ellipse(0, 0, this.width, this.height);
    }
    
    _pointInShape(localX, localY) {
        // For ellipses, use distance formula
        const radiusX = this.width / 2;
        const radiusY = this.height / 2;
        
        return ((localX * localX) / (radiusX * radiusX)) + ((localY * localY) / (radiusY * radiusY)) <= 1;
    }
}