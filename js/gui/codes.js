class DemoCodes {
  ring() {
    const colors = {
      skyBlue: [135, 206, 235],
      coral: [255, 127, 80],
      limeGreen: [50, 205, 50],
      goldenRod: [218, 165, 32],
      orchid: [218, 112, 214],
      slateGray: [112, 128, 144],
      tomato: [255, 99, 71],
      steelBlue: [70, 130, 180],
      mediumPurple: [147, 112, 219],
      seaGreen: [46, 139, 87],
      deepPink: [255, 20, 147],
      turquoise: [64, 224, 208],
      fireBrick: [178, 34, 34],
      darkOrange: [255, 140, 0],
      lightSlateGray: [119, 136, 153],
    };

    this.animation.clearAll();
    this.animation.setDuration(10);
    this.animation.setFPS(60);
    this.engine.setCanvasSize(1900, 1000);

    const n0 = this.animation.createShape("circle", {
      x: 200,
      y: 400,
      size: 80,
      fill: colors.goldenRod, // Highlight node
      name: "node 0",
    });

    const n1 = this.animation.createShape("circle", {
      x: 400,
      y: 400,
      size: 80,
      fill: colors.steelBlue,
      name: "node 1",
    });

    const n2 = this.animation.createShape("circle", {
      x: 600,
      y: 400,
      size: 80,
      fill: colors.steelBlue,
      name: "node 2",
    });

    const n3 = this.animation.createShape("circle", {
      x: 800,
      y: 400,
      size: 80,
      fill: colors.steelBlue,
      name: "node 3",
    });

    const n4 = this.animation.createShape("circle", {
      x: 800,
      y: 200,
      size: 80,
      fill: colors.steelBlue,
      name: "node 4",
    });

    const n5 = this.animation.createShape("circle", {
      x: 600,
      y: 200,
      size: 80,
      fill: colors.steelBlue,
      name: "node 5",
    });

    const n6 = this.animation.createShape("circle", {
      x: 400,
      y: 200,
      size: 80,
      fill: colors.steelBlue,
      name: "node 6",
    });

    const n7 = this.animation.createShape("circle", {
      x: 200,
      y: 200,
      size: 80,
      fill: colors.steelBlue,
      name: "node 7",
    });

    const fp1 = this.animation.createShape("flowpath", {
      startShape: n0,
      endShape: n1,
      startConnection: "right",
      endConnection: "left",
      pathStyle: "bezier",
      curveIntensity: 0,
      arrowEnd: false,
      arrowSize: 8,
      stroke: colors.steelBlue,
      strokeWeight: 2,
      flowParticles: 8, // Add flowing particles
      particleSize: 6, // Size of particles
      fill: colors.steelBlue, // Particle color
      animationSpeed: 2, // Speed of flow
    });

    const fp2 = this.animation.createShape("flowpath", {
      startShape: n1,
      endShape: n2,
      startConnection: "right",
      endConnection: "left",
      pathStyle: "bezier",
      curveIntensity: 0,
      arrowEnd: false,
      arrowSize: 8,
      stroke: colors.steelBlue,
      strokeWeight: 2,
      flowParticles: 8, // Add flowing particles
      particleSize: 6, // Size of particles
      fill: colors.steelBlue, // Particle color
      animationSpeed: 2, // Speed of flow
    });

    const fp3 = this.animation.createShape("flowpath", {
      startShape: n2,
      endShape: n3,
      startConnection: "right",
      endConnection: "left",
      pathStyle: "bezier",
      curveIntensity: 0,
      arrowEnd: false,
      arrowSize: 8,
      stroke: colors.steelBlue,
      strokeWeight: 2,
      flowParticles: 8, // Add flowing particles
      particleSize: 6, // Size of particles
      fill: colors.steelBlue, // Particle color
      animationSpeed: 2, // Speed of flow
    });

    const fp4 = this.animation.createShape("flowpath", {
      startShape: n3,
      endShape: n4,
      startConnection: "top",
      endConnection: "bottom",
      pathStyle: "bezier",
      curveIntensity: 0,
      arrowEnd: false,
      arrowSize: 8,
      stroke: colors.steelBlue,
      strokeWeight: 2,
      flowParticles: 8, // Add flowing particles
      particleSize: 6, // Size of particles
      fill: colors.steelBlue, // Particle color
      animationSpeed: 2, // Speed of flow
    });

    const fp5 = this.animation.createShape("flowpath", {
      startShape: n4,
      endShape: n5,
      startConnection: "left",
      endConnection: "right",
      pathStyle: "bezier",
      curveIntensity: 0,
      arrowEnd: false,
      arrowSize: 8,
      stroke: colors.steelBlue,
      strokeWeight: 2,
      flowParticles: 8, // Add flowing particles
      particleSize: 6, // Size of particles
      fill: colors.steelBlue, // Particle color
      animationSpeed: 2, // Speed of flow
    });

    const fp6 = this.animation.createShape("flowpath", {
      startShape: n5,
      endShape: n6,
      startConnection: "left",
      endConnection: "right",
      pathStyle: "bezier",
      curveIntensity: 0,
      arrowEnd: false,
      arrowSize: 8,
      stroke: colors.steelBlue,
      strokeWeight: 2,
      flowParticles: 8, // Add flowing particles
      particleSize: 6, // Size of particles
      fill: colors.steelBlue, // Particle color
      animationSpeed: 2, // Speed of flow
    });

    const fp7 = this.animation.createShape("flowpath", {
      startShape: n6,
      endShape: n7,
      startConnection: "left",
      endConnection: "right",
      pathStyle: "bezier",
      curveIntensity: 0,
      arrowEnd: false,
      arrowSize: 8,
      stroke: colors.steelBlue,
      strokeWeight: 2,
      flowParticles: 8, // Add flowing particles
      particleSize: 6, // Size of particles
      fill: colors.steelBlue, // Particle color
      animationSpeed: 2, // Speed of flow
    });

    const fp8 = this.animation.createShape("flowpath", {
      startShape: n7,
      endShape: n0,
      startConnection: "bottom",
      endConnection: "top",
      pathStyle: "bezier",
      curveIntensity: 0,
      arrowEnd: false,
      arrowSize: 8,
      stroke: colors.steelBlue,
      strokeWeight: 2,
      flowParticles: 8, // Add flowing particles
      particleSize: 6, // Size of particles
      fill: colors.steelBlue, // Particle color
      animationSpeed: 2, // Speed of flow
    });
  }

  ringOptimized() {
    const colors = {
      skyBlue: [135, 206, 235],
      coral: [255, 127, 80],
      limeGreen: [50, 205, 50],
      goldenRod: [218, 165, 32],
      orchid: [218, 112, 214],
      slateGray: [112, 128, 144],
      tomato: [255, 99, 71],
      steelBlue: [70, 130, 180],
      mediumPurple: [147, 112, 219],
      seaGreen: [46, 139, 87],
      deepPink: [255, 20, 147],
      turquoise: [64, 224, 208],
      fireBrick: [178, 34, 34],
      darkOrange: [255, 140, 0],
      lightSlateGray: [119, 136, 153],
    };

    this.animation.clearAll();
    this.animation.setDuration(10);
    this.animation.setFPS(60);
    this.engine.setCanvasSize(1900, 1000);

    // Node positions and names
    const nodeData = [
      { x: 200, y: 400, name: "node 0", fill: colors.goldenRod }, // highlighted
      { x: 400, y: 400, name: "node 1", fill: colors.steelBlue },
      { x: 600, y: 400, name: "node 2", fill: colors.steelBlue },
      { x: 800, y: 400, name: "node 3", fill: colors.steelBlue },
      { x: 800, y: 200, name: "node 4", fill: colors.steelBlue },
      { x: 600, y: 200, name: "node 5", fill: colors.steelBlue },
      { x: 400, y: 200, name: "node 6", fill: colors.steelBlue },
      { x: 200, y: 200, name: "node 7", fill: colors.steelBlue },
    ];

    // Create all nodes dynamically
    const nodes = nodeData.map((data) =>
      this.animation.createShape("circle", {
        x: data.x,
        y: data.y,
        size: 80,
        fill: data.fill,
        name: data.name,
      })
    );

    // Common flowpath config
    const flowConfig = {
      pathStyle: "bezier",
      curveIntensity: 0,
      arrowEnd: false,
      arrowSize: 8,
      stroke: colors.steelBlue,
      strokeWeight: 2,
      flowParticles: 8,
      particleSize: 6,
      fill: colors.steelBlue,
      animationSpeed: 2,
    };

    // Define connections between nodes
    const flowPathsData = [
      { from: 0, to: 1, start: "right", end: "left" },
      { from: 1, to: 2, start: "right", end: "left" },
      { from: 2, to: 3, start: "right", end: "left" },
      { from: 3, to: 4, start: "top", end: "bottom" },
      { from: 4, to: 5, start: "left", end: "right" },
      { from: 5, to: 6, start: "left", end: "right" },
      { from: 6, to: 7, start: "left", end: "right" },
      { from: 7, to: 0, start: "bottom", end: "top" },
    ];

    // Create flowpaths dynamically
    flowPathsData.forEach((fp) => {
      this.animation.createShape("flowpath", {
        startShape: nodes[fp.from],
        endShape: nodes[fp.to],
        startConnection: fp.start,
        endConnection: fp.end,
        ...flowConfig,
      });
    });
  }

  mesh() {
    const colors = {
      skyBlue: [135, 206, 235],
      coral: [255, 127, 80],
      limeGreen: [50, 205, 50],
      goldenRod: [218, 165, 32],
      orchid: [218, 112, 214],
      slateGray: [112, 128, 144],
      tomato: [255, 99, 71],
      steelBlue: [70, 130, 180],
      mediumPurple: [147, 112, 219],
      seaGreen: [46, 139, 87],
      deepPink: [255, 20, 147],
      turquoise: [64, 224, 208],
      fireBrick: [178, 34, 34],
      darkOrange: [255, 140, 0],
      lightSlateGray: [119, 136, 153],
    };

    this.animation.clearAll();
    this.animation.setDuration(10);
    this.animation.setFPS(60);
    this.engine.setCanvasSize(1900, 1000);

    const n03 = this.animation.createShape("circle", {
      x: 100,
      y: 100,
      size: 80,
      fill: colors.steelBlue, // Highlight node
      name: "node 3",
    });

    const n07 = this.animation.createShape("circle", {
      x: 300,
      y: 100,
      size: 80,
      fill: colors.steelBlue,
      name: "node 7",
    });

    const n11 = this.animation.createShape("circle", {
      x: 500,
      y: 100,
      size: 80,
      fill: colors.steelBlue,
      name: "node 11",
    });

    const n15 = this.animation.createShape("circle", {
      x: 700,
      y: 100,
      size: 80,
      fill: colors.steelBlue,
      name: "node 15",
    });

    const n02 = this.animation.createShape("circle", {
      x: 100,
      y: 300,
      size: 80,
      fill: colors.steelBlue, // Highlight node
      name: "node 2",
    });

    const n06 = this.animation.createShape("circle", {
      x: 300,
      y: 300,
      size: 80,
      fill: colors.steelBlue,
      name: "node 6",
    });

    const n10 = this.animation.createShape("circle", {
      x: 500,
      y: 300,
      size: 80,
      fill: colors.steelBlue,
      name: "node 10",
    });

    const n14 = this.animation.createShape("circle", {
      x: 700,
      y: 300,
      size: 80,
      fill: colors.steelBlue,
      name: "node 14",
    });

    const n01 = this.animation.createShape("circle", {
      x: 100,
      y: 500,
      size: 80,
      fill: colors.steelBlue, // Highlight node
      name: "node 1",
    });

    const n05 = this.animation.createShape("circle", {
      x: 300,
      y: 500,
      size: 80,
      fill: colors.steelBlue,
      name: "node 5",
    });

    const n09 = this.animation.createShape("circle", {
      x: 500,
      y: 500,
      size: 80,
      fill: colors.steelBlue,
      name: "node 9",
    });

    const n13 = this.animation.createShape("circle", {
      x: 700,
      y: 500,
      size: 80,
      fill: colors.steelBlue,
      name: "node 13",
    });

    const n00 = this.animation.createShape("circle", {
      x: 100,
      y: 700,
      size: 80,
      fill: colors.goldenRod, // Highlight node
      name: "node 0",
    });

    const n04 = this.animation.createShape("circle", {
      x: 300,
      y: 700,
      size: 80,
      fill: colors.steelBlue,
      name: "node 4",
    });

    const n08 = this.animation.createShape("circle", {
      x: 500,
      y: 700,
      size: 80,
      fill: colors.steelBlue,
      name: "node 8",
    });

    const n12 = this.animation.createShape("circle", {
      x: 700,
      y: 700,
      size: 80,
      fill: colors.steelBlue,
      name: "node 12",
    });

    const fp1 = this.animation.createShape("flowpath", {
      startShape: n00,
      endShape: n04,
      startConnection: "right",
      endConnection: "left",
      pathStyle: "bezier",
      curveIntensity: 0,
      arrowEnd: false,
      arrowSize: 8,
      stroke: colors.steelBlue,
      strokeWeight: 2,
      flowParticles: 8, // Add flowing particles
      particleSize: 6, // Size of particles
      fill: colors.steelBlue, // Particle color
      animationSpeed: 2, // Speed of flow
    });

    const fp2 = this.animation.createShape("flowpath", {
      startShape: n04,
      endShape: n08,
      startConnection: "right",
      endConnection: "left",
      pathStyle: "bezier",
      curveIntensity: 0,
      arrowEnd: false,
      arrowSize: 8,
      stroke: colors.steelBlue,
      strokeWeight: 2,
      flowParticles: 8, // Add flowing particles
      particleSize: 6, // Size of particles
      fill: colors.steelBlue, // Particle color
      animationSpeed: 2, // Speed of flow
    });

    const fp3 = this.animation.createShape("flowpath", {
      startShape: n08,
      endShape: n12,
      startConnection: "right",
      endConnection: "left",
      pathStyle: "bezier",
      curveIntensity: 0,
      arrowEnd: false,
      arrowSize: 8,
      stroke: colors.steelBlue,
      strokeWeight: 2,
      flowParticles: 8, // Add flowing particles
      particleSize: 6, // Size of particles
      fill: colors.steelBlue, // Particle color
      animationSpeed: 2, // Speed of flow
    });

    const fp4 = this.animation.createShape("flowpath", {
      startShape: n00,
      endShape: n01,
      startConnection: "top",
      endConnection: "bottom",
      pathStyle: "bezier",
      curveIntensity: 0,
      arrowEnd: false,
      arrowSize: 8,
      stroke: colors.steelBlue,
      strokeWeight: 2,
      flowParticles: 8, // Add flowing particles
      particleSize: 6, // Size of particles
      fill: colors.steelBlue, // Particle color
      animationSpeed: 2, // Speed of flow
    });

    const fp5 = this.animation.createShape("flowpath", {
      startShape: n01,
      endShape: n02,
      startConnection: "top",
      endConnection: "bottom",
      pathStyle: "bezier",
      curveIntensity: 0,
      arrowEnd: false,
      arrowSize: 8,
      stroke: colors.steelBlue,
      strokeWeight: 2,
      flowParticles: 8, // Add flowing particles
      particleSize: 6, // Size of particles
      fill: colors.steelBlue, // Particle color
      animationSpeed: 2, // Speed of flow
    });

    const fp6 = this.animation.createShape("flowpath", {
      startShape: n02,
      endShape: n03,
      startConnection: "top",
      endConnection: "bottom",
      pathStyle: "bezier",
      curveIntensity: 0,
      arrowEnd: false,
      arrowSize: 8,
      stroke: colors.steelBlue,
      strokeWeight: 2,
      flowParticles: 8, // Add flowing particles
      particleSize: 6, // Size of particles
      fill: colors.steelBlue, // Particle color
      animationSpeed: 2, // Speed of flow
    });

    const fp7 = this.animation.createShape("flowpath", {
      startShape: n04,
      endShape: n05,
      startConnection: "top",
      endConnection: "bottom",
      pathStyle: "bezier",
      curveIntensity: 0,
      arrowEnd: false,
      arrowSize: 8,
      stroke: colors.steelBlue,
      strokeWeight: 2,
      flowParticles: 8, // Add flowing particles
      particleSize: 6, // Size of particles
      fill: colors.steelBlue, // Particle color
      animationSpeed: 2, // Speed of flow
    });

    const fp8 = this.animation.createShape("flowpath", {
      startShape: n05,
      endShape: n06,
      startConnection: "top",
      endConnection: "bottom",
      pathStyle: "bezier",
      curveIntensity: 0,
      arrowEnd: false,
      arrowSize: 8,
      stroke: colors.steelBlue,
      strokeWeight: 2,
      flowParticles: 8, // Add flowing particles
      particleSize: 6, // Size of particles
      fill: colors.steelBlue, // Particle color
      animationSpeed: 2, // Speed of flow
    });

    const fp9 = this.animation.createShape("flowpath", {
      startShape: n06,
      endShape: n07,
      startConnection: "top",
      endConnection: "bottom",
      pathStyle: "bezier",
      curveIntensity: 0,
      arrowEnd: false,
      arrowSize: 8,
      stroke: colors.steelBlue,
      strokeWeight: 2,
      flowParticles: 8, // Add flowing particles
      particleSize: 6, // Size of particles
      fill: colors.steelBlue, // Particle color
      animationSpeed: 2, // Speed of flow
    });

    const fp10 = this.animation.createShape("flowpath", {
      startShape: n08,
      endShape: n09,
      startConnection: "top",
      endConnection: "bottom",
      pathStyle: "bezier",
      curveIntensity: 0,
      arrowEnd: false,
      arrowSize: 8,
      stroke: colors.steelBlue,
      strokeWeight: 2,
      flowParticles: 8, // Add flowing particles
      particleSize: 6, // Size of particles
      fill: colors.steelBlue, // Particle color
      animationSpeed: 2, // Speed of flow
    });

    const fp11 = this.animation.createShape("flowpath", {
      startShape: n09,
      endShape: n10,
      startConnection: "top",
      endConnection: "bottom",
      pathStyle: "bezier",
      curveIntensity: 0,
      arrowEnd: false,
      arrowSize: 8,
      stroke: colors.steelBlue,
      strokeWeight: 2,
      flowParticles: 8, // Add flowing particles
      particleSize: 6, // Size of particles
      fill: colors.steelBlue, // Particle color
      animationSpeed: 2, // Speed of flow
    });

    const fp12 = this.animation.createShape("flowpath", {
      startShape: n10,
      endShape: n11,
      startConnection: "top",
      endConnection: "bottom",
      pathStyle: "bezier",
      curveIntensity: 0,
      arrowEnd: false,
      arrowSize: 8,
      stroke: colors.steelBlue,
      strokeWeight: 2,
      flowParticles: 8, // Add flowing particles
      particleSize: 6, // Size of particles
      fill: colors.steelBlue, // Particle color
      animationSpeed: 2, // Speed of flow
    });

    const fp13 = this.animation.createShape("flowpath", {
      startShape: n12,
      endShape: n13,
      startConnection: "top",
      endConnection: "bottom",
      pathStyle: "bezier",
      curveIntensity: 0,
      arrowEnd: false,
      arrowSize: 8,
      stroke: colors.steelBlue,
      strokeWeight: 2,
      flowParticles: 8, // Add flowing particles
      particleSize: 6, // Size of particles
      fill: colors.steelBlue, // Particle color
      animationSpeed: 2, // Speed of flow
    });

    const fp14 = this.animation.createShape("flowpath", {
      startShape: n13,
      endShape: n14,
      startConnection: "top",
      endConnection: "bottom",
      pathStyle: "bezier",
      curveIntensity: 0,
      arrowEnd: false,
      arrowSize: 8,
      stroke: colors.steelBlue,
      strokeWeight: 2,
      flowParticles: 8, // Add flowing particles
      particleSize: 6, // Size of particles
      fill: colors.steelBlue, // Particle color
      animationSpeed: 2, // Speed of flow
    });

    const fp15 = this.animation.createShape("flowpath", {
      startShape: n14,
      endShape: n15,
      startConnection: "top",
      endConnection: "bottom",
      pathStyle: "bezier",
      curveIntensity: 0,
      arrowEnd: false,
      arrowSize: 8,
      stroke: colors.steelBlue,
      strokeWeight: 2,
      flowParticles: 8, // Add flowing particles
      particleSize: 6, // Size of particles
      fill: colors.steelBlue, // Particle color
      animationSpeed: 2, // Speed of flow
    });

    const fp16 = this.animation.createShape("flowpath", {
      startShape: n03,
      endShape: n07,
      startConnection: "right",
      endConnection: "left",
      pathStyle: "bezier",
      curveIntensity: 0,
      arrowEnd: false,
      arrowSize: 8,
      stroke: colors.steelBlue,
      strokeWeight: 2,
      flowParticles: 8, // Add flowing particles
      particleSize: 6, // Size of particles
      fill: colors.steelBlue, // Particle color
      animationSpeed: 2, // Speed of flow
    });

    const fp17 = this.animation.createShape("flowpath", {
      startShape: n07,
      endShape: n11,
      startConnection: "right",
      endConnection: "left",
      pathStyle: "bezier",
      curveIntensity: 0,
      arrowEnd: false,
      arrowSize: 8,
      stroke: colors.steelBlue,
      strokeWeight: 2,
      flowParticles: 8, // Add flowing particles
      particleSize: 6, // Size of particles
      fill: colors.steelBlue, // Particle color
      animationSpeed: 2, // Speed of flow
    });

    const fp18 = this.animation.createShape("flowpath", {
      startShape: n11,
      endShape: n15,
      startConnection: "right",
      endConnection: "left",
      pathStyle: "bezier",
      curveIntensity: 0,
      arrowEnd: false,
      arrowSize: 8,
      stroke: colors.steelBlue,
      strokeWeight: 2,
      flowParticles: 8, // Add flowing particles
      particleSize: 6, // Size of particles
      fill: colors.steelBlue, // Particle color
      animationSpeed: 2, // Speed of flow
    });

    const fp19 = this.animation.createShape("flowpath", {
      startShape: n02,
      endShape: n06,
      startConnection: "right",
      endConnection: "left",
      pathStyle: "bezier",
      curveIntensity: 0,
      arrowEnd: false,
      arrowSize: 8,
      stroke: colors.steelBlue,
      strokeWeight: 2,
      flowParticles: 8, // Add flowing particles
      particleSize: 6, // Size of particles
      fill: colors.steelBlue, // Particle color
      animationSpeed: 2, // Speed of flow
    });

    const fp20 = this.animation.createShape("flowpath", {
      startShape: n06,
      endShape: n10,
      startConnection: "right",
      endConnection: "left",
      pathStyle: "bezier",
      curveIntensity: 0,
      arrowEnd: false,
      arrowSize: 8,
      stroke: colors.steelBlue,
      strokeWeight: 2,
      flowParticles: 8, // Add flowing particles
      particleSize: 6, // Size of particles
      fill: colors.steelBlue, // Particle color
      animationSpeed: 2, // Speed of flow
    });

    const fp21 = this.animation.createShape("flowpath", {
      startShape: n10,
      endShape: n14,
      startConnection: "right",
      endConnection: "left",
      pathStyle: "bezier",
      curveIntensity: 0,
      arrowEnd: false,
      arrowSize: 8,
      stroke: colors.steelBlue,
      strokeWeight: 2,
      flowParticles: 8, // Add flowing particles
      particleSize: 6, // Size of particles
      fill: colors.steelBlue, // Particle color
      animationSpeed: 2, // Speed of flow
    });

    const fp22 = this.animation.createShape("flowpath", {
      startShape: n01,
      endShape: n05,
      startConnection: "right",
      endConnection: "left",
      pathStyle: "bezier",
      curveIntensity: 0,
      arrowEnd: false,
      arrowSize: 8,
      stroke: colors.steelBlue,
      strokeWeight: 2,
      flowParticles: 8, // Add flowing particles
      particleSize: 6, // Size of particles
      fill: colors.steelBlue, // Particle color
      animationSpeed: 2, // Speed of flow
    });

    const fp23 = this.animation.createShape("flowpath", {
      startShape: n05,
      endShape: n09,
      startConnection: "right",
      endConnection: "left",
      pathStyle: "bezier",
      curveIntensity: 0,
      arrowEnd: false,
      arrowSize: 8,
      stroke: colors.steelBlue,
      strokeWeight: 2,
      flowParticles: 8, // Add flowing particles
      particleSize: 6, // Size of particles
      fill: colors.steelBlue, // Particle color
      animationSpeed: 2, // Speed of flow
    });

    const fp24 = this.animation.createShape("flowpath", {
      startShape: n09,
      endShape: n13,
      startConnection: "right",
      endConnection: "left",
      pathStyle: "bezier",
      curveIntensity: 0,
      arrowEnd: false,
      arrowSize: 8,
      stroke: colors.steelBlue,
      strokeWeight: 2,
      flowParticles: 8, // Add flowing particles
      particleSize: 6, // Size of particles
      fill: colors.steelBlue, // Particle color
      animationSpeed: 2, // Speed of flow
    });
  }

  meshOptimized() {
    const colors = {
      skyBlue: [135, 206, 235],
      coral: [255, 127, 80],
      limeGreen: [50, 205, 50],
      goldenRod: [218, 165, 32],
      orchid: [218, 112, 214],
      slateGray: [112, 128, 144],
      tomato: [255, 99, 71],
      steelBlue: [70, 130, 180],
      mediumPurple: [147, 112, 219],
      seaGreen: [46, 139, 87],
      deepPink: [255, 20, 147],
      turquoise: [64, 224, 208],
      fireBrick: [178, 34, 34],
      darkOrange: [255, 140, 0],
      lightSlateGray: [119, 136, 153],
    };

    this.animation.clearAll();
    this.animation.setDuration(10);
    this.animation.setFPS(60);
    this.engine.setCanvasSize(1900, 1000);

    // Node coordinates and names
    const nodeGrid = [
      // [x, y, name, highlightColor?]
      [100, 700, "node 0", colors.goldenRod], // Highlighted node
      [100, 500, "node 1"],
      [100, 300, "node 2"],
      [100, 100, "node 3"],
      [300, 700, "node 4"],
      [300, 500, "node 5"],
      [300, 300, "node 6"],
      [300, 100, "node 7"],
      [500, 700, "node 8"],
      [500, 500, "node 9"],
      [500, 300, "node 10"],
      [500, 100, "node 11"],
      [700, 700, "node 12"],
      [700, 500, "node 13"],
      [700, 300, "node 14"],
      [700, 100, "node 15"],
    ];

    // Create all nodes and keep reference by name
    const nodes = {};
    nodeGrid.forEach(([x, y, name, customFill]) => {
      nodes[name] = this.animation.createShape("circle", {
        x,
        y,
        size: 80,
        fill: customFill || colors.steelBlue,
        name,
      });
    });

    const flowDefaults = {
      pathStyle: "bezier",
      curveIntensity: 0,
      arrowEnd: false,
      arrowSize: 8,
      stroke: colors.steelBlue,
      strokeWeight: 2,
      flowParticles: 8,
      particleSize: 6,
      fill: colors.steelBlue,
      animationSpeed: 2,
    };

    const flowPaths = [
      // [startNode, endNode, startConnection, endConnection]
      ["node 0", "node 4", "right", "left"],
      ["node 4", "node 8", "right", "left"],
      ["node 8", "node 12", "right", "left"],

      ["node 1", "node 5", "right", "left"],
      ["node 5", "node 9", "right", "left"],
      ["node 9", "node 13", "right", "left"],

      ["node 2", "node 6", "right", "left"],
      ["node 6", "node 10", "right", "left"],
      ["node 10", "node 14", "right", "left"],

      ["node 3", "node 7", "right", "left"],
      ["node 7", "node 11", "right", "left"],
      ["node 11", "node 15", "right", "left"],

      ["node 0", "node 1", "top", "bottom"],
      ["node 1", "node 2", "top", "bottom"],
      ["node 2", "node 3", "top", "bottom"],
      ["node 4", "node 5", "top", "bottom"],
      ["node 5", "node 6", "top", "bottom"],
      ["node 6", "node 7", "top", "bottom"],
      ["node 8", "node 9", "top", "bottom"],
      ["node 9", "node 10", "top", "bottom"],
      ["node 10", "node 11", "top", "bottom"],
      ["node 12", "node 13", "top", "bottom"],
      ["node 13", "node 14", "top", "bottom"],
      ["node 14", "node 15", "top", "bottom"],
    ];

    flowPaths.forEach(([start, end, startConn, endConn]) => {
      this.animation.createShape("flowpath", {
        ...flowDefaults,
        startShape: nodes[start],
        endShape: nodes[end],
        startConnection: startConn,
        endConnection: endConn,
      });
    });
  }

  hypercubeOptimized() {
    const colors = {
        skyBlue: [135, 206, 235],
        coral: [255, 127, 80],
        limeGreen: [50, 205, 50],
        goldenRod: [218, 165, 32],
        orchid: [218, 112, 214],
        slateGray: [112, 128, 144],
        tomato: [255, 99, 71],
        steelBlue: [70, 130, 180],
        mediumPurple: [147, 112, 219],
        seaGreen: [46, 139, 87],
        deepPink: [255, 20, 147],
        turquoise: [64, 224, 208],
        fireBrick: [178, 34, 34],
        darkOrange: [255, 140, 0],
        lightSlateGray: [119, 136, 153],
      };
  
      this.animation.clearAll();
      this.animation.setDuration(10);
      this.animation.setFPS(60);
      this.engine.setCanvasSize(1900, 1000);
  
      // Node coordinates and names
      const nodeGrid = [
        // [x, y, name, highlightColor?]
        [100, 700, "node 0", colors.goldenRod], // Highlighted node
        [500, 700, "node 1"],
        [500, 300, "node 2"],
        [100, 300, "node 3"],
        [300, 500, "node 4"],
        [700, 500, "node 5"],
        [700, 100, "node 6"],
        [300, 100, "node 7"],
      ];
  
      // Create all nodes and keep reference by name
      const nodes = {};
      nodeGrid.forEach(([x, y, name, customFill]) => {
        nodes[name] = this.animation.createShape("circle", {
          x,
          y,
          size: 80,
          fill: customFill || colors.steelBlue,
          name,
        });
      });
  
      const flowDefaults = {
        pathStyle: "bezier",
        curveIntensity: 0,
        arrowEnd: false,
        arrowSize: 8,
        stroke: colors.steelBlue,
        strokeWeight: 2,
        flowParticles: 8,
        particleSize: 6,
        fill: colors.steelBlue,
        animationSpeed: 2,
      };
  
      const flowPaths = [
        // [startNode, endNode, startConnection, endConnection]
  
  
        ["node 0", "node 4", "center", "center"],
        ["node 2", "node 6", "center", "center"],
        ["node 1", "node 5", "center", "center"],
        ["node 3", "node 7", "center", "center"],
  
        ["node 0", "node 1", "center", "center"],
        ["node 1", "node 2", "center", "center"],
        ["node 2", "node 3", "center", "center"],
        ["node 3", "node 0", "center", "center"],
  
  
        ["node 4", "node 5", "center", "center"],
        ["node 5", "node 6", "center", "center"],
        ["node 6", "node 7", "center", "center"],
        ["node 7", "node 4", "center", "center"],
      ];
  
      flowPaths.forEach(([start, end, startConn, endConn]) => {
        this.animation.createShape("flowpath", {
          ...flowDefaults,
          startShape: nodes[start],
          endShape: nodes[end],
          startConnection: startConn,
          endConnection: endConn,
        });
      });
  }
}
