class Text extends BaseShape {
    constructor(x, y, text) {
        super(x, y);
        this.text = text || "Text";
        this.fontSize = 24;
        this.fontFamily = "Arial";
        this.textAlign = "center"; // left, center, right
        this.textStyle = "normal"; // normal, italic, bold
        this.name = "Text";
        this.letterSpacing = 0; // Add this property
        this.lineHeight = 1.2; // Add this property
    }
    
    _renderShape() {
        textSize(this.fontSize);
        textFont(this.fontFamily);
        
        // Apply text style
        if (this.textStyle === "bold") {
            textStyle(BOLD);
        } else if (this.textStyle === "italic") {
            textStyle(ITALIC);
        } else {
            textStyle(NORMAL);
        }
        
        // Check if text has multiple lines
        if (this.text.includes('\n')) {
            const lines = this.text.split('\n');
            const lineHeightPixels = this.fontSize * this.lineHeight;
            
            // Calculate total height to center vertically
            const totalHeight = lineHeightPixels * (lines.length - 1);
            let yPos = -totalHeight / 2;
            
            for (let i = 0; i < lines.length; i++) {
                // Handle letter spacing for each line if needed
                if (this.letterSpacing !== 0) {
                    // Letter spacing implementation for this line
                    textAlign(LEFT, CENTER);
                    
                    let totalWidth = 0;
                    for (let j = 0; j < lines[i].length; j++) {
                        totalWidth += textWidth(lines[i][j]) + this.letterSpacing;
                    }
                    totalWidth -= this.letterSpacing;
                    
                    let xPos = 0;
                    if (this.textAlign === "center") {
                        xPos = -totalWidth / 2;
                    } else if (this.textAlign === "right") {
                        xPos = -totalWidth;
                    }
                    
                    for (let j = 0; j < lines[i].length; j++) {
                        const char = lines[i][j];
                        text(char, xPos, yPos);
                        xPos += textWidth(char) + this.letterSpacing;
                    }
                } else {
                    // Normal text rendering for this line
                    textAlign(this._getTextAlignValue(), CENTER);
                    text(lines[i], 0, yPos);
                }
                
                yPos += lineHeightPixels;
            }
        } else {
            // Single line text
            if (this.letterSpacing !== 0) {
                // Letter spacing implementation (as above)
                textAlign(LEFT, CENTER);
                
                let totalWidth = 0;
                for (let i = 0; i < this.text.length; i++) {
                    totalWidth += textWidth(this.text[i]) + this.letterSpacing;
                }
                totalWidth -= this.letterSpacing;
                
                let xPos = 0;
                if (this.textAlign === "center") {
                    xPos = -totalWidth / 2;
                } else if (this.textAlign === "right") {
                    xPos = -totalWidth;
                }
                
                for (let i = 0; i < this.text.length; i++) {
                    text(this.text[i], xPos, 0);
                    xPos += textWidth(this.text[i]) + this.letterSpacing;
                }
            } else {
                // Normal text rendering
                textAlign(this._getTextAlignValue(), CENTER);
                text(this.text, 0, 0);
            }
        }
        
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
        // Initialize variables before using them
        let textWidthValue = 0;
        let textHeightValue = 0;
        
        // Temporarily set text properties to calculate dimensions
        push();
        textSize(this.fontSize);
        textFont(this.fontFamily);
        if (this.textStyle === "bold") {
            textStyle(BOLD);
        } else if (this.textStyle === "italic") {
            textStyle(ITALIC);
        }
        
        // Calculate text width with letter spacing if needed
        if (this.letterSpacing !== 0 && !this.text.includes('\n')) {
            textWidthValue = 0;
            for (let i = 0; i < this.text.length; i++) {
                textWidthValue += textWidth(this.text[i]);
            }
            // Add letter spacing between characters
            textWidthValue += this.letterSpacing * (this.text.length - 1);
        } else if (this.text.includes('\n')) {
            // For multiline text, find the widest line
            const lines = this.text.split('\n');
            textWidthValue = 0;
            
            for (let i = 0; i < lines.length; i++) {
                let lineWidth = 0;
                
                if (this.letterSpacing !== 0) {
                    for (let j = 0; j < lines[i].length; j++) {
                        lineWidth += textWidth(lines[i][j]);
                    }
                    lineWidth += this.letterSpacing * (lines[i].length - 1);
                } else {
                    lineWidth = textWidth(lines[i]);
                }
                
                if (lineWidth > textWidthValue) {
                    textWidthValue = lineWidth;
                }
            }
            
            // Calculate height for multiline text with line height
            textHeightValue = (textAscent() + textDescent()) * lines.length * this.lineHeight;
        } else {
            textWidthValue = textWidth(this.text);
            textHeightValue = textAscent() + textDescent();
        }
        
        pop();
        
        // Calculate bounding box based on alignment
        let xOffset = 0;
        if (this.textAlign === 'center') {
            xOffset = -textWidthValue / 2;
        } else if (this.textAlign === 'right') {
            xOffset = -textWidthValue;
        }
        
        return {
            x: this.x + xOffset,
            y: this.y - textHeightValue / 2,
            width: textWidthValue,
            height: textHeightValue
        };
    }
}