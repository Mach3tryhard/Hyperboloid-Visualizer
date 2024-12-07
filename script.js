javascript:(function(){var script=document.createElement('script');script.onload=function(){var stats=new Stats();document.body.appendChild(stats.dom);requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};script.src='https://mrdoob.github.io/stats.js/build/stats.min.js';document.head.appendChild(script);})()
import GUI from 'https://cdn.jsdelivr.net/npm/lil-gui@0.20/+esm';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

///VECTOR

let lines = [];
let Circlelines = [];
let currentCylinderMesh = null;
let Circle1mesh = null;
let Circle2mesh = null;

///SCENA

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 10, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

///GUI

const gui = new GUI();
const obj = { 
    Lines: true,
    HighlightedLine: true,
    Wireframe: false,
    Surface: false,
    CircleLines:false,
    CircleWireframe:true,
    CirclesSurface:false,
    SurfaceColorNormal:false,
    Radius:7,
    Segments:32,
    Height:22,
    Theta:2*Math.PI,
    Phi:0,
    LineColor: [255, 255, 255],
    CameraAngle:0,
    x: 15,
    y: 15,
    z: 15,
    CameraAnimate:false,
    PhiAnimate:true,
    Credits: function() { alert( 'Hyperboloid Visualiser made by Sirghe Matei-Stefan for University Algebra Course. (En)                                                                 Vizualizator de hiperboloid cu panza realizat de Sirghe Matei-Stefan pentru Cursul Universitar de Algebră. (Ro)' ) }
};

const fisier1 = gui.addFolder('Display Modes');
fisier1.add(obj,'Lines').onChange(() => {
    Generate(obj.Radius, obj.Height, obj.Segments);
});
fisier1.add(obj,'Wireframe').onChange(() => {
    Generate(obj.Radius, obj.Height, obj.Segments);
});
fisier1.add(obj,'Surface').onChange(() => {
    Generate(obj.Radius, obj.Height, obj.Segments);
});
fisier1.add(obj,'CircleLines').onChange(() => {
    Generate(obj.Radius, obj.Height, obj.Segments);
});
fisier1.add(obj,'CircleWireframe').onChange(() => {
    Generate(obj.Radius, obj.Height, obj.Segments);
});
fisier1.add(obj,'CirclesSurface').onChange(() => {
    Generate(obj.Radius, obj.Height, obj.Segments);
});

const fisier2 = gui.addFolder('Display Settings');
fisier2.add(obj,'HighlightedLine').onChange(() => {
    Generate(obj.Radius, obj.Height, obj.Segments);
});
fisier2.add(obj, 'SurfaceColorNormal').onChange(() => {
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
fisier3.add(obj,'Phi',0,2*Math.PI).onChange(() => {
    Generate(obj.Radius, obj.Height, obj.Segments);
});

const fisier4 = gui.addFolder('Camera Functions');
fisier4.add(obj,'CameraAngle',0,2*Math.PI).onChange(() => {UpdateCamera(1)});
fisier4.add(obj, 'x',-30,30,1).onChange(() => {UpdateCamera(0)});
fisier4.add(obj, 'y',-30,30,1).onChange(() => {UpdateCamera(0)});
fisier4.add(obj, 'z',-30,30,1).onChange(() => {UpdateCamera(0)});

const fisier5 = gui.addFolder('Animations');
fisier5.add(obj,'CameraAnimate');
fisier5.add(obj,'PhiAnimate');

const fisier6 = gui.addFolder('Other');
fisier6.add(obj,'Credits');


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
        camera.position.set(x, obj.y, z);
    }
    camera.lookAt(0, 0, 0);
}
UpdateCamera(0);

function Generate(radius, height, segments) {
    ///REMOVE OLD SHIT
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
        currentCylinderMesh.material.dispose();
        scene.remove(currentCylinderMesh);
        currentCylinderMesh = null;
    }

    while(Circlelines.length>0){
        const line = Circlelines.pop();
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

    ///Generare Cerc
    if(segments>2){
        let geometry1 = new THREE.CircleGeometry( radius, segments,obj.Theta,obj.Theta ); 
        let geometry2 = new THREE.CircleGeometry( radius, segments,obj.Theta,obj.Theta ); 
        let material2=null;
        if(obj.SurfaceColorNormal==false){
            material2 = new THREE.MeshDepthMaterial({
                wireframe: obj.CircleWireframe,
                side: THREE.DoubleSide
            });
        }else{
            material2 = new THREE.MeshNormalMaterial({
                wireframe: obj.CircleWireframe,
                side: THREE.DoubleSide
            });
        }
        
        Circle1mesh = new THREE.Mesh( geometry1, material2);
        Circle2mesh = new THREE.Mesh( geometry2, material2);
        Circle1mesh.rotation.x =Math.PI/2;
        Circle1mesh.rotation.z =2*Math.PI/segments+obj.Phi;
        Circle1mesh.position.set(0, height/2, 0); 

        Circle2mesh.rotation.x =Math.PI/2;
        Circle2mesh.rotation.z =2*Math.PI/segments;
        Circle2mesh.position.set(0, -height/2, 0); 

        if(obj.CirclesSurface || obj.CircleWireframe){
            scene.add( Circle1mesh );
            scene.add( Circle2mesh );
        }
    }

    ///MAKE Lines

    const topCircle = [];
    const bottomCircle = [];
    const SolidDisplay = [];

    for (let i = 0; i < obj.Segments; i++) {
        const angle2 = (i / obj.Segments) * obj.Theta +obj.Phi;
        const x2 = Math.cos(angle2) * radius;
        const z2 = Math.sin(angle2) * radius;
        SolidDisplay.push(new THREE.Vector3(x2, height / 2, z2));
        topCircle.push(new THREE.Vector3(x2, height / 2, z2));
    }

    for (let i = 0; i < obj.Segments; i++) {
        const angle1 = (i / obj.Segments) * obj.Theta;
        const x1 = Math.cos(angle1) * radius;
        const z1 = Math.sin(angle1) * radius;
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
                    ? new THREE.Color('rgb(255, 0,0)')
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

    ///GENERARE Puncte
    const vertices = [];
    const indices = [];
    const stepTheta = obj.Theta / obj.Segments; // Step size based on Theta

    for (let i = 0; i < obj.Segments; i++) {
        const currentAngle = i * stepTheta + obj.Phi;
        const nextAngle = (i + 1) * stepTheta + obj.Phi;

        // Calculate vertex positions
        const v0 = new THREE.Vector3(
            Math.cos(currentAngle) * radius,
            height / 2,
            Math.sin(currentAngle) * radius
        );
        const v1 = new THREE.Vector3(
            Math.cos(currentAngle) * radius,
            -height / 2,
            Math.sin(currentAngle) * radius
        );
        const v2 = new THREE.Vector3(
            Math.cos(nextAngle) * radius,
            height / 2,
            Math.sin(nextAngle) * radius
        );
        const v3 = new THREE.Vector3(
            Math.cos(nextAngle) * radius,
            -height / 2,
            Math.sin(nextAngle) * radius
        );

        // Push vertices for the quad
        vertices.push(v0.x, v0.y, v0.z);
        vertices.push(v1.x, v1.y, v1.z);
        vertices.push(v2.x, v2.y, v2.z);
        vertices.push(v3.x, v3.y, v3.z);

        const base = i * 4;

        // Create two triangles for the quad
        indices.push(base, base + 2, base + 1);
        indices.push(base + 1, base + 2, base + 3);
    }

    /// STERGE CHESTIILE VECHI
    if (currentCylinderMesh) {
        currentCylinderMesh.geometry.dispose();
        currentCylinderMesh.material.dispose();
        scene.remove(currentCylinderMesh);
    }

    ///Generare forma dupa puncte
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    let material=null;
    if(obj.SurfaceColorNormal==false){
        material = new THREE.MeshDepthMaterial({
            wireframe: obj.Wireframe,
            side: THREE.DoubleSide,
            //flatShading: !obj.Wireframe
        });
    }else{
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

}

Generate(obj.Radius, obj.Height, obj.Segments);

let GlobAng=obj.CameraAngle;

///UPDATE EVERYTHING
function animate() {
    renderer.render(scene, camera);
    controls.update();
    GlobAng+=0.0025;
    if(obj.CameraAnimate==true){
        const radius = Math.sqrt(obj.x ** 2 + obj.z ** 2);

        const x = radius * Math.cos(GlobAng);
        const z = radius * Math.sin(GlobAng);
        camera.position.set(x, obj.y, z);
        camera.lookAt(0, 0, 0);
    }
    if(obj.PhiAnimate==true){
        obj.Phi+=0.01;
        Generate(obj.Radius, obj.Height, obj.Segments);
    }
}
renderer.setAnimationLoop(animate);
