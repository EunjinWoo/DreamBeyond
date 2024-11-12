import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import CloudAndChar from "../assets/MacMiler_noPiano.glb";

function Home() {
  const mountRef = useRef(null);
  const mixers = [];
  let action;

  useEffect(() => {
    let WIDTH = window.innerWidth;
    let HEIGHT = window.innerHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#fff");

    const camera = new THREE.PerspectiveCamera(70, WIDTH / HEIGHT, 0.1, 2000);
    camera.position.set(50, 50, 100);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(WIDTH, HEIGHT);
    renderer.shadowMap.enabled = true;

    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);

    const axes = new THREE.AxesHelper(150);
    scene.add(axes);

    // 조명
    const light1 = new THREE.HemisphereLight(0xffffff, 0x080820, 1);
    light1.position.set(300, 300, 300);
    scene.add(light1);

    const light2 = new THREE.PointLight(0xffffff, 0.6);
    light2.position.set(40, 120, 40);
    light2.castShadow = true;
    scene.add(light2);

    const pointLightHelper = new THREE.PointLightHelper(light2, 10);
    scene.add(pointLightHelper);

    // GLTF 모델 로드
    const gltfloader = new GLTFLoader();

    gltfloader.load(
      CloudAndChar,
      function (gltf) {
        console.log("Cloud and Character Model : ", gltf);
        scene.add(gltf.scene);
      },
      undefined,
      function (error) {
        console.error(error);
      }
    );

    const clock = new THREE.Clock();

    const animate = () => {
      const delta = clock.getDelta();

      mixers.forEach((mixer) => mixer.update(delta));

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    const handleResize = () => {
      WIDTH = window.innerWidth;
      HEIGHT = window.innerHeight;

      camera.aspect = WIDTH / HEIGHT;
      camera.updateProjectionMatrix();
      renderer.setSize(WIDTH, HEIGHT);
    };

    window.addEventListener("resize", handleResize);

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("keydown", (event) => {});
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} style={{ width: "100vw", height: "100vh" }} />;
}

export default Home;
