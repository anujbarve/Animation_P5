class PropertiesPanel {
    constructor(engine, gui, keyframeManager) {
        this.engine = engine;
        this.gui = gui;
        this.keyframeManager = keyframeManager;
        
        // GUI folders
        this.shapeFolder = null;
        this.styleFolder = null;
        this.animationFolder = null;
        
        // GUI controllers
        this.controllers = {
            shape: {},
            style: {},
            animation: {}
        };
    }
    
    initialize() {
        // Create folders
        this.shapeFolder = this.gui.addFolder('Shape Properties');
        this.styleFolder = this.gui.addFolder('Style Properties');
        this.animationFolder = this.gui.addFolder('Animation');
        
        // Open folders by default
        this.shapeFolder.open();
        this.styleFolder.open();
        this.animationFolder.open();
        
        // Add empty message when no object is selected
        this.updateForSelectedObject();
    }
    
    update() {
        // Check if selected object changed
        if (this.lastSelectedObject !== this.engine.selectedObject) {
            this.updateForSelectedObject();
        }
        
        // Update controllers if needed
        this.updateControllers();
    }
    
    updateForSelectedObject() {
        // Store reference to currently selected object
        this.lastSelectedObject = this.engine.selectedObject;
        
        // Clear existing controllers
        this.clearControllers();
        
        // If no object selected, show message
        if (!this.engine.selectedObject) {
            const noSelectionMsg = document.createElement('div');
            noSelectionMsg.innerHTML = 'No object selected';
            noSelectionMsg.style.padding = '10px';
            noSelectionMsg.style.color = '#aaa';
            
            this.shapeFolder.domElement.appendChild(noSelectionMsg);
            return;
        }
        
        // Add appropriate controllers for the selected object type
        this.addShapeControllers();
        this.addStyleControllers();
        this.addAnimationControllers();
    }
    
    clearControllers() {
        // Clear shape controllers
        for (const key in this.controllers.shape) {
            this.shapeFolder.remove(this.controllers.shape[key]);
        }
        this.controllers.shape = {};
        
        // Clear style controllers
        for (const key in this.controllers.style) {
            this.styleFolder.remove(this.controllers.style[key]);
        }
        this.controllers.style = {};
        
        // Clear animation controllers
        for (const key in this.controllers.animation) {
            this.animationFolder.remove(this.controllers.animation[key]);
        }
        this.controllers.animation = {};
    }
    
    addShapeControllers() {
        const obj = this.engine.selectedObject;
        
        // Common properties for all shapes
        this.controllers.shape.name = this.shapeFolder.add(obj, 'name');
        
        this.controllers.shape.x = this.shapeFolder.add(obj, 'x', 0, this.engine.canvasWidth);
        this.controllers.shape.y = this.shapeFolder.add(obj, 'y', 0, this.engine.canvasHeight);
        this.controllers.shape.rotation = this.shapeFolder.add(obj, 'rotation', 0, 360);
        
        // Shape-specific properties
        if (obj instanceof Circle) {
            this.controllers.shape.width = this.shapeFolder.add(obj, 'width', 1, 500).name('diameter');
        } 
        else if (obj instanceof Rectangle) {
            this.controllers.shape.width = this.shapeFolder.add(obj, 'width', 1, 500);
            this.controllers.shape.height = this.shapeFolder.add(obj, 'height', 1, 500);
            this.controllers.shape.cornerRadius = this.shapeFolder.add(obj, 'cornerRadius', 0, 100);
        } 
        else if (obj instanceof Text) {
            this.controllers.shape.text = this.shapeFolder.add(obj, 'text');
            this.controllers.shape.fontSize = this.shapeFolder.add(obj, 'fontSize', 8, 72);
            this.controllers.shape.fontFamily = this.shapeFolder.add(obj, 'fontFamily', [
                'Arial', 'Verdana', 'Helvetica', 'Times New Roman', 'Courier New', 'Georgia'
            ]);
            this.controllers.shape.textAlign = this.shapeFolder.add(obj, 'textAlign', [
                'left', 'center', 'right'
            ]);
            this.controllers.shape.textStyle = this.shapeFolder.add(obj, 'textStyle', [
                'normal', 'italic', 'bold'
            ]);
        }
        else if (obj instanceof Path) {
            this.controllers.shape.closed = this.shapeFolder.add(obj, 'closed');
            
            // Add button to edit points
            const editPointsButton = {
                editPoints: () => {
                    alert('Point editing not implemented in this demo');
                    // In a full implementation, this would open a point editor
                }
            };
            this.controllers.shape.editPoints = this.shapeFolder.add(editPointsButton, 'editPoints').name('Edit Points');
        }
        
        // Add keyframe buttons to all numeric properties
        this.addKeyframeButtonsToFolder(this.shapeFolder, this.controllers.shape);
    }
    
    addStyleControllers() {
        const obj = this.engine.selectedObject;
        
        // Add color controllers using dat.GUI's addColor method
        const fillColorObj = {
            fillColor: [
                red(obj.fill), 
                green(obj.fill), 
                blue(obj.fill)
            ]
        };
        
        const strokeColorObj = {
            strokeColor: [
                red(obj.stroke), 
                green(obj.stroke), 
                blue(obj.stroke)
            ]
        };
        
        this.controllers.style.fillColor = this.styleFolder.addColor(fillColorObj, 'fillColor').onChange((value) => {
            obj.fill = color(value[0], value[1], value[2], alpha(obj.fill));
        });
        
        this.controllers.style.strokeColor = this.styleFolder.addColor(strokeColorObj, 'strokeColor').onChange((value) => {
            obj.stroke = color(value[0], value[1], value[2], alpha(obj.stroke));
        });
        
        this.controllers.style.opacity = this.styleFolder.add(obj, 'opacity', 0, 255);
        this.controllers.style.strokeWeight = this.styleFolder.add(obj, 'strokeWeight', 0, 20);
        this.controllers.style.visible = this.styleFolder.add(obj, 'visible');
        
        // Add keyframe buttons to numeric properties
        this.addKeyframeButtonsToFolder(this.styleFolder, this.controllers.style);
    }
    
    addAnimationControllers() {
        const obj = this.engine.selectedObject;
        
        // Add current keyframes information
        const keyframesCount = this.getKeyframesCount(obj);
        
        const keyframesInfo = { message: `This object has ${keyframesCount} keyframes` };
        this.controllers.animation.info = this.animationFolder.add(keyframesInfo, 'message').name('Keyframes').listen();
        
        // Add buttons for common animation actions
        const animationActions = {
            addKeyframe: () => {
                const property = prompt('Enter property name to keyframe:', 'x');
                if (property && obj.hasOwnProperty(property)) {
                    this.keyframeManager.createKeyframeForCurrentSelection(this.engine, property);
                }
            },
            removeAllKeyframes: () => {
                if (confirm('Remove all keyframes for this object?')) {
                    for (const prop in obj.keyframes) {
                        delete obj.keyframes[prop];
                    }
                }
            },
            editEasing: () => {
                const easingTypes = EasingFunctions.getAllEasingNames();
                const easingType = prompt('Select easing type:\n' + easingTypes.join('\n'), 'easeInOutCubic');
                
                if (easingType && easingTypes.includes(easingType)) {
                    const property = prompt('Enter property name to apply easing:', 'x');
                    if (property && obj.keyframes[property]) {
                        const frame = parseInt(prompt('Enter keyframe frame number:', this.engine.timeline.currentFrame));
                        
                        // Find the keyframe
                        const keyframeIndex = obj.keyframes[property].findIndex(kf => kf.frame === frame);
                        if (keyframeIndex !== -1) {
                            obj.keyframes[property][keyframeIndex].easing = easingType;
                        }
                    }
                }
            }
        };
        
        this.controllers.animation.addKeyframe = this.animationFolder.add(animationActions, 'addKeyframe').name('Add Keyframe');
        this.controllers.animation.removeKeyframes = this.animationFolder.add(animationActions, 'removeAllKeyframes').name('Remove All');
        this.controllers.animation.editEasing = this.animationFolder.add(animationActions, 'editEasing').name('Edit Easing');
    }
    
    addKeyframeButtonsToFolder(folder, controllers) {
        // For each controller, add a keyframe button next to it
        for (const propName in controllers) {
            const controller = controllers[propName];
            
            // Only add keyframe buttons to numeric properties
            if (typeof this.engine.selectedObject[propName] === 'number') {
                const keyframeButton = document.createElement('button');
                keyframeButton.innerHTML = '⬤';
                keyframeButton.title = 'Add keyframe';
                keyframeButton.className = 'keyframe-button';
                keyframeButton.style.marginLeft = '5px';
                keyframeButton.style.background = 'none';
                keyframeButton.style.border = 'none';
                keyframeButton.style.color = '#ffcc00';
                keyframeButton.style.cursor = 'pointer';
                keyframeButton.style.fontSize = '12px';
                keyframeButton.style.opacity = '0.5';
                
                // Store the property name directly on the button
                keyframeButton.dataset.property = propName;
                
                // Update button appearance if there's a keyframe at current frame
                this.updateKeyframeButtonState(keyframeButton, propName);
                
                // Add click handler
                keyframeButton.addEventListener('click', () => {
                    const obj = this.engine.selectedObject;
                    const property = propName;
                    const currentFrame = this.engine.timeline.currentFrame;
                    
                    if (this.keyframeManager.hasKeyframeAt(obj, property, currentFrame)) {
                        // Remove keyframe if it exists
                        this.keyframeManager.removeKeyframeForCurrentSelection(this.engine, property);
                        keyframeButton.style.opacity = '0.5';
                    } else {
                        // Add keyframe
                        this.keyframeManager.createKeyframeForCurrentSelection(this.engine, property);
                        keyframeButton.style.opacity = '1';
                    }
                });
                
                // Add button next to the controller
                const controllerElement = controller.__li;
                controllerElement.style.position = 'relative';
                controllerElement.appendChild(keyframeButton);
            }
        }
    }
    
    updateKeyframeButtonState(button, property) {
        const obj = this.engine.selectedObject;
        if (!obj) return;
        
        const currentFrame = this.engine.timeline.currentFrame;
        const hasKeyframe = this.keyframeManager.hasKeyframeAt(obj, property, currentFrame);
        
        button.style.opacity = hasKeyframe ? '1' : '0.5';
    }
    
    updateControllers() {
        // Update all keyframe buttons
        if (this.engine.selectedObject) {
            const keyframeButtons = document.querySelectorAll('.keyframe-button');
            keyframeButtons.forEach(button => {
                const property = button.dataset.property;
                if (property) {
                    this.updateKeyframeButtonState(button, property);
                }
            });
            
            // Update keyframes count
            if (this.controllers.animation.info) {
                const keyframesCount = this.getKeyframesCount(this.engine.selectedObject);
                this.controllers.animation.info.object.message = `This object has ${keyframesCount} keyframes`;
            }
        }
    }
    
    getKeyframesCount(obj) {
        let count = 0;
        for (const prop in obj.keyframes) {
            count += obj.keyframes[prop].length;
        }
        return count;
    }
}