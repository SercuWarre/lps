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
        this._plane;
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
        this._camera.position.setZ(0); //Move camera back so we can see the shapes
        this._scene.add(this._camera);
        //this._scene.background = new THREE.Color(0xB2BEB5);
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
        this._plane = new THREE.Object3D();
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
        this._shapes.position.setZ(0); //Move shape forward so we can see it
        this._scene.add(this._shapes);
        let loader = new THREE.TextureLoader();
        let texture = loader.load('../scripts/Texture/granstudio_grid2.jpg');
        /*texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.x = 3;
        texture.repeat.y = 3;*/
        const geometry = new THREE.PlaneGeometry(10, 10, 5, 5);
        const material = new THREE.MeshPhongMaterial({ map: texture, side: THREE.DoubleSide });
        const plane = new THREE.Mesh(geometry, material);
        this._plane.add(plane);
        this._plane.position.setY(-0.5); //Place at eye level
        this._plane.position.setZ(-5); //Move shape forward so we can see it
        this._plane.rotation.x = -Math.PI / 2;
        this._scene.add(this._plane);

        this._addSkyBox();
        //Add light to the scene
        let light = new THREE.PointLight(0xffffff, 0.1);
        let ambientLight = new THREE.AmbientLight(0xffffff,0.5);
        light.position.setY(0);
        light.position.setZ(10);
        this._scene.add(ambientLight);
        this._scene.add(light);
    }

    _addSkyBox() {
        let materialArray = [];
        let texture_ft = new THREE.TextureLoader().load('../scripts/Texture/andy_wall.jpg');
        let texture_bk = new THREE.TextureLoader().load('../scripts/Texture/andy_wall.jpg');
        let texture_up = new THREE.TextureLoader().load('../scripts/Texture/andy_roof.jpg');
        let texture_dn = new THREE.TextureLoader().load('../scripts/Texture/andy_floor.jpg');
        let texture_rt = new THREE.TextureLoader().load('../scripts/Texture/andy_wall.jpg');
        let texture_lf = new THREE.TextureLoader().load('../scripts/Texture/andy_wall.jpg');

        materialArray.push(new THREE.MeshBasicMaterial({ map: texture_ft, side: THREE.DoubleSide }));
        materialArray.push(new THREE.MeshBasicMaterial({ map: texture_bk, side: THREE.DoubleSide }));
        materialArray.push(new THREE.MeshBasicMaterial({ map: texture_up, side: THREE.DoubleSide }));
        materialArray.push(new THREE.MeshBasicMaterial({ map: texture_dn, side: THREE.DoubleSide }));
        materialArray.push(new THREE.MeshBasicMaterial({ map: texture_rt, side: THREE.DoubleSide }));
        materialArray.push(new THREE.MeshBasicMaterial({ map: texture_lf, side: THREE.DoubleSide }));

        console.log('hola');
        
        /*for (let i = 0; i < 6; i++)
            materialArray[i].side = THREE.BackSide;*/

        let skyboxGeo = new THREE.BoxGeometry(15, 10, 15);
        let skybox = new THREE.Mesh(skyboxGeo, materialArray);
        skybox.position.set(0, 4.45, -5);
        this._scene.add(skybox);
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
        //let timeDelta = this._clock.getDelta();
        //get runtime of the program
        //let timeElapsed = this._clock.getElapsedTime();
        // let rotationAmount = 2 * Math.PI * timeDelta * 0.1; //0.1 rotations per second
        // this._shapes.rotation.x += rotationAmount;
        // this._shapes.rotation.y += rotationAmount;
        //let x_loc = Math.sin(timeElapsed)*5;
        //log the x location of the shape
        this._shapes.position.setX((window.object['1'][0]) * 10);
        this._shapes.position.setY((window.object['1'][1]) * -10);
        this._shapes.position.setZ(((window.object['1'][2]) * -10)-5);
        this._sessionHandler.update();
        this._renderer.render(this._scene, this._camera);
    }
}
