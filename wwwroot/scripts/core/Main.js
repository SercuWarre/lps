import * as THREE from '../three/build/three.module.js';
import SessionHandler from './SessionHandler.js';
import global from './global.js';
import { GLTFLoader } from '../three/examples/jsm/loaders/GLTFLoader.js';


export default class Main {
    constructor() {
        this._renderer;
        this._scene;
        this._camera;
        this._shapes;
        this._clock = new THREE.Clock();
        this._container = document.getElementById('container');

        this._createRenderer();
        this._createScene();
        this._createUser();
        this._createAssets();
        this._addEventListeners();

        this._sessionHandler = new SessionHandler(this._renderer, this._camera);

        this._renderer.setAnimationLoop(() => { this._update() });
    }

    _createRenderer() {
        this._renderer = new THREE.WebGLRenderer({ antialias : true });
        this._renderer.setSize(window.innerWidth, window.innerHeight);
        this._container.appendChild(this._renderer.domElement);
        if(global.deviceType == "XR") {
            this._renderer.xr.enabled = true;
        }
    }

    _createScene() {
        this._scene = new THREE.Scene();
    }

    _createUser() {
        this._camera = new THREE.PerspectiveCamera(
            45, //Field of View Angle
            window.innerWidth / window.innerHeight, //Aspect Ratio
            0.1, //Clipping for things closer than this amount
            1000 //Clipping for things farther than this amount
        );
        this._camera.position.setY(1.7); //Height of your eyes
        this._scene.add(this._camera);
    }

    _createAssets() {
         let sphereRadius = 0.5;
        let cubeGeometry = new THREE.BoxBufferGeometry(
             1.5 * sphereRadius, //Width
             1.5 * sphereRadius, //Height
             1.5 * sphereRadius //Depth
        );
        let cubeMaterial = new THREE.MeshLambertMaterial({
             color: 0x00FF00 //Green
        });
        let cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);
        //const loader = new GLTFLoader();
        this._shapes = new THREE.Object3D();
        /*let me = this;
        loader.load(
          // resource URL
          '../scripts/models/props.glb',
          // called when the resource is loaded
          function (gltf) {
            let model = gltf.scene;
            model.scale.set(0.01, 0.01, 0.01);
            model.position.set(0, 0, 0);
            model.rotation.set(0, 0, 0);
            me._shapes.add(model);
          }
        );*/

        //Group shapes together and add group to the scene
        
        // this._shapes.add(sphereMesh);
        
        this._shapes.add(cubeMesh);
        this._shapes.position.setY(0); //Place at eye level
        this._shapes.position.setZ(-10); //Move shape forward so we can see it
        this._scene.add(this._shapes);

        //Add light to the scene
        let light = new THREE.PointLight();
        light.position.setY(2);
        this._scene.add(light);
    }

    _addEventListeners() {
        window.addEventListener('resize', () => { this._onResize() });
        window.addEventListener('wheel', function(event) {
                    event.preventDefault();
        }, {passive: false, capture: true});
        
    }

    _onResize () {
        this._renderer.setSize(window.innerWidth, window.innerHeight);
        this._camera.aspect = window.innerWidth / window.innerHeight;
        this._camera.updateProjectionMatrix();
    }

    _update() {
        let timeDelta = this._clock.getDelta();
        //get runtime of the program
        let timeElapsed = this._clock.getElapsedTime();
        // let rotationAmount = 2 * Math.PI * timeDelta * 0.1; //0.1 rotations per second
        // this._shapes.rotation.x += rotationAmount;
        // this._shapes.rotation.y += rotationAmount;
        let x_loc = Math.sin(timeElapsed)*5;
        //log the x location of the shape
        this._shapes.position.setX(x_loc);
        this._sessionHandler.update();
        this._renderer.render(this._scene, this._camera);
    }
}
