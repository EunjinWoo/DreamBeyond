import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { setupCameraInteraction } from "../components/utils/CameraHandler";
import LoadingOverlay from "../components/LoadingOverlay";

function Home() {
  const mountRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가
  const [loadingProgress, setLoadingProgress] = useState(0); // 로딩 퍼센트 추가

  // 환경 변수에서 Blob URL 가져오기
  const DreamBeyondModel =
    "https://dreambeyondbucket.s3.ap-northeast-2.amazonaws.com/dream-beyond-object-portfoliopng.glb";
  const mixers = [];
  let action;

  useEffect(() => {
    let WIDTH = window.innerWidth;
    let HEIGHT = window.innerHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#000000");

    const initialCameraPosition = [50, 30, 100]; // 초기 카메라 위치
    const camera = new THREE.PerspectiveCamera(70, WIDTH / HEIGHT, 0.1, 2000);
    camera.position.set(...initialCameraPosition);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(WIDTH, HEIGHT);
    renderer.shadowMap.enabled = true;

    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false; // 확대/축소 비활성화

    const modelCharacter = new THREE.Object3D();
    const modelBackground = new THREE.Object3D();
    const model = new THREE.Object3D();
    const modelLaptopScreen = new THREE.Mesh();
    const mainObjectGroup = new THREE.Group();

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
    let isRotating = true;

    gltfloader.load(
      DreamBeyondModel,
      function (gltf) {
        console.log("Cloud and Character Model : ", gltf.scene.children[1]);
        const background = gltf.scene.children[0];
        const object = gltf.scene.children[1];
        const laptopScreen =
          gltf.scene.children[1].children[8].children[0].children[0].children[0]
            .children[0].children[0].children[2].children[0].children[4];
        // console.log("Laptop Model : ", laptop);

        // laptop.traverse((child) => {
        //   if (child.name === "obRdEiGZsRMTwyW") {
        //     // laptopScreen.add(child);
        //     laptopScreen = child;
        //   }
        // });
        console.log("Laptop Screen Object:", laptopScreen); // 객체 확인

        // 크기 / 위치 조절
        const objectScale = 55;
        object.scale.set(objectScale, objectScale, objectScale);
        object.position.set(7, 7, 0);
        object.name = "modelCharacter";

        const backgroundScale = 13;
        background.scale.set(backgroundScale, backgroundScale, backgroundScale);
        background.position.set(-30, 0, 0);
        background.rotation.set(0, 0, 45);

        const laptopScreenScale = 0.218;
        laptopScreen.scale.set(
          laptopScreenScale,
          laptopScreenScale,
          laptopScreenScale
        );
        laptopScreen.position.set(-13.7, 12.35, 0.6);
        laptopScreen.rotation.set(0, THREE.MathUtils.degToRad(95), 0);
        laptopScreen.name = "modelLaptopScreen";

        // 그림자 생기도록
        object.recieveShadow = true;

        modelCharacter.add(object);
        modelBackground.add(background);
        modelLaptopScreen.add(laptopScreen);
        console.log("model added :", model);
        model.rotation.set(0, 5, 0);

        mainObjectGroup.add(modelLaptopScreen);
        mainObjectGroup.add(modelCharacter);

        scene.add(mainObjectGroup);
        scene.add(modelBackground);

        // 모델 로딩 완료 시 로딩 화면 제거
        setIsLoading(false);
      },
      (xhr) => {
        // onProgress: 로딩 진행 상태 업데이트
        if (xhr.lengthComputable) {
          const percentComplete = (xhr.loaded / xhr.total) * 100;
          setLoadingProgress(Math.round(percentComplete));
        }
      },
      function (error) {
        console.error(error);
      }
    );

    const animate = () => {
      if (isRotating) {
        mainObjectGroup.rotation.y += 0.0008;
        modelBackground.rotation.y += 0.0001;
      }

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    const cleanupCameraHandler = setupCameraInteraction(
      camera,
      scene,
      renderer,
      mainObjectGroup,
      initialCameraPosition,
      () => {
        isRotating = false; // 모델 클릭 시 회전 멈춤
      },
      () => {
        isRotating = true; // 모델 외부 클릭 시 회전 재개
      }
    );

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
      cleanupCameraHandler();
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <>
      {isLoading && <LoadingOverlay progress={loadingProgress} />}{" "}
      {/* 로딩 화면 표시 */}
      <div ref={mountRef} style={{ width: "100vw", height: "100vh" }} />
    </>
  );
}

export default Home;
