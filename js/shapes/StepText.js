class StepText extends Text {
    constructor(x, y, steps = []) {
        super(x, y, "");
        this.steps = Array.isArray(steps) ? steps : [];
        this.currentStep = 0; // Track the currently highlighted step
        this.name = "StepText";
        this.textAlign = "left"; // Step text works better left-aligned
        this.highlightColor = '#FFCC00'; // Color for highlighting the current step
        this.stepNumberColor = '#4A90E2'; // Color for step numbers
        this.stepPadding = 10; // Padding between steps
        this.updateStepText(); // Initialize text content
    }
    
    // Method to add a new step
    addStep(stepText) {
        this.steps.push(stepText);
        this.updateStepText();
        return this.steps.length - 1; // Return the index of the added step
    }
    
    // Method to remove a step
    removeStep(index) {
        if (index >= 0 && index < this.steps.length) {
            this.steps.splice(index, 1);
            this.updateStepText();
            return true;
        }
        return false;
    }
    
    // Method to update a step's text
    updateStep(index, newText) {
        if (index >= 0 && index < this.steps.length) {
            this.steps[index] = newText;
            this.updateStepText();
            return true;
        }
        return false;
    }
    
    // Set the current highlighted step
    setCurrentStep(index) {
        if (index >= 0 && index < this.steps.length) {
            this.currentStep = index;
            return true;
        } else if (index === -1) { // -1 means no step highlighted
            this.currentStep = -1;
            return true;
        }
        return false;
    }
    
    // Go to next step
    nextStep() {
        if (this.currentStep < this.steps.length - 1) {
            this.currentStep++;
            return true;
        }
        return false;
    }
    
    // Go to previous step
    previousStep() {
        if (this.currentStep > 0) {
            this.currentStep--;
            return true;
        }
        return false;
    }
    
    // Generate formatted text from steps array
    updateStepText() {
        if (this.steps.length === 0) {
            this.text = "No steps defined";
            return;
        }
        
        let formattedText = "";
        for (let i = 0; i < this.steps.length; i++) {
            formattedText += `Step ${i + 1}: ${this.steps[i]}`;
            if (i < this.steps.length - 1) {
                formattedText += '\n';
            }
        }
        
        this.text = formattedText;
    }
    
    // Override the render method to add custom styling
    _renderShape() {
        if (this.steps.length === 0) {
            // Use parent class rendering for "No steps defined" message
            super._renderShape();
            return;
        }
        
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
        
        const lines = this.text.split('\n');
        const lineHeightPixels = this.fontSize * this.lineHeight;
        
        // Calculate total height to center vertically
        const totalHeight = lineHeightPixels * (lines.length - 1);
        let yPos = -totalHeight / 2;
        
        for (let i = 0; i < lines.length; i++) {
            const isCurrentStep = i === this.currentStep;
            const line = lines[i];
            
            // Find where the colon is to separate "Step X:" from the content
            const colonIndex = line.indexOf(':');
            if (colonIndex !== -1) {
                const stepPart = line.substring(0, colonIndex + 1);
                const contentPart = line.substring(colonIndex + 1);
                
                // Set alignment
                textAlign(LEFT, CENTER);
                
                // Draw background highlight for current step
                if (isCurrentStep) {
                    push();
                    fill(this.highlightColor + '40'); // 40 = 25% opacity
                    noStroke();
                    
                    // Calculate the width of the entire line for the highlight
                    const lineWidth = textWidth(line) + this.stepPadding * 2;
                    const lineHeight = lineHeightPixels * 0.9;
                    
                    let xPos = 0;
                    if (this.textAlign === "center") {
                        xPos = -lineWidth / 2;
                    } else if (this.textAlign === "right") {
                        xPos = -lineWidth;
                    } else { // left
                        xPos = -this.stepPadding; 
                    }
                    
                    rect(xPos, yPos - lineHeight/2, lineWidth, lineHeight, 5);
                    pop();
                }
                
                // Draw the "Step X:" part with special color
                push();
                fill(this.stepNumberColor);
                textStyle(BOLD);
                text(stepPart, 0, yPos);
                pop();
                
                // Draw the content part with normal color
                push();
                fill(this.fillColor || '#000000');
                text(contentPart, textWidth(stepPart), yPos);
                pop();
            } else {
                // Just in case there's no colon, render normally
                textAlign(this._getTextAlignValue(), CENTER);
                text(line, 0, yPos);
            }
            
            yPos += lineHeightPixels;
        }
        
        // Reset text style
        textStyle(NORMAL);
    }
    
    // Method to move all steps (up/down) as a group
    moveSteps(direction, amount = 1) {
        if (direction === "up" && this.currentStep > 0) {
            // Move the highlighted step up
            const step = this.steps[this.currentStep];
            this.steps.splice(this.currentStep, 1);
            this.steps.splice(this.currentStep - amount, 0, step);
            this.currentStep -= amount;
            this.updateStepText();
            return true;
        } else if (direction === "down" && this.currentStep < this.steps.length - 1) {
            // Move the highlighted step down
            const step = this.steps[this.currentStep];
            this.steps.splice(this.currentStep, 1);
            this.steps.splice(this.currentStep + amount, 0, step);
            this.currentStep += amount;
            this.updateStepText();
            return true;
        }
        return false;
    }
    
    // Create a new instance with sample steps
    static createWithSampleSteps(x, y) {
        return new StepText(x, y, [
            "Created animation",
            "Added first object",
            "Set up timeline",
            "Finalized composition"
        ]);
    }
}