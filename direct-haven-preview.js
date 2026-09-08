const canvas = document.getElementById('sceneCanvas');
const statusLine = document.getElementById('status');

let renderer;
let scene;
let camera;
let controls;

function setStatus(message) {
  statusLine.textContent = message;
}

function makeGeometry(meshData) {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(meshData.position), 3));
  geometry.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(meshData.normal), 3));
  geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(meshData.uv), 2));
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  return geometry;
}

function centerObject(group) {
  const box = new THREE.Box3().setFromObject(group);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  group.position.sub(center);

  const maxDimension = Math.max(size.x, size.y, size.z) || 1;
  group.scale.setScalar(6.5 / maxDimension);
}

async function loadObject() {
  const objectData = await fetch('direct-haven/windmill.json').then((response) => response.json());
  const texture = new THREE.TextureLoader().load(`direct-haven/${objectData.meshes[0].directTexture}`);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;

  const material = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.DoubleSide
  });

  const group = new THREE.Group();
  objectData.meshes.forEach((meshData) => {
    const mesh = new THREE.Mesh(makeGeometry(meshData), material);
    mesh.name = meshData.name;
    group.add(mesh);
  });

  centerObject(group);
  scene.add(group);
  setStatus(`${objectData.name} | ${objectData.meshes.length} meshes`);
}

function setup() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0d1014);

  camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 1.5, 14);

  renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight, false);

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.screenSpacePanning = true;
  controls.enablePan = true;
  controls.maxDistance = 80;
  controls.target.set(0, 0, 0);

  scene.add(new THREE.HemisphereLight(0xffffff, 0x111111, 1.2));

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight, false);
  });
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

setup();
loadObject().catch((error) => {
  console.error(error);
  setStatus(`Failed: ${error.message}`);
});
animate();
