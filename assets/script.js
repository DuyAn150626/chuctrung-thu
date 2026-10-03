const container = document.getElementById("webgl-container");
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;

const scene = new THREE.Scene();

// CẤU HÌNH LẠI SƯƠNG MÙ SIÊU MỎNG ĐỂ KHÔNG LÀM MỜ MẶT TRĂNG
scene.fog = new THREE.FogExp2(0x060312, 0.001);

const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    2000
);

const DEFAULT_CAM_POS = isMobile ? new THREE.Vector3(0, 16, 50) : new THREE.Vector3(0, 22, 45);
const DEFAULT_CAM_TARGET = new THREE.Vector3(0, 8, 0);
camera.position.copy(DEFAULT_CAM_POS);

const renderer = new THREE.WebGLRenderer({ antialias: !isMobile, alpha: false });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = !isMobile;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
container.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.target.copy(DEFAULT_CAM_TARGET);
controls.maxPolarAngle = Math.PI / 2 - 0.05;
controls.minDistance = 20;
controls.maxDistance = 150;

// ====== 1. ĐÈN CHIẾU SÁNG MÔI TRƯỜNG CỰC MẠNH ======
const ambientLight = new THREE.AmbientLight(0xffffff, 1.6); 
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
dirLight.position.set(100, 150, 50);
dirLight.castShadow = !isMobile;
if (!isMobile) {
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 500;
    const d = 80;
    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;
}
scene.add(dirLight);

// ====== 2. SIÊU MẶT TRĂNG VÀNG SÁNG RỰC RỠ TRÊN BẦU TRỜI ======
const moonGeometry = new THREE.SphereGeometry(32, 32, 32);
const moonMaterial = new THREE.MeshBasicMaterial({ 
    color: 0xfff3a8,
    transparent: true,
    opacity: 1.0 
});
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
moon.position.set(90, 70, -200);
scene.add(moon);

// ====== 3. DANH SÁCH LỜI CHÚC TRUNG THU & ĐỔI ẢNH KÈM THEO ======
const wishList = [
  {
    wish: "Cầu chúc cho mọi nguyện ước của người thương đêm nay sẽ trở thành hiện thực.",
    imgUrl: "./assets/1.jpg"
  },
  {
    wish: "Chúc người thương và gia đình một mùa Trung Thu đoàn viên, tràn ngập niềm vui và hạnh phúc!",
    imgUrl: "./assets/2.jpg"
  },
  {
    wish: "Trăng tròn ấm áp, chúc tình cảm của chúng ta mãi luôn bền chặt và ngọt ngào.",
    imgUrl: "./assets/3.jpg"
  },
  {
    wish: "Chúc người thương luôn giữ được sự hồn nhiên, yêu đời và rạng rỡ như ánh trăng rằm.",
    imgUrl: "./assets/1.jpg"
  }
];

// ====== 4. DỰNG MÔ HÌNH ĐẢO BAY 3D CƠ BẢN ======
const islandGroup = new THREE.Group();
scene.add(islandGroup);

const islandGeo = new THREE.CylinderGeometry(20, 14, 8, 8, 1);
const islandMat = new THREE.MeshStandardMaterial({ color: 0x251a4a, roughness: 0.8 });
const island = new THREE.Mesh(islandGeo, islandMat);
island.position.y = -4;
island.receiveShadow = true;
islandGroup.add(island);

const grassGeo = new THREE.CylinderGeometry(20.2, 20.2, 0.5, 16);
const grassMat = new THREE.MeshStandardMaterial({ color: 0x3d2563, roughness: 0.6 });
const grass = new THREE.Mesh(grassGeo, grassMat);
grass.position.y = 0.25;
islandGroup.add(grass);

const particleCount = isMobile ? 40 : 120;
const particleGeo = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);
const speeds = [];

for(let i=0; i<particleCount; i++) {
    positions[i*3] = (Math.random() - 0.5) * 80;
    positions[i*3+1] = Math.random() * 40 - 5;
    positions[i*3+2] = (Math.random() - 0.5) * 80;
    speeds.push({
        x: (Math.random() - 0.5) * 0.05,
        y: Math.random() * 0.03 + 0.01,
        z: (Math.random() - 0.5) * 0.05
    });
}
particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const particleMat = new THREE.PointsMaterial({ color: 0xffd700, size: isMobile ? 0.6 : 0.4, transparent: true, opacity: 0.8 });
const fireflies = new THREE.Points(particleGeo, particleMat);
scene.add(fireflies);

// ====== 5. HỆ THỐNG LỒNG ĐÈN BAY THẢ TRÔI ======
const lanterns = [];
const lanternCount = isMobile ? 15 : 35;

function createLantern(isInitial = false) {
    const lanternGroup = new THREE.Group();
    
    const bodyGeo = new THREE.CylinderGeometry(1.2, 1.2, 3, 8);
    const bodyMat = new THREE.MeshBasicMaterial({ color: 0xff5533 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    lanternGroup.add(body);
    
    const capGeo = new THREE.CylinderGeometry(1.4, 1.4, 0.3, 8);
    const capMat = new THREE.MeshBasicMaterial({ color: 0xddaa33 });
    const capTop = new THREE.Mesh(capGeo, capMat);
    capTop.position.y = 1.6;
    const capBottom = capTop.clone();
    capBottom.position.y = -1.6;
    lanternGroup.add(capTop, capBottom);
    
    const light = new THREE.PointLight(0xff7733, 1.5, 15);
    light.position.y = 0;
    lanternGroup.add(light);
    
    const randomWish = wishList[Math.floor(Math.random() * wishList.length)];
    lanternGroup.userData = {
        wish: randomWish.wish,
        imgUrl: randomWish.imgUrl,
        speedY: Math.random() * 0.03 + 0.02,
        amplitude: Math.random() * 0.5 + 0.2,
        frequency: Math.random() * 0.02 + 0.01,
        offset: Math.random() * Math.PI * 2
    };
    
    lanternGroup.position.x = (Math.random() - 0.5) * 120;
    lanternGroup.position.y = isInitial ? Math.random() * 90 - 10 : -20;
    lanternGroup.position.z = (Math.random() - 0.5) * 120;
    
    scene.add(lanternGroup);
    lanterns.push(lanternGroup);
}

for(let i=0; i<lanternCount; i++) {
    createLantern(true);
}

// ====== 6. XỬ LÝ SỰ KIỆN CLICK CHUỘT VÀO ĐÈN LỒNG ======
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const wishModal = document.getElementById("wishModal");
const wishText = document.getElementById("wishText");
const wishImage = document.getElementById("wishImage");
const closeWishBtn = document.getElementById("closeWishBtn");

function handleSelection(clientX, clientY) {
    mouse.x = (clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    
    const clickableObjects = [];
    lanterns.forEach(l => {
        l.children.forEach(child => {
            if(child.isMesh) {
                child.userData.parentGroup = l;
                clickableObjects.push(child);
            }
        });
    });

    const intersects = raycaster.intersectObjects(clickableObjects);

    if (intersects.length > 0) {
        const targetGroup = intersects[0].object.userData.parentGroup;
        if(targetGroup && targetGroup.userData.wish) {
            controls.enabled = false;
            wishText.textContent = `${targetGroup.userData.wish}`;
            wishImage.src = targetGroup.userData.imgUrl;
            wishImage.style.cssText = "width: 100% !important; max-width: 180px !important; height: auto !important; display: block !important; margin: 0 auto 15px auto !important; border-radius: 8px;";
            wishModal.classList.add("active");
        }
    }
}

function onPointerDown(event) {
    if (event.target.tagName === 'BUTTON' || event.target.closest('#wishModal')) return;
    handleSelection(event.clientX, event.clientY);
}

function onTouchStart(event) {
    if (event.target.tagName === 'BUTTON' || event.target.closest('#wishModal')) return;
    if(event.touches && event.touches.length > 0) {
        handleSelection(event.touches[0].clientX, event.touches[0].clientY);
    }
}

window.addEventListener("pointerdown", onPointerDown);
window.addEventListener("touchstart", onTouchStart, { passive: true });

if(closeWishBtn) {
    closeWishBtn.addEventListener("click", () => {
        wishModal.classList.remove("active");
        controls.enabled = true;
    });
}

// ====== 7. XỬ LÝ ÂM THANH NỀN ======
const bgm = document.getElementById("bgm");
const audioBtn = document.getElementById("audio-btn");
let isPlaying = false;

if(audioBtn && bgm) {
    audioBtn.addEventListener("click", () => {
        if (isPlaying) {
            bgm.pause();
            audioBtn.innerHTML = '<i class="fas fa-music"></i> Bật Nhạc';
        } else {
            bgm.play().catch(e => console.log("Chặn phát tự động:", e));
            audioBtn.innerHTML = '<i class="fas fa-pause"></i> Tắt Nhạc';
        }
        isPlaying = !isPlaying;
    });
}

// ====== 8. VÒNG LẶP HOẠT ẢNH RENDER (ANIMATION LOOP) ======
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const time = clock.getElapsedTime();
    
    islandGroup.rotation.y = time * 0.05;
    islandGroup.position.y = Math.sin(time * 0.8) * 0.4;
    
    const posAttr = fireflies.geometry.attributes.position;
    for(let i=0; i<particleCount; i++) {
        posAttr.array[i*3] += speeds[i].x;
        posAttr.array[i*3+1] += speeds[i].y;
        posAttr.array[i*3+2] += speeds[i].z;
        
        if(posAttr.array[i*3+1] > 35) {
            posAttr.array[i*3+1] = -5;
            posAttr.array[i*3] = (Math.random() - 0.5) * 80;
            posAttr.array[i*3+2] = (Math.random() - 0.5) * 80;
        }
    }
    posAttr.needsUpdate = true;
    
    for(let i = lanterns.length - 1; i >= 0; i--) {
        const l = lanterns[i];
        l.position.y += l.userData.speedY;
        l.position.x += Math.sin(time * l.userData.frequency + l.userData.offset) * 0.02;
        
        if(l.position.y > 75) {
            scene.remove(l);
            lanterns.splice(i, 1);
            createLantern(false);
        }
    }
    
    controls.update();
    renderer.render(scene, camera);
}

window.addEventListener("resize", () => {
