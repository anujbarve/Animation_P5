class StepsDisplay extends BaseShape {
    constructor(x, y, steps = []) {
        super(x, y);
        this.steps = steps;
        this.width = 300;
        this.height = 400;
        this.padding = 15;
        this.stepHeight = 80;
        this.scrollY = 0;
        this.maxScroll = 0;
        this.isDragging = false;
        this.lastY = 0;
        this.name = "Steps Display";
        this.backgroundColor = color(240, 240, 240);
        this.stepColor = color(255, 255, 255);
        this.textColor = color(50, 50, 50);
        this.stepNumberColor = color(70, 130, 180);
        this.cornerRadius = 10;
    }
    
    _renderShape() {
        // Calculate max scroll based on content height
        const contentHeight = this.steps.length * this.stepHeight;
        this.maxScroll = Math.max(0, contentHeight - (this.height - this.padding * 2));
        
        // Constrain scroll
        this.scrollY = constrain(this.scrollY, 0, this.maxScroll);
        
        // Draw container background
        fill(this.backgroundColor);
        stroke(200);
        strokeWeight(1);
        rect(-this.width/2, -this.height/2, this.width, this.height, this.cornerRadius);
        
        // Create clip region for scrolling
        push();
        // Set up clipping area for scrolling content
        const clipX = -this.width/2 + this.padding;
        const clipY = -this.height/2 + this.padding;
        const clipWidth = this.width - this.padding * 2;
        const clipHeight = this.height - this.padding * 2;
        
        // Note: p5.js doesn't have built-in clipping, so we create a mask
        drawingContext.save();
        drawingContext.beginPath();
        drawingContext.rect(clipX, clipY, clipWidth, clipHeight);
        drawingContext.clip();
        
        // Draw steps
        const startY = clipY - this.scrollY;
        textAlign(LEFT, TOP);
        textSize(16);
        noStroke();
        
        for (let i = 0; i < this.steps.length; i++) {
            const yPos = startY + i * this.stepHeight;
            
            // Only render steps that are visible
            if (yPos + this.stepHeight >= clipY && yPos <= clipY + clipHeight) {
                // Step background
                fill(this.stepColor);
                rect(clipX, yPos, clipWidth, this.stepHeight - 10, 5);
                
                // Step number
                fill(this.stepNumberColor);
                textStyle(BOLD);
                text(`Step ${i + 1}:`, clipX + 10, yPos + 10);
                
                // Step text
                fill(this.textColor);
                textStyle(NORMAL);
                text(this.steps[i].split(":").slice(1).join(":").trim(), 
                     clipX + 10, yPos + 35);
            }
        }
        
        // Restore drawing context
        drawingContext.restore();
        pop();
        
        // Draw scroll indicator if needed
        if (this.maxScroll > 0) {
            const scrollRatio = this.scrollY / this.maxScroll;
            const scrollBarHeight = Math.max(30, (this.height - this.padding * 2) * 
                                  ((this.height - this.padding * 2) / contentHeight));
            
            const scrollBarY = map(
                scrollRatio, 
                0, 1, 
                -this.height/2 + this.padding, 
                this.height/2 - this.padding - scrollBarHeight
            );
            
            fill(180);
            noStroke();
            rect(
                this.width/2 - 10, 
                scrollBarY, 
                5, 
                scrollBarHeight, 
                2
            );
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
    
    getBoundingBox() {
        return {
            x: this.x - this.width/2,
            y: this.y - this.height/2,
            width: this.width,
            height: this.height
        };
    }
    
    handleMousePressed(x, y) {
        if (this._pointInShape(x - this.x, y - this.y)) {
            this.isDragging = true;
            this.lastY = y;
            return true;
        }
        return false;
    }
    
    handleMouseDragged(x, y) {
        if (this.isDragging) {
            const deltaY = this.lastY - y;
            this.scrollY += deltaY;
            this.lastY = y;
            return true;
        }
        return false;
    }
    
    handleMouseReleased() {
        this.isDragging = false;
        return false;
    }
    
    // Method to set steps
    setSteps(steps) {
        this.steps = steps;
        this.scrollY = 0; // Reset scroll position
    }
    
    // Method to add a step
    addStep(step) {
        this.steps.push(step);
    }
}