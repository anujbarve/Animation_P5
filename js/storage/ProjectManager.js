class ProjectManager {
    // Save the current project to a JSON file
    static saveProject(engine) {
        const projectData = {
            version: "1.0.0",
            timestamp: Date.now(),
            canvas: {
                width: engine.canvasWidth,
                height: engine.canvasHeight,
                backgroundColor: {
                    r: red(engine.backgroundColor),
                    g: green(engine.backgroundColor),
                    b: blue(engine.backgroundColor)
                },
                gridVisible: engine.gridVisible,
                gridSize: engine.gridSize
            },
            timeline: {
                fps: engine.timeline.fps,
                totalFrames: engine.timeline.totalFrames,
                currentFrame: engine.timeline.currentFrame,
                markers: engine.timeline.markers
            },
            objects: []
        };
        
        // Convert all objects to JSON
        engine.objects.forEach(obj => {
            projectData.objects.push(obj.toJSON());
        });
        
        // Convert to JSON string
        const jsonString = JSON.stringify(projectData, null, 2);
        
        // Create download
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `animation_project_${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    // Load a project from a JSON file
    static loadProject(engine, jsonData) {
        try {
            // Reset engine
            engine.objects = [];
            
            // Set canvas properties
            if (jsonData.canvas) {
                engine.canvasWidth = jsonData.canvas.width || 800;
                engine.canvasHeight = jsonData.canvas.height || 600;
                resizeCanvas(engine.canvasWidth, engine.canvasHeight);
                
                if (jsonData.canvas.backgroundColor) {
                    engine.backgroundColor = color(
                        jsonData.canvas.backgroundColor.r,
                        jsonData.canvas.backgroundColor.g,
                        jsonData.canvas.backgroundColor.b
                    );
                }
                
                engine.gridVisible = jsonData.canvas.gridVisible !== undefined ? jsonData.canvas.gridVisible : true;
                engine.gridSize = jsonData.canvas.gridSize || 20;
            }
            
            // Set timeline properties
            if (jsonData.timeline) {
                engine.timeline.fps = jsonData.timeline.fps || 24;
                engine.timeline.totalFrames = jsonData.timeline.totalFrames || 240;
                engine.timeline.currentFrame = jsonData.timeline.currentFrame || 0;
                
                // Load markers
                if (jsonData.timeline.markers && Array.isArray(jsonData.timeline.markers)) {
                    engine.timeline.markers = jsonData.timeline.markers;
                }
            }
            
            // Create objects
            if (jsonData.objects && Array.isArray(jsonData.objects)) {
                jsonData.objects.forEach(objData => {
                    const newObj = this.createObjectFromJSON(objData);
                    if (newObj) {
                        engine.objects.push(newObj);
                    }
                });
            }
            
            // Reset selection
            engine.selectedObject = null;
            
            // Update UI
            if (engine.uiManager) {
                engine.uiManager.propertiesPanel.updateForSelectedObject();
                engine.uiManager.timelinePanel.updateRulerMarkers();
            }
            
            return true;
        } catch (error) {
            console.error("Error loading project:", error);
            alert("Error loading project: " + error.message);
            return false;
        }
    }
    
    // Create an appropriate object based on the JSON data
    static createObjectFromJSON(objData) {
        let obj;
        
        switch(objData.type) {
            case 'Circle':
                obj = new Circle(objData.x, objData.y, objData.width);
                break;
                
            case 'Rectangle':
                obj = new Rectangle(objData.x, objData.y, objData.width, objData.height);
                if (objData.cornerRadius !== undefined) {
                    obj.cornerRadius = objData.cornerRadius;
                }
                break;
                
            case 'Path':
                obj = new Path(objData.x, objData.y);
                if (objData.points && Array.isArray(objData.points)) {
                    obj.points = objData.points;
                }
                obj.closed = objData.closed !== undefined ? objData.closed : false;
                break;
                
            case 'Text':
                obj = new Text(objData.x, objData.y, objData.text);
                if (objData.fontSize !== undefined) obj.fontSize = objData.fontSize;
                if (objData.fontFamily !== undefined) obj.fontFamily = objData.fontFamily;
                if (objData.textAlign !== undefined) obj.textAlign = objData.textAlign;
                if (objData.textStyle !== undefined) obj.textStyle = objData.textStyle;
                break;
                
            default:
                console.warn("Unknown object type:", objData.type);
                return null;
        }
        
        // Set common properties
        if (objData.name !== undefined) obj.name = objData.name;
        if (objData.rotation !== undefined) obj.rotation = objData.rotation;
        if (objData.visible !== undefined) obj.visible = objData.visible;
        if (objData.opacity !== undefined) obj.opacity = objData.opacity;
        if (objData.strokeWeight !== undefined) obj.strokeWeight = objData.strokeWeight;
        
        // Set fill and stroke colors
        if (objData.fill) {
            obj.fill = color(
                objData.fill.r,
                objData.fill.g,
                objData.fill.b,
                objData.fill.a || 255
            );
        }
        
        if (objData.stroke) {
            obj.stroke = color(
                objData.stroke.r,
                objData.stroke.g,
                objData.stroke.b,
                objData.stroke.a || 255
            );
        }
        
        // Load keyframes
        if (objData.keyframes) {
            obj.keyframes = objData.keyframes;
        }
        
        return obj;
    }
    
    // Show a file picker and load the selected project
    static promptLoadProject(engine) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = e => {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = event => {
                try {
                    const jsonData = JSON.parse(event.target.result);
                    this.loadProject(engine, jsonData);
                } catch (error) {
                    console.error("Error parsing project file:", error);
                    alert("Error loading project: Invalid file format");
                }
            };
            reader.readAsText(file);
        };
        
        input.click();
    }
}