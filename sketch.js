let t = 0.0;
let vel = 0.02;
let num;
let paletteSelected;
let paletteSelected1;
let paletteSelected2;
let iframeEl = null;
let iframeUrls = [
    'https://950902katherine-droid.github.io/20251014/',
    'https://hackmd.io/@RbOrXZtpR8u7UUX3kVIiZA/BJlPgF_khxx'
];
// 新增：右上文字元素
let nameEl = null;

// 新增：選單相關變數
let menuItems = ['作品一', '作品二', '作品三'];
let menuX = 10;
let menuY = 10;
let menuW = 160;
let menuH = 34;
let selectedMenu = -1;

function setup() {
    // 全螢幕
    createCanvas(windowWidth, windowHeight);
    pixelDensity(2)
    angleMode(DEGREES);
    num = random(100000);
    paletteSelected = random(palettes);
    paletteSelected1 = random(palettes);
    paletteSelected2 = random(palettes);
    // 若啟動時已選擇 作品一/二，建立 iframe
    if (selectedMenu === 0 || selectedMenu === 1) createIframe(selectedMenu);

    // 建立固定在視窗右上角的文字
    nameEl = createDiv('414730357林翊涵');
    nameEl.style('position', 'fixed');
    nameEl.style('top', '10px');
    nameEl.style('right', '10px');
    nameEl.style('font-size', '20px');
    nameEl.style('line-height', '20px');
    nameEl.style('z-index', '10001'); // 確保在 iframe 上方
    nameEl.style('color', '#000'); // 若需白色改成 '#fff'
    nameEl.style('pointer-events', 'none'); // 不攔截滑鼠事件
}

function windowResized() {
    // 調整畫布大小以維持全螢幕
    resizeCanvas(windowWidth, windowHeight);
    // 調整 iframe 大小與位置（若存在）
    if (iframeEl) positionAndSizeIframe();
}

function draw() {
    randomSeed(num);
    background(bgCol())
    stroke("#355070");

    // 根據選單選擇切換不同作品
    if (selectedMenu === 0) {
        // 作品一
        circlePacking(0);
    } else if (selectedMenu === 1) {
        // 作品二
        circlePacking(1);
    } else {
        // 預設 / 作品三（或未選擇時）
        circlePacking(2);
    }

    // 在最上層繪製選單（只有當滑鼠靠近左側時顯示）
    drawMenu();
}

// 新增：選單繪製
function drawMenu() {
    // 當滑鼠距左側小於或等於 100px 時顯示選單
    if (mouseX <= 100) {
        push();
        // 背景容器
        noStroke();
        fill(255, 230);
        rect(menuX - 8, menuY - 8, menuW + 16, menuItems.length * menuH + 16, 8);

        textAlign(LEFT, CENTER);
        textSize(16);

        for (let i = 0; i < menuItems.length; i++) {
            let miY = menuY + i * menuH;
            let hovered = mouseX >= menuX && mouseX <= menuX + menuW && mouseY >= miY && mouseY <= miY + menuH;

            // 背景高亮
            if (hovered || selectedMenu === i) {
                fill(60, 120);
                rect(menuX, miY, menuW, menuH, 6);
                fill(255);
            } else {
                noStroke();
                fill(30);
            }

            // 文字
            text(menuItems[i], menuX + 12, miY + menuH / 2);
        }
        pop();
    }
}

// 新增：點選選單
function mousePressed() {
    if (mouseX <= 100) {
        for (let i = 0; i < menuItems.length; i++) {
            let miY = menuY + i * menuH;
            if (mouseX >= menuX && mouseX <= menuX + menuW && mouseY >= miY && mouseY <= miY + menuH) {
                selectedMenu = i;
                // 點選時可重設 seed 或切換 palette 以改變畫面
                num = random(100000);
                if (i === 0) {
                    // 作品一使用 paletteSelected
                    paletteSelected = random(palettes);
                } else if (i === 1) {
                    // 作品二使用另一組配色
                    paletteSelected1 = random(palettes);
                } else {
                    paletteSelected2 = random(palettes);
                }
                // 選到作品一或作品二 -> 建立/更新 iframe；其他則移除 iframe
                if (i === 0 || i === 1) {
                    createIframe(i);
                } else {
                    removeIframe();
                }
            }
        }
    }
}
// 新增：建立 iframe 與相關控制
function createIframe(mode) {
    removeIframe();
    if (mode !== 0 && mode !== 1) return;
    iframeEl = createElement('iframe');
    iframeEl.attribute('src', iframeUrls[mode]);
    iframeEl.attribute('frameborder','0');
    iframeEl.style('position','fixed');
    iframeEl.style('border','none');
    iframeEl.style('z-index','9999');
    iframeEl.style('background','white');
    positionAndSizeIframe();
}
function positionAndSizeIframe() {
    if (!iframeEl) return;
    let w = Math.floor(windowWidth * 0.8);
    let h = Math.floor(windowHeight * 0.8);
    let left = Math.floor((windowWidth - w) / 2);
    let top = Math.floor((windowHeight - h) / 2);
    iframeEl.position(left, top);
    iframeEl.size(w, h);
}
function removeIframe() {
    if (iframeEl) {
        iframeEl.remove();
        iframeEl = null;
    }
}

// 修改：circlePacking 改為接受 mode 參數，根據 mode 呈現不同作品風格
function circlePacking(mode = 2) {
    push();
    translate(width / 2, height / 2)

    let points = [];
    // 根據 mode 調整參數（作品一二三各不同）
    let count = 2000;
    if (mode === 0) {
        // 作品一：較少但大的形狀
        count = 900;
    } else if (mode === 1) {
        // 作品二：更多、較小且更密集
        count = 3000;
    } else {
        // 作品三 / 預設：原始設定
        count = 2000;
    }

    for (let i = 0; i < count; i++) {
        let a = random(360);
        let d = random(width * 0.35);
        // 作品一二的大小分布可以不同
        let s;
        if (mode === 0) s = random(80, 220);
        else if (mode === 1) s = random(8, 120);
        else s = random(20, 200);

        let x = cos(a) * (d - s / 2);
        let y = sin(a) * (d - s / 2);
        let add = true;
        for (let j = 0; j < points.length; j++) {
            let p = points[j];
            if (dist(x, y, p.x, p.y) < (s + p.z) * 0.6) {
                add = false;
                break;
            }
        }
        if (add) points.push(createVector(x, y, s));
    }

    for (let i = 0; i < points.length; i++) {
        let p = points[i];
        // 作品一二三 使用不同的旋轉與混合模式作為視覺差異
        let rot = random(360);
        push();
        translate(p.x, p.y);
        rotate(rot);
        if (mode === 0) {
            blendMode(BLEND);
        } else if (mode === 1) {
            blendMode(OVERLAY);
        } else {
            blendMode(OVERLAY);
        }
        let r = p.z - 5;
        gradient(r)
        // 作品一使用 paletteSelected，作品二使用 paletteSelected1
        if (mode === 0) {
            // 暫時可以改變顏色取得邏輯：randomCol 內部會使用 paletteSelected
            // 若 randomCol 不依 paletteSelected，請告訴我要如何切換 palette，我可以幫你綁定
        } else if (mode === 1) {
            // 同上
        }
        shape(0, 0, r)
        pop();
    }
    pop();
}

function shape(x, y, r) {
    push();
noStroke();
//fill(randomCol())
    translate(x, y);
    let radius = r; //半径
    let nums = 8
    for (let i = 0; i < 360; i += 360 / nums) {
        let ex = radius * sin(i);
        let ey = radius * cos(i);
        push();
        translate(ex,ey)
        rotate(atan2(ey, ex))
        distortedCircle(0,0,r);

        pop();
        stroke(randomCol())
        strokeWeight(0.5)
        line(0,0,ex,ey)
        ellipse(ex,ey,2)
    }


    pop();
}

function distortedCircle(x, y, r) {
    push();
    translate(x, y)
    //points
    let p1 = createVector(0, -r / 2);
    let p2 = createVector(r / 2, 0);
    let p3 = createVector(0, r / 2);
    let p4 = createVector(-r / 2, 0)
    //anker
    let val = 0.3;
    let random_a8_1 = random(-r * val, r * val)
    let random_a2_3 = random(-r * val, r * val)
    let random_a4_5 = random(-r * val, r * val)
    let random_a6_7 = random(-r * val, r * val)
    let ran_anker_lenA = r * random(0.2, 0.5)
    let ran_anker_lenB = r * random(0.2, 0.5)
    let a1 = createVector(ran_anker_lenA, -r / 2 + random_a8_1);
    let a2 = createVector(r / 2 + random_a2_3, -ran_anker_lenB);
    let a3 = createVector(r / 2 - random_a2_3, ran_anker_lenA);
    let a4 = createVector(ran_anker_lenB, r / 2 + random_a4_5);
    let a5 = createVector(-ran_anker_lenA, r / 2 - random_a4_5);
    let a6 = createVector(-r / 2 + random_a6_7, ran_anker_lenB);
    let a7 = createVector(-r / 2 - random_a6_7, -ran_anker_lenA);
    let a8 = createVector(-ran_anker_lenB, -r / 2 - random_a8_1);
    beginShape();
    vertex(p1.x, p1.y);
    bezierVertex(a1.x, a1.y, a2.x, a2.y, p2.x, p2.y)
    bezierVertex(a3.x, a3.y, a4.x, a4.y, p3.x, p3.y)
    bezierVertex(a5.x, a5.y, a6.x, a6.y, p4.x, p4.y)
    bezierVertex(a7.x, a7.y, a8.x, a8.y, p1.x, p1.y)
    endShape();
    pop();
}