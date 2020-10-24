import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import PARAMETERS from "store/config/parameters.yml";
import Coordinates from "renderer/coordinates";
import AutoDrivingCar from "renderer/adc";
import Ground from "renderer/ground";
import PlanningTrajectory from "renderer/trajectory.js";

class Renderer {
    constructor() {
        this.coordinates = new Coordinates();
        this.renderer = new THREE.WebGLRenderer({
            preserveDrawingBuffer: true
        });
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x031C31);

        // The ground.
        this.ground = new Ground();

        // The main autonomous driving car.
        this.adc = new AutoDrivingCar();
        // The mesh this.adc.mesh is not added to the scene because it
        // takes time to load. It will be added later on.
        this.adcMeshAddedToScene = false;

        // The planning tranjectory.
        this.planningTrajectory = new PlanningTrajectory();

    }

    initialize(canvasId, width, height, options) {
        this.options = options;

        // Camera
        this.viewAngle = PARAMETERS.camera.viewAngle;
        this.viewDistance = (
            PARAMETERS.camera.laneWidth *
            PARAMETERS.camera.laneWidthToViewDistanceRatio);
        this.camera = new THREE.PerspectiveCamera(
            PARAMETERS.camera[this.options.cameraAngle].fov,
            width / height,
            PARAMETERS.camera[this.options.cameraAngle].near,
            PARAMETERS.camera[this.options.cameraAngle].far
        );
        // this.camera.position.set(0,-16,3);
        // // this.camera.lookAt(this.scene.position);
        // this.camera.lookAt(0,0,0);
        // 实验
        // this.camera.position.set(0,-6,3);
        // this.camera.up.set(0, 0, 1); // 设置相机的顶部为Z轴正方向
        // this.camera.lookAt(0,0,0)
        // 验证
        // this.camera.position.set(-8.46972543541674,-13.190815818824133, 16.140512045239262);
        // this.camera.up.set(0, 0, 1); // 设置相机的顶部为Z轴正方向
        // this.camera.lookAt(8.46972543541674,13.190815818824133,0)
        this.scene.add(this.camera);

        //坐标轴辅助
        // var axes = new THREE.AxesHelper(10);
        // this.scene.add(axes);

        this.updateDimension(width, height);
        this.renderer.setPixelRatio(window.devicePixelRatio);

        const container = document.getElementById(canvasId);
        container.appendChild(this.renderer.domElement);

        const ambient = new THREE.AmbientLight(0x444444);
        const directionalLight = new THREE.DirectionalLight(0xffeedd);
        directionalLight.position.set(0, 0, 1).normalize();
        // Hack fix orbit control plugin
        //
        // TODO maybe implement this?
        // 添加控件
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        // this.controls.enabled = false;
        // OrbitControl实验
        // this.camera.position.set(0, 0, 6);
        // this.controls.update();

        this.scene.add(ambient);
        this.scene.add(directionalLight);

        // TODO maybe add sanity check.

        // Actually start the animation.
        this.animate();
    }

    maybeInitializeOffest(x, y) {
        // 将车的初始位置设置为补偿值，用于将车的物理坐标映射到三维坐标系
        // 相当于车的初始位置始终映射为三维坐标系的原点
        if (!this.coordinates.isInitialized()) {
            this.coordinates.initialize(x, y);
        }
    }

    updateDimension(width, height) {
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    adjustCameraWithTarget(target) {
        // console.log(target);
        // TODO Add more views.
        const deltaX = (this.viewDistance * Math.cos(target.rotation.y)
            * Math.cos(this.viewAngle));
        const deltaY = (this.viewDistance * Math.sin(target.rotation.y)
            * Math.cos(this.viewAngle));
        const deltaZ = this.viewDistance * Math.sin(this.viewAngle);
       
        this.camera.position.x = target.position.x - deltaX;
        this.camera.position.y = target.position.y - deltaY;
        this.camera.position.z = target.position.z + deltaZ;
       
        this.camera.up.set(0, 0, 1);
        this.camera.lookAt(
            target.position.x + deltaX,
            target.position.y + deltaY,
            0
        );
        //  // 实验OrbitControls
        //  this.enableOrbitControls();
        //  console.log(this.controls)
        // this.camera.position.set(-8.46972543541674, -13.190815818824133, 16.140512045239262);
        // this.camera.up.set(0, 0, 1); // 设置相机的顶部为Z轴正方向
        // this.camera.lookAt(8.46972543541674, 13.190815818824133,0)
        // console.log(this.camera);
        this.camera.updateProjectionMatrix();
    }

    enableOrbitControls() {
        const carPosition = this.adc.mesh.position;
        this.controls.enabled = true;
        this.controls.enableRotate = false;
        this.controls.reset();
        this.controls.minDistance = 20;
        this.controls.maxDistance = 1000;
        this.controls.target.set(carPosition.x, carPosition.y, 0);

        this.camera.position.set(carPosition.x, carPosition.y, 50);
        this.camera.up.set(0, 1, 0);
        this.camera.lookAt(carPosition.x, carPosition.y, 0);

    }

    // Render one frame. This supports the main draw/render loop.
    render() {
        // TODO should also return when no need to update.
        if (!this.coordinates.isInitialized()) {
            // console.log("坐标未初始化！")
            return;
        }

        // 如果车模型或者地面模型未加载完毕，则返回
        if (!this.adc.mesh || !this.ground.mesh) {
            // console.log("模型未加载！")
            return;
        }

        // Upon the first time in render() it sees car mesh loaded,
        // added it to the scene.
        if (!this.adcMeshAddedToScene) {
            this.adcMeshAddedToScene = true;
            this.scene.add(this.adc.mesh);
            // console.log(this.adc.mesh);
            // console.log("添加车模型！")
        }

        // Upon the first time in render() it sees ground mesh loaded,
        // added it to the scene.
        if (!this.ground.initialized) {
            this.ground.initialize(this.coordinates);
            this.scene.add(this.ground.mesh);
            // console.log(this.ground.mesh);
            // console.log("添加地面模型！")
        }

        // 根据目标位置实时调整相机位置，使物体始终处在视野的良好范围内
        this.adjustCameraWithTarget(this.adc.mesh);
        this.renderer.render(this.scene, this.camera);
    }

    animate() {
        requestAnimationFrame(() => {
            this.animate();
        });
        // this.controls.update();
        this.render();
    }

    updateWorld(world) {
        // console.log(world);
        this.adc.update(world, this.coordinates);
        // 更新规划轨迹点
        this.planningTrajectory.update(world, this.coordinates, this.scene);
    }
}

const RENDERER = new Renderer();

export default RENDERER;
