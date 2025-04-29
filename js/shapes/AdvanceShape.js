/**
 * Arrow Connector Shape for showing data flow in diagrams
 */
class Arrow extends BaseShape {
    constructor(startX, startY, endX, endY) {
        super(
            (startX + endX) / 2, // Center x
            (startY + endY) / 2  // Center y
        );
        
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
        
        // Arrow properties
        this.arrowSize = 10;
        this.arrowType = "single"; // "single", "double", "none"
        this.lineStyle = "solid";  // "solid", "dashed", "dotted"
        this.name = "Arrow";
        
        // Calculate width and height for bounding box
        this._updateDimensions();
    }
    
    _updateDimensions() {
        const dx = this.endX - this.startX;
        const dy = this.endY - this.startY;
        
        // Update the center point
        this.x = (this.startX + this.endX) / 2;
        this.y = (this.startY + this.endY) / 2;
        
        // Update width and height (add a bit of padding for the arrow head)
        this.width = Math.abs(dx) + this.arrowSize * 2;
        this.height = Math.abs(dy) + this.arrowSize * 2;
    }
    
    _renderShape() {
        // Get local coordinates relative to the center
        const localStartX = this.startX - this.x;
        const localStartY = this.startY - this.y;
        const localEndX = this.endX - this.x;
        const localEndY = this.endY - this.y;
        
        // Draw line with different styles
        if (this.lineStyle === "dashed") {
            this._drawDashedLine(localStartX, localStartY, localEndX, localEndY);
        } else if (this.lineStyle === "dotted") {
            this._drawDottedLine(localStartX, localStartY, localEndX, localEndY);
        } else {
            // Solid line
            line(localStartX, localStartY, localEndX, localEndY);
        }
        
        // Draw arrow heads
        if (this.arrowType === "single" || this.arrowType === "double") {
            this._drawArrowHead(localEndX, localEndY, localStartX, localStartY);
        }
        
        if (this.arrowType === "double") {
            this._drawArrowHead(localStartX, localStartY, localEndX, localEndY);
        }
    }
    
    _drawArrowHead(x, y, fromX, fromY) {
        // Calculate angle of the line
        const angle = atan2(y - fromY, x - fromX);
        
        push();
        translate(x, y);
        rotate(angle);
        
        // Draw arrow head
        beginShape();
        vertex(0, 0);
        vertex(-this.arrowSize, -this.arrowSize/2);
        vertex(-this.arrowSize, this.arrowSize/2);
        endShape(CLOSE);
        
        pop();
    }
    
    _drawDashedLine(x1, y1, x2, y2) {
        const dashLength = 8;
        const dx = x2 - x1;
        const dy = y2 - y1;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const steps = Math.floor(dist / dashLength);
        const xStep = dx / steps;
        const yStep = dy / steps;
        
        for (let i = 0; i < steps; i += 2) {
            const startX = x1 + i * xStep;
            const startY = y1 + i * yStep;
            const endX = x1 + (i + 1) * xStep;
            const endY = y1 + (i + 1) * yStep;
            
            if (i + 1 <= steps) {
                line(startX, startY, endX, endY);
            }
        }
    }
    
    _drawDottedLine(x1, y1, x2, y2) {
        const dotSpacing = 5;
        const dx = x2 - x1;
        const dy = y2 - y1;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const steps = Math.floor(dist / dotSpacing);
        
        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const x = x1 + dx * t;
            const y = y1 + dy * t;
            
            point(x, y);
        }
    }
    
    _pointInShape(localX, localY) {
        // Get local coordinates of start and end points
        const localStartX = this.startX - this.x;
        const localStartY = this.startY - this.y;
        const localEndX = this.endX - this.x;
        const localEndY = this.endY - this.y;
        
        // Check if point is near the line
        return this._distToSegment(localX, localY, localStartX, localStartY, localEndX, localEndY) <= 5;
    }
    
    _distToSegment(px, py, x1, y1, x2, y2) {
        const A = px - x1;
        const B = py - y1;
        const C = x2 - x1;
        const D = y2 - y1;
        
        const dot = A * C + B * D;
        const len_sq = C * C + D * D;
        let param = -1;
        
        if (len_sq !== 0) param = dot / len_sq;
        
        let xx, yy;
        
        if (param < 0) {
            xx = x1;
            yy = y1;
        } else if (param > 1) {
            xx = x2;
            yy = y2;
        } else {
            xx = x1 + param * C;
            yy = y1 + param * D;
        }
        
        const dx = px - xx;
        const dy = py - yy;
        
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    getBoundingBox() {
        // Get the min and max coordinates to create the bounding box
        const minX = Math.min(this.startX, this.endX) - this.arrowSize;
        const minY = Math.min(this.startY, this.endY) - this.arrowSize;
        const maxX = Math.max(this.startX, this.endX) + this.arrowSize;
        const maxY = Math.max(this.startY, this.endY) + this.arrowSize;
        
        return {
            x: minX,
            y: minY,
            width: maxX - minX,
            height: maxY - minY
        };
    }
    
    // Method to update the arrow points
    setPoints(startX, startY, endX, endY) {
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
        
        this._updateDimensions();
    }
}

/**
 * Diamond Shape for decision points in flowcharts
 */
class Diamond extends BaseShape {
    constructor(x, y, width, height) {
        super(x, y);
        this.width = width || 100;
        this.height = height || 100;
        this.name = "Diamond";
    }
    
    _renderShape() {
        beginShape();
        vertex(0, -this.height/2);
        vertex(this.width/2, 0);
        vertex(0, this.height/2);
        vertex(-this.width/2, 0);
        endShape(CLOSE);
    }
    
    _pointInShape(localX, localY) {
        // For a diamond, we can check using the equation of lines
        const halfWidth = this.width / 2;
        const halfHeight = this.height / 2;
        
        const topRightSlope = halfHeight / halfWidth;
        const bottomRightSlope = -halfHeight / halfWidth;
        
        // Check if point is inside all four line boundaries
        return (
            localY <= topRightSlope * (localX - halfWidth), // Below top-right line
            localY <= bottomRightSlope * (localX - halfWidth) + halfHeight, // Below bottom-right line
            localY >= topRightSlope * (localX + halfWidth) - halfHeight, // Above bottom-left line
            localY >= bottomRightSlope * (localX + halfWidth) // Above top-left line
        );
    }
}

/**
 * Parallelogram Shape for input/output in flowcharts
 */
class Parallelogram extends BaseShape {
    constructor(x, y, width, height, slant) {
        super(x, y);
        this.width = width || 120;
        this.height = height || 60;
        this.slant = slant || 20; // Horizontal offset amount for slanting
        this.name = "Parallelogram";
    }
    
    _renderShape() {
        beginShape();
        vertex(-this.width/2 + this.slant, -this.height/2);
        vertex(this.width/2 + this.slant, -this.height/2);
        vertex(this.width/2 - this.slant, this.height/2);
        vertex(-this.width/2 - this.slant, this.height/2);
        endShape(CLOSE);
    }
    
    _pointInShape(localX, localY) {
        // Approximate check using a rectangle
        return (
            localX >= -this.width/2 - this.slant &&
            localX <= this.width/2 + this.slant &&
            localY >= -this.height/2 &&
            localY <= this.height/2
        );
    }
}

/**
 * Database/Cylinder Shape for database representations
 */
class Database extends BaseShape {
    constructor(x, y, width, height) {
        super(x, y);
        this.width = width || 80;
        this.height = height || 120;
        this.capHeight = Math.min(20, this.height * 0.2); // Height of the elliptical caps
        this.name = "Database";
    }
    
    _renderShape() {
        // Top cap (ellipse)
        ellipseMode(CENTER);
        ellipse(0, -this.height/2 + this.capHeight/2, this.width, this.capHeight);
        
        // Cylinder body (rectangle with rounded sides)
        rect(0, 0, this.width, this.height - this.capHeight, 0, 0, this.width/2, this.width/2);
        
        // Bottom cap (semi-ellipse)
        arc(0, this.height/2 - this.capHeight/2, this.width, this.capHeight, 0, PI);
    }
    
    _pointInShape(localX, localY) {
        // Check if in the rectangular part
        if (
            localX >= -this.width/2 &&
            localX <= this.width/2 &&
            localY >= -this.height/2 + this.capHeight/2 &&
            localY <= this.height/2 - this.capHeight/2
        ) {
            return true;
        }
        
        // Check if in the top ellipse
        if (
            localY >= -this.height/2 && 
            localY <= -this.height/2 + this.capHeight
        ) {
            const radiusX = this.width / 2;
            const radiusY = this.capHeight / 2;
            const centerY = -this.height/2 + radiusY;
            
            return ((localX * localX) / (radiusX * radiusX) + 
                   ((localY - centerY) * (localY - centerY)) / (radiusY * radiusY)) <= 1;
        }
        
        // Check if in the bottom ellipse
        if (
            localY >= this.height/2 - this.capHeight && 
            localY <= this.height/2
        ) {
            const radiusX = this.width / 2;
            const radiusY = this.capHeight / 2;
            const centerY = this.height/2 - radiusY;
            
            return ((localX * localX) / (radiusX * radiusX) + 
                   ((localY - centerY) * (localY - centerY)) / (radiusY * radiusY)) <= 1;
        }
        
        return false;
    }
}

/**
 * Document Shape for document representations
 */
class Document extends BaseShape {
    constructor(x, y, width, height) {
        super(x, y);
        this.width = width || 100;
        this.height = height || 120;
        this.curlHeight = Math.min(20, this.height * 0.15); // Height of the curl at the bottom
        this.name = "Document";
    }
    
    _renderShape() {
        // Calculate dimensions
        const halfWidth = this.width / 2;
        const halfHeight = this.height / 2;
        
        beginShape();
        // Top left corner
        vertex(-halfWidth, -halfHeight);
        // Top right
        vertex(halfWidth, -halfHeight);
        // Right side
        vertex(halfWidth, halfHeight - this.curlHeight);
        
        // Bottom curved edge
        const steps = 10;
        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const angle = PI * t;
            const x = halfWidth - t * this.width;
            const y = halfHeight - this.curlHeight + Math.sin(angle) * this.curlHeight;
            vertex(x, y);
        }
        
        // Left side back to top
        vertex(-halfWidth, halfHeight - this.curlHeight * 2);
        vertex(-halfWidth, -halfHeight);
        
        endShape(CLOSE);
    }
    
    _pointInShape(localX, localY) {
        // Simplified check using a rectangle with slightly reduced height
        return (
            localX >= -this.width/2 &&
            localX <= this.width/2 &&
            localY >= -this.height/2 &&
            localY <= this.height/2 - this.curlHeight
        );
    }
}