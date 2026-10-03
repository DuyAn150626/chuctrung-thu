const container = document.getElementById("webgl-container");
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x05050a, 0.005);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 15, 45);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
container.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.target.set(0, 5, 0);
controls.maxPolarAngle = Math.PI / 2 - 0.05;

// ====== 1. HỆ THỐNG ÁNH SÁNG RỰC RỠ ĐỔ KHỐI ĐẸP ======
const ambientLight = new THREE.AmbientLight(0xffffff, 1.4); // Ánh sáng trắng cực mạnh khơi thông màu sắc
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffeedd, 1.5); // Đèn rọi màu vàng ấm tạo khối gồ ghề
dirLight.position.set(40, 60, 40);
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 1024;
dirLight.shadow.mapSize.height = 1024;
scene.add(dirLight);

// ====== 2. MẶT TRĂNG XÁM BẠC TO LỚN PHÍA SAU ======
const moonGeo = new THREE.SphereGeometry(28, 32, 32);
const moonMat = new THREE.MeshBasicMaterial({ color: 0x8a8a9a }); 
const moon = new THREE.Mesh(moonGeo, moonMat);
moon.position.set(40, 45, -150);
scene.add(moon);

// LỜI CHÚC TRUNG THU
const wishList = [
  { wish: "Cầu chúc cho mọi nguyện ước của người thương đêm nay sẽ trở thành hiện thực.", imgUrl: "./assets/1.jpg" },
  { wish: "Chúc người thương và gia đình một mùa Trung Thu đoàn viên, tràn ngập niềm vui và hạnh phúc!", imgUrl: "./assets/2.jpg" },
  { wish: "Trăng tròn ấm áp, chúc tình cảm của chúng ta mãi luôn bền chặt và ngọt ngào.", imgUrl: "./assets/3.jpg" },
  { wish: "Chúc người thương luôn giữ được sự hồn nhiên, yêu đời và rạng rỡ như ánh trăng rằm.", imgUrl: "./assets/1.jpg" }
];

// ====== 3. PHỤC DỰNG ĐẢO ĐÁ GỒ GHỀ NỔI KHỐI TỰ NHIÊN ======
const islandGroup = new THREE.Group();
scene.add(islandGroup);

const islandGeo = new THREE.CylinderGeometry(16, 2, 12, 6, 4);
const pos = islandGeo.attributes.position;
for (let i = 0; i < pos.count; i++) {
    let y = pos.getY(i);
    if (y < 5) { 
        pos.setX(i, pos.getX(i) + (Math.random() - 0.5) * 2.5);
        pos.setZ(i, pos.getZ(i) + (Math.random() - 0.5) * 2.5);
    }
}
islandGeo.computeVertexNormals();

const islandMat = new THREE.MeshStandardMaterial({ color: 0x3a283e, roughness: 0.7, metalness: 0.1 });
const island = new THREE.Mesh(islandGeo, islandMat);
island.position.y = 0;
island.receiveShadow = true;
island.castShadow = true;
islandGroup.add(island);

// Thảm cỏ bề mặt đảo
const grassGeo = new THREE.CylinderGeometry(16.2, 16.2, 0.2, 16);
const grassMat = new THREE.MeshStandardMaterial({ color: 0x4a235a, roughness: 0.6 });
const grass = new THREE.Mesh(grassGeo, grassMat);
grass.position.y = 6;
grass.receiveShadow = true;
islandGroup.add(grass);

// ====== 4. TẠO CÂY HOA ANH ĐÀO PHÁT SÁNG LUNG LINH ======
const treeGroup = new THREE.Group();
treeGroup.position.set(0, 6, 0);

const trunkGeo = new THREE.CylinderGeometry(0.5, 0.9, 6, 8);
const trunkMat = new THREE.MeshStandardMaterial({ color: 0x1a0f1a, roughness: 0.9 });
const trunk = new THREE.Mesh(trunkGeo, trunkMat);
trunk.position.y = 3;
trunk.castShadow = true;
treeGroup.add(trunk);

const leavesGroup = new THREE.Group();
leavesGroup.position.y = 6;

const leafGeo = new THREE.SphereGeometry(3.5, 8, 8);
// Dùng màu hồng tươi tự phát sáng rực rỡ xuyên sương mù
const leafMat = new THREE.MeshBasicMaterial({ color: 0xffa0b4, transparent: true, opacity: 0.5 });

for (let i = 0; i < 50; i++) {
    const mesh = new THREE.Mesh(leafGeo, leafMat);
    mesh.position.set(
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 5 + 2,
        (Math.random() - 0.5) * 12
    );
    const s = Math.random() * 0.5 + 0.7;
    mesh.scale.set(s, s, s);
    leavesGroup.add(mesh);
}
treeGroup.add(leavesGroup);
islandGroup.add(treeGroup);

// ====== 5. THỎ NGỌC NHỎ TRÊN ĐẢO ======
const rabbitGroup = new THREE.Group();
rabbitGroup.position.set(-2, 6.2, 3);
rabbitGroup.scale.set(0.4, 0.4, 0.4);

const body = new THREE.Mesh(new THREE.SphereGeometry(1.5, 16, 16), new THREE.MeshBasicMaterial({ color: 0xeeeeee }));
body.scale.set(1, 1.2, 1);
const head = new THREE.Mesh(new THREE.SphereGeometry(0.8, 16, 16), new THREE.MeshBasicMaterial({ color: 0xffffff }));
head.position.set(0, 1.6, 0.4);

const earGeo = new THREE.CylinderGeometry(0.12, 0.18, 1.4, 8);
const earMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
const earL = new THREE.Mesh(earGeo, earMat); earL.position.set(-0.25, 2.5, 0.2);
const earR = new THREE.Mesh(earGeo, earMat); earR.position.set(0.25, 2.5, 0.2);

rabbitGroup.add(body, head, earL, earR);
islandGroup.add(rabbitGroup);

// ====== 6. HỆ THỐNG LỒNG ĐÈN BAY ======
const lanterns = [];
const lanternCount = isMobile ? 15 : 35;

function createLantern(isInitial = false) {
    const lanternGroup = new THREE.Group();
    const body = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 0.9, 2.4, 8), new THREE.MeshBasicMaterial({ color: 0xff8822 }));
    lanternGroup.add(body);
    
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.3, 0.2, 8), new THREE.MeshBasicMaterial({ color: 0xd32f2f }));
    cap.position.y = 1.2;
    const bottomCap = cap.clone(); bottomCap.position.y = -1.2;
    lanternGroup.add(cap, bottomCap);
    
    const randomWish = wishList[Math.floor(Math.random() * wishList.length)];
    lanternGroup.userData = {
        wish: randomWish.wish, imgUrl: randomWish.imgUrl,
        speedY: Math.random() * 0.03 + 0.02, frequency: Math.random() * 0.02 + 0.01, offset: Math.random() * Math.PI * 2
    };
    
    lanternGroup.position.set((Math.random() - 0.5) * 130, isInitial ? Math.random() * 90 - 10 : -25, (Math.random() - 0.5) * 130);
    scene.add(lanternGroup);
    lanterns.push(lanternGroup);
}

for(let i=0; i<lanternCount; i++) createLantern(true);

// TƯƠNG TÁC MỞ THIỆP
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const wishModal = document.getElementById("wishModal");
const wishText = document.getElementById("wishText");
const wishImage = document.getElementById("wishImage");

function handleSelection(clientX, clientY) {
    mouse.x = (clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const clickableObjects = [];
    lanterns.forEach(l => l.children.forEach(c => { if(c.isMesh) { c.userData.parentGroup = l; clickableObjects.push(c); } }));
    const intersects = raycaster.intersectObjects(clickableObjects);

    if (intersects.length > 0) {
        const targetGroup = intersects.object.userData.parentGroup;
        if(targetGroup && targetGroup.userData.wish) {
            controls.enabled = false;
            wishText.textContent = `${targetGroup.userData.wish}`;
            wishImage.src = targetGroup.userData.imgUrl;
            wishImage.style.cssText = "width: 100% !important; max-width: 180px !important; height: auto !important; display: block !important; margin: 0 auto 15px auto !important; border-radius: 8px;";
            wishModal.classList.add("active");
        }
    }
}

window.addEventListener("pointerdown", (e) => { if (!(e.target.tagName === 'BUTTON' || e.target.closest('#wishModal'))) handleSelection(e.clientX, e.clientY); });
document.getElementById("closeWishBtn").addEventListener("click", () => { wishModal.classList.remove("active"); controls.enabled = true; });

// NHẠC NỀN
const bgm = document.getElementById("bgm");
const audioBtn = document.getElementById("audio-btn");
let isPlaying = false;
audioBtn.addEventListener("click", () => {
    if (isPlaying) { bgm.pause(); audioBtn.innerHTML = '<i class="fas fa-music"></i> Bật Nhạc'; }
    else { bgm.play().catch(e => console.log(e)); audioBtn.innerHTML = '<i class="fas fa-pause"></i> Tắt Nhạc'; }
    isPlaying = !isPlaying;
});

// VÒNG LẶP HOẠT ẢNH ANiMATE
const clock = new THREE.Clock();
function animate() {
    requestAnimationFrame(animate);
    const time = clock.getElapsedTime();
    
    islandGroup.rotation.y = time * 0.04; 
    islandGroup.position.y = Math.sin(time * 0.6) * 0.3; 
    
    leavesGroup.children.forEach((child, index) => {
        child.position.y += Math.sin(time * 1.2 + index) * 0.004;
    });
    
    rabbitGroup.position.y = 6.2 + Math.abs(Math.sin(time * 2.5)) * 0.35;

    for(let i = lanterns.length - 1; i >= 0; i--) {
        const l = lanterns[i];
        l.position.y += l.userData.speedY;
        l.position.x += Math.sin(time * l.userData.frequency + l.userData.offset) * 0.02;
        if(l.position.y > 80) { scene.remove(l); lanterns.splice(i, 1); createLantern(false); }
    }
    
    controls.update();
    renderer.render(scene, camera);
}

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
