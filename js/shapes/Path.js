class Path extends BaseShape {
    constructor(x, y) {
        super(x, y);
        this.points = [];
        this.closed = false;
        this.name = "Path";
    }
    
    addPoint(x, y) {
        this.points.push({ x, y });
        this._updateBounds();
        return this.points.length - 1; // Return index of added point
    }
    
    removePoint(index) {
        if (index >= 0 && index < this.points.length) {
            this.points.splice(index, 1);
            this._updateBounds();
        }
    }
    
    movePoint(index, x, y) {
        if (index >= 0 && index < this.points.length) {
            this.points[index].x = x;
            this.points[index].y = y;
            this._updateBounds();
        }
    }
    
    _updateBounds() {
        if (this.points.length === 0) {
            this.width = this.height = 0;
            return;
        }
        
        let minX = this.points[0].x;
        let maxX = this.points[0].x;
        let minY = this.points[0].y;
        let maxY = this.points[0].y;
        
        for (let i = 1; i < this.points.length; i++) {
            minX = Math.min(minX, this.points[i].x);
            maxX = Math.max(maxX, this.points[i].x);
            minY = Math.min(minY, this.points[i].y);
            maxY = Math.max(maxY, this.points[i].y);
        }
        
        this.width = maxX - minX;
        this.height = maxY - minY;
    }
    
    _renderShape() {
        if (this.points.length < 2) return;
        
        beginShape();
        
        for (const point of this.points) {
            vertex(point.x, point.y);
        }
        
        if (this.closed) {
            endShape(CLOSE);
        } else {
            endShape();
        }
    }
    
    _pointInShape(localX, localY) {
        if (this.points.length < 3 || !this.closed) {
            // For open paths or paths with less than 3 points, use simpler detection
            return this._isPointOnLine(localX, localY);
        }
        
        // For closed paths, use point-in-polygon algorithm
        let inside = false;
        
        for (let i = 0, j = this.points.length - 1; i < this.points.length; j = i++) {
            const xi = this.points[i].x;
            const yi = this.points[i].y;
            const xj = this.points[j].x;
            const yj = this.points[j].y;
            
            const intersect = ((yi > localY) !== (yj > localY)) && 
                (localX < (xj - xi) * (localY - yi) / (yj - yi) + xi);
                
            if (intersect) inside = !inside;
        }
        
        return inside;
    }
    
    _isPointOnLine(x, y) {
        const threshold = 5; // Distance threshold in pixels
        
        for (let i = 0; i < this.points.length - 1; i++) {
            const x1 = this.points[i].x;
            const y1 = this.points[i].y;
            const x2 = this.points[i + 1].x;
            const y2 = this.points[i + 1].y;
            
            // Calculate distance from point to line segment
            const A = x - x1;
            const B = y - y1;
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
            
            const dx = x - xx;
            const dy = y - yy;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < threshold) {
                return true;
            }
        }
        
        return false;
    }
    
    getBoundingBox() {
        if (this.points.length === 0) {
            return { x: this.x, y: this.y, width: 0, height: 0 };
        }
        
        let minX = this.points[0].x;
        let maxX = this.points[0].x;
        let minY = this.points[0].y;
        let maxY = this.points[0].y;
        
        for (let i = 1; i < this.points.length; i++) {
            minX = Math.min(minX, this.points[i].x);
            maxX = Math.max(maxX, this.points[i].x);
            minY = Math.min(minY, this.points[i].y);
            maxY = Math.max(maxY, this.points[i].y);
        }
        
        return {
            x: this.x + minX,
            y: this.y + minY,
            width: maxX - minX,
            height: maxY - minY
        };
    }
}