const container = document.getElementById("webgl-container");
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;

const scene = new THREE.Scene();
// Sương mù màu tối mờ ảo theo đúng bản gốc
scene.fog = new THREE.FogExp2(0x05050a, 0.006);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 15, 45);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.target.set(0, 5, 0);
controls.maxPolarAngle = Math.PI / 2 - 0.05;

// ====== 1. HỆ THỐNG ÁNH SÁNG ĐÊM TRĂNG MỜ ẢO ======
const ambientLight = new THREE.AmbientLight(0x222233, 1.2); 
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffddbb, 0.6);
dirLight.position.set(-50, 80, -100); // Rọi từ hướng mặt trăng xuống
scene.add(dirLight);

// ====== 2. MẶT TRĂNG XÁM BẠC TO LỚN PHÍA SAU ======
const moonGeo = new THREE.SphereGeometry(30, 32, 32);
const moonMat = new THREE.MeshBasicMaterial({ color: 0x7a7a8a }); // Màu xám bạc chuẩn ảnh gốc
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

// ====== 3. PHỤC DỰNG ĐẢO ĐÁ GỒ GHỀ NỔI KHỐI ======
const islandGroup = new THREE.Group();
scene.add(islandGroup);

// Tạo hình nón cụt ngược làm thân đảo đá gồ ghề
const islandGeo = new THREE.CylinderGeometry(16, 2, 12, 5, 4);
// Sửa các đỉnh ngẫu nhiên để tạo vân đá gồ ghề tự nhiên không bị phẳng dẹt
const pos = islandGeo.attributes.position;
for (let i = 0; i < pos.count; i++) {
    let y = pos.getY(i);
    if (y < 6) { // Phần thân dưới gồ ghề
        pos.setX(i, pos.getX(i) + (Math.random() - 0.5) * 3);
        pos.setZ(i, pos.getZ(i) + (Math.random() - 0.5) * 3);
    }
}
islandGeo.computeVertexNormals();

const islandMat = new THREE.MeshStandardMaterial({ color: 0x1c121a, roughness: 0.9, metalness: 0.1 });
const island = new THREE.Mesh(islandGeo, islandMat);
island.position.y = 0;
islandGroup.add(island);

// Thảm cỏ phẳng màu tối trên bề mặt đảo
const grassGeo = new THREE.CylinderGeometry(16.2, 16.2, 0.2, 16);
const grassMat = new THREE.MeshStandardMaterial({ color: 0x241116, roughness: 0.8 });
const grass = new THREE.Mesh(grassGeo, grassMat);
grass.position.y = 6;
islandGroup.add(grass);

// ====== 4. TẠO CÂY HOA ANH ĐÀO PHÁT SÁNG BỒNG BỀNH ======
const treeGroup = new THREE.Group();
treeGroup.position.set(0, 6, 0); // Đặt trên mặt cỏ

// Thân cây gỗ màu tối
const trunkGeo = new THREE.CylinderGeometry(0.6, 1, 6, 8);
const trunkMat = new THREE.MeshStandardMaterial({ color: 0x0d080d, roughness: 0.9 });
const trunk = new THREE.Mesh(trunkGeo, trunkMat);
trunk.position.y = 3;
treeGroup.add(trunk);

// Tán hoa hồng phát sáng bồng bềnh xếp từ nhiều khối cầu hạt nhỏ
const leavesGroup = new THREE.Group();
leavesGroup.position.y = 6;

const leafGeo = new THREE.SphereGeometry(4, 8, 8);
const leafMat = new THREE.MeshBasicMaterial({ color: 0xffb7c5, transparent: true, opacity: 0.35 }); // Màu hồng phấn mờ ảo

// Rải ngẫu nhiên các khối cầu hoa tạo thành tán cây lớn xum xuê
for (let i = 0; i < 45; i++) {
    const mesh = new THREE.Mesh(leafGeo, leafMat);
    mesh.position.set(
        (Math.random() - 0.5) * 14,
        (Math.random() - 0.5) * 6 + 2,
        (Math.random() - 0.5) * 14
    );
    const s = Math.random() * 0.6 + 0.6;
    mesh.scale.set(s, s, s);
    leavesGroup.add(mesh);
}
treeGroup.add(leavesGroup);
islandGroup.add(treeGroup);

// ====== 5. THỎ NGỌC NHỎ TRÊN MẶT ĐẢO ======
const rabbitGroup = new THREE.Group();
rabbitGroup.position.set(-3, 6.2, 4);
rabbitGroup.scale.set(0.4, 0.4, 0.4);

const body = new THREE.Mesh(new THREE.SphereGeometry(1.5, 16, 16), new THREE.MeshBasicMaterial({ color: 0xdddddd }));
body.scale.set(1, 1.2, 1);
const head = new THREE.Mesh(new THREE.SphereGeometry(0.9, 16, 16), new THREE.MeshBasicMaterial({ color: 0xffffff }));
head.position.set(0, 1.6, 0.5);

const earGeo = new THREE.CylinderGeometry(0.15, 0.2, 1.5, 8);
const earMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
const earL = new THREE.Mesh(earGeo, earMat); earL.position.set(-0.3, 2.6, 0.3); earL.rotation.z = 0.1;
const earR = new THREE.Mesh(earGeo, earMat); earR.position.set(0.3, 2.6, 0.3); earR.rotation.z = -0.1;

rabbitGroup.add(body, head, earL, earR);
islandGroup.add(rabbitGroup);

// HỆ THỐNG ĐÈN LỒNG BAY
const lanterns = [];
const lanternCount = isMobile ? 15 : 35;

function createLantern(isInitial = false) {
    const lanternGroup = new THREE.Group();
    // Tạo hình dáng đèn lồng thắt ngỏ gốc chuẩn ảnh
    const body = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 0.9, 2.5, 8), new THREE.MeshBasicMaterial({ color: 0xff9933 }));
    lanternGroup.add(body);
    
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.3, 0.2, 8), new THREE.MeshBasicMaterial({ color: 0xcc3300 }));
    cap.position.y = 1.3;
    const bottomCap = cap.clone(); bottomCap.position.y = -1.3;
    lanternGroup.add(cap, bottomCap);
    
    const randomWish = wishList[Math.floor(Math.random() * wishList.length)];
    lanternGroup.userData = {
        wish: randomWish.wish, imgUrl: randomWish.imgUrl,
        speedY: Math.random() * 0.03 + 0.02, frequency: Math.random() * 0.02 + 0.01, offset: Math.random() * Math.PI * 2
    };
    
    lanternGroup.position.set((Math.random() - 0.5) * 140, isInitial ? Math.random() * 90 - 10 : -30, (Math.random() - 0.5) * 140);
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

// VÒNG LẶP HOẠT ẢNH
const clock = new THREE.Clock();
function animate() {
    requestAnimationFrame(animate);
    const time = clock.getElapsedTime();
    
    islandGroup.rotation.y = time * 0.03; // Đảo xoay chậm huyền ảo
    islandGroup.position.y = Math.sin(time * 0.5) * 0.3; // Nhấp nhô nhẹ
    
    // Làm tán cây hoa anh đào rung rinh nhẹ trong gió bồng bềnh
    leavesGroup.children.forEach((child, index) => {
        child.position.y += Math.sin(time * 1.5 + index) * 0.005;
    });
    
    // Thỏ ngọc nhún nhảy nhẹ
    rabbitGroup.position.y = 6.2 + Math.abs(Math.sin(time * 3)) * 0.4;

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
