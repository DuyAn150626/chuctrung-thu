const container = document.getElementById("webgl-container");
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x060312, 0.005);

const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

const DEFAULT_CAM_POS = isMobile ? new THREE.Vector3(0, 16, 50) : new THREE.Vector3(0, 22, 45);
camera.position.copy(DEFAULT_CAM_POS);

const renderer = new THREE.WebGLRenderer({ antialias: !isMobile, alpha: false });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.target.set(0, 8, 0);
controls.maxPolarAngle = Math.PI / 2 - 0.05;

const ambientLight = new THREE.AmbientLight(0xffffff, 1.2); 
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(100, 150, 50);
scene.add(dirLight);

// DANH SÁCH LỜI CHÚC TRUNG THU GỐC
const wishList = [
  { wish: "Cầu chúc cho mọi nguyện ước của cậu đêm nay sẽ trở thành hiện thực.", imgUrl: "./assets/1.jpg" },
  { wish: "Chúc cậu và gia đình một mùa Trung Thu đoàn viên, tràn ngập niềm vui và hạnh phúc!", imgUrl: "./assets/2.jpg" },
  { wish: "Trăng tròn ấm áp, chúc tình cậu và tình yêu của chúng ta mãi bền chặt.", imgUrl: "./assets/3.jpg" },
  { wish: "Chúc cậu luôn giữ được tâm hồn trong trẻo, yêu đời như ánh trăng rằm.", imgUrl: "./assets/1.jpg" }
];

const islandGroup = new THREE.Group();
scene.add(islandGroup);

const islandGeo = new THREE.CylinderGeometry(20, 14, 8, 8, 1);
const islandMat = new THREE.MeshStandardMaterial({ color: 0x251a4a, roughness: 0.8 });
const island = new THREE.Mesh(islandGeo, islandMat);
island.position.y = -4;
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
    speeds.push({ x: (Math.random() - 0.5) * 0.05, y: Math.random() * 0.03 + 0.01, z: (Math.random() - 0.5) * 0.05 });
}
particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const fireflies = new THREE.Points(particleGeo, new THREE.PointsMaterial({ color: 0xffd700, size: isMobile ? 0.6 : 0.4, transparent: true, opacity: 0.8 }));
scene.add(fireflies);

const lanterns = [];
const lanternCount = isMobile ? 15 : 35;

function createLantern(isInitial = false) {
    const lanternGroup = new THREE.Group();
    const body = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 3, 8), new THREE.MeshBasicMaterial({ color: 0xff5533 }));
    lanternGroup.add(body);
    
    const capTop = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, 0.3, 8), new THREE.MeshBasicMaterial({ color: 0xddaa33 }));
    capTop.position.y = 1.6;
    const capBottom = capTop.clone();
    capBottom.position.y = -1.6;
    lanternGroup.add(capTop, capBottom);
    
    const randomWish = wishList[Math.floor(Math.random() * wishList.length)];
    lanternGroup.userData = {
        wish: randomWish.wish, imgUrl: randomWish.imgUrl,
        speedY: Math.random() * 0.03 + 0.02, frequency: Math.random() * 0.02 + 0.01, offset: Math.random() * Math.PI * 2
    };
    
    lanternGroup.position.set((Math.random() - 0.5) * 120, isInitial ? Math.random() * 90 - 10 : -20, (Math.random() - 0.5) * 120);
    scene.add(lanternGroup);
    lanterns.push(lanternGroup);
}

for(let i=0; i<lanternCount; i++) createLantern(true);

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
            wishModal.classList.add("active");
        }
    }
}

window.addEventListener("pointerdown", (e) => {
    if (e.target.tagName === 'BUTTON' || e.target.closest('#wishModal')) return;
    handleSelection(e.clientX, e.clientY);
});

document.getElementById("closeWishBtn").addEventListener("click", () => { wishModal.classList.remove("active"); controls.enabled = true; });

const bgm = document.getElementById("bgm");
const audioBtn = document.getElementById("audio-btn");
let isPlaying = false;
if(audioBtn && bgm) {
    audioBtn.addEventListener("click", () => {
        if (isPlaying) { bgm.pause(); audioBtn.innerHTML = '<i class="fas fa-music"></i> Bật Nhạc'; }
        else { bgm.play().catch(e => console.log(e)); audioBtn.innerHTML = '<i class="fas fa-pause"></i> Tắt Nhạc'; }
        isPlaying = !isPlaying;
    });
}

const clock = new THREE.Clock();
function animate() {
    requestAnimationFrame(animate);
    const time = clock.getElapsedTime();
    
    islandGroup.rotation.y = time * 0.05;
    islandGroup.position.y = Math.sin(time * 0.8) * 0.4;
    
    const posAttr = fireflies.geometry.attributes.position;
    for(let i=0; i<particleCount; i++) {
        posAttr.array[i*3+1] += speeds[i].y;
        if(posAttr.array[i*3+1] > 35) posAttr.array[i*3+1] = -5;
    }
    posAttr.needsUpdate = true;
    
    for(let i = lanterns.length - 1; i >= 0; i--) {
        const l = lanterns[i];
        l.position.y += l.userData.speedY;
        l.position.x += Math.sin(time * l.userData.frequency + l.userData.offset) * 0.02;
        if(l.position.y > 75) { scene.remove(l); lanterns.splice(i, 1); createLantern(false); }
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
