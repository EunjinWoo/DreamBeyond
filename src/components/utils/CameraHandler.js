import * as THREE from "three";

export function setupCameraInteraction(
  camera,
  scene,
  renderer,
  mainObjectGroup,
  initialCameraPosition,
  onModelClick,
  onOutsideClick
) {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  let isCameraTransformed = false; // 카메라가 변환되었는지 추적
  let hoverZoneActive = false; // URL로 이동 가능한 영역에 마우스가 있는지 추적

  // 카메라 초기 위치 저장
  const originalPosition = new THREE.Vector3(...initialCameraPosition);
  const originalLookAt = new THREE.Vector3(0, 0, 0); // 초기 카메라 시점

  let animationClock = new THREE.Clock(); // 애니메이션을 위한 시계
  let animationActive = false; // 애니메이션 활성 상태
  let startPosition = new THREE.Vector3();
  let endPosition = new THREE.Vector3();
  let startLookAt = new THREE.Vector3();
  let endLookAt = new THREE.Vector3();
  let duration = 0.5; // 애니메이션 지속 시간 (초)

  // 애니메이션 업데이트 함수
  const updateAnimation = () => {
    if (!animationActive) return;

    const elapsed = animationClock.getElapsedTime();
    const t = Math.min(elapsed / duration, 1); // 0에서 1 사이의 비율 계산

    // 위치와 시점 보간
    camera.position.lerpVectors(startPosition, endPosition, t);
    const currentLookAt = new THREE.Vector3().lerpVectors(
      startLookAt,
      endLookAt,
      t
    );
    camera.lookAt(currentLookAt);

    // 애니메이션 종료
    if (t >= 1.3) {
      animationActive = false;
    }
  };

  // 클릭 이벤트 핸들러
  const onMouseClick = (event) => {
    // 마우스 좌표를 정규화
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    if (!isCameraTransformed) {
      // 카메라가 이동되지 않은 상태에서 mainObjectGroup 클릭 처리
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects([mainObjectGroup], true);

      if (intersects.length > 0) {
        // 기존 위치에서 mainObjectGroup 클릭 시: 모델 뒤로 이동
        mainObjectGroup.rotation.set(0, THREE.MathUtils.degToRad(0), 0); // 모델 회전 초기화

        startPosition.copy(camera.position);
        endPosition
          .copy(intersects[0].object.position)
          .add(new THREE.Vector3(-11, 15, 0.5));

        startLookAt.copy(originalLookAt);
        endLookAt.set(-13, 15, 0.65); // 원하는 좌표로 설정

        animationClock.start();
        animationActive = true;
        hoverZoneActive = true;

        isCameraTransformed = true; // 카메라 상태 업데이트
        onModelClick(); // 회전 멈춤
      }
    } else {
      // 카메라가 이동된 상태에서 처리
      const hoverZone = {
        x: window.innerWidth / 2 - 300, // 가로 600px 구간 시작 (600 / 2)
        y: window.innerHeight / 2 - 100, // 세로 450px 구간 시작 (450 / 2), 아래로 이동
        width: 600,
        height: 450,
      };

      // 마우스가 hoverZone 내에 있는지 확인
      if (
        event.clientX >= hoverZone.x &&
        event.clientX <= hoverZone.x + hoverZone.width &&
        event.clientY >= hoverZone.y &&
        event.clientY <= hoverZone.y + hoverZone.height
      ) {
        console.log("Navigating to URL...");
        if (hoverZoneActive) {
          window.location.href = "https://bronze-halibut.squarespace.com/";
          hoverZoneActive = false;
        }
      } else {
        // 변환된 상태에서 아무것도 클릭되지 않으면 원래 위치로 복귀
        startPosition.copy(camera.position);
        endPosition.copy(originalPosition);

        startLookAt.copy(originalLookAt);
        endLookAt.copy(originalLookAt);

        animationClock.start();
        animationActive = true;

        // 카메라 상태와 Hover 상태를 초기화
        isCameraTransformed = false; // 카메라 상태 초기화
        hoverZoneActive = false; // Hover 상태 초기화
        renderer.domElement.style.cursor = "default"; // 커서 모양 복원

        onOutsideClick(); // 회전 재개
      }
    }
  };

  // 마우스 이동 이벤트 핸들러
  const onMouseMove = (event) => {
    if (isCameraTransformed) {
      // Hover Zone 정의
      const hoverZone = {
        x: window.innerWidth / 2 - 300, // 가로 600px 구간 시작 (600 / 2)
        y: window.innerHeight / 2 - 100, // 세로 450px 구간 시작 (450 / 2), 아래로 이동
        width: 600,
        height: 450,
      };

      // 마우스가 Hover Zone에 있는지 확인
      if (
        event.clientX >= hoverZone.x &&
        event.clientX <= hoverZone.x + hoverZone.width &&
        event.clientY >= hoverZone.y &&
        event.clientY <= hoverZone.y + hoverZone.height
      ) {
        if (!hoverZoneActive) {
          hoverZoneActive = true;

          // 커서 모양 변경
          renderer.domElement.style.cursor = "pointer";

          // LookAt 방향으로 조금 더 이동
          const lookAtTarget = new THREE.Vector3(-13, 15, 0.65); // LookAt 위치
          const direction = new THREE.Vector3()
            .subVectors(lookAtTarget, camera.position) // LookAt - Camera
            .normalize(); // 방향 벡터

          // 이동 거리 설정
          const moveDistance = 0.6; // LookAt 방향으로 2만큼 이동
          const targetPosition = new THREE.Vector3().addVectors(
            camera.position,
            direction.multiplyScalar(moveDistance)
          );

          startCameraAnimation(camera.position, targetPosition);
        }
      } else {
        if (hoverZoneActive) {
          hoverZoneActive = false;

          // 커서 모양 복원
          renderer.domElement.style.cursor = "default";

          // 카메라를 초기 변환 위치로 애니메이션 이동
          startCameraAnimation(camera.position, { x: -11, y: 15, z: 0.5 });
        }
      }
    }
  };

  // 애니메이션으로 카메라 이동
  const startCameraAnimation = (currentPosition, targetPosition) => {
    const animationClock = new THREE.Clock();
    const duration = 0.5; // 애니메이션 지속 시간 (초)

    const initialPosition = new THREE.Vector3(
      currentPosition.x,
      currentPosition.y,
      currentPosition.z
    );
    const target = new THREE.Vector3(
      targetPosition.x,
      targetPosition.y,
      targetPosition.z
    );

    const animate = () => {
      const elapsed = animationClock.getElapsedTime();
      const t = Math.min(elapsed / duration, 1); // 0에서 1 사이의 비율 계산

      // 위치 보간
      camera.position.lerpVectors(initialPosition, target, t);

      // 카메라가 타겟 방향을 계속 바라보게 설정
      camera.lookAt(new THREE.Vector3(-13, 15, 0.65)); // 변환된 상태의 LookAt 좌표 유지

      if (t < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  };

  // 이벤트 리스너 등록
  renderer.domElement.addEventListener("click", onMouseClick);
  renderer.domElement.addEventListener("mousemove", onMouseMove);

  // 렌더 루프에 애니메이션 업데이트 추가
  const animate = () => {
    updateAnimation();
    requestAnimationFrame(animate);
  };
  animate();

  return () => {
    // 이벤트 리스너 제거
    renderer.domElement.removeEventListener("click", onMouseClick);
    renderer.domElement.removeEventListener("mousemove", onMouseMove);
  };
}
