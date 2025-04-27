class ToolbarPanel {
    constructor(engine, gui) {
        this.engine = engine;
        this.gui = gui;
        
        // GUI folders
        this.toolsFolder = null;
        this.projectFolder = null;
        
        // GUI controllers
        this.toolControllers = {};
    }
    
    initialize() {
        // Create folders
        this.toolsFolder = this.gui.addFolder('Tools');
        this.projectFolder = this.gui.addFolder('Project');
        
        // Open folders by default
        this.toolsFolder.open();
        this.projectFolder.open();
        
        // Add tools
        this.addShapeTools();
        this.addCanvasSettings();
        this.addProjectSettings();
        this.addShapeTools();
        this.addCanvasSettings();
        this.addProjectSettings();
        this.addAnimationTemplates(); // Add this line
    }
    
    addShapeTools() {
        const shapeTools = {
            createCircle: () => {
                this.createShape('circle');
            },
            createRectangle: () => {
                this.createShape('rectangle');
            },
            createPath: () => {
                this.createShape('path');
            },
            createText: () => {
                this.createShape('text');
            }
        };
        
        this.toolControllers.createCircle = this.toolsFolder.add(shapeTools, 'createCircle').name('Add Circle');
        this.toolControllers.createRectangle = this.toolsFolder.add(shapeTools, 'createRectangle').name('Add Rectangle');
        this.toolControllers.createPath = this.toolsFolder.add(shapeTools, 'createPath').name('Add Path');
        this.toolControllers.createText = this.toolsFolder.add(shapeTools, 'createText').name('Add Text');
    }
    
    addCanvasSettings() {
        // Background color
        const bgColorObj = {
            backgroundColor: [
                red(this.engine.backgroundColor), 
                green(this.engine.backgroundColor), 
                blue(this.engine.backgroundColor)
            ]
        };
        
        this.toolControllers.backgroundColor = this.toolsFolder.addColor(bgColorObj, 'backgroundColor')
            .name('Canvas Color')
            .onChange((value) => {
                this.engine.backgroundColor = color(value[0], value[1], value[2]);
            });
        
        // Canvas size
        const canvasSettings = {
            width: this.engine.canvasWidth,
            height: this.engine.canvasHeight,
            updateSize: () => {
                this.engine.setCanvasSize(canvasSettings.width, canvasSettings.height);
            }
        };
        
        this.toolControllers.canvasWidth = this.toolsFolder.add(canvasSettings, 'width', 100, 2000).step(10).name('Canvas Width');
        this.toolControllers.canvasHeight = this.toolsFolder.add(canvasSettings, 'height', 100, 1200).step(10).name('Canvas Height');
        this.toolControllers.updateSize = this.toolsFolder.add(canvasSettings, 'updateSize').name('Apply Size');
        
        // Grid settings
        this.toolControllers.showGrid = this.toolsFolder.add(this.engine, 'gridVisible').name('Show Grid');
        this.toolControllers.gridSize = this.toolsFolder.add(this.engine, 'gridSize', 5, 50).step(5).name('Grid Size');
    }
    
    addProjectSettings() {
        // FPS and duration settings
        const timelineSettings = {
            fps: this.engine.timeline.fps,
            duration: this.engine.timeline.totalFrames / this.engine.timeline.fps,
            updateTimeline: () => {
                this.engine.timeline.setFPS(timelineSettings.fps);
                this.engine.timeline.setDuration(timelineSettings.duration);
            }
        };
        
        this.toolControllers.fps = this.projectFolder.add(timelineSettings, 'fps', 1, 60).step(1).name('FPS');
        this.toolControllers.duration = this.projectFolder.add(timelineSettings, 'duration', 1, 60).step(1).name('Duration (sec)');
        this.toolControllers.updateTimeline = this.projectFolder.add(timelineSettings, 'updateTimeline').name('Apply Timeline');
        
        // Project save/load
        const projectActions = {
            saveProject: () => {
                ProjectManager.saveProject(this.engine);
            },
            loadProject: () => {
                ProjectManager.promptLoadProject(this.engine);
            },
            exportAnimation: () => {
                ExportManager.showExportOptions(this.engine);
            }
        };
        
        this.toolControllers.saveProject = this.projectFolder.add(projectActions, 'saveProject').name('Save Project');
        this.toolControllers.loadProject = this.projectFolder.add(projectActions, 'loadProject').name('Load Project');
        this.toolControllers.exportAnimation = this.projectFolder.add(projectActions, 'exportAnimation').name('Export Animation');
    }
    
    createShape(type) {
        const centerX = this.engine.canvasWidth / 2;
        const centerY = this.engine.canvasHeight / 2;
        
        // Find an empty spot near the center
        let x = centerX + Math.random() * 100 - 50;
        let y = centerY + Math.random() * 100 - 50;
        
        // Create the shape using UIManager's helper
        const uiManager = this.engine.uiManager;
        uiManager.createShape(type, x, y);
    }
    
    update() {
        // Nothing to update regularly
    }

    // Add this to ToolbarPanel.js
addAnimationTemplates() {
    const templates = {
        bounceAnimation: () => this.createBounceAnimation(),
        typingAnimation: () => this.createTypingAnimation(),
        fadeInOut: () => this.createFadeInOutAnimation(),
        particleExplosion: () => this.createParticleAnimation(),
        waveAnimation: () => this.createWaveAnimation(),
        logoReveal: () => this.createLogoRevealAnimation()
    };
    
    const templateFolder = this.gui.addFolder('Animation Templates');
    templateFolder.add(templates, 'bounceAnimation').name('Bounce Effect');
    templateFolder.add(templates, 'typingAnimation').name('Typing Text');
    templateFolder.add(templates, 'fadeInOut').name('Fade In/Out');
    templateFolder.add(templates, 'particleExplosion').name('Particle Effect');
    templateFolder.add(templates, 'waveAnimation').name('Wave Animation');
    templateFolder.add(templates, 'logoReveal').name('Logo Reveal');
    
    templateFolder.open();
}

// Example template methods
createBounceAnimation() {
    // Clear existing objects
    animAPI.clearAll();
    
    // Create a bouncing ball
    const ball = animAPI.createShape('circle', {
        x: 400,
        y: 100,
        size: 80,
        fill: color(255, 100, 100),
        name: "Bouncing Ball"
    });
    
    // Set up path for bouncing
    const path = [
        {x: 400, y: 100},
        {x: 400, y: 500},
        {x: 400, y: 200},
        {x: 400, y: 500},
        {x: 400, y: 300},
        {x: 400, y: 500},
        {x: 400, y: 400},
        {x: 400, y: 500}
    ];
    
    // Animate along the path
    animAPI.followPath(ball, path, 0, 120, 'easeOutBounce');
    
    // Squash and stretch
    const keyframes = [
        {frame: 0, value: 80},
        {frame: 30, value: 90, easing: 'easeInCubic'},
        {frame: 40, value: 60, easing: 'easeOutCubic'},
        {frame: 50, value: 80, easing: 'easeInOutCubic'},
        {frame: 70, value: 85, easing: 'easeInCubic'},
        {frame: 80, value: 70, easing: 'easeOutCubic'},
        {frame: 90, value: 80, easing: 'easeInOutCubic'},
        {frame: 110, value: 75, easing: 'easeInCubic'},
        {frame: 120, value: 80, easing: 'easeOutCubic'}
    ];
    
    animAPI.animate(ball, 'width', keyframes);
    
    // Play the animation
    animAPI.play();
}

createTypingAnimation() {
    // Clear existing objects
    animAPI.clearAll();
    
    // Create text object
    const text = animAPI.createShape('text', {
        x: 400,
        y: 300,
        text: "",
        fontSize: 36,
        fill: color(255, 255, 255),
        name: "Typing Text"
    });
    
    // Create typing animation
    animAPI.typeText(text, 0, "Creating programmatic animations is fun!", 120);
    
    // Add a cursor
    const cursor = animAPI.createShape('rectangle', {
        x: 400,
        y: 300,
        width: 3,
        height: 36,
        fill: color(255, 255, 255),
        name: "Cursor"
    });
    
    // Make cursor blink
    animAPI.animate(cursor, 'opacity', [
        {frame: 0, value: 255},
        {frame: 10, value: 0},
        {frame: 20, value: 255},
        {frame: 30, value: 0},
        {frame: 40, value: 255},
        {frame: 50, value: 0},
        {frame: 60, value: 255},
        {frame: 70, value: 0},
        {frame: 80, value: 255},
        {frame: 90, value: 0},
        {frame: 100, value: 255},
        {frame: 110, value: 0},
        {frame: 120, value: 255}
    ]);
    
    // Play the animation
    animAPI.play();
}

createWaveAnimation() {
    // Clear existing objects
    animAPI.clearAll();
    
    // Create a group in a circle
    const circles = animAPI.createGroup(12, 'circle', {
        size: 30,
        fill: color(100, 200, 255),
        name: "Wave Circle"
    }, 'circle');
    
    // Create wave effect
    animAPI.waveEffect(circles, 'width', 0, 120, 30, 60);
    
    // Play the animation
    animAPI.play();
}


}