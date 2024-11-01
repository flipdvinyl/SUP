
let numSteps = 17;  // 기본 타원 개수
let diameter = 100;  // 기본 타원의 지름 (X축 지름)
let maxStretchSet1 = 12;  // Set1의 Y축 변형 비율의 최대값
let maxStretchSet2 = 12;  // Set2의 Y축 변형 비율의 최대값
let maxStretchSet3 = 14;  // Set3의 Y축 변형 비율의 최대값
let maxStretchSet4 = 8;  // 첫 번째 타원의 Y축 변형 비율의 최대값
let overlapRatio = 0.95;  // 5% 겹침 (100% - 5%)
let rectWidth = 30;  // 직사각형의 너비
let rectHeight = 300;  // 직사각형의 높이
let totalWidth = 500;  // 왼쪽 끝에서 오른쪽 끝까지의 총폭 (초기값 400)

let numStepsCircle = 12;  // 기본 타원 개수
let numArms = 14;  // 팔 개수 (8방향)
let centerGap = 80;  // 중심의 빈 공간 크기
// 타원의 긴쪽 지름의 최대치를 계산
let outerCircleRadius;  // 가장 바깥 원의 반지름 (회전 중심 기준)

// 각 Set의 배경색 및 도형 색
let bgSet1, shapeColorSet1, bgSet2, shapeColorSet2, bgSet3, shapeColorSet3, bgSet4, shapeColorSet4;


function setup() {
  createCanvas(1200, 800);  // SVG 모드로 캔버스 생성
  noStroke();  // 도형의 외곽선을 제거
  textSize(20);  // 텍스트 크기 설정
  textAlign(RIGHT, TOP);  // 텍스트를 우상단에 맞추기 위해 정렬 설정

  outerCircleRadius = min(width, height) / 2;  // 화면 크기에서 여유를 두고 원 반지름 계산

  // 색상 정의
  bgSet1 = color(0, 0, 0);
  shapeColorSet1 = color(255, 255, 255);
  bgSet2 = color(0, 0, 0);
  shapeColorSet2 = color(255, 255, 255);
  bgSet3 = color(0, 0, 0);
  shapeColorSet3 = color(255, 255, 255);
  bgSet4 = color(0, 0, 0);
  shapeColorSet4 = color(255, 255, 255);
}

function draw() {
  background(255);  // 전체 배경을 흰색으로 초기화

  // 화면을 4분할하여 각 세트를 배치
  drawSetSymmetric(0, width / 2, bgSet1, shapeColorSet1, maxStretchSet1, 0);  // Set1 (좌상단)
  drawSetSymmetricReverse(width / 2, width, bgSet2, shapeColorSet2, maxStretchSet2, 0);  // Set2 (우상단)
  drawSet(0, width / 2, bgSet3, shapeColorSet3, maxStretchSet3, true, height / 2);  // Set3 (좌하단)
  drawSetCircle(width / 2, width, bgSet4, shapeColorSet4, maxStretchSet4, height / 2);  // Set4 (우하단)
  

}

function drawSetSymmetric(startX, endX, bgColor, shapeColor, maxStretch, yOffset) {
  fill(bgColor);  // 배경색 설정
  rect(startX, yOffset, endX - startX, height / 2);  // 영역 배경 그리기

  let xProgress = map(mouseX, 0, 1200, 0, 1);
  let curveFactor = calculateCurveFactor(xProgress);

  let yProgress = map(mouseY, 0, height, 0, 1);
  let dynamicStretch = map(yProgress, 0, 1, maxStretch, 1);  // Y축 변형 비율 계산

  push();
  translate((startX + endX) / 2, height / 4 + yOffset);  // 위쪽 반에 배치
  scale(0.6);  // 스케일 조정

  drawEllipsesAndRectSymmetric(numSteps, curveFactor + 0.2, dynamicStretch, shapeColor);  // 대칭 타원 그리기
  pop();
}

function drawSetSymmetricReverse(startX, endX, bgColor, shapeColor, maxStretch, yOffset) {
  fill(bgColor);  // 배경색 설정
  rect(startX, yOffset, endX - startX, height / 2);  // 영역 배경 그리기

  let xProgress = map(mouseX, 0, 1200, 1, 0);
  let curveFactor = calculateCurveFactor(xProgress);

  let yProgress = map(mouseY, 0, height, 0, 1);
  let dynamicStretch = map(yProgress, 0, 1, maxStretch, 1);  // Y축 변형 비율 계산

  push();
  translate((startX + endX) / 2, height / 4 + yOffset);  // 위쪽 반에 배치
  scale(0.6);  // 스케일 조정

  drawEllipsesAndRectSymmetricReverse(numSteps, curveFactor + 0.2, dynamicStretch, shapeColor);   
  pop();
}

function drawSet(startX, endX, bgColor, shapeColor, maxStretch, drawRect, yOffset) {
  fill(bgColor);
  rect(startX, yOffset, endX - startX, height / 2);

  let xProgress = map(mouseX, 0, 1200, 0, 1);
  let curveFactor = calculateCurveFactor(xProgress);
  let yProgress = map(mouseY, 0, height, 0, 1);
  let dynamicStretch = map(yProgress, 0, 1, maxStretch, 1);

  push();
  translate((startX + endX) / 2, height / 4 + yOffset);  // 아래쪽 반에 배치
  scale(0.6);

  drawEllipsesAndRect(numSteps, curveFactor, dynamicStretch, shapeColor, drawRect);
  pop();
}

function drawSetCircle(startX, endX, bgColor, shapeColor, maxStretch, yOffset) {
  fill(bgColor);  // Set4 배경색 설정
  rect(startX, yOffset, endX - startX, height / 2);  // Set4의 배경 그리기
  
  push();
  translate((startX + endX) / 2, 3 * height / 4 );  // Set4 영역 중앙으로 이동 (하단)
  scale(0.2);  // 스케일 축소

  let yProgress = map(mouseX, 0, width, 0, 1);
  let scaleFactor = map(yProgress, 0, 1, 0.5, 1.5);
  let curveFactor = calculateCurveFactorCircle(0);

  let xProgress = map(mouseY, height, 0, 0.5, (3*numStepsCircle)/numArms);
  let maxOuterEllipseHeight = TWO_PI * outerCircleRadius / numArms;
  let dynamicStretch = map(1 - yProgress, 0, 1, 1, maxOuterEllipseHeight / (diameter / 2));

  for (let arm = 0; arm < numArms; arm++) {
    let angle = TWO_PI / numArms * arm;
    push();
    rotate(angle);
    drawEllipses(numStepsCircle, curveFactor, dynamicStretch, xProgress, scaleFactor);
    pop();
  }

  pop();
}

function drawEllipsesAndRectSymmetric(steps, curveFactor, dynamicStretch, shapeColor) {
  let currentX = -(totalWidth / 2) + rectWidth / 2;
  let stepWidth = totalWidth / (steps * overlapRatio);
  
  fill(shapeColor);

  for (let i = 0; i < steps+1; i++) {
    let progress = abs((steps / 2) - i) / (steps / 2);
    let adjustedProgress = pow(progress, curveFactor);
    let radiusX = stepWidth / 2;
    let radiusY = (diameter / 4) * (1 + (1 - adjustedProgress) * dynamicStretch);

    ellipse(currentX, 0, radiusX * 2, radiusY * 2);

    currentX += radiusX * 2 * overlapRatio;
  }
}

function drawEllipses(numStepsCircle, curveFactor, dynamicStretch, xProgress, scaleFactor) {
  let currentX = centerGap / 3;
  let stepWidth = totalWidth / (numStepsCircle * overlapRatio);  // 각 타원의 폭 (갯수에 따라 자동 조정됨)

  fill(255);  // 타원 색상 설정 (흰색)

  for (let i = 0; i < numStepsCircle; i++) {
    let progress = i / (numStepsCircle - 1);  // 진행 상태를 0에서 1까지 비율로 계산
    let adjustedProgress = pow(progress, curveFactor);  // 커브를 반영한 비율
    
    // X축 반지름과 Y축 반지름 비율 조정 (scaleFactor를 적용)
    let radiusX = (diameter / 10) * (1 + adjustedProgress * dynamicStretch * 3) * scaleFactor;
    let radiusY = radiusX * xProgress;  // X축의 비율에 따라 Y축 조정

    ellipse(currentX, 0, radiusX * 2, radiusY * 2);  // 타원 그리기

    currentX += radiusX * 2.4 * (1 - (numStepsCircle * 0.008));  // 다음 타원의 X 좌표 계산
  }
}

function drawEllipsesAndRect(steps, curveFactor, dynamicStretch, shapeColor, drawRect) {
  let currentX = -(totalWidth / 2);  // 첫 번째 타원의 X 좌표 시작점
  let stepWidth = totalWidth / (steps * overlapRatio);  // 각 타원의 폭 (갯수에 따라 자동 조정됨)
  
  fill(shapeColor);  // 도형의 색상 설정

  for (let i = 0; i < steps; i++) {
    let progress = i / (steps - 1);  // 진행 상태를 0에서 1까지 비율로 계산
    let adjustedProgress = pow(progress, curveFactor);  // 커브를 반영한 비율
    let radiusX = stepWidth / 2;  // X축 반지름
    let radiusY = (diameter / 4) * (1 + (1 - adjustedProgress) * dynamicStretch);  // Y축 반지름

    ellipse(currentX, 0, radiusX * 2, radiusY * 2);  // 타원 그리기

    currentX += radiusX * 2 * overlapRatio;  // 다음 타원의 X 좌표 계산
  }

  // 직사각형 그리기
  if (drawRect) {
    let rectX = currentX - stepWidth / 2.2;
    let rectY = -rectHeight / 2;
    rect(rectX, rectY, rectWidth, rectHeight);  // 직사각형 그리기
  }
}

function calculateCurveFactor(xProgress) {
  return map(1 - xProgress, 0, 1, 2.5, 0.2);  // xProgress에 따른 곡률 계산
}

function calculateCurveFactorCircle(yProgress) {
  return map(yProgress, 0, 1, 2.5, 0.2);  // yProgress에 따른 커브 비율 계산
}

function drawEllipsesAndRectSymmetricReverse(steps, curveFactor, dynamicStretch, shapeColor) {
  let currentX = -(totalWidth / 2) + rectWidth / 2;  // 첫 번째 타원의 X 좌표 시작점
  let stepWidth = totalWidth / (steps * overlapRatio);  // 각 타원의 폭 (갯수에 따라 자동 조정됨)

  fill(shapeColor);  // 도형의 색상 설정

  let midPoint = steps / 2;  // 중간 지점 계산

  for (let i = 0; i < steps; i++) {
    let progress;
    if (i < midPoint - 1) {
      progress = (midPoint - i) / midPoint;
    } else if (i === midPoint || i === midPoint - 1) {
      progress = 0;
    } else {
      progress = (i - midPoint + 1) / midPoint;
    }

    let adjustedProgress = pow(progress, curveFactor);
    let radiusX = stepWidth / 2;
    let radiusY = (diameter / 4) * (1 + adjustedProgress * dynamicStretch);  // 반대로 적용 (나비 모양)

    ellipse(currentX, 0, radiusX * 2, radiusY * 2);  // 타원 그리기

    currentX += radiusX * 2 * overlapRatio;  // 다음 타원의 X 좌표 계산
  }
}



function keyPressed() {
  if (key === ' ') {
    //save("snapshot.svg");  // 스페이스바를 누르면 SVG 파일로 저장
  } else if (keyCode === UP_ARROW) {
    numSteps++;  // 타원의 개수 증가
    numArms = min(100, numArms + 1);  // 팔 개수 증가
  } else if (keyCode === DOWN_ARROW && numSteps > 1) {
    numSteps--;  // 타원의 개수 감소
    numArms = max(1, numArms - 1);  // 팔 개수 감소
  } else if (keyCode === LEFT_ARROW) {
    totalWidth = max(10, totalWidth - 10);  // 폭 줄이기
    numStepsCircle--;
  } else if (keyCode === RIGHT_ARROW) {
    totalWidth += 10;  // 폭 늘리기
    numStepsCircle++;
  }
}
