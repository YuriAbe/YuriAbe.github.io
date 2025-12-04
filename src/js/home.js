import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// --- Configuração da Cena Three.js ---

const container = document.getElementById('home-container');
const loadingIndicator = document.getElementById('loading-indicator');

let scene, camera, renderer, controls;
let model;

function init() {
    console.log('Inicializando cena Three.js...');

    // 1. Cena
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87cefa); // Fundo azul claro

    // 2. Câmera Ortográfica para visão isométrica
    // Os parâmetros são left, right, top, bottom, near, far
    const aspect = container.clientWidth / container.clientHeight;
    const frustumSize = 10; // Tamanho do frustum, ajuste conforme necessário
    camera = new THREE.OrthographicCamera(
        frustumSize * aspect / -2,
        frustumSize * aspect / 2,
        frustumSize / 2,
        frustumSize / -2,
        0.1,
        1000
    );

    // Configuração para visão isométrica
    // Rotação em Z: 45 graus (PI/4)
    // Rotação em X: 35.264 graus (aproximadamente Math.atan(1 / Math.sqrt(2)))
    camera.rotation.order = 'YXZ'; // Ordem de rotação para evitar gimbal lock
    camera.rotation.y = Math.PI / 4;
    camera.rotation.x = Math.atan(1 / Math.sqrt(2));
    camera.rotation.z = 0; // Já está implícito na ordem YXZ, mas explicitado para clareza

    // Posicionamento inicial da câmera
    camera.position.set(20, 20, 20); // Ajuste a posição para enquadrar o modelo
    camera.lookAt(scene.position); // Aponta para o centro da cena

    // 3. Renderizador
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.outputEncoding = THREE.sRGBEncoding; // Para cores mais precisas
    container.appendChild(renderer.domElement);

    // 4. Luzes
    // Luz Direcional (simula o sol)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Cor branca, intensidade 1
    directionalLight.position.set(5, 10, 7.5); // Posição da luz
    scene.add(directionalLight);

    // Luz Hemisférica (luz ambiente suave)
    const hemisphereLight = new THREE.HemisphereLight(0xb1e1ff, 0xb97a20, 0.5); // Céu, chão, intensidade
    scene.add(hemisphereLight);

    // 5. Controles de Câmera (OrbitControls)
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false; // Desabilita pan para manter a isometria
    controls.enableZoom = true; // Permite zoom
    controls.minZoom = 0.5;
    controls.maxZoom = 2;
    controls.enableDamping = true; // Suaviza os movimentos
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.5;
    controls.screenSpacePanning = false; // Importante para ortográfica

    // Limita a rotação para manter a sensação isométrica
    controls.minPolarAngle = Math.PI / 4; // Limite inferior da rotação vertical
    controls.maxPolarAngle = Math.PI / 2; // Limite superior da rotação vertical (evita olhar por baixo)
    controls.minAzimuthAngle = -Math.PI / 2; // Limite esquerdo da rotação horizontal
    controls.maxAzimuthAngle = Math.PI / 2; // Limite direito da rotação horizontal

    // 6. Manipulação de redimensionamento da janela
    window.addEventListener('resize', onWindowResize, false);

    // 7. Carregar o modelo GLTF
    loadModel();
}

function loadModel() {
    console.log('Iniciando carregamento do modelo GLTF...');
    loadingIndicator.style.display = 'block'; // Mostra indicador de carregamento

    const loader = new GLTFLoader();

    loader.load(
        '../assets/3dmodels/torrev2.glb', // Caminho relativo ao index.html
        function (glb) {
            console.log('Modelo GLb carregado com sucesso!', glb);
            model = glb.scene;

            // Ajustar o modelo para caber na view (centralizar e escalar automaticamente)
            const bbox = new THREE.Box3().setFromObject(model);
            const center = new THREE.Vector3();
            bbox.getCenter(center);
            model.position.sub(center); // Centraliza o modelo

            const size = new THREE.Vector3();
            bbox.getSize(size);
            const maxDim = Math.max(size.x, size.y, size.z);
            const desiredSize = 5; // Tamanho desejado na cena, ajuste conforme necessário
            model.scale.multiplyScalar(desiredSize / maxDim); // Escala o modelo


            scene.add(model);
            loadingIndicator.style.display = 'none'; // Esconde indicador
            console.log('Modelo adicionado à cena.');
            animate(); // Inicia a animação após o carregamento

        },
        function (xhr) {
            // Progresso de carregamento (opcional)
            console.log((xhr.loaded / xhr.total * 100) + '% carregado');
        },
        function (error) {
            console.error('Erro ao carregar o modelo GLTF:', error);
            loadingIndicator.textContent = 'Erro ao carregar o modelo. Verifique o console.';
            loadingIndicator.style.color = 'red';
        }
    );
}

function onWindowResize() {
    console.log('Redimensionando janela...');
    const newWidth = container.clientWidth;
    const newHeight = container.clientHeight;

    // Atualiza a proporção da câmera ortográfica
    const aspect = newWidth / newHeight;
    const frustumSize = 10;
    camera.left = frustumSize * aspect / -2;
    camera.right = frustumSize * aspect / 2;
    camera.top = frustumSize / 2;
    camera.bottom = frustumSize / -2;
    camera.updateProjectionMatrix();

    renderer.setSize(newWidth, newHeight);
    console.log(`Novo tamanho do renderizador: ${newWidth}x${newHeight}`);
}

function animate() {
    requestAnimationFrame(animate);
    // Rotate the model
    model.rotation.y += 0.01; // Rotate around the X-axis
    controls.update(); // Apenas se enableDamping ou autoRotate estiverem ativados
    renderer.render(scene, camera);
}

// Inicia a aplicação quando o DOM estiver completamente carregado
document.addEventListener('DOMContentLoaded', init);
