import * as THREE from "three";

export function setupCameraInteraction(
  camera,
  scene,
  renderer,
  targetModel,
  initialCameraPosition,
  onModelClick,
  onOutsideClick
) {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  // 카메라 초기 위치 저장
  const originalPosition = new THREE.Vector3(...initialCameraPosition);
  const originalLookAt = new THREE.Vector3(0, 0, 0); // 초기 카메라 시점

  // 클릭 이벤트 핸들러
  const onMouseClick = (event) => {
    // 마우스 좌표를 정규화
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // 카메라에서 Raycaster를 통해 교차 체크 (Raycaster 설정)
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects([targetModel], true);

    if (intersects.length > 0) {
      // 모델이 클릭된 경우: 모델 뒤로 이동
      const newPosition = new THREE.Vector3();
      newPosition.copy(intersects[0].object.position);
      newPosition.add(new THREE.Vector3(0, 0, -50)); // 뒤쪽 위치로 이동

      camera.position.copy(newPosition);
      camera.lookAt(intersects[0].object.position);

      onModelClick(); // 회전 멈춤
    } else {
      // 모델 외부 클릭 시: 원래 위치로 돌아가기
      camera.position.copy(originalPosition);
      camera.lookAt(originalLookAt);

      onOutsideClick(); // 회전 재개
    }
  };

  // 이벤트 리스너 등록
  renderer.domElement.addEventListener("click", onMouseClick);

  return () => {
    // 이벤트 리스너 제거
    renderer.domElement.removeEventListener("click", onMouseClick);
  };
}
