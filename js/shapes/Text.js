class Text extends BaseShape {
    constructor(x, y, text) {
        super(x, y);
        this.text = text || "Text";
        this.fontSize = 24;
        this.fontFamily = "Arial";
        this.textAlign = "center"; // left, center, right
        this.textStyle = "normal"; // normal, italic, bold
        this.name = "Text";
    }
    
    _renderShape() {
        textSize(this.fontSize);
        textFont(this.fontFamily);
        textAlign(this._getTextAlignValue(), CENTER);
        
        // Apply text style
        if (this.textStyle === "bold") {
            textStyle(BOLD);
        } else if (this.textStyle === "italic") {
            textStyle(ITALIC);
        } else {
            textStyle(NORMAL);
        }
        
        text(this.text, 0, 0);
        
        // Reset text style
        textStyle(NORMAL);
    }
    
    _getTextAlignValue() {
        switch(this.textAlign) {
            case "left": return LEFT;
            case "right": return RIGHT;
            case "center":
            default:
                return CENTER;
        }
    }
    
    _pointInShape(localX, localY) {
        textSize(this.fontSize);
        textFont(this.fontFamily);
        
        const textWidth = this.text.length * this.fontSize * 0.6; // Approximate width
        const textHeight = this.fontSize * 1.2; // Approximate height
        
        let offsetX = 0;
        
        // Adjust based on text alignment
        switch(this.textAlign) {
            case "left":
                offsetX = textWidth / 2;
                break;
            case "right":
                offsetX = -textWidth / 2;
                break;
        }
        
        return (
            localX >= -textWidth/2 + offsetX &&
            localX <= textWidth/2 + offsetX &&
            localY >= -textHeight/2 &&
            localY <= textHeight/2
        );
    }
    
    getBoundingBox() {
        textSize(this.fontSize);
        textFont(this.fontFamily);
        
        const textWidth = textWidth(this.text);
        const textHeight = this.fontSize * 1.2; // Approximate height
        
        let offsetX = 0;
        
        // Adjust based on text alignment
        switch(this.textAlign) {
            case "left":
                offsetX = textWidth / 2;
                break;
            case "right":
                offsetX = -textWidth / 2;
                break;
        }
        
        return {
            x: this.x - textWidth/2 + offsetX,
            y: this.y - textHeight/2,
            width: textWidth,
            height: textHeight
        };
    }
}