let myFont;

function preload() {
  // 외부 웹 호스팅된 폰트 URL 사용
  myFont = loadFont("CircularXXTrial-Regular.otf");
}

let widthAir = 1200;
let heightAir = 600;
let textSizeAir = 120;

let prevMouseX, prevMouseY; // 이전 마우스 위치 변수
let maxFrames = 30; // 마지막 10프레임 저장
let lines = []; // 선 데이터를 저장할 배열

function setup() {
  frameRate(12);  // 프레임 레이트를 24fps로 설정
  pixelDensity(1);  // 앤티앨리어싱 제거
  createCanvas(1200, 600);
  noStroke();
  rectMode(CENTER);
  prevMouseX = mouseX; // 초기값 설정
  prevMouseY = mouseY;  
  background(0); // 초기 배경 설정 (화면을 한 번만 지움)
}

function draw() {
  background(0); // 배경을 초기화  
  fill(255, 204);

  let posAX = mouseX - (widthAir / 15);
  let posAY = mouseY + (heightAir / textSizeAir);
  let posIX = width - mouseX;
  let posIY = height - mouseY;
  let posRX = ((widthAir / 15) + (mouseY * 3.4) / 2) + 100;
  let posRY = mouseX * 0.5;

  // 마우스가 움직일 때 선 데이터를 저장
  if (mouseX != prevMouseX || mouseY != prevMouseY) {
    let frameLines = [];
    let alpha = random(40, 150); // 새로 생성되는 선의 알파값을 40~150으로 설정

    for (let i = 0; i < 60; i++) {
      // A 글자의 X, Y 오프셋 적용 (글자 높이를 반영)
      let offsetAX = random(-20, 20);
      let offsetAY = map(i, 0, 60, -textSizeAir * 0.06, textSizeAir * 0.35) + random(-35, 35) - 30;

      // I 글자의 X, Y 오프셋 적용
      let offsetIX = random(-5, 5);
      let offsetIY = map(i, 0, 60, -textSizeAir * 0.06, textSizeAir * 0.35) + random(-35, 35) - 30;

      // R 글자의 X, Y 오프셋 적용
      let offsetRX = random(-30, 30);
      let offsetRY = map(i, 0, 60, -textSizeAir * 0.06, textSizeAir * 0.35) + random(-35, 35) - 30;

      // A와 I 사이에 선 그리기 (높이 반영)
      frameLines.push(new LineSegment(posAX + offsetAX, posAY + offsetAY, posIX + offsetIX, posIY + offsetIY));

      // I와 R 사이에 선 그리기 (높이 반영)
      frameLines.push(new LineSegment(posIX + offsetIX, posIY + offsetIY, posRX + offsetRX, posRY + offsetRY));
    }

    lines.push(new LineData(frameLines, alpha));

    // 저장된 프레임이 최대치를 넘으면 가장 오래된 프레임 제거
    if (lines.length > maxFrames) {
      lines.shift();
    }

    prevMouseX = mouseX;
    prevMouseY = mouseY;
  }

  // 저장된 선을 그리면서 알파값을 업데이트
  for (let i = 0; i < lines.length; i++) {
    let lineData = lines[i];

    // 마지막에 생성된 선들은 알파값을 유지, 그 이전의 선들만 알파값 감소
    if (i < lines.length - 1) {
      lineData.alpha = max(0, lineData.alpha * 0.85); // 알파값을 10%씩 감소
    }

    stroke(146, 245, 102, lineData.alpha); // 각 선의 고유 알파값 적용
    lineData.drawLines();
  }

  // 글자 출력
  textFont('myFont', textSizeAir);
  textAlign(CENTER, CENTER);
  fill(146, 245, 102, 255);
  text("A", posAX, posAY);
  text("I", posIX, posIY);
  text("R", posRX, posRY);
}

// 선분을 정의하는 클래스
class LineSegment {
  constructor(x1, y1, x2, y2) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
  }

  draw() {
    line(this.x1, this.y1, this.x2, this.y2);
  }
}

// 선 데이터 클래스
class LineData {
  constructor(segments, alpha) {
    this.segments = segments;
    this.alpha = alpha; // 생성 시 알파값 설정
  }

  drawLines() {
    for (let segment of this.segments) {
      segment.draw();
    }
  }
}