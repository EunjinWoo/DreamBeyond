import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import DreamBeyondModel from "../assets/dream-beyond-object.glb";

function Home() {
  const mountRef = useRef(null);
  const mixers = [];
  let action;

  useEffect(() => {
    let WIDTH = window.innerWidth;
    let HEIGHT = window.innerHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#000000");

    const camera = new THREE.PerspectiveCamera(70, WIDTH / HEIGHT, 0.1, 2000);
    camera.position.set(50, 30, 100);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(WIDTH, HEIGHT);
    renderer.shadowMap.enabled = true;

    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);

    const modelCharacter = new THREE.Object3D();
    const modelBackground = new THREE.Object3D();
    const model = new THREE.Object3D();

    {
      const axes = new THREE.AxesHelper(150);
      scene.add(axes);

      const gridHelper = new THREE.GridHelper(70, 20);
      scene.add(gridHelper);
    }

    scene.fog = new THREE.Fog(0x000000, 10, 1000);

    // 조명
    {
      // ambient light
      const ambient_light = new THREE.AmbientLight(0xf6f5ff, 0.7);
      scene.add(ambient_light);

      // directional light 1
      const directional_light = new THREE.DirectionalLight(0xf6f5ff, 1.5);
      directional_light.castShadow = true;
      scene.add(directional_light);

      // directional light 2
      const directional_light_2 = new THREE.DirectionalLight(0xefedff, 0.6);
      directional_light_2.castShadow = true;
      directional_light_2.position.set(50, 50, 50);
      scene.add(directional_light_2);

      const directionalLightHelper2 = new THREE.DirectionalLightHelper(
        directional_light_2,
        5,
        "#000"
      );
      scene.add(directionalLightHelper2);

      // directional light 3
      const directional_light_3 = new THREE.DirectionalLight(0xefedff, 0.6);
      directional_light_3.castShadow = true;
      directional_light_3.position.set(50, 50, 50);
      scene.add(directional_light_3);

      const directionalLightHelper3 = new THREE.DirectionalLightHelper(
        directional_light_3,
        5,
        "#000"
      );
      scene.add(directionalLightHelper3);

      // directional light 4
      const directional_light_4 = new THREE.DirectionalLight(0xefedff, 2);
      directional_light_4.castShadow = true;
      directional_light_4.position.set(-50, 50, -50);
      scene.add(directional_light_4);

      const directionalLightHelper4 = new THREE.DirectionalLightHelper(
        directional_light_4,
        5,
        "#000"
      );
      scene.add(directionalLightHelper4);

      // directional light 5 - below object
      const directional_light_5 = new THREE.DirectionalLight(0xefedff, 1);
      directional_light_5.castShadow = true;
      directional_light_5.position.set(-50, -50, -50);
      scene.add(directional_light_5);

      const directionalLightHelper5 = new THREE.DirectionalLightHelper(
        directional_light_5,
        5,
        "#000"
      );
      scene.add(directionalLightHelper5);

      // directional light 6 - to mini clouds
      const directional_light_6 = new THREE.DirectionalLight(0xefedff, 0.6);
      directional_light_6.castShadow = true;
      directional_light_6.position.set(50, 50, 50);
      directional_light_6.target.position.set(-30, 30, 30);
      scene.add(directional_light_6);
      scene.add(directional_light_6.target);

      const directionalLightHelper6 = new THREE.DirectionalLightHelper(
        directional_light_6,
        5,
        "#000"
      );
      scene.add(directionalLightHelper6);
    }

    // GLTF 모델 로드
    const gltfloader = new GLTFLoader();

    gltfloader.load(
      DreamBeyondModel,
      function (gltf) {
        console.log("Cloud and Character Model : ", gltf.scene.children[1]);
        const background = gltf.scene.children[0];
        const object = gltf.scene.children[1];

        //크기 / 위치 조절
        const objectScale = 55;
        object.scale.set(objectScale, objectScale, objectScale);
        object.position.set(7, 7, 0);

        const backgroundScale = 13;
        background.scale.set(backgroundScale, backgroundScale, backgroundScale);
        background.position.set(-30, 0, 0);
        background.rotation.set(0, 0, 45);

        // 그림자 생기도록
        object.recieveShadow = true;

        modelCharacter.add(object);
        modelBackground.add(background);
        console.log("model added :", model);
        model.rotation.set(0, 5, 0);

        scene.add(modelCharacter);
        scene.add(modelBackground);
      },
      undefined,
      function (error) {
        console.error(error);
      }
    );

    const animate = () => {
      modelCharacter.rotation.y += 0.0008;
      modelBackground.rotation.y += 0.0001;

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
