javascript:(function(){var script=document.createElement('script');script.onload=function(){var stats=new Stats();document.body.appendChild(stats.dom);requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};script.src='https://mrdoob.github.io/stats.js/build/stats.min.js';document.head.appendChild(script);})()
import GUI from 'https://cdn.jsdelivr.net/npm/lil-gui@0.20/+esm';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

///VECTOR
let lines = [];
let Circlelines = [];
let Ellipselines = [];
let ProjectionPoint = [];
let middleCircleLines = [];
let Letters = [];
let cones = [];

let perpendicularLine=null;
let pointMesh = null; 
let currentCylinderMesh = null;
let Circle1mesh = null;
let Circle2mesh = null;
const AXESlength = 25;
let label;

const axesHelper = new THREE.AxesHelper( AXESlength );

///SCENA
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0x404040, 10);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 4);
directionalLight.position.set(10, 10, 10).normalize();
scene.add(directionalLight);

///GUI
const gui = new GUI();
const obj = { 
    Lines: true,
    HighlightedLine: true,
    Wireframe: false,
    Surface: false,
    CircleLines:true,
    CircleWireframe:false,
    CircleSurface:false,
    SurfaceColorNormal:false,
    SurfaceLighting:false,
    MiddleCircle:false,
    AxisShow:true,
    ShowPoints:false,
    RotationPointer:false,
    EllipseProjection2D:true,
    NamePoints:true,
    Alpha:1,
    Beta:1,
    Radius:7,
    Segments:32,
    Height:22,
    Theta:2*Math.PI,
    Phi:0,
    SurfaceColor: [150, 150, 150],
    LineColor: [255, 255, 255],
    CameraAngle:0,
    x: 12,
    y: 16,
    z: 16,
    CameraAnimate:false,
    PhiAnimate:true,
    Credits: function() { alert( 'Hyperboloid Visualiser made by Sirghe Matei-Stefan for University Algebra and Geometry Course. (En)                                                                 Vizualizator de hiperboloid cu panza realizat de Sirghe Matei-Stefan pentru Cursul Universitar de Algebră si Geometrie. (Ro)' ) }
};

const fisier1 = gui.addFolder('Display Modes');
fisier1.add(obj,'Lines').onChange(() => {
    Generate(obj.Radius, obj.Height, obj.Segments);
});
fisier1.add(obj,'CircleLines').onChange(() => {
    Generate(obj.Radius, obj.Height, obj.Segments);
});
fisier1.add(obj,'Wireframe').onChange(() => {
    Generate(obj.Radius, obj.Height, obj.Segments);
});
fisier1.add(obj,'CircleWireframe').onChange(() => {
    Generate(obj.Radius, obj.Height, obj.Segments);
});
fisier1.add(obj,'Surface').onChange(() => {
    Generate(obj.Radius, obj.Height, obj.Segments);
});
fisier1.add(obj,'CircleSurface').onChange(() => {
    Generate(obj.Radius, obj.Height, obj.Segments);
});

const fisier2 = gui.addFolder('Display Settings');
fisier2.add(obj,'AxisShow').onChange(() => {
    Generate(obj.Radius, obj.Height, obj.Segments);
});
fisier2.add(obj,'EllipseProjection2D').onChange(() => {
    Generate(obj.Radius, obj.Height, obj.Segments);
});
fisier2.add(obj,'HighlightedLine').onChange(() => {
    Generate(obj.Radius, obj.Height, obj.Segments);
});
fisier2.add(obj,'NamePoints').onChange(() => {
    Generate(obj.Radius, obj.Height, obj.Segments);
});
fisier2.add(obj,'MiddleCircle').onChange(() => {
    Generate(obj.Radius, obj.Height, obj.Segments);
});
fisier2.add(obj,'RotationPointer').onChange(() => {
    Generate(obj.Radius, obj.Height, obj.Segments);
});
fisier2.add(obj,'ShowPoints').onChange(() => {
    Generate(obj.Radius, obj.Height, obj.Segments);
});
fisier2.add(obj, 'SurfaceLighting').onChange(() => {
    Generate(obj.Radius, obj.Height, obj.Segments);
});
fisier2.add(obj, 'SurfaceColorNormal').onChange(() => {
    Generate(obj.Radius, obj.Height, obj.Segments);
});
fisier2.addColor(obj, 'SurfaceColor', 255).onChange(() => {
    Generate(obj.Radius, obj.Height, obj.Segments);
});
fisier2.addColor(obj, 'LineColor', 255).onChange(() => {
    Generate(obj.Radius, obj.Height, obj.Segments);
});

const fisier3 = gui.addFolder('Display Modes');
fisier3.add(obj,'Radius',0,14).onChange(() => {
    Generate(obj.Radius, obj.Height, obj.Segments);
});
fisier3.add(obj,'Segments',2,62,1).onChange(() => {
    Generate(obj.Radius, obj.Height, obj.Segments);
});
fisier3.add(obj,'Height',0,44).onChange(() => {
    Generate(obj.Radius, obj.Height, obj.Segments);
});
fisier3.add(obj,'Theta',0,2*Math.PI).onChange(() => {
    Generate(obj.Radius, obj.Height, obj.Segments);
});
const phiController = fisier3.add(obj,'Phi',0,2*Math.PI).onChange(() => {
    Generate(obj.Radius, obj.Height, obj.Segments);
});
fisier3.add(obj,'Alpha',0,5).onChange(() => {
    Generate(obj.Radius, obj.Height, obj.Segments);
});
fisier3.add(obj,'Beta',0,5).onChange(() => {
    Generate(obj.Radius, obj.Height, obj.Segments);
});

const fisier4 = gui.addFolder('Camera Functions');
fisier4.add(obj,'CameraAngle',0,2*Math.PI).onChange(() => {UpdateCamera(1)});
const xController = fisier4.add(obj, 'x',-30,30,1).onChange(() => {UpdateCamera(0)});
const yController = fisier4.add(obj, 'y',-30,30,1).onChange(() => {UpdateCamera(0)});
const zController = fisier4.add(obj, 'z',-30,30,1).onChange(() => {UpdateCamera(0)});

const fisier5 = gui.addFolder('Animations');
fisier5.add(obj,'CameraAnimate');
fisier5.add(obj,'PhiAnimate');

const fisier6 = gui.addFolder('Credits');
fisier6.add(obj,'Credits');
fisier6.close();

const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

function UpdateCamera(_type){
    if(_type==0 && obj.CameraAnimate==false)
        camera.position.set(obj.x, obj.y, obj.z);
    if (_type === 1  && obj.CameraAnimate==false) {
        const radius = Math.sqrt(obj.x ** 2 + obj.z ** 2);
        const angle = obj.CameraAngle;
        GlobAng=obj.CameraAngle;

        const x = radius * Math.cos(angle);
        const z = radius * Math.sin(angle);
        obj.x=x;
        obj.z=z;
        camera.position.set(x, obj.y, z);
    }
    camera.lookAt(0, 0, 0);

    ///UPDATE CONTROLLERS

    xController.setValue(obj.x);
    yController.setValue(obj.y);
    zController.setValue(obj.z);
    xController.updateDisplay();
    yController.updateDisplay();
    zController.updateDisplay();
}
UpdateCamera(0);

function Generate(radius, height, segments) {
    ///STERGE LUCRURILE VECHI
    if (Circle1mesh) {
        Circle1mesh.geometry.dispose();
        Circle1mesh.material.dispose();
        scene.remove(Circle1mesh);
        Circle1mesh = null;
    }
    if (Circle2mesh) {
        Circle2mesh.geometry.dispose();
        Circle2mesh.material.dispose();
        scene.remove(Circle2mesh);
        Circle2mesh = null;
    }

    if (currentCylinderMesh) {
        currentCylinderMesh.geometry.dispose();
        if (currentCylinderMesh.material && currentCylinderMesh.material.dispose) {
            currentCylinderMesh.material.dispose();
        }
        scene.remove(currentCylinderMesh);
        currentCylinderMesh = null;
    }

    while(Circlelines.length>0){
        const line = Circlelines.pop();
        scene.remove(line);
        if (line.geometry) line.geometry.dispose();
        if (line.material) line.material.dispose();
    }
    
    while(cones.length>0){
        const line = cones.pop();
        scene.remove(line);
        if (line.geometry) line.geometry.dispose();
        if (line.material) line.material.dispose();
    }

    while(Ellipselines.length>0){
        const line = Ellipselines.pop();
        scene.remove(line);
        if (line.geometry) line.geometry.dispose();
        if (line.material) line.material.dispose();
    }

    while (lines.length > 0) {
        const line = lines.pop();
        scene.remove(line);
        if (line.geometry) line.geometry.dispose();
        if (line.material) line.material.dispose();
    }

    while (middleCircleLines.length > 0) {
        const line = middleCircleLines.pop();
        scene.remove(line);
        if (line.geometry) line.geometry.dispose();
        if (line.material) line.material.dispose();
    }

    while (ProjectionPoint.length > 0) {
        const line = ProjectionPoint.pop();
        scene.remove(line);
        if (line.geometry) line.geometry.dispose();
        if (line.material) line.material.dispose();
    }

    if(perpendicularLine!=null){
        scene.remove(perpendicularLine);
        perpendicularLine.geometry.dispose();
        perpendicularLine.material.dispose();
        perpendicularLine=null;
    }

    if (pointMesh) {
        scene.remove(pointMesh);
        pointMesh.geometry.dispose();
        pointMesh.material.dispose();
        pointMesh = null;
    }

    ///MAKE AXIS

    if(obj.AxisShow==true){
        axesHelper.position.set(0, -obj.Height/2-0.05, 0); 
        scene.add( axesHelper );
        ///AXES VECTOR POINTERS
        const geometry = new THREE.ConeGeometry( 0.2, 1 , 6 ); 
        const material1 = new THREE.MeshBasicMaterial( {color: 0xbfff00} );
        const cone1 = new THREE.Mesh(geometry, material1 ); 
        cones.push(cone1);
        scene.add( cone1 );
        cone1.position.set(0,AXESlength/2+1.5,0);
        
        const material2 = new THREE.MeshBasicMaterial( {color: 0xffa500} );
        const cone2 = new THREE.Mesh(geometry, material2 ); 
        cones.push(cone2);
        scene.add( cone2 );
        cone2.position.set(AXESlength,-obj.Height/2,0);
        cone2.rotation.set(0, 0, -Math.PI / 2);

        const material3 = new THREE.MeshBasicMaterial( {color: 0x87CEEB} );
        const cone3 = new THREE.Mesh(geometry, material3 ); 
        cones.push(cone3);
        scene.add( cone3 );
        cone3.position.set(0,-obj.Height/2,AXESlength);
        cone3.rotation.set(Math.PI / 2, 0, 0);

    }
    else{
        axesHelper.dispose();
        scene.remove(axesHelper);
    }

    ///MAKE LINE OBJECTS

    const topCircle = [];
    const bottomCircle = [];
    const SolidDisplay = [];

    for (let i = 0; i < obj.Segments; i++) {
        const angle2 = (i / obj.Segments) * obj.Theta +obj.Phi;
        const x2 = obj.Alpha * Math.cos(angle2) * radius;
        const z2 = obj.Beta * Math.sin(angle2) * radius;
        SolidDisplay.push(new THREE.Vector3(x2, height / 2, z2));
        topCircle.push(new THREE.Vector3(x2, height / 2, z2));
    }

    for (let i = 0; i < obj.Segments; i++) {
        const angle1 = (i / obj.Segments) * obj.Theta;
        let x1 = obj.Alpha * Math.cos(angle1) * radius;
        let z1 = obj.Beta * Math.sin(angle1) * radius;
        SolidDisplay.push(new THREE.Vector3(x1, height / 2, z1));
        bottomCircle.push(new THREE.Vector3(x1, -height / 2, z1));
    }

    for (let i = 0; i < obj.Segments; i++) {
        const start = topCircle[i];
        const end = bottomCircle[i];
        const points = [start, end];
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);

        const isCloseToWhite = obj.LineColor[0] > 180 && obj.LineColor[1] > 180 && obj.LineColor[2] > 180;

        const lineMaterial = new THREE.LineBasicMaterial({
            color: i === 0 && obj.HighlightedLine === true
                ? isCloseToWhite 
                    ? new THREE.Color('rgb(255, 0,255)')
                    : new THREE.Color(`rgb(${255 - obj.LineColor[0]}, ${255 - obj.LineColor[1]}, ${255 - obj.LineColor[2]})`)
                : new THREE.Color(`rgb(${obj.LineColor[0]}, ${obj.LineColor[1]}, ${obj.LineColor[2]})`)
        });

        const line = new THREE.Line(lineGeometry, lineMaterial);
        lines.push(line);
        if(obj.HighlightedLine==true && i==0)
            scene.add(line);
        if(obj.Lines==true)
            scene.add(line);
    }
    
    /// MAKE CIRCLE LINES

    for (let i = 0; i < segments; i++) {
        const start = topCircle[i];
        const end = topCircle[(i + 1) % segments];

        const points = [start, end];
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);

        const lineMaterial = new THREE.LineBasicMaterial({
            color: new THREE.Color(`rgb(${obj.LineColor[0]}, ${obj.LineColor[1]}, ${obj.LineColor[2]})`)
        });

        const line = new THREE.Line(lineGeometry, lineMaterial);
        Circlelines.push(line);
        if (obj.CircleLines) {
            scene.add(line);
        }
    }


    for (let i = 0; i < segments; i++) {
        const start = bottomCircle[i];
        const end = bottomCircle[(i + 1) % segments];

        const points = [start, end];
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);

        const lineMaterial = new THREE.LineBasicMaterial({
            color: new THREE.Color(`rgb(${obj.LineColor[0]}, ${obj.LineColor[1]}, ${obj.LineColor[2]})`)
        });

        const line = new THREE.Line(lineGeometry, lineMaterial);
        Circlelines.push(line);
        if (obj.CircleLines) {
            scene.add(line);
        }
    }

    ///GENERARE Puncte Pentru obiect
    const vertices = [];
    const indices = [];
    var kon=0;
    if(obj.Theta!=6.283185307179586)kon=obj.Segments-1;
    else kon=obj.Segments;
    for (let i = 0; i < kon; i++) {
        const nextIndex = (i + 1) % obj.Segments;
        const v0 = topCircle[i];
        const v1 = bottomCircle[i]; 
        const v2 = topCircle[nextIndex];
        const v3 = bottomCircle[nextIndex];
        vertices.push(v0.x, v0.y, v0.z);
        vertices.push(v1.x, v1.y, v1.z);
        vertices.push(v2.x, v2.y, v2.z);
        vertices.push(v3.x, v3.y, v3.z);

        const base = i * 4;
        // Faci 2 triunghiuri
        indices.push(base, base + 2, base + 1);
        indices.push(base + 1, base + 2, base + 3);
    }

    ////ARATARE PUNCTE DACA SE VREA
    if(obj.ShowPoints==true){
        const pointGeometry = new THREE.BufferGeometry();
        pointGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

        ///SHADER COSTUM PENTRU PUNCTE CA SA FIE MAI EFICIENT
        const pointMaterial = new THREE.ShaderMaterial({
            vertexShader: `
                varying float vSize;
                void main() {
                    vSize = 10.0;
                    gl_PointSize = vSize;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                void main() {
                    vec2 uv = gl_PointCoord * 2.0 - 1.0;
                    if (dot(uv, uv) > 1.0) discard;
                    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
                }
            `,
            transparent: false,
        });

        pointMesh = new THREE.Points(pointGeometry, pointMaterial);
        scene.add(pointMesh);
    }

    ///Generare Suprafata dupa forma
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();

    let material=null;
    if(obj.SurfaceColorNormal==false){
        if(obj.Surface==true){
            ///Shader pentru suprafata clasica
            material = new THREE.ShaderMaterial({
                uniforms: {
                    surfaceColor: { value: new THREE.Color(obj.SurfaceColor[0]/255, obj.SurfaceColor[1]/255, obj.SurfaceColor[2]/255) },
                },
                vertexShader: `
                    varying float vDepth;
                    varying vec3 vNormal;
                    varying vec3 vPosition;
            
                    void main() {
                        vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
            
                        vNormal = normalize(normalMatrix * normal);
            
                        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                        vDepth = -mvPosition.z;
            
                        gl_Position = projectionMatrix * mvPosition;
                    }
                `,
                fragmentShader: `
                    varying float vDepth;
                    varying vec3 vNormal;
                    varying vec3 vPosition;
            
                    uniform vec3 surfaceColor;
            
                    void main() {
                        float depth = vDepth / 500.0;
                        depth = clamp(depth, 0.0, 1.0);
                        depth = pow(depth, 0.3);
            
                        vec3 normal = normalize(vNormal);
            
                        float lightingZ = abs(dot(normal, vec3(0.0, 0.0, 1.0)));
                        float lightingY = abs(dot(normal, vec3(0.0, 1.0, 0.0)));
                        float combinedLighting = max(lightingZ, lightingY);
            
                        vec3 color = surfaceColor * (depth * combinedLighting);
                        gl_FragColor = vec4(color, 1.0);
                    }
                `,
                side: THREE.DoubleSide,
                transparent: false,
            });
        }
        if(obj.Wireframe==true){
            material = new THREE.MeshBasicMaterial({
                color:0x808080,
                wireframe: obj.Wireframe,
                side: THREE.DoubleSide,
            });
        }
    }
    if(obj.SurfaceLighting==true){
        material = new THREE.MeshStandardMaterial({
            vertexColors:false,
            color:new THREE.Color(`rgb(${obj.SurfaceColor[0]}, ${obj.SurfaceColor[1]}, ${obj.SurfaceColor[2]})`),
            wireframe: obj.Wireframe,
            flatShading:false,
            side: THREE.DoubleSide,
        });
    }
    if(obj.SurfaceColorNormal==true){
        material = new THREE.MeshNormalMaterial({
            wireframe: obj.Wireframe,
            side: THREE.DoubleSide,
            //flatShading: !obj.Wireframe
        });
    }
    currentCylinderMesh = new THREE.Mesh(geometry, material);

    if (obj.Surface || obj.Wireframe) {
        scene.add(currentCylinderMesh);
    }

    ///Generare Cerc dupa forma
    if (segments > 2) {
        const topVertices = [];
        const topIndices = [];
        for (let i = 0; i < kon; i++) {
            const v0 = topCircle[i];
            const v1 = topCircle[(i + 1) % obj.Segments];
            const vCenter = new THREE.Vector3(0, height / 2, 0);
    
            topVertices.push(v0.x, v0.y, v0.z);
            topVertices.push(v1.x, v1.y, v1.z);
            topVertices.push(vCenter.x, vCenter.y, vCenter.z);
    
            const base = i * 3;
            topIndices.push(base, base + 1, base + 2);
        }
    
        const topGeometry = new THREE.BufferGeometry();
        topGeometry.setAttribute('position', new THREE.Float32BufferAttribute(topVertices, 3));
        topGeometry.setIndex(topIndices);
        topGeometry.computeVertexNormals();
    
        let material2=null;
        if(obj.SurfaceColorNormal==false){
            
            ///Shader pentru suprafata clasica la cerc
            material2 = new THREE.ShaderMaterial({
                uniforms: {
                    surfaceColor: { value: new THREE.Color(obj.SurfaceColor[0]/255, obj.SurfaceColor[1]/255, obj.SurfaceColor[2]/255) },
                },
                vertexShader: `
                    varying float vDepth;
                    varying vec3 vNormal;
            
                    void main() {
                        vNormal = normalize(normalMatrix * normal);
            
                        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                        vDepth = -mvPosition.z;

                        gl_Position = projectionMatrix * mvPosition;
                    }
                `,
                fragmentShader: `
                    varying float vDepth;
                    varying vec3 vNormal;
            
                    uniform vec3 surfaceColor;
            
                    void main() {
                        float depth = vDepth / 500.0;
                        depth = clamp(depth, 0.0, 1.0);
                        depth = pow(depth, 0.3);
            
                        vec3 normal = normalize(vNormal);
                        float lighting = abs(dot(normal, vec3(0.0, 0.0, 1.0)));
                        lighting = clamp(lighting, 0.2, 1.0);
            
                        vec3 color = surfaceColor * (depth * lighting);
                        gl_FragColor = vec4(color, 1.0);
                    }
                `,
                side: THREE.DoubleSide,
                transparent: false,
            });
            if(obj.CircleWireframe==true){
                material2 = new THREE.MeshBasicMaterial({
                    color:0x808080,
                    wireframe: obj.CircleWireframe,
                    side: THREE.DoubleSide,
                });
            }
        }
        if(obj.SurfaceLighting==true){
            material2 = new THREE.MeshStandardMaterial({
                color:new THREE.Color(`rgb(${obj.SurfaceColor[0]}, ${obj.SurfaceColor[1]}, ${obj.SurfaceColor[2]})`),
                wireframe: obj.CircleWireframe,
                flatShading:false,
                vertexColors:false,
                side: THREE.DoubleSide,
            });
        }
        if(obj.SurfaceColorNormal==true){
            material2 = new THREE.MeshNormalMaterial({
                wireframe: obj.CircleWireframe,
                side: THREE.DoubleSide,
            });
        }

        ///Offseturi la cercuri
        Circle1mesh = new THREE.Mesh(topGeometry, material2);
        //Circle1mesh.rotation.x = Math.PI;
        //Circle1mesh.rotation.z=Math.Pi+obj.Phi;
        //Circle1mesh.rotation.y = segments/Math.PI;
        Circle1mesh.position.set(0, 0, 0);
    
        const bottomVertices = [];
        const bottomIndices = [];
        for (let i = 0; i < kon; i++) {
            const v0 = bottomCircle[i];
            const v1 = bottomCircle[(i + 1) % obj.Segments];
            const vCenter = new THREE.Vector3(0, -height / 2, 0);
    
            bottomVertices.push(v0.x, v0.y, v0.z);
            bottomVertices.push(v1.x, v1.y, v1.z);
            bottomVertices.push(vCenter.x, vCenter.y, vCenter.z);
    
            const base = i * 3;
            bottomIndices.push(base, base + 1, base + 2);
        }
    
        const bottomGeometry = new THREE.BufferGeometry();
        bottomGeometry.setAttribute('position', new THREE.Float32BufferAttribute(bottomVertices, 3));
        bottomGeometry.setIndex(bottomIndices);
        bottomGeometry.computeVertexNormals();
    
        Circle2mesh = new THREE.Mesh(bottomGeometry, material2);
        //Circle2mesh.rotation.x = Math.PI;
        //Circle2mesh.rotation.z = obj.Phi;
        Circle2mesh.position.set(0, 0, 0);
    
        if (obj.CircleSurface || obj.CircleWireframe) {
            scene.add(Circle1mesh);
            scene.add(Circle2mesh);
        }
        ///NEW STUFFF ------------------------------------------------------
        ///CERCUL DIN MIJLOC GENERARE

        const middleRadius = radius * Math.cos(obj.Phi / 2);
        const middleCircle = [];
        const middlePhi = obj.Phi / 2;

        for (let i = 0; i < obj.Segments; i++) {
            const angle = (i / obj.Segments) * obj.Theta;
            const x = middleRadius * Math.cos(angle) * obj.Alpha;
            const z = middleRadius * Math.sin(angle) * obj.Beta;
            const y = 0;

            const rotatedX = x * Math.cos(middlePhi) - z * Math.sin(middlePhi);
            const rotatedZ = x * Math.sin(middlePhi) + z * Math.cos(middlePhi);

            middleCircle.push(new THREE.Vector3(rotatedX, y, rotatedZ));
        }

        for (let i = 0; i < obj.Segments; i++) {
            const start = middleCircle[i];
            const end = middleCircle[(i + 1) % obj.Segments];
            const points = [start, end];
            const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);

            const isCloseToWhite = obj.LineColor[0] > 180 && obj.LineColor[1] > 180 && obj.LineColor[2] > 180;

            const lineMaterial = new THREE.LineBasicMaterial({
                color: obj.MiddleCircle === true
                    ? isCloseToWhite 
                        ? new THREE.Color('rgb(255, 0,255)')
                        : new THREE.Color(`rgb(${255 - obj.LineColor[0]}, ${255 - obj.LineColor[1]}, ${255 - obj.LineColor[2]})`)
                    : new THREE.Color(`rgb(${obj.LineColor[0]}, ${obj.LineColor[1]}, ${obj.LineColor[2]})`)
            });

            const line = new THREE.Line(lineGeometry, lineMaterial);
            if (obj.MiddleCircle == true) {
                middleCircleLines.push(line); 
                scene.add(line);
            }
        }

        //LINE THAT SHOWS TOP CIRCLE ROTATING
        const phiAngle = obj.Phi;
        const lineRadius = radius;
        const rotationAngle = phiAngle;

        const angle = rotationAngle;
        const x = lineRadius * Math.cos(angle);
        const y = height / 2;
        const z = lineRadius * Math.sin(angle);

        const start = new THREE.Vector3(x, y, z);

        const tangentDirection = new THREE.Vector3(-Math.sin(angle), 0, Math.cos(angle));
        const outwardDirection = new THREE.Vector3(tangentDirection.z, 0, -tangentDirection.x);

        const lineLength = 5;
        const end = start.clone().add(outwardDirection.multiplyScalar(lineLength));

        const lineGeometry = new THREE.BufferGeometry().setFromPoints([start, end]);

        const isCloseToWhite = obj.LineColor[0] > 180 && obj.LineColor[1] > 180 && obj.LineColor[2] > 180;

        const lineMaterial = new THREE.LineBasicMaterial({
            color: obj.RotationPointer === true
                ? isCloseToWhite 
                    ? new THREE.Color('rgb(255, 0,255)')
                    : new THREE.Color(`rgb(${255 - obj.LineColor[0]}, ${255 - obj.LineColor[1]}, ${255 - obj.LineColor[2]})`)
                : new THREE.Color(`rgb(${obj.LineColor[0]}, ${obj.LineColor[1]}, ${obj.LineColor[2]})`)
        });

        perpendicularLine = new THREE.Line(lineGeometry, lineMaterial);
        if(obj.RotationPointer)
            scene.add(perpendicularLine);

        /// GENERAREA ELIPSEI PE CARE O DOREA PROFA
        if(obj.EllipseProjection2D==true){
            const isCloseToWhite = obj.LineColor[0] > 180 && obj.LineColor[1] > 180 && obj.LineColor[2] > 180;

            const lineMaterial = new THREE.LineBasicMaterial({
                color: obj.EllipseProjection2D === true
                ? isCloseToWhite 
                    ? new THREE.Color('rgb(255, 0,255)')
                    : new THREE.Color(`rgb(${255 - obj.LineColor[0]}, ${255 - obj.LineColor[1]}, ${255 - obj.LineColor[2]})`)
                : new THREE.Color(`rgb(${obj.LineColor[0]}, ${obj.LineColor[1]}, ${obj.LineColor[2]})`)
            });

            const bottomCircle1 = [];
            ///ELIPSA
            for (let i = 0; i < obj.Segments; i++) {
                const angle1 = (i / obj.Segments)*2*Math.PI;
                let x1 = obj.Alpha * Math.cos(angle1) * radius*3/2;
                let z1 = obj.Beta * Math.sin(angle1) * radius;
                bottomCircle1.push(new THREE.Vector3(x1, -height / 2, z1));
            }

            for (let i = 0; i < segments; i++) {
                const start = bottomCircle1[i];
                const end = bottomCircle1[(i + 1) % segments];
        
                const points = [start, end];
                const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
        
                const lineMaterial = new THREE.LineBasicMaterial({
                    color: new THREE.Color(`rgb(${obj.LineColor[0]}, ${obj.LineColor[1]}, ${obj.LineColor[2]})`)
                });
        
                const line = new THREE.Line(lineGeometry, lineMaterial);
                Ellipselines.push(line);
                scene.add(line);
            }

            ///CRUCEA DE LA ELIPSA SI OQ
            const centerY = -height / 2;
            const majorRadius = radius * 3 / 2;
            const minorRadius = radius;

            const majorAxisPoints1 = [
                new THREE.Vector3(-majorRadius * obj.Alpha, centerY, 0),
                new THREE.Vector3(0, centerY, 0)
            ];
            const majorAxisPoints2 = [
                new THREE.Vector3(0, centerY, 0),
                new THREE.Vector3(majorRadius * obj.Alpha, centerY, 0)
            ];
            const majorAxisGeometry1 = new THREE.BufferGeometry().setFromPoints(majorAxisPoints1);
            const majorAxisMaterial1 = new THREE.LineBasicMaterial({
                color: new THREE.Color(`rgb(${obj.LineColor[0]}, ${obj.LineColor[1]}, ${obj.LineColor[2]})`),
                linewidth: 2
            });
            const majorAxisLine1 = new THREE.Line(majorAxisGeometry1, majorAxisMaterial1);
            Ellipselines.push(majorAxisLine1);
            scene.add(majorAxisLine1);

            const majorAxisGeometry2 = new THREE.BufferGeometry().setFromPoints(majorAxisPoints2);

            const majorAxisLine2 = new THREE.Line(majorAxisGeometry2, lineMaterial);
            Ellipselines.push(majorAxisLine2);
            scene.add(majorAxisLine2);

            const minorAxisPoints = [
                new THREE.Vector3(0, centerY, -minorRadius * obj.Beta),
                new THREE.Vector3(0, centerY, minorRadius * obj.Beta)
            ];
            const minorAxisGeometry = new THREE.BufferGeometry().setFromPoints(minorAxisPoints);
            const minorAxisMaterial = new THREE.LineBasicMaterial({
                color: new THREE.Color(`rgb(${obj.LineColor[0]}, ${obj.LineColor[1]}, ${obj.LineColor[2]})`),
                linewidth: 2
            });
            const minorAxisLine = new THREE.Line(minorAxisGeometry, minorAxisMaterial);
            Ellipselines.push(minorAxisLine);
            scene.add(minorAxisLine);

            /// PERPENDICULARA LA PLANUL ELIPSEI
            const start = topCircle[0];
            const end = new THREE.Vector3(start.x, start.y - obj.Height, start.z);
            const points = [start, end];
            const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);

            const line = new THREE.Line(lineGeometry, lineMaterial);
            Ellipselines.push(line);
            scene.add(line);

            /// LINIA PERPENDICULARA CU AXA Z
            let intersectionZ = start.z;

            let ZAxisIntersection = new THREE.Vector3(
                0,
                -obj.Height/2,
                intersectionZ
            );
            let scalar=1;
            if(start.x>=0) scalar=1;
            else scalar=-1;
            let newLinePoints = [new THREE.Vector3(start.x + scalar * obj.Alpha * radius * 1/2 * Math.abs(Math.cos(obj.Phi)), -obj.Height/2, start.z), ZAxisIntersection];
            let newLineGeometry = new THREE.BufferGeometry().setFromPoints(newLinePoints);

            const newLine = new THREE.Line(newLineGeometry, lineMaterial);
            Ellipselines.push(newLine);
            scene.add(newLine);

            /// LINIE SPRE CENTRU DE LA PUNCTUL P
            newLinePoints = [new THREE.Vector3(start.x + scalar * obj.Alpha * radius * 1/2 * Math.abs(Math.cos(obj.Phi)), -obj.Height/2, start.z), new THREE.Vector3(0,-obj.Height/2,0)];
            newLineGeometry = new THREE.BufferGeometry().setFromPoints(newLinePoints);

            const newLine1 = new THREE.Line(newLineGeometry, lineMaterial);
            Ellipselines.push(newLine1);
            scene.add(newLine1);

            /// ADAUGARE TOATE PUNCTELE IMPORTANTE
            const geometry = new THREE.SphereGeometry( 0.2, 10, 10 ); 
            const material = new THREE.MeshBasicMaterial( { 
                color: obj.EllipseProjection2D === true
                ? isCloseToWhite 
                    ? new THREE.Color('rgb(255, 0,255)')
                    : new THREE.Color(`rgb(${255 - obj.LineColor[0]}, ${255 - obj.LineColor[1]}, ${255 - obj.LineColor[2]})`)
                : new THREE.Color(`rgb(${obj.LineColor[0]}, ${obj.LineColor[1]}, ${obj.LineColor[2]})`) } ); 
            const sphere = new THREE.Mesh( geometry, material ); 
            scene.add( sphere );
            ProjectionPoint.push(sphere);
            const PPointPos =new THREE.Vector3(start.x + scalar * obj.Alpha * radius * 1/2 * Math.abs(Math.cos(obj.Phi)), -obj.Height/2, start.z);
            sphere.position.set(PPointPos.x, PPointPos.y, PPointPos.z);

            const sphere1 = new THREE.Mesh( geometry, material );
            scene.add( sphere1 );
            ProjectionPoint.push(sphere1);
            sphere1.position.set(obj.Radius*3/2*obj.Alpha, -obj.Height/2, 0);

            const sphere2 = new THREE.Mesh( geometry, material );
            scene.add( sphere2 );
            ProjectionPoint.push(sphere2);
            sphere2.position.set(0, -obj.Height/2, 0);

            const sphere4 = new THREE.Mesh( geometry, material );
            scene.add( sphere4 );
            ProjectionPoint.push(sphere4);
            sphere4.position.set(radius*Math.cos(obj.Phi)*obj.Alpha, obj.Height/2, radius*Math.sin(obj.Phi)*obj.Beta);

            const sphere5 = new THREE.Mesh( geometry, material );
            scene.add( sphere5 );
            ProjectionPoint.push(sphere5);
            sphere5.position.set(radius*obj.Alpha, -obj.Height/2, 0);

            const sphere6 = new THREE.Mesh( geometry, material );
            scene.add( sphere6 );
            ProjectionPoint.push(sphere6);
            const DPointPos = new THREE.Vector3(start.x, start.y - obj.Height, start.z);
            sphere6.position.set(DPointPos.x, -obj.Height/2, DPointPos.z);
        }
    }
}

Generate(obj.Radius, obj.Height, obj.Segments);

let GlobAng=obj.CameraAngle;

let LetterFrecv = ['P','Q','O','H','E','D'];

///ADAUGA TEXT
function GenerateText(verf){
    if(verf==1){
        while (Letters.length > 0) {
            const label = Letters.pop();
            document.body.removeChild(label);
        }
        return 0;
    }
    while (Letters.length > 0) {
        const label = Letters.pop();
        document.body.removeChild(label);
    }
    for(let i=0;i<ProjectionPoint.length;i++){
        label = document.createElement('div');
        label.className = 'label';
        label.innerHTML = LetterFrecv[i]
        label.style.position = 'absolute';
        label.style.color = 'white';
        document.body.appendChild(label);

        let screenPos = toScreenPosition(ProjectionPoint[i], camera);
        Letters.push(label);
        label.style.left = `${screenPos.x}px`;
        label.style.top = `${screenPos.y}px`;
    }
}
//TEXT TO SCREEN POSITION PENTRU LITERELE PUNCTELOR

function toScreenPosition(obj, camera) {
    const vector = new THREE.Vector3();
    const widthHalf = 0.5 * renderer.domElement.width;
    const heightHalf = 0.5 * renderer.domElement.height;

    obj.updateMatrixWorld();
    vector.setFromMatrixPosition(obj.matrixWorld);
    vector.project(camera);

    vector.x = (vector.x * widthHalf) + widthHalf;
    vector.y = -(vector.y * heightHalf) + heightHalf;

    return { x: vector.x, y: vector.y };
}

///UPDATE EVERYTHING
function animate() {
    renderer.render(scene, camera);
    controls.update();

    if(obj.NamePoints==true){
        GenerateText(0);
    }
    else{
        GenerateText(1);
    }

    if(obj.CameraAnimate==true){
        const radius = Math.sqrt(obj.x ** 2 + obj.z ** 2);
        GlobAng+=0.0025;
        const x = radius * Math.cos(GlobAng);
        const z = radius * Math.sin(GlobAng);
        camera.position.set(x, obj.y, z);
        camera.lookAt(0, 0, 0);
    }
    if(obj.PhiAnimate==true){
        obj.Phi+=0.01;
        if(obj.Phi>2*Math.PI)obj.Phi=0;
        Generate(obj.Radius, obj.Height, obj.Segments);
        phiController.setValue(obj.Phi);
        phiController.updateDisplay();
    }
}
renderer.setAnimationLoop(animate);