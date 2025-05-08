class UIManager {
    constructor(engine) {
        this.engine = engine;
        this.gui = null;
        this.timelinePanel = null;
        this.propertiesPanel = null;
        this.toolbarPanel = null;
        this.codeEditorPanel = null;
        this.keyframeManager = new KeyframeManager();
        
        this.isDragging = false;
        this.dragTarget = null;
        this.dragOffset = { x: 0, y: 0 };
        
        this.copyBuffer = null;
        
        // UI state tracking
        this.uiState = {
            propertiesVisible: true,
            timelineVisible: true,
            toolbarVisible: true,
            codeEditorVisible: false
        };
    }
    
    initialize() {
        // Initialize GUI
        this.initializeGUI();
        
        // Initialize panel components
        this.timelinePanel = new TimelinePanel(this.engine, this.keyframeManager);
        this.toolbarPanel = new ToolbarPanel(this.engine, this.gui);
        this.propertiesPanel = new PropertiesPanel(this.engine, this.gui, this.keyframeManager);
        this.codeEditorPanel = new CodeEditorPanel(this.engine);
        
        // Initialize each panel
        this.timelinePanel.initialize();
        
        this.toolbarPanel.initialize();
        this.propertiesPanel.initialize();
        this.codeEditorPanel.initialize();
        
        // Create UI toggle controls
        this.initializeUIToggleControls();
        
        // Setup input event handlers
        this.setupEventListeners();
        
        // Handle initial window resize
        this.handleWindowResize();
    }
    
    initializeGUI() {
        this.gui = new dat.GUI({ autoPlace: false, width: 288 }); // Tailwind w-72 = 288px
        
        // Place the GUI in a custom container
        const guiContainer = document.getElementById('gui-container');
        guiContainer.appendChild(this.gui.domElement);
        
        // Apply custom styling to dat.GUI if needed (minimal since Tailwind handles most)
        this.styleGUI();
    }
    
    styleGUI() {
        // Minimal custom styles since Tailwind handles the container
        const style = document.createElement('style');
        style.textContent = `
            .dg .c {
                float: right;
                width: 60%;
            }
            .dg .property-name {
                width: 40%;
            }
            .dg .c input[type=text] {
                border-radius: 2px;
                padding: 1px 4px;
            }
            .dg li:not(.folder) {
                border-bottom: 1px solid #374151;
                transition: background-color 0.1s;
            }
            .dg li:not(.folder):hover {
                background-color: #2d3748;
            }
            .dg .c .slider {
                background: #2d3748;
                border-radius: 2px;
                box-shadow: none;
            }
            .dg .c .slider-fg {
                background: #4299e1;
                border-radius: 2px;
            }
            .keyframe-button {
                margin-left: 5px;
                background: none;
                border: none;
                color: #fbbf24;
                cursor: pointer;
                font-size: 12px;
                transition: opacity 0.2s;
            }
            .keyframe-button:hover {
                opacity: 1 !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    initializeUIToggleControls() {
        // Add event listeners to toggle buttons
        document.querySelector('.timeline-toggle').addEventListener('click', () => this.togglePanel('timeline'));
        document.querySelector('.properties-toggle').addEventListener('click', () => this.togglePanel('properties'));
        document.querySelector('.toolbar-toggle').addEventListener('click', () => this.togglePanel('toolbar'));
        document.querySelector('.code-editor-toggle').addEventListener('click', () => this.togglePanel('codeEditor'));
        document.querySelector('.collapse-all').addEventListener('click', () => this.toggleAllPanels());
    }
    
    togglePanel(panelType) {
        switch(panelType) {
            case 'timeline':
                this.uiState.timelineVisible = !this.uiState.timelineVisible;
                const timelineContainer = document.getElementById('timeline-container');
                if (this.uiState.timelineVisible) {
                    timelineContainer.classList.remove('translate-y-full');
                } else {
                    timelineContainer.classList.add('translate-y-full');
                }
                break;
            case 'properties':
                this.uiState.propertiesVisible = !this.uiState.propertiesVisible;
                const guiContainer = document.getElementById('gui-container');
                if (this.uiState.propertiesVisible) {
                    guiContainer.classList.remove('translate-x-full');
                    this.propertiesPanel.show();
                } else {
                    guiContainer.classList.add('translate-x-full');
                    this.propertiesPanel.hide();
                }
                break;
            case 'toolbar':
                this.uiState.toolbarVisible = !this.uiState.toolbarVisible;
                this.toolbarPanel.toggleVisibility(this.uiState.toolbarVisible);
                break;
            case 'codeEditor':
                this.uiState.codeEditorVisible = !this.uiState.codeEditorVisible;
                this.codeEditorPanel.toggleEditor(this.uiState.codeEditorVisible);
                break;
        }
        
        // Update toggle button state
        const button = document.querySelector(`.${panelType}-toggle`);
        if (button) {
            button.classList.toggle('active', this.uiState[`${panelType}Visible`]);
        }
    }
    
    toggleAllPanels(show = null) {
        // If show is null, toggle based on current state
        const newState = (show === null) ? 
            !Object.values(this.uiState).some(v => v) : show;
        
        // Update all states
        this.uiState.timelineVisible = newState;
        this.uiState.propertiesVisible = newState;
        this.uiState.toolbarVisible = newState;
        
        // Update UI elements
        const timelineContainer = document.getElementById('timeline-container');
        const guiContainer = document.getElementById('gui-container');
        if (newState) {
            timelineContainer.classList.remove('translate-y-full');
            guiContainer.classList.remove('translate-x-full');
            this.propertiesPanel.show();
        } else {
            timelineContainer.classList.add('translate-y-full');
            guiContainer.classList.add('translate-x-full');
            this.propertiesPanel.hide();
        }
        
        this.toolbarPanel.toggleVisibility(newState);
        
        // Update toggle buttons
        document.querySelector('.timeline-toggle').classList.toggle('active', newState);
        document.querySelector('.properties-toggle').classList.toggle('active', newState);
        document.querySelector('.toolbar-toggle').classList.toggle('active', newState);
    }
    
    setupEventListeners() {
        // Mouse pressed event
        window.mousePressed = () => {
            // Only handle events in canvas
            if (mouseX < 0 || mouseX > this.engine.canvasWidth || 
                mouseY < 0 || mouseY > this.engine.canvasHeight) {
                return;
            }
            
            // Check if clicked on an object
            const clickedObject = this.engine.findObjectAt(mouseX, mouseY);
            
            if (clickedObject) {
                this.engine.selectObject(clickedObject);
                this.propertiesPanel.updateForSelectedObject();
                
                // Prepare for dragging
                this.isDragging = true;
                this.dragTarget = clickedObject;
                this.dragOffset.x = mouseX - clickedObject.x;
                this.dragOffset.y = mouseY - clickedObject.y;
            } else {
                this.engine.selectObject(null);
                this.propertiesPanel.updateForSelectedObject();
            }
        };
        
        // Mouse dragged event
        window.mouseDragged = () => {
            if (this.isDragging && this.dragTarget) {
                this.dragTarget.x = mouseX - this.dragOffset.x;
                this.dragTarget.y = mouseY - this.dragOffset.y;
            }
        };
        
        // Mouse released event
        window.mouseReleased = () => {
            this.isDragging = false;
            this.dragTarget = null;
        };
        
        // Keyboard events
        window.keyPressed = () => {
            // Delete selected object
            if (keyCode === DELETE && this.engine.selectedObject) {
                this.engine.removeObject(this.engine.selectedObject);
                this.propertiesPanel.updateForSelectedObject();
            }
            
            // Copy (Ctrl+C)
            if (keyCode === 67 && keyIsDown(CONTROL) && this.engine.selectedObject) {
                this.copyBuffer = this.engine.selectedObject.clone();
            }
            
            // Paste (Ctrl+V)
            if (keyCode === 86 && keyIsDown(CONTROL) && this.copyBuffer) {
                const newObject = this.copyBuffer.clone();
                // Offset slightly
                newObject.x += 20;
                newObject.y += 20;
                this.engine.addObject(newObject);
                this.engine.selectObject(newObject);
                this.propertiesPanel.updateForSelectedObject();
            }
            
            // Play/Pause (Spacebar)
            if (keyCode === 32) { // Spacebar
                if (this.engine.isPlaying) {
                    this.engine.pause();
                } else {
                    this.engine.play();
                }
                return false; // Prevent scrolling
            }
            
            // Hide/Show all panels (Escape)
            if (keyCode === 27) { // Escape
                this.toggleAllPanels();
            }
        };
        
        // Window resize event
        window.addEventListener('resize', () => {
            this.handleWindowResize();
        });
    }
    
    handleWindowResize() {
        // Adjust UI components based on window size
        const width = window.innerWidth;
        
        // Adjust GUI width if needed (handled by Tailwind mostly)
        if (this.timelinePanel) {
            this.timelinePanel.fitTimelineToWindow();
        }
    }
    
    update() {
        // Update panels
        this.timelinePanel.update();
        this.propertiesPanel.update();
        this.toolbarPanel.update();
    }
    
    // Helper method to create shapes
    createShape(type, x, y) {
        let shape;
        
        switch(type) {
            case 'circle':
                shape = new Circle(x, y, 100);
                break;
            case 'rectangle':
                shape = new Rectangle(x, y, 100, 80);
                break;
            case 'path':
                shape = new Path(x, y);
                // Add some default points
                shape.addPoint(-50, -50);
                shape.addPoint(50, -50);
                shape.addPoint(0, 50);
                shape.closed = true;
                break;
            case 'text':
                shape = new Text(x, y, "Text");
                break;
            default:
                console.error("Unknown shape type:", type);
                return null;
        }
        
        return this.engine.addObject(shape);
    }
}