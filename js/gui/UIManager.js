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
        // Create main stylesheet
        this.createGlobalStyles();
        
        // Initialize GUI
        this.initializeGUI();
        
        // Initialize panel components
        this.timelinePanel = new TimelinePanel(this.engine, this.keyframeManager);
        this.propertiesPanel = new PropertiesPanel(this.engine, this.gui, this.keyframeManager);
        this.toolbarPanel = new ToolbarPanel(this.engine, this.gui);
        this.codeEditorPanel = new CodeEditorPanel(this.engine);
        
        // Initialize each panel
        this.timelinePanel.initialize();
        this.propertiesPanel.initialize();
        this.toolbarPanel.initialize();
        this.codeEditorPanel.initialize();
        
        // Create UI toggle controls
        this.initializeUIToggleControls();
        
        // Setup input event handlers
        this.setupEventListeners();
        
        // Handle initial window resize
        this.handleWindowResize();
    }
    
    initializeGUI() {
        this.gui = new dat.GUI({ autoPlace: false, width: 300 });
        
        // Place the GUI in a custom container
        const guiContainer = document.createElement('div');
        guiContainer.id = 'gui-container';
        guiContainer.className = 'panel-container';
        document.body.appendChild(guiContainer);
        guiContainer.appendChild(this.gui.domElement);
        
        // Apply custom styling to dat.GUI
        this.styleGUI();
    }
    
    styleGUI() {
        // Add custom CSS for dat.GUI elements to make it more modern
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
            .dg .c select {
                border-radius: 2px;
            }
            .dg .cr.function .property-name {
                width: 100%;
            }
            .dg li:not(.folder) {
                border-bottom: 1px solid #2c2c2c;
                transition: background-color 0.1s;
            }
            .dg li:not(.folder):hover {
                background-color: #1a1a1a;
            }
            .dg .c .slider {
                background: #2c2c2c;
                border-radius: 2px;
                box-shadow: none;
            }
            .dg .c .slider:hover {
                background: #333;
            }
            .dg .c .slider-fg {
                background: #4d94e7;
                border-radius: 2px;
            }
            .dg .closed .arrow {
                border-left-color: #777;
            }
            .dg .open .arrow {
                border-top-color: #777;
            }
            .dg .closed:hover .arrow {
                border-left-color: #aaa;
            }
            .dg .open:hover .arrow {
                border-top-color: #aaa;
            }
            .keyframe-button {
                margin-left: 5px;
                background: none;
                border: none;
                color: #ffcc00;
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
    
    createGlobalStyles() {
        const style = document.createElement('style');
        style.textContent = `
            :root {
                --bg-color: #1e1e1e;
                --panel-bg: #252525;
                --border-color: #444;
                --text-color: #e0e0e0;
                --accent-color: #4d94e7;
                --secondary-color: #555;
                --timeline-track: #2a2a2a;
                --keyframe-color: #ffcc00;
                --slider-color: #333;
                --button-hover: #2c2c2c;
            }
            
            body {
                background-color: var(--bg-color);
                color: var(--text-color);
                margin: 0;
                padding: 0;
                font-family: 'Segoe UI', Arial, sans-serif;
                overflow: hidden;
            }
            
            .panel-container {
                background-color: var(--panel-bg);
                border: 1px solid var(--border-color);
                border-radius: 4px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
                overflow: hidden;
                transition: all 0.3s ease;
            }
            
            #gui-container {
                position: absolute;
                top: 10px;
                right: 10px;
                max-height: 90vh;
                overflow-y: auto;
                width: 300px;
                z-index: 100;
                transition: transform 0.3s ease;
            }
            
            #timeline-container {
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                height: 180px;
                background-color: var(--panel-bg);
                border-top: 1px solid var(--border-color);
                z-index: 100;
                transition: transform 0.3s ease;
            }
            
            .button {
                background-color: var(--secondary-color);
                color: var(--text-color);
                border: none;
                border-radius: 4px;
                padding: 5px 10px;
                margin: 0 5px;
                cursor: pointer;
                transition: background-color 0.2s;
                outline: none;
            }
            
            .button:hover {
                background-color: var(--button-hover);
            }
            
            .button.primary {
                background-color: var(--accent-color);
            }
            
            .button.primary:hover {
                background-color: #3a7bca;
            }
            
            .ui-toggle-bar {
                position: fixed;
                top: 10px;
                left: 10px;
                background-color: var(--panel-bg);
                border: 1px solid var(--border-color);
                border-radius: 4px;
                padding: 5px;
                display: flex;
                gap: 5px;
                z-index: 1000;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            }
            
            .ui-toggle-button {
                width: 32px;
                height: 32px;
                background-color: transparent;
                border: 1px solid var(--border-color);
                border-radius: 4px;
                color: var(--text-color);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 16px;
                padding: 0;
                transition: all 0.2s;
            }
            
            .ui-toggle-button:hover {
                background-color: var(--button-hover);
            }
            
            .ui-toggle-button.active {
                background-color: var(--accent-color);
                color: white;
            }
            
            .timeline-ruler {
                background-color: #1a1a1a;
            }
            
            .timeline-tracks {
                background-color: #151515;
            }
            
            .timeline-track {
                background-color: var(--timeline-track);
            }
            
            .keyframe-marker {
                background-color: var(--keyframe-color);
                transition: transform 0.1s, box-shadow 0.1s;
            }
            
            .keyframe-marker:hover {
                transform: rotate(45deg) translateY(-50%) scale(1.2);
                box-shadow: 0 0 5px var(--keyframe-color);
            }
            
            .ruler-marker {
                background-color: #666;
            }
            
            .ruler-label {
                color: #aaa;
                font-size: 9px;
            }
            
            /* Responsive adjustments */
            @media (max-width: 1200px) {
                #gui-container {
                    width: 250px;
                }
                
                #timeline-container {
                    height: 150px;
                }
            }
            
            @media (max-width: 800px) {
                #gui-container {
                    transform: translateX(100%);
                }
                
                #gui-container.visible {
                    transform: translateX(0);
                }
                
                #timeline-container {
                    height: 120px;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    initializeUIToggleControls() {
        // Create a minimalistic toggle bar
        const toggleBar = document.createElement('div');
        toggleBar.id = 'ui-toggle-bar';
        toggleBar.className = 'ui-toggle-bar';
        toggleBar.innerHTML = `
            <button title="Toggle Timeline" class="ui-toggle-button timeline-toggle active">⏱️</button>
            <button title="Toggle Properties" class="ui-toggle-button properties-toggle active">🔧</button>
            <button title="Toggle Tools" class="ui-toggle-button toolbar-toggle active">🧰</button>
            <button title="Toggle Code Editor" class="ui-toggle-button code-editor-toggle">📝</button>
            <button title="Collapse All" class="ui-toggle-button collapse-all">◀</button>
        `;
        document.body.appendChild(toggleBar);
        
        // Add event listeners
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
                    timelineContainer.style.transform = 'translateY(0)';
                } else {
                    timelineContainer.style.transform = 'translateY(100%)';
                }
                break;
            case 'properties':
                this.uiState.propertiesVisible = !this.uiState.propertiesVisible;
                if (this.uiState.propertiesVisible) {
                    document.getElementById('gui-container').style.transform = 'translateX(0)';
                    this.propertiesPanel.show();
                } else {
                    document.getElementById('gui-container').style.transform = 'translateX(100%)';
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
        document.getElementById('timeline-container').style.transform = 
            newState ? 'translateY(0)' : 'translateY(100%)';
            
        document.getElementById('gui-container').style.transform = 
            newState ? 'translateX(0)' : 'translateX(100%)';
            
        if (newState) {
            this.propertiesPanel.show();
        } else {
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
        
        // Adjust GUI width
        if (width < 1000) {
            document.getElementById('gui-container').style.width = '250px';
            this.gui.width = 250;
        } else {
            document.getElementById('gui-container').style.width = '300px';
            this.gui.width = 300;
        }
        
        // Update timeline to fit new width
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