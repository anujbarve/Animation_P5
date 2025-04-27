class AnimationEngine {
    constructor() {
        this.objects = [];
        this.timeline = null;
        this.recorder = null;
        this.selectedObject = null;
        this.isPlaying = false;
        this.backgroundColor = color(30);
        this.gridVisible = true;
        this.gridSize = 20;
        this.canvasWidth = 800;
        this.canvasHeight = 600;
    }

    initialize() {
        this.timeline = new Timeline(this);
        this.recorder = new Recorder(this);
    }

    update() {
        if (this.isPlaying) {
            this.timeline.advanceFrame();
        }
        
        // Update all objects based on current frame
        this.objects.forEach(obj => obj.updateToFrame(this.timeline.currentFrame));
    }

    render() {
        background(this.backgroundColor);
        
        if (this.gridVisible) {
            this.drawGrid();
        }
        
        // Render all objects
        this.objects.forEach(obj => obj.render());
        
        // Highlight selected object
        if (this.selectedObject) {
            this.drawSelectionIndicator(this.selectedObject);
        }
        
        // Capture frame if recording
        if (this.recorder.isRecording) {
            this.recorder.captureFrame();
        }
    }

    drawGrid() {
        stroke(40);
        strokeWeight(1);
        
        for (let x = 0; x < this.canvasWidth; x += this.gridSize) {
            line(x, 0, x, this.canvasHeight);
        }
        
        for (let y = 0; y < this.canvasHeight; y += this.gridSize) {
            line(0, y, this.canvasWidth, y);
        }
    }

    drawSelectionIndicator(obj) {
        push();
        noFill();
        stroke(0, 150, 255);
        strokeWeight(2);
        
        // Get the bounding box
        const bb = obj.getBoundingBox();
        rect(bb.x, bb.y, bb.width, bb.height);
        
        // Draw control points
        fill(0, 150, 255);
        noStroke();
        
        const controlPoints = [
            {x: bb.x, y: bb.y},  // top-left
            {x: bb.x + bb.width/2, y: bb.y},  // top-center
            {x: bb.x + bb.width, y: bb.y},  // top-right
            {x: bb.x, y: bb.y + bb.height/2},  // middle-left
            {x: bb.x + bb.width, y: bb.y + bb.height/2},  // middle-right
            {x: bb.x, y: bb.y + bb.height},  // bottom-left
            {x: bb.x + bb.width/2, y: bb.y + bb.height},  // bottom-center
            {x: bb.x + bb.width, y: bb.y + bb.height}  // bottom-right
        ];
        
        controlPoints.forEach(pt => {
            ellipse(pt.x, pt.y, 8, 8);
        });
        
        pop();
    }

    addObject(obj) {
        this.objects.push(obj);
        this.selectObject(obj);
        return obj;
    }

    removeObject(obj) {
        const index = this.objects.indexOf(obj);
        if (index !== -1) {
            this.objects.splice(index, 1);
            if (this.selectedObject === obj) {
                this.selectedObject = null;
            }
        }
    }

    selectObject(obj) {
        this.selectedObject = obj;
    }

    findObjectAt(x, y) {
        // Reverse loop to select topmost object
        for (let i = this.objects.length - 1; i >= 0; i--) {
            if (this.objects[i].containsPoint(x, y)) {
                return this.objects[i];
            }
        }
        return null;
    }

    play() {
        this.isPlaying = true;
    }

    pause() {
        this.isPlaying = false;
    }

    reset() {
        this.timeline.currentFrame = 0;
        this.objects.forEach(obj => obj.updateToFrame(0));
    }

    setCanvasSize(width, height) {
        this.canvasWidth = width;
        this.canvasHeight = height;
        resizeCanvas(width, height);
    }
}