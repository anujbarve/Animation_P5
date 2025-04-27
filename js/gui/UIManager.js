class UIManager {
<<<<<<< HEAD
  constructor(engine) {
    this.engine = engine;
    this.gui = null;
    this.toolbarPanel = null;
    this.keyframeManager = new KeyframeManager();

    this.isDragging = false;
    this.dragTarget = null;
    this.dragOffset = { x: 0, y: 0 };

    this.copyBuffer = null;
  }

  // In UIManager.js
  initialize() {
    // We still need the dat.GUI for property editing
    this.gui = new dat.GUI({ autoPlace: false, width: 300 });
    this.gui.domElement.style.display = "none"; // Hide by default
    document.body.appendChild(this.gui.domElement);

    // Initialize panel components
    this.toolbarPanel = new ToolbarPanel(this.engine, this.gui);

    // Initialize each panel
    this.toolbarPanel.initialize();

    // Set up integration with VS Code UI
    this.setupVSCodeUIIntegration();

    // Setup input event handlers
    this.setupEventListeners();
  }

  setupVSCodeUIIntegration() {
    // Add the GUI to the properties panel in VS Code UI
    if (vsCodeUI && vsCodeUI.panels && vsCodeUI.panels["properties-panel"]) {
      const propertiesContent =
        vsCodeUI.panels["properties-panel"].querySelector(".panel-content");
      if (propertiesContent) {
        propertiesContent.appendChild(this.gui.domElement);
        this.gui.domElement.style.display = "block";

        // Make the GUI fit the panel
        this.gui.width = propertiesContent.offsetWidth - 20;
      }
    }
  }

  setupEventListeners() {
    // Mouse pressed event
    window.mousePressed = () => {
      // Only handle events in canvas
      if (
        mouseX < 0 ||
        mouseX > this.engine.canvasWidth ||
        mouseY < 0 ||
        mouseY > this.engine.canvasHeight
      ) {
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
      if (keyCode === 32) {
        // Spacebar
        if (this.engine.isPlaying) {
          this.engine.pause();
        } else {
          this.engine.play();
        }
        return false; // Prevent scrolling
      }
    };
  }

  update() {
    // Update panels
    this.toolbarPanel.update();
  }

  // Helper method to create shapes
  createShape(type, x, y) {
    let shape;

    switch (type) {
      case "circle":
        shape = new Circle(x, y, 100);
        break;
      case "rectangle":
        shape = new Rectangle(x, y, 100, 80);
        break;
      case "path":
        shape = new Path(x, y);
        // Add some default points
        shape.addPoint(-50, -50);
        shape.addPoint(50, -50);
        shape.addPoint(0, 50);
        shape.closed = true;
        break;
      case "text":
        shape = new Text(x, y, "Text");
        break;
      default:
        console.error("Unknown shape type:", type);
        return null;
    }

    return this.engine.addObject(shape);
  }
}
=======
    constructor(engine) {
        this.engine = engine;
        this.gui = null;
        this.timelinePanel = null;
        this.propertiesPanel = null;
        this.toolbarPanel = null;
        this.keyframeManager = new KeyframeManager();
        
        this.isDragging = false;
        this.dragTarget = null;
        this.dragOffset = { x: 0, y: 0 };
        
        this.copyBuffer = null;
    }
    
    initialize() {
        this.gui = new dat.GUI({ autoPlace: false, width: 300 });
        
        // Place the GUI in a custom container
        const guiContainer = document.createElement('div');
        guiContainer.id = 'gui-container';
        guiContainer.style.position = 'absolute';
        guiContainer.style.top = '10px';
        guiContainer.style.right = '10px';
        guiContainer.style.maxHeight = '90vh';
        guiContainer.style.overflowY = 'auto';
        document.body.appendChild(guiContainer);
        guiContainer.appendChild(this.gui.domElement);
        
        // Add responsive handling
        window.addEventListener('resize', () => {
            // Adjust GUI width on small screens
            if (window.innerWidth < 1000) {
                guiContainer.style.width = '250px';
                this.gui.width = 250;
            } else {
                guiContainer.style.width = '300px';
                this.gui.width = 300;
            }
        });
        
        // Initialize panel components
        this.timelinePanel = new TimelinePanel(this.engine, this.keyframeManager);
        this.propertiesPanel = new PropertiesPanel(this.engine, this.gui, this.keyframeManager);
        this.toolbarPanel = new ToolbarPanel(this.engine, this.gui);
        
        // Initialize each panel
        this.timelinePanel.initialize();
        this.propertiesPanel.initialize();
        this.toolbarPanel.initialize();
        
        // Setup input event handlers
        this.setupEventListeners();
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
        };
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
>>>>>>> parent of 4885e6c (vscode style UI)
